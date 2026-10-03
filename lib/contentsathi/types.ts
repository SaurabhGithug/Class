// ─────────────────────────────────────────────────────────────────────────────
// ContentSathi → website connect kit. Canonical source: bollywood/shared/
// contentsathi-connect/. Copied into each site's lib/contentsathi/ by
// bollywood/shared/sync.sh — edit THERE, then sync, never in a site's copy.
//
// What a post is on disk (content/blog/<slug>.json) and what a store must do.
// No dependencies: these modules run unchanged under Next.js and under Node's
// built-in test runner (`node --test`), which is why every import carries its
// .ts extension and every type-only import says `import type`.
// ─────────────────────────────────────────────────────────────────────────────

export type PostStatus = "published" | "draft";

export interface BlogPost {
  slug: string;
  title: string;
  /** Markdown or plain text — never HTML. See normalizeBody() in markdown.ts. */
  body: string;
  category: string;
  tags: string[];
  /** "" or an https URL. */
  featuredImage: string;
  metaTitle: string;
  metaDescription: string;
  status: PostStatus;
  /** First time it went live; kept when a published post is re-sent. null while a draft. */
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

import type { DocName } from "./typed.ts";

/** A stored typed update: the content plus an `updatedAt` stamp. */
export type StoredDocument = Record<string, unknown>;

/**
 * Where received content is written. Reading is separate (posts.ts, docs.ts) and
 * always from the repo's own files.
 *   posts      one file each, content/blog/<slug>.json
 *   documents  one file per typed update, content/<name>.json, where <name> comes
 *              from a fixed list (DocName) — never from the request
 */
export interface ContentStore {
  readonly kind: "fs" | "github";
  get(slug: string): Promise<BlogPost | null>;
  put(post: BlogPost): Promise<void>;
  getDoc(name: DocName): Promise<StoredDocument | null>;
  putDoc(name: DocName, doc: StoredDocument): Promise<void>;
}

/** A failure the caller may be told about, in words that carry no secret. */
export class ReceiverError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ReceiverError";
    this.status = status;
  }
}
