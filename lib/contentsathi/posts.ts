// Reading posts for the blog pages: always from the repository's own
// content/blog/*.json, whichever store wrote them. Server-only (node:fs).
//
// A draft is stored but never listed and never served: its page is a 404 until
// ContentSathi sends it again as published.

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { toPlainText } from "./markdown.ts";
import { isValidSlug, parseStoredPost } from "./stored.ts";
import type { BlogPost } from "./types.ts";

// Written out literally (not via the POSTS_DIR constant): Next's bundler can only scope a
// file-system read to this folder if it can see the folder. Behind a constant it traces the
// whole project — public/ and all — into the server bundle.
const defaultDir = () => path.join(process.cwd(), "content", "blog");

/** Every well-formed post in the directory, drafts included. Malformed files are skipped, not fatal. */
export async function readPosts(dir: string = defaultDir()): Promise<BlogPost[]> {
  let names: string[];
  try {
    names = await readdir(dir);
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw e;
  }
  const posts: BlogPost[] = [];
  for (const name of names.filter((n) => n.endsWith(".json"))) {
    try {
      const post = parseStoredPost(JSON.parse(await readFile(path.join(dir, name), "utf8")));
      // The file name is the slug; a file that says otherwise is not trusted.
      if (post && `${post.slug}.json` === name) posts.push(post);
    } catch {
      // not valid JSON: skip
    }
  }
  return posts;
}

const newestFirst = (a: BlogPost, b: BlogPost) =>
  (b.publishedAt ?? b.createdAt).localeCompare(a.publishedAt ?? a.createdAt) || a.slug.localeCompare(b.slug);

export async function listPublished(dir?: string): Promise<BlogPost[]> {
  return (await readPosts(dir)).filter((p) => p.status === "published").sort(newestFirst);
}

export async function getPublished(slug: string, dir?: string): Promise<BlogPost | null> {
  if (!isValidSlug(slug)) return null;
  return (await listPublished(dir)).find((p) => p.slug === slug) ?? null;
}

/** A plain-text teaser: the post's own words up to about `max` characters, cut at a word. */
export function excerpt(post: Pick<BlogPost, "body" | "metaDescription">, max = 180): string {
  if (post.metaDescription) return post.metaDescription;
  const text = toPlainText(post.body);
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, "")}…`;
}
