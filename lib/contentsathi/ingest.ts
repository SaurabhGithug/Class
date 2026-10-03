// The receiver: ContentSathi's website push, end to end, with no framework in it.
// The Next.js route (app/api/contentsathi/route.ts) is a few lines around this,
// so the whole contract runs under `node --test` with plain Request objects.
//
// ORDER MATTERS, and every refusal is deliberate:
//   no key configured          503  fail closed — never "open when unset"
//   request too large          413  before the body is parsed
//   not JSON                   400
//   key missing or wrong       401  same answer for both; says nothing else
//   a type this site does not accept   400  (a payload meant for something else is never stored)
//   fields wrong               400  every problem listed (only for authenticated callers)
//   no store configured        503
//   store failed               502  a generic message; the cause is logged, never returned
// Re-sending the same slug updates that post, and re-sending identical content
// writes nothing — so a retry (ContentSathi retries; its idempotency key says "same
// again") neither duplicates a post nor makes a needless commit. The same holds for
// typed updates: an identical schedule or announcement is not written again.
//
// WHICH TYPES a site accepts is the site's decision (deps.accepts, from its
// lib/contentsathi-site.ts). The default is posts only, so a site that has not
// opted into "schedule" or "announcement" refuses them rather than storing them.

import { configuredKeys, keyMatches, presentedKey } from "./auth.ts";
import { LIMITS, parsePost } from "./payload.ts";
import { isDocName, parseTyped, stableStringify, withoutStamp } from "./typed.ts";
import type { DocName, UpdateType } from "./typed.ts";
import { ReceiverError } from "./types.ts";
import type { BlogPost, ContentStore } from "./types.ts";

export interface IngestDeps {
  env: Record<string, string | undefined>;
  store: ContentStore | null;
  /** Why there is no store, when choosing one failed — shown to the caller, so it must carry no secret. */
  storeProblem?: string;
  /** What this site is willing to receive. Default: posts only. */
  accepts?: readonly UpdateType[];
  /** The site's public origin, for the URL in the reply. */
  siteUrl?: string;
  now?: () => Date;
  log?: (line: string) => void;
}

const reply = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

const sameContent = (a: BlogPost, b: BlogPost) =>
  a.title === b.title &&
  a.body === b.body &&
  a.category === b.category &&
  a.featuredImage === b.featuredImage &&
  a.metaTitle === b.metaTitle &&
  a.metaDescription === b.metaDescription &&
  a.status === b.status &&
  JSON.stringify(a.tags) === JSON.stringify(b.tags);

const isRecord = (v: unknown): v is Record<string, unknown> => Boolean(v) && typeof v === "object" && !Array.isArray(v);

