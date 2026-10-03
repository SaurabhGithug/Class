import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fsStore, githubStore, storeFromEnv } from "./store.ts";
import { listPublished, getPublished, readPosts, excerpt } from "./posts.ts";
import { parseStoredPost } from "./stored.ts";
import { ReceiverError } from "./types.ts";
import type { BlogPost } from "./types.ts";

const post = (over: Partial<BlogPost> = {}): BlogPost => ({
  slug: "sangeet-tips", title: "Sangeet Tips", body: "Dance.", category: "Weddings", tags: ["sangeet"], featuredImage: "",
  metaTitle: "", metaDescription: "", status: "published", publishedAt: "2026-10-02T10:00:00.000Z",
  createdAt: "2026-10-02T10:00:00.000Z", updatedAt: "2026-10-02T10:00:00.000Z", ...over,
});

const tmp = async () => mkdtemp(path.join(tmpdir(), "csconnect-"));

test("fsStore: a post written is the post read back, atomically, with no temp files left", async () => {
  const dir = await tmp();
  try {
    const store = fsStore(dir);
    assert.equal(await store.get("sangeet-tips"), null);
    await store.put(post());
    assert.deepEqual(await store.get("sangeet-tips"), post());
    assert.deepEqual(await readdir(dir), ["sangeet-tips.json"]);
    await store.put(post({ title: "Changed" })); // the same slug is replaced, not duplicated
    assert.equal((await store.get("sangeet-tips"))?.title, "Changed");
    assert.equal((await readdir(dir)).length, 1);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("fsStore refuses any slug that is not a plain slug — the file name is never attacker-controlled", async () => {
  const dir = await tmp();
  try {
    const store = fsStore(dir);
    for (const slug of ["../escape", "a/b", "a\\b", "..", "", "UPPER", "a b", "a".repeat(101)]) {
      await assert.rejects(() => store.put(post({ slug })), ReceiverError, JSON.stringify(slug));
      await assert.rejects(() => store.get(slug), ReceiverError, JSON.stringify(slug));
    }
    assert.deepEqual(await readdir(dir), []);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

// ── GitHub store, against a fake of the Contents API ─────────────────────────

interface PutBody { message: string; content: string; branch: string; sha?: string }
interface Call { url: string; method: string; headers: Record<string, string>; body?: PutBody }
function fakeGitHub(opts: { files?: Record<string, { sha: string; content: string }>; putStatuses?: number[]; readStatus?: number } = {}) {
  const files = opts.files ?? {};
  const putStatuses = [...(opts.putStatuses ?? [])];
  const calls: Call[] = [];
  const impl = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method ?? "GET";
    const call: Call = { url, method, headers: init?.headers as Record<string, string>, body: init?.body ? JSON.parse(String(init.body)) : undefined };
    calls.push(call);
    const file = decodeURIComponent(url.split("/contents/")[1].split("?")[0]);
    if (method === "GET") {
      if (opts.readStatus) return new Response("{}", { status: opts.readStatus });
      const f = files[file];
      return f ? new Response(JSON.stringify({ sha: f.sha, content: f.content }), { status: 200 }) : new Response("{}", { status: 404 });
    }
    const status = putStatuses.shift() ?? 200;
    if (status >= 200 && status < 300) files[file] = { sha: `sha${calls.length}`, content: call.body?.content ?? "" };
    return new Response(JSON.stringify({ message: "leaky GitHub detail: token ghp_SECRET" }), { status });
  }) as typeof fetch;
  return { impl, calls, files };
}
const b64 = (p: BlogPost) => Buffer.from(JSON.stringify(p), "utf8").toString("base64");
const gh = (fetchImpl: typeof fetch) => githubStore({ repo: "owner/site", branch: "main", token: "ghp_SECRET", fetch: fetchImpl });

test("githubStore: a new post is created with a PUT and no sha", async () => {
  const api = fakeGitHub();
  await gh(api.impl).put(post());
  const put = api.calls.find((c) => c.method === "PUT")!;
  assert.ok(put.body);
  assert.ok(put.body);
  assert.match(put.url, /repos\/owner\/site\/contents\/content\/blog\/sangeet-tips\.json$/);
  assert.equal(put.body.branch, "main");
  assert.equal("sha" in put.body, false);
  assert.match(put.body.message, /^contentsathi: publish "Sangeet Tips"$/);
  assert.deepEqual(JSON.parse(Buffer.from(put.body.content, "base64").toString("utf8")), post());
  assert.equal(put.headers.Authorization, "Bearer ghp_SECRET");
});

test("githubStore: an existing post is updated with its current sha", async () => {
  const api = fakeGitHub({ files: { "content/blog/sangeet-tips.json": { sha: "abc123", content: b64(post()) } } });
  await gh(api.impl).put(post({ title: "Changed" }));
  assert.equal(api.calls.find((c) => c.method === "PUT")?.body?.sha, "abc123");
});

test("githubStore: a drafts is committed as a draft", async () => {
  const api = fakeGitHub();
  await gh(api.impl).put(post({ status: "draft", publishedAt: null }));
  assert.match(api.calls.find((c) => c.method === "PUT")?.body?.message ?? "", /^contentsathi: save draft /);
});

test("githubStore: get returns the stored post, or null when there is none", async () => {
  const api = fakeGitHub({ files: { "content/blog/sangeet-tips.json": { sha: "s", content: b64(post()) } } });
  const store = gh(api.impl);
  assert.deepEqual(await store.get("sangeet-tips"), post());
  assert.equal(await store.get("nothing-here"), null);
});

test("githubStore: one retry when the file changed under it (409/422), then success", async () => {
  const api = fakeGitHub({ putStatuses: [409, 200] });
  await gh(api.impl).put(post());
  assert.equal(api.calls.filter((c) => c.method === "PUT").length, 2);
  assert.equal(api.calls.filter((c) => c.method === "GET").length, 2); // the sha was read again
});

test("githubStore: gives up after one retry, and the error never carries GitHub's text or the token", async () => {
  const api = fakeGitHub({ putStatuses: [409, 409] });
  await assert.rejects(
    () => gh(api.impl).put(post()),
    (e: unknown) => e instanceof ReceiverError && e.status === 502 && !/ghp_|SECRET|leaky/.test(e.message),
  );
});

test("githubStore: a 403 on save and a 500 on read are 502s with no leak", async () => {
  const denied = fakeGitHub({ putStatuses: [403] });
  await assert.rejects(() => gh(denied.impl).put(post()), (e: unknown) => e instanceof ReceiverError && e.status === 502 && /403/.test(e.message) && !/ghp_|leaky/.test(e.message));
  const down = fakeGitHub({ readStatus: 500 });
  await assert.rejects(() => gh(down.impl).get("sangeet-tips"), (e: unknown) => e instanceof ReceiverError && e.status === 502);
});

test("githubStore refuses a repo, branch or directory that could redirect the write", () => {
  const f = fakeGitHub().impl;
  assert.throws(() => githubStore({ repo: "owner", branch: "main", token: "t", fetch: f }), ReceiverError);
  assert.throws(() => githubStore({ repo: "owner/site/extra", branch: "main", token: "t", fetch: f }), ReceiverError);
  assert.throws(() => githubStore({ repo: "owner/site", branch: "main..evil", token: "t", fetch: f }), ReceiverError);
  assert.throws(() => githubStore({ repo: "owner/site", branch: "main", token: "t", dir: "../x", fetch: f }), ReceiverError);
});

test("storeFromEnv: settings pasted with a trailing newline still work, and blank ones count as unset", async () => {
  const api = fakeGitHub();
  const real = globalThis.fetch;
  globalThis.fetch = api.impl;
  try {
    const store = storeFromEnv({ NODE_ENV: "production", GITHUB_CONTENT_TOKEN: "ghp_SECRET\n", GITHUB_CONTENT_REPO: " owner/site\n", GITHUB_CONTENT_BRANCH: "main\r\n" });
    assert.equal(store?.kind, "github");
    await store!.put(post());
    const put = api.calls.at(-1)!;
    assert.equal(put.headers.Authorization, "Bearer ghp_SECRET");
    assert.ok(put.url.startsWith("https://api.github.com/repos/owner/site/contents/"), put.url);
    assert.equal(put.body?.branch, "main");
  } finally {
    globalThis.fetch = real;
  }
  assert.equal(storeFromEnv({ NODE_ENV: "production", GITHUB_CONTENT_TOKEN: " \n", GITHUB_CONTENT_REPO: "o/s" }), null, "a blank token is no token");
});

test("storeFromEnv: explicit in production, never an implicit fs", () => {
  assert.equal(storeFromEnv({ NODE_ENV: "production" }), null, "production, nothing configured");
  assert.equal(storeFromEnv({ NODE_ENV: "production", GITHUB_CONTENT_TOKEN: "t" }), null, "token without repo");
  assert.equal(storeFromEnv({ NODE_ENV: "production", GITHUB_CONTENT_TOKEN: "t", GITHUB_CONTENT_REPO: "o/s" })?.kind, "github");
  assert.equal(storeFromEnv({ NODE_ENV: "development" })?.kind, "fs");
  assert.equal(storeFromEnv({ NODE_ENV: "production", CONTENT_STORE: "fs" })?.kind, "fs", "explicit fs is honoured");
  assert.equal(storeFromEnv({ CONTENT_STORE: "github" }), null, "github chosen but not configured");
  assert.equal(storeFromEnv({ CONTENT_STORE: "github", GITHUB_CONTENT_TOKEN: "t", GITHUB_CONTENT_REPO: "o/s" })?.kind, "github");
});

// ── Reading ──────────────────────────────────────────────────────────────────

test("posts: drafts are never listed or served; newest first; malformed and mis-named files are skipped", async () => {
  const dir = await tmp();
  try {
    const w = (slug: string, p: BlogPost, name = `${slug}.json`) => writeFile(path.join(dir, name), JSON.stringify(p));
    await w("older", post({ slug: "older", title: "Older", publishedAt: "2026-01-01T00:00:00.000Z" }));
    await w("newer", post({ slug: "newer", title: "Newer", publishedAt: "2026-06-01T00:00:00.000Z" }));
    await w("secret", post({ slug: "secret", title: "Secret", status: "draft", publishedAt: null }));
    await writeFile(path.join(dir, "broken.json"), "{ not json");
    await w("liar", post({ slug: "someone-else" }), "liar.json"); // file name says liar, contents say otherwise
    await writeFile(path.join(dir, "notes.txt"), "ignored");

    assert.deepEqual((await listPublished(dir)).map((p) => p.slug), ["newer", "older"]);
    assert.equal((await readPosts(dir)).length, 3); // drafts included here, junk not
    assert.equal(await getPublished("secret", dir), null);
    assert.equal((await getPublished("newer", dir))?.title, "Newer");
    assert.equal(await getPublished("../etc/passwd", dir), null);
    assert.deepEqual(await listPublished(path.join(dir, "missing")), []);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("parseStoredPost fills missing optional fields and rejects what is not a post", () => {
  const minimal = parseStoredPost({ slug: "a", title: "A", body: "b" });
  assert.equal(minimal?.status, "published");
  assert.equal(minimal?.category, "General");
  assert.deepEqual(minimal?.tags, []);
  for (const raw of [null, [], "x", { slug: "A", title: "t", body: "b" }, { slug: "a", title: "", body: "b" }, { slug: "a", title: "t" }]) {
    assert.equal(parseStoredPost(raw), null, JSON.stringify(raw));
  }
  assert.equal(parseStoredPost({ slug: "a", title: "A", body: "b", status: "draft", publishedAt: "2026-01-01T00:00:00.000Z" })?.publishedAt, null);
});

test("excerpt prefers the meta description, else the post's own first words, cut at a word", () => {
  assert.equal(excerpt({ body: "x", metaDescription: "Meta." }), "Meta.");
  const long = excerpt({ body: "## Heading\n\n" + "word ".repeat(100), metaDescription: "" }, 40);
  assert.ok(long.length <= 41 && long.endsWith("…"));
  assert.ok(!long.includes("#"));
});

// ── Typed documents (schedule, announcement) ─────────────────────────────────

const DOC = { confirmed: true, note: "", classes: [{ day: "Tue", time: "After School", clock: "", location: "", name: "Kids Bollywood", level: "Ages 5–9", audiences: ["kids"] }], updatedAt: "2026-10-02T10:00:00.000Z" };

test("fsStore documents: written beside the posts folder, read back, replaced in place, no temp files left", async () => {
  const root = await tmp();
  try {
    const store = fsStore(path.join(root, "blog"), root);
    assert.equal(await store.getDoc("schedule"), null);
    await store.putDoc("schedule", DOC);
    assert.deepEqual(await store.getDoc("schedule"), DOC);
    assert.deepEqual((await readdir(root)).sort(), ["schedule.json"]);
    await store.putDoc("schedule", { ...DOC, note: "Changed" });
    assert.equal((await store.getDoc("schedule"))?.note, "Changed");
    assert.deepEqual((await readdir(root)).sort(), ["schedule.json"]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("fsStore: by default documents live in the parent of the posts folder", async () => {
  const root = await tmp();
  try {
    const store = fsStore(path.join(root, "blog"));
    await store.putDoc("announcement", { active: true, updatedAt: "x" });
    assert.deepEqual(await readdir(root), ["announcement.json"]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("only the two fixed document names ever reach a path — a request can never choose a file", async () => {
  const root = await tmp();
  try {
    const store = fsStore(path.join(root, "blog"), root);
    for (const name of ["../escape", "blog/post", "post", "SCHEDULE", "", "schedule.json", "announcement/../x"]) {
      await assert.rejects(() => store.putDoc(name as never, DOC), ReceiverError, JSON.stringify(name));
      await assert.rejects(() => store.getDoc(name as never), ReceiverError, JSON.stringify(name));
    }
    assert.deepEqual(await readdir(root), []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("fsStore: a document file that is not an object reads as none", async () => {
  const root = await tmp();
  try {
    await writeFile(path.join(root, "schedule.json"), "[1,2,3]");
    assert.equal(await fsStore(path.join(root, "blog"), root).getDoc("schedule"), null);
    await writeFile(path.join(root, "schedule.json"), "{ broken");
    await assert.rejects(() => fsStore(path.join(root, "blog"), root).getDoc("schedule")); // a corrupt file is an error, not silent loss
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("githubStore documents: created at content/<name>.json, with its own commit message", async () => {
  const api = fakeGitHub();
  await gh(api.impl).putDoc("schedule", DOC);
  const put = api.calls.find((c) => c.method === "PUT");
  assert.ok(put?.body);
  assert.match(put.url, /repos\/owner\/site\/contents\/content\/schedule\.json$/);
  assert.equal(put.body.message, "contentsathi: update schedule");
  assert.equal("sha" in put.body, false);
  assert.deepEqual(JSON.parse(Buffer.from(put.body.content, "base64").toString("utf8")), DOC);
});

test("githubStore documents: an existing file is updated with its sha, and read back", async () => {
  const b64doc = Buffer.from(JSON.stringify(DOC), "utf8").toString("base64");
  const api = fakeGitHub({ files: { "content/announcement.json": { sha: "doc-sha", content: b64doc } } });
  const store = gh(api.impl);
  assert.deepEqual(await store.getDoc("announcement"), DOC);
  assert.equal(await store.getDoc("schedule"), null);
  await store.putDoc("announcement", { ...DOC, note: "n" });
  assert.equal(api.calls.find((c) => c.method === "PUT")?.body?.sha, "doc-sha");
});

test("githubStore documents: a file that is not JSON reads as none, and is replaced on the next write", async () => {
  const api = fakeGitHub({ files: { "content/schedule.json": { sha: "s1", content: Buffer.from("<<<not json", "utf8").toString("base64") } } });
  const store = gh(api.impl);
  assert.equal(await store.getDoc("schedule"), null);
  await store.putDoc("schedule", DOC);
  assert.equal(api.calls.find((c) => c.method === "PUT")?.body?.sha, "s1");
});

test("githubStore documents: one retry on a conflict, and failures never leak GitHub's text or the token", async () => {
  const retry = fakeGitHub({ putStatuses: [422, 200] });
  await gh(retry.impl).putDoc("schedule", DOC);
  assert.equal(retry.calls.filter((c) => c.method === "PUT").length, 2);
  const denied = fakeGitHub({ putStatuses: [403] });
  await assert.rejects(() => gh(denied.impl).putDoc("schedule", DOC), (e: unknown) => e instanceof ReceiverError && e.status === 502 && /403/.test(e.message) && !/ghp_|leaky/.test(e.message));
  const down = fakeGitHub({ readStatus: 500 });
  await assert.rejects(() => gh(down.impl).getDoc("schedule"), (e: unknown) => e instanceof ReceiverError && e.status === 502);
  await assert.rejects(() => gh(fakeGitHub().impl).putDoc("../x" as never, DOC), ReceiverError);
});

test("githubStore: the documents folder follows the posts folder unless told otherwise", async () => {
  const f = fakeGitHub();
  await githubStore({ repo: "o/s", branch: "main", token: "t", dir: "site/content/blog", fetch: f.impl }).putDoc("schedule", DOC);
  assert.match(f.calls.find((c) => c.method === "PUT")!.url, /contents\/site\/content\/schedule\.json$/);
  const g = fakeGitHub();
  await githubStore({ repo: "o/s", branch: "main", token: "t", docsDir: "data", fetch: g.impl }).putDoc("announcement", DOC);
  assert.match(g.calls.find((c) => c.method === "PUT")!.url, /contents\/data\/announcement\.json$/);
  assert.throws(() => githubStore({ repo: "o/s", branch: "main", token: "t", docsDir: "../x", fetch: g.impl }), ReceiverError);
});
