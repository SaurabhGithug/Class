// Reading a stored post back. Files in content/blog/ are edited by hand and by
// commits as well as by this receiver, so the shape is checked rather than
// trusted — one malformed file must not take the whole blog down.

import type { BlogPost, PostStatus } from "./types.ts";

export const POSTS_DIR = "content/blog";
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const isString = (v: unknown): v is string => typeof v === "string";

export function isValidSlug(slug: string): boolean {
  return slug.length > 0 && slug.length <= 100 && SLUG_PATTERN.test(slug);
}

/** The post, or null if `raw` is not one. Missing optional fields get their empty value. */
export function parseStoredPost(raw: unknown): BlogPost | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const o = raw as Record<string, unknown>;
  if (!isString(o.slug) || !isValidSlug(o.slug) || !isString(o.title) || !o.title || !isString(o.body)) return null;
  const status: PostStatus = o.status === "draft" ? "draft" : "published";
  const when = (v: unknown) => (isString(v) && !Number.isNaN(Date.parse(v)) ? v : null);
  const createdAt = when(o.createdAt) ?? new Date(0).toISOString();
  return {
    slug: o.slug,
    title: o.title,
    body: o.body,
    category: isString(o.category) && o.category ? o.category : "General",
    tags: Array.isArray(o.tags) ? o.tags.filter(isString) : [],
    featuredImage: isString(o.featuredImage) ? o.featuredImage : "",
    metaTitle: isString(o.metaTitle) ? o.metaTitle : "",
    metaDescription: isString(o.metaDescription) ? o.metaDescription : "",
    status,
    publishedAt: status === "published" ? (when(o.publishedAt) ?? createdAt) : null,
    createdAt,
    updatedAt: when(o.updatedAt) ?? createdAt,
  };
}