export async function handleIngest(req: Request, deps: IngestDeps): Promise<Response> {
  const log = deps.log ?? (() => {});
  const keys = configuredKeys(deps.env);
  if (keys.length === 0) return reply(503, { error: "This site is not set up to receive posts from ContentSathi yet." });

  const declared = Number(req.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > LIMITS.requestBytes) return reply(413, { error: "Request too large." });
  const text = await req.text();
  if (Buffer.byteLength(text, "utf8") > LIMITS.requestBytes) return reply(413, { error: "Request too large." });

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return reply(400, { error: "The request body is not valid JSON." });
  }

  if (!keyMatches(presentedKey(req.headers, raw), keys)) return reply(401, { error: "Unauthorized." });

  // What kind of update is this, and does this site take it?
  const accepts = deps.accepts ?? (["post"] as const);
  const declaredType = isRecord(raw) ? raw.type : undefined;
  const type: UpdateType | null = declaredType === undefined || declaredType === "post" ? "post" : isDocName(declaredType) ? declaredType : null;
  if (type === null) return reply(400, { error: `Unsupported type ${JSON.stringify(declaredType)}.`, accepts });
  if (!accepts.includes(type)) return reply(400, { error: `This site does not accept ${type} updates.`, accepts });

  const now = (deps.now ?? (() => new Date()))().toISOString();

  /** Run a store operation; a store failure is a generic 502 and the cause goes to the log, never the caller. */
  const guarded = async (fn: () => Promise<Response>): Promise<Response> => {
    try {
      return await fn();
    } catch (e) {
      if (e instanceof ReceiverError) {
        log(`[contentsathi] refused: ${e.message}`);
        return reply(e.status, { error: e.status === 502 ? "The update could not be saved. Try again shortly." : e.message });
      }
      log(`[contentsathi] store failure: ${e instanceof Error ? e.message : String(e)}`);
      return reply(502, { error: "The update could not be saved. Try again shortly." });
    }
  };

  // ── Typed update: schedule | announcement ───────────────────────────────────
  if (type !== "post") {
    const name: DocName = type;
    const parsed = parseTyped(name, isRecord(raw) ? raw.data : undefined);
    if (!parsed.ok) return reply(400, { error: "The update was not accepted.", issues: parsed.issues });
    const store = deps.store;
    if (!store) return reply(503, { error: deps.storeProblem ?? "This site has no place configured to keep updates." });
    return guarded(async () => {
      const existing = await store.getDoc(name);
      const unchanged = existing ? stableStringify(withoutStamp(existing)) === stableStringify(parsed.value) : false;
      if (!unchanged) await store.putDoc(name, { ...parsed.value, updatedAt: now });
      log(`[contentsathi] ${existing ? (unchanged ? "unchanged" : "updated") : "created"} ${name} via ${store.kind}`);
      return reply(200, { success: true, type: name, created: !existing, unchanged });
    });
  }

  // ── Article ─────────────────────────────────────────────────────────────────
  const parsed = parsePost(raw);
  if (!parsed.ok) return reply(400, { error: "The post was not accepted.", issues: parsed.issues });

  const store = deps.store;
  if (!store) return reply(503, { error: deps.storeProblem ?? "This site has no place configured to keep posts." });

  const incoming = parsed.post;
  return guarded(async () => {
    const existing = await store.get(incoming.slug);
    const status = incoming.publishImmediately ? "published" : "draft";
    const post: BlogPost = {
      slug: incoming.slug,
      title: incoming.title,
      body: incoming.body,
      category: incoming.category,
      tags: incoming.tags,
      featuredImage: incoming.featuredImage,
      metaTitle: incoming.metaTitle,
      metaDescription: incoming.metaDescription,
      status,
      // The date a post first went live is kept when it is re-sent.
      publishedAt: status === "published" ? (existing?.publishedAt ?? now) : null,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    const unchanged = existing ? sameContent(existing, post) : false;
    if (!unchanged) await store.put(post);
    log(`[contentsathi] ${existing ? (unchanged ? "unchanged" : "updated") : "created"} ${status} ${post.slug} via ${store.kind}`);
    return reply(200, {
      success: true,
      slug: post.slug,
      status,
      created: !existing,
      unchanged,
      url: `${deps.siteUrl ?? ""}/blog/${post.slug}`,
    });
  });
}

/** GET: lets ContentSathi (or you, with curl) check the key and the setup without sending anything. */
export function handlePing(req: Request, deps: Pick<IngestDeps, "env" | "store" | "storeProblem" | "accepts">): Response {
  const keys = configuredKeys(deps.env);
  if (keys.length === 0) return reply(503, { error: "This site is not set up to receive posts from ContentSathi yet." });
  if (!keyMatches(presentedKey(req.headers, undefined), keys)) return reply(401, { error: "Unauthorized." });
  return reply(200, {
    ok: true,
    service: "contentsathi-receiver",
    store: deps.store?.kind ?? null,
    accepts: deps.accepts ?? ["post"],
    ...(deps.store ? {} : { problem: deps.storeProblem ?? "No place configured to keep posts." }),
  });
}
