// Where received content is written.
//
//   fs      writes under content/ on this machine. For development and
//           self-hosting. It is NEVER chosen implicitly in production: a serverless
//           host's disk is read-only, and a 500 from a failed write would read as
//           a broken integration. In production the choice is explicit.
//   github  commits the file to the site's own repository through GitHub's
//           Contents API; the host redeploys on the commit. Free, versioned,
//           reviewable, no database. The token lives on the host, never in
//           ContentSathi, and can be limited to this one repository ("Contents:
//           read and write").
//
// Reading is separate (posts.ts, docs.ts) and always from the repository's own files.

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { POSTS_DIR, isValidSlug, parseStoredPost } from "./stored.ts";
import { isDocName } from "./typed.ts";
import type { DocName } from "./typed.ts";
import { ReceiverError } from "./types.ts";
import type { ContentStore, StoredDocument } from "./types.ts";

const serialise = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`;

function assertSlug(slug: string) {
  // The slug becomes a file name. It is already [a-z0-9-] by the time it gets here;
  // this is the second lock on the door, not the first.
  if (!isValidSlug(slug)) throw new ReceiverError("Invalid slug.", 400);
}

function assertDocName(name: string): asserts name is DocName {
  // Likewise for documents: only the fixed names ever reach a path.
  if (!isDocName(name)) throw new ReceiverError("Invalid document.", 400);
}

const isRecord = (v: unknown): v is StoredDocument => Boolean(v) && typeof v === "object" && !Array.isArray(v);

export function fsStore(dir: string, docsDir: string = path.dirname(dir)): ContentStore {
  const file = (slug: string) => path.join(dir, `${slug}.json`);
  const docFile = (name: DocName) => path.join(docsDir, `${name}.json`);

  /** Write beside, then rename: a reader never sees half a file. */
  async function atomicWrite(target: string, content: string) {
    await mkdir(path.dirname(target), { recursive: true });
    const tmp = `${target}.${process.pid}.tmp`;
    await writeFile(tmp, content, "utf8");
    await rename(tmp, target);
  }
  async function readJson(target: string): Promise<unknown> {
    try {
      return JSON.parse(await readFile(target, "utf8"));
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw e;
    }
  }

  return {
    kind: "fs",
    async get(slug) {
      assertSlug(slug);
      return parseStoredPost(await readJson(file(slug)));
    },
    async put(post) {
      assertSlug(post.slug);
      await atomicWrite(file(post.slug), serialise(post));
    },
    async getDoc(name) {
      assertDocName(name);
      const doc = await readJson(docFile(name));
      return isRecord(doc) ? doc : null;
    },
    async putDoc(name, doc) {
      assertDocName(name);
      await atomicWrite(docFile(name), serialise(doc));
    },
  };
}

export interface GitHubOptions {
  /** "owner/name" */
  repo: string;
  branch: string;
  token: string;
  /** Posts directory. Default content/blog. */
  dir?: string;
  /** Typed-update documents directory. Default: the parent of `dir` (content). */
  docsDir?: string;
  fetch?: typeof fetch;
}

export function githubStore(opts: GitHubOptions): ContentStore {
  if (!/^[\w.-]+\/[\w.-]+$/.test(opts.repo)) throw new ReceiverError("GITHUB_CONTENT_REPO must look like owner/name.", 503);
  if (!/^[\w./-]+$/.test(opts.branch) || opts.branch.includes("..")) throw new ReceiverError("GITHUB_CONTENT_BRANCH is not a valid branch name.", 503);
  const clean = (d: string) => d.replace(/^\/+|\/+$/g, "");
  const dir = clean(opts.dir ?? POSTS_DIR);
  const docsDir = clean(opts.docsDir ?? (dir.split("/").slice(0, -1).join("/") || "content"));
  if (dir.includes("..") || docsDir.includes("..")) throw new ReceiverError("Invalid content directory.", 503);
  const doFetch = opts.fetch ?? fetch;
  const headers = {
    Authorization: `Bearer ${opts.token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "contentsathi-receiver",
  };
  const url = (relPath: string) => `https://api.github.com/repos/${opts.repo}/contents/${relPath}`;
  const signal = () => AbortSignal.timeout(15_000);

  /** The file at `relPath` and its sha, or null when there is none. A file that is not JSON reads as `json: null`. */
  async function readFileAt(relPath: string, what: string): Promise<{ json: unknown; sha: string | null } | null> {
    const res = await doFetch(`${url(relPath)}?ref=${encodeURIComponent(opts.branch)}`, { headers, signal: signal() });
    if (res.status === 404) return null;
    // Never echo GitHub's body or the token: the status alone is what the caller needs.
    if (!res.ok) throw new ReceiverError(`GitHub answered ${res.status} when reading the ${what}.`, 502);
    const file = (await res.json()) as { content?: string; sha?: string };
    let json: unknown = null;
    try {
      json = JSON.parse(Buffer.from(file.content ?? "", "base64").toString("utf8"));
    } catch {
      json = null; // a file that is not valid JSON is replaced, not fatal
    }
    return { json, sha: file.sha ?? null };
  }

  async function writeFileAt(relPath: string, value: unknown, message: string, what: string): Promise<void> {
    // One retry: the file may have changed between reading its sha and writing it.
    for (let attempt = 0; ; attempt++) {
      const current = await readFileAt(relPath, what);
      const res = await doFetch(url(relPath), {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          content: Buffer.from(serialise(value), "utf8").toString("base64"),
          branch: opts.branch,
          ...(current?.sha ? { sha: current.sha } : {}),
        }),
        signal: signal(),
      });
      if (res.ok) return;
      if ((res.status === 409 || res.status === 422) && attempt === 0) continue;
      throw new ReceiverError(`GitHub answered ${res.status} when saving the ${what}.`, 502);
    }
  }

  return {
    kind: "github",
    async get(slug) {
      assertSlug(slug);
      const file = await readFileAt(`${dir}/${slug}.json`, "post");
      return file ? parseStoredPost(file.json) : null;
    },
    async put(post) {
      assertSlug(post.slug);
      await writeFileAt(
        `${dir}/${post.slug}.json`,
        post,
        `contentsathi: ${post.status === "draft" ? "save draft" : "publish"} "${post.title.slice(0, 80)}"`,
        "post",
      );
    },
    async getDoc(name) {
      assertDocName(name);
      const file = await readFileAt(`${docsDir}/${name}.json`, "update");
      return file && isRecord(file.json) ? file.json : null;
    },
    async putDoc(name, doc) {
      assertDocName(name);
      await writeFileAt(`${docsDir}/${name}.json`, doc, `contentsathi: update ${name}`, "update");
    },
  };
}

/**
 * The store this environment is configured for, or null when none is.
 *   CONTENT_STORE=github|fs  chooses explicitly.
 *   Unset: github when GITHUB_CONTENT_TOKEN and GITHUB_CONTENT_REPO are both set;
 *          else fs outside production; else none.
 */
export function storeFromEnv(env: Record<string, string | undefined>, cwd = process.cwd()): ContentStore | null {
  // Values pasted into a host's settings often end in a newline. A token with one makes every GitHub
  // request fail (a header value may not contain a line break) and a repo with one fails its check.
  const value = (key: string) => env[key]?.trim() || undefined;
  const mode = value("CONTENT_STORE");
  const token = value("GITHUB_CONTENT_TOKEN");
  const repo = value("GITHUB_CONTENT_REPO");
  if (mode === "github" || (!mode && token && repo)) {
    if (!token || !repo) return null;
    return githubStore({ repo, token, branch: value("GITHUB_CONTENT_BRANCH") || "main" });
  }
  // Literal paths, for the same reason as in posts.ts: a bundler must be able to see the folder.
  if (mode === "fs" || (!mode && env.NODE_ENV !== "production")) return fsStore(path.join(cwd, "content", "blog"), path.join(cwd, "content"));
  return null;
}
