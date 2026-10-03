// What ContentSathi may send, and what is made of it.
//
// ContentSathi has three senders, with three shapes (AI content engine/
// contentsathi/src/app/api/):
//   publish/website        { source, apiKey, title, slug, body, category, tags, featuredImage, publishImmediately, timestamp }
//   seo-harness/publish    { source, apiKey, idempotencyKey, title, slug, body, content, metaTitle, metaDescription, publishImmediately, timestamp }
//                          + header X-Idempotency-Key
//   env ingest fallback    Authorization: Bearer <key>; { title, slug, content, metaTitle, metaDescription, idempotencyKey }
// One parser reads all three. Anything not recognised is ignored; anything
// recognised and wrong is refused with the reason, all of them at once.

import { normalizeBody } from "./markdown.ts";

export const LIMITS = {
  requestBytes: 256 * 1024,
  title: 200,
  body: 100_000,
  slug: 100,
  category: 60,
  tags: 12,
  tag: 40,
  metaTitle: 120,
  metaDescription: 320,
  image: 500,
} as const;

/** Lowercase a–z, 0–9 and single hyphens. "" when nothing usable is left. */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, LIMITS.slug)
    .replace(/-+$/g, "");
}

export function isHttpsUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "https:" && !u.username && !u.password;
  } catch {
    return false;
  }
}

export interface IncomingPost {
  slug: string;
  title: string;
  body: string;
  category: string;
  tags: string[];
  featuredImage: string;
  metaTitle: string;
  metaDescription: string;
  /** Absent means publish: the env-ingest sender never says. Only an explicit false makes a draft. */
  publishImmediately: boolean;
}

export type Parsed = { ok: true; post: IncomingPost } | { ok: false; issues: string[] };

const str = (v: unknown) => (typeof v === "string" ? v.trim() : undefined);

export function parsePost(raw: unknown): Parsed {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return { ok: false, issues: ["The request body must be a JSON object."] };
  const o = raw as Record<string, unknown>;
  const issues: string[] = [];

  // Reserved for later kinds of update (a schedule, an announcement). Refused loudly,
  // so a payload meant for something else is never stored as an article.
  if (o.type !== undefined && o.type !== "post") issues.push(`Unsupported type ${JSON.stringify(o.type)}: this receiver accepts posts.`);

  const title = str(o.title);
  if (!title) issues.push("title is required.");
  else if (title.length > LIMITS.title) issues.push(`title is longer than ${LIMITS.title} characters.`);

  // seo-harness sends the text twice (body and content); the first non-empty one wins.
  const rawBody = [o.body, o.content].map(str).find((s) => s);
  let body = "";
  if (!rawBody) issues.push("body is required.");
  else if (rawBody.length > LIMITS.body) issues.push(`body is longer than ${LIMITS.body} characters.`);
  else {
    body = normalizeBody(rawBody);
    if (!body) issues.push("body has no text in it.");
  }

  // The sender builds a slug from the title when it has none, which can leave stray hyphens; tidy it.
  const slug = slugify(str(o.slug) ?? "") || slugify(title ?? "");
  if (!slug) issues.push("slug is empty and could not be made from the title.");

  const category = (str(o.category) ?? "").slice(0, LIMITS.category) || "General";

  let tags: string[] = [];
  if (o.tags !== undefined) {
    if (!Array.isArray(o.tags)) issues.push("tags must be a list of strings.");
    else {
      const seen = new Set<string>();
      for (const t of o.tags) {
        const tag = str(t)?.slice(0, LIMITS.tag);
        if (tag && !seen.has(tag.toLowerCase())) {
          seen.add(tag.toLowerCase());
          tags.push(tag);
        }
      }
      tags = tags.slice(0, LIMITS.tags);
    }
  }

  const image = str(o.featuredImage) ?? "";
  if (image && (image.length > LIMITS.image || !isHttpsUrl(image))) issues.push("featuredImage must be an https URL.");

  if (o.publishImmediately !== undefined && typeof o.publishImmediately !== "boolean") issues.push("publishImmediately must be true or false.");

  if (issues.length) return { ok: false, issues };
  return {
    ok: true,
    post: {
      slug,
      title: title!,
      body,
      category,
      tags,
      featuredImage: image,
      metaTitle: (str(o.metaTitle) ?? "").slice(0, LIMITS.metaTitle),
      metaDescription: (str(o.metaDescription) ?? "").slice(0, LIMITS.metaDescription),
      publishImmediately: o.publishImmediately !== false,
    },
  };
}
