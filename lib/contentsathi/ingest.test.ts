import { test } from "node:test";
import assert from "node:assert/strict";
import { handleIngest, handlePing } from "./ingest.ts";
import type { IngestDeps } from "./ingest.ts";
import { LIMITS } from "./payload.ts";
import { ReceiverError } from "./types.ts";
import type { BlogPost, ContentStore } from "./types.ts";

const KEY = "k-live-0123456789abcdef";
const T0 = new Date("2026-10-02T10:00:00.000Z");
const T1 = new Date("2026-10-03T10:00:00.000Z");

/** An in-memory store that counts writes, and can be made to fail. */
function memoryStore(failWith?: Error): ContentStore & { posts: Map<string, BlogPost>; docs: Map<string, Record<string, unknown>>; writes: number; docWrites: number } {
  const posts = new Map<string, BlogPost>();
  const docs = new Map<string, Record<string, unknown>>();
  const s = {
    kind: "fs" as const,
    posts,
    docs,
    writes: 0,
    docWrites: 0,
    async get(slug: string) { return posts.get(slug) ?? null; },
    async put(p: BlogPost) { if (failWith) throw failWith; s.writes++; posts.set(p.slug, p); },
    async getDoc(name: string) { return docs.get(name) ?? null; },
    async putDoc(name: string, doc: Record<string, unknown>) { if (failWith) throw failWith; s.docWrites++; docs.set(name, doc); },
  };
  return s;
}

const deps = (over: Partial<IngestDeps> = {}): IngestDeps => ({
  env: { CONTENTSATHI_WEBHOOK_KEY: KEY },
  store: memoryStore(),
  siteUrl: "https://site.example",
  now: () => T0,
  ...over,
});

const send = (body: unknown, d: IngestDeps, headers: Record<string, string> = {}) =>
  handleIngest(new Request("https://site.example/api/contentsathi", { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: typeof body === "string" ? body : JSON.stringify(body) }), d);
interface Reply {
  error?: string;
  issues?: string[];
  status?: string;
  created?: boolean;
  unchanged?: boolean;
  success?: boolean;
  slug?: string;
  url?: string;
}
const json = async (r: Response) => (await r.json()) as Reply;

const calendarPayload = (over: Record<string, unknown> = {}) => ({
  source: "contentsathi", apiKey: KEY, title: "Sangeet Tips", slug: "sangeet-tips", body: "## One\n\nDance.", category: "Weddings", tags: ["sangeet"],
  featuredImage: "", publishImmediately: true, timestamp: T0.toISOString(), ...over,
});

test("the calendar publish flow: accepted, stored, URL returned", async () => {
  const d = deps();
  const r = await send(calendarPayload(), d);
  assert.equal(r.status, 200);
  assert.deepEqual(await json(r), { success: true, slug: "sangeet-tips", status: "published", created: true, unchanged: false, url: "https://site.example/blog/sangeet-tips" });
  const stored = (d.store as ReturnType<typeof memoryStore>).posts.get("sangeet-tips")!;
  assert.equal(stored.status, "published");
  assert.equal(stored.publishedAt, T0.toISOString());
  assert.equal(stored.category, "Weddings");
  assert.equal(r.headers.get("cache-control"), "no-store");
});

test("the SEO harness's connection payload, key in the body", async () => {
  const r = await send({ source: "contentsathi", apiKey: KEY, idempotencyKey: "seo-harness:c1:t:abc", title: "T", slug: "t", body: "Text.", content: "Text.", metaTitle: "MT", metaDescription: "MD", publishImmediately: true }, deps(), { "X-Idempotency-Key": "seo-harness:c1:t:abc" });
  assert.equal(r.status, 200);
});

test("the env ingest payload, key as a Bearer header and no apiKey field", async () => {
  const r = await send({ title: "T", slug: "t", content: "Text.", metaTitle: "MT", metaDescription: "MD", idempotencyKey: "x" }, deps(), { Authorization: `Bearer ${KEY}` });
  assert.equal(r.status, 200);
  assert.equal((await json(r)).status, "published"); // that sender never says publishImmediately
});

test("FAIL CLOSED: with no key configured nothing is accepted, whatever it carries", async () => {
  for (const env of [{}, { CONTENTSATHI_WEBHOOK_KEY: "" }, { CONTENTSATHI_WEBHOOK_KEY: " , " }]) {
    const d = deps({ env });
    assert.equal((await send(calendarPayload({ apiKey: "" }), d)).status, 503);
    assert.equal((await send(calendarPayload({ apiKey: "anything" }), d)).status, 503);
    assert.equal((d.store as ReturnType<typeof memoryStore>).writes, 0);
  }
});

test("a missing or wrong key is 401, says nothing else, and writes nothing", async () => {
  const d = deps();
  const store = d.store as ReturnType<typeof memoryStore>;
  for (const [body, headers] of [
    [calendarPayload({ apiKey: undefined }), {}],
    [calendarPayload({ apiKey: "wrong" }), {}],
    [calendarPayload({ apiKey: KEY.slice(0, -1) }), {}],
    [calendarPayload({ apiKey: `${KEY}x` }), {}],
    [calendarPayload({ apiKey: undefined }), { Authorization: "Bearer wrong" }],
    [calendarPayload({ apiKey: undefined }), { Authorization: KEY }], // no Bearer scheme
  ] as const) {
    const r = await send(body, d, headers as Record<string, string>);
    assert.equal(r.status, 401);
    assert.deepEqual(await json(r), { error: "Unauthorized." });
  }
  assert.equal(store.writes, 0);
});

test("an unauthenticated caller learns nothing about field validity", async () => {
  const r = await send({ apiKey: "wrong", title: "", body: "" }, deps());
  assert.equal(r.status, 401);
  assert.equal((await json(r)).issues, undefined);
});

test("rotation: any of several keys works", async () => {
  const d = deps({ env: { CONTENTSATHI_WEBHOOK_KEY: `old-key, ${KEY}` } });
  assert.equal((await send(calendarPayload(), d)).status, 200);
  assert.equal((await send(calendarPayload({ apiKey: "old-key", slug: "other" }), d)).status, 200);
});

test("authenticated but invalid: 400 with every issue, nothing stored", async () => {
  const d = deps();
  const r = await send(calendarPayload({ title: "", body: "", featuredImage: "http://insecure.example/a.jpg" }), d);
  assert.equal(r.status, 400);
  const body = await json(r);
  assert.ok((body.issues?.length ?? 0) >= 3);
  assert.equal((d.store as ReturnType<typeof memoryStore>).writes, 0);
});

test("not JSON is 400; too large is 413 — by header and by actual size", async () => {
  assert.equal((await send("{ nope", deps())).status, 400);
  const big = JSON.stringify(calendarPayload({ body: "x".repeat(LIMITS.requestBytes) }));
  assert.equal((await send(big, deps())).status, 413);
  const lying = await handleIngest(new Request("https://site.example/x", { method: "POST", headers: { "content-length": String(LIMITS.requestBytes + 1) }, body: "{}" }), deps());
  assert.equal(lying.status, 413);
});

test("publishImmediately:false stores a draft with no publish date", async () => {
  const d = deps();
  const r = await send(calendarPayload({ publishImmediately: false }), d);
  assert.equal((await json(r)).status, "draft");
  const stored = (d.store as ReturnType<typeof memoryStore>).posts.get("sangeet-tips")!;
  assert.equal(stored.status, "draft");
  assert.equal(stored.publishedAt, null);
});

test("IDEMPOTENT: sending the same post again changes nothing and writes nothing", async () => {
  const d = deps();
  const store = d.store as ReturnType<typeof memoryStore>;
  await send(calendarPayload(), d);
  assert.equal(store.writes, 1);
  const again = await json(await send(calendarPayload(), { ...d, now: () => T1 }));
  assert.equal(again.created, false);
  assert.equal(again.unchanged, true);
  assert.equal(store.writes, 1, "a retry must not make a second commit");
  assert.equal(store.posts.get("sangeet-tips")!.updatedAt, T0.toISOString(), "and must not move updatedAt");
});

test("an edited post updates in place: same slug, original dates kept, updatedAt moved", async () => {
  const d = deps();
  const store = d.store as ReturnType<typeof memoryStore>;
  await send(calendarPayload(), d);
  const r = await json(await send(calendarPayload({ body: "New text." }), { ...d, now: () => T1 }));
  assert.equal(r.created, false);
  assert.equal(r.unchanged, false);
  const p = store.posts.get("sangeet-tips")!;
  assert.equal(p.body, "New text.");
  assert.equal(p.createdAt, T0.toISOString());
  assert.equal(p.publishedAt, T0.toISOString(), "the date it first went live is kept");
  assert.equal(p.updatedAt, T1.toISOString());
  assert.equal(store.posts.size, 1);
});

test("a draft goes live when it is sent again as published", async () => {
  const d = deps();
  const store = d.store as ReturnType<typeof memoryStore>;
  await send(calendarPayload({ publishImmediately: false }), d);
  await send(calendarPayload({ publishImmediately: true }), { ...d, now: () => T1 });
  const p = store.posts.get("sangeet-tips")!;
  assert.equal(p.status, "published");
  assert.equal(p.publishedAt, T1.toISOString());
  assert.equal(p.createdAt, T0.toISOString());
});

test("no store configured: 503 with the reason, and a store that cannot be built says why", async () => {
  assert.equal((await send(calendarPayload(), deps({ store: null }))).status, 503);
  const r = await send(calendarPayload(), deps({ store: null, storeProblem: "GITHUB_CONTENT_REPO must look like owner/name." }));
  assert.equal((await json(r)).error, "GITHUB_CONTENT_REPO must look like owner/name.");
});

test("a store failure is a generic 502 — GitHub's words, tokens and paths never reach the caller", async () => {
  const lines: string[] = [];
  const leaky = new Error("ENOENT /Users/saurabh/secret/path token ghp_SECRET");
  const r = await send(calendarPayload(), deps({ store: memoryStore(leaky), log: (l) => lines.push(l) }));
  assert.equal(r.status, 502);
  const text = JSON.stringify(await json(r));
  assert.ok(!/ghp_|SECRET|saurabh|ENOENT/.test(text), text);
  assert.ok(lines.some((l) => l.includes("store failure")), "the cause is logged for the owner");
  const upstream = await send(calendarPayload(), deps({ store: memoryStore(new ReceiverError("GitHub answered 403 when saving the post.", 502)) }));
  assert.equal(upstream.status, 502);
  assert.ok(!/403/.test(JSON.stringify(await json(upstream))), "even the upstream status stays out of the reply");
});

test("the key is never logged", async () => {
  const lines: string[] = [];
  await send(calendarPayload(), deps({ log: (l) => lines.push(l) }));
  await send(calendarPayload({ apiKey: "wrong" }), deps({ log: (l) => lines.push(l) }));
  assert.ok(lines.length > 0);
  assert.ok(lines.every((l) => !l.includes(KEY) && !l.includes("wrong")));
});

test("a type this receiver does not handle is refused, never stored as a post", async () => {
  const d = deps();
  const r = await send(calendarPayload({ type: "schedule" }), d);
  assert.equal(r.status, 400);
  assert.equal((d.store as ReturnType<typeof memoryStore>).writes, 0);
});

test("ping: 503 unconfigured, 401 wrong key, 200 with the store kind", () => {
  const ping = (headers: Record<string, string>, d: Pick<IngestDeps, "env" | "store" | "storeProblem">) => handlePing(new Request("https://site.example/api/contentsathi", { headers }), d);
  assert.equal(ping({}, { env: {}, store: null }).status, 503);
  assert.equal(ping({ Authorization: "Bearer wrong" }, deps()).status, 401);
  assert.equal(ping({}, deps()).status, 401);
  const ok = ping({ Authorization: `Bearer ${KEY}` }, deps());
  assert.equal(ok.status, 200);
});


// ── Typed updates: schedule, announcement ─────────────────────────────────────

type Mem = ReturnType<typeof memoryStore>;
const mem = (d: IngestDeps) => d.store as Mem;
const SCHEDULE = { confirmed: true, note: "", classes: [{ day: "Tue", time: "After School", clock: "", location: "", name: "Kids Bollywood", level: "Ages 5–9", audiences: ["kids"] }] };
const BANNER = { active: true, text: "Spring batch registration is open.", linkLabel: "See the classes", linkHref: "/classes", tone: "info", startsAt: null, expiresAt: null };
const typed = (type: string, data: unknown, over: Record<string, unknown> = {}) => ({ source: "contentsathi", apiKey: KEY, type, data, idempotencyKey: "abc", timestamp: T0.toISOString(), ...over });
const wide = (over: Partial<IngestDeps> = {}) => deps({ accepts: ["post", "schedule", "announcement"], ...over });

test("a site that has not opted in refuses typed updates — they are never stored", async () => {
  const d = deps(); // default: posts only
  for (const type of ["schedule", "announcement"]) {
    const r = await send(typed(type, type === "schedule" ? SCHEDULE : BANNER), d);
    assert.equal(r.status, 400);
    const body = (await r.json()) as { error: string; accepts: string[] };
    assert.match(body.error, new RegExp(`does not accept ${type}`));
    assert.deepEqual(body.accepts, ["post"]);
  }
  assert.equal(mem(d).docWrites, 0);
});

test("a site may take announcements and still refuse schedules", async () => {
  const d = deps({ accepts: ["post", "announcement"] });
  assert.equal((await send(typed("schedule", SCHEDULE), d)).status, 400);
  assert.equal((await send(typed("announcement", BANNER), d)).status, 200);
  assert.deepEqual([...mem(d).docs.keys()], ["announcement"]);
});

test("a type nobody has heard of is refused as unsupported", async () => {
  const d = wide();
  const r = await send(typed("banana", {}), d);
  assert.equal(r.status, 400);
  assert.match(((await json(r)).error) ?? "", /Unsupported type/);
  assert.equal(mem(d).docWrites + mem(d).writes, 0);
});

test("a valid schedule is stored with a timestamp, and the reply says so", async () => {
  const d = wide();
  const r = await send(typed("schedule", SCHEDULE), d);
  assert.equal(r.status, 200);
  assert.deepEqual(await r.json(), { success: true, type: "schedule", created: true, unchanged: false });
  assert.deepEqual(mem(d).docs.get("schedule"), { ...SCHEDULE, updatedAt: T0.toISOString() });
});

test("IDEMPOTENT: an identical schedule or announcement is not written again, whatever the key order", async () => {
  const d = wide();
  await send(typed("announcement", BANNER), d);
  assert.equal(mem(d).docWrites, 1);
  const reordered = { expiresAt: null, startsAt: null, tone: "info", linkHref: "/classes", linkLabel: "See the classes", text: BANNER.text, active: true };
  const again = await json(await send(typed("announcement", reordered), { ...d, now: () => T1 }));
  assert.equal(again.unchanged, true);
  assert.equal(again.created, false);
  assert.equal(mem(d).docWrites, 1, "a retry must not make a second commit");
  assert.equal(mem(d).docs.get("announcement")?.updatedAt, T0.toISOString(), "and must not move updatedAt");
});

test("a changed announcement replaces the old one; clearing it is just active:false", async () => {
  const d = wide();
  await send(typed("announcement", BANNER), d);
  const changed = await json(await send(typed("announcement", { ...BANNER, text: "Registration closes Friday." }), { ...d, now: () => T1 }));
  assert.equal(changed.unchanged, false);
  assert.equal(mem(d).docs.get("announcement")?.text, "Registration closes Friday.");
  assert.equal(mem(d).docs.get("announcement")?.updatedAt, T1.toISOString());
  const cleared = await send(typed("announcement", { active: false }), { ...d, now: () => T1 });
  assert.equal(cleared.status, 200);
  assert.equal(mem(d).docs.get("announcement")?.active, false);
  assert.equal(mem(d).docs.get("announcement")?.text, "");
});

test("invalid typed data is 400 with every issue, and nothing is written", async () => {
  const d = wide();
  const r = await send(typed("schedule", { confirmed: "yes", classes: [{ day: "Funday" }], price: 5 }), d);
  assert.equal(r.status, 400);
  const body = await json(r);
  assert.ok((body.issues?.length ?? 0) >= 3);
  assert.equal(mem(d).docWrites, 0);
  const noData = await send(typed("announcement", undefined), d);
  assert.equal(noData.status, 400, "a typed update with no data is refused, not stored empty");
});

test("typed updates need the key like everything else, and an unauthenticated caller learns nothing about the data", async () => {
  const d = wide();
  const r = await send(typed("schedule", { nonsense: true }, { apiKey: "wrong" }), d);
  assert.equal(r.status, 401);
  assert.equal((await json(r)).issues, undefined);
  assert.equal(mem(d).docWrites, 0);
  const viaBearer = await send(typed("announcement", BANNER, { apiKey: undefined }), d, { Authorization: `Bearer ${KEY}` });
  assert.equal(viaBearer.status, 200);
});

test("FAIL CLOSED holds for typed updates: no key configured, nothing accepted", async () => {
  const d = wide({ env: {} });
  assert.equal((await send(typed("announcement", BANNER, { apiKey: "" }), d)).status, 503);
  assert.equal(mem(d).docWrites, 0);
});

test("typed updates: no store is 503 with the reason; a store failure is a generic 502 with no leak", async () => {
  const none = await send(typed("schedule", SCHEDULE), wide({ store: null, storeProblem: "GITHUB_CONTENT_REPO must look like owner/name." }));
  assert.equal(none.status, 503);
  assert.equal((await json(none)).error, "GITHUB_CONTENT_REPO must look like owner/name.");
  const lines: string[] = [];
  const bad = await send(typed("schedule", SCHEDULE), wide({ store: memoryStore(new Error("ENOENT /Users/saurabh/x token ghp_SECRET")), log: (l) => lines.push(l) }));
  assert.equal(bad.status, 502);
  assert.ok(!/ghp_|SECRET|saurabh|ENOENT/.test(JSON.stringify(await json(bad))));
  assert.ok(lines.some((l) => l.includes("store failure")));
});

test("a post still works on a site that also takes typed updates, and typed fields do not make a post", async () => {
  const d = wide();
  assert.equal((await send(calendarPayload(), d)).status, 200);
  assert.equal(mem(d).writes, 1);
  // title/body without a type are a post; a typed update's data is only ever read from `data`.
  const r = await send({ apiKey: KEY, type: "schedule", title: "T", body: "b" }, d);
  assert.equal(r.status, 400);
  assert.equal(mem(d).docWrites, 0);
});

test("ping tells a caller what this site accepts", async () => {
  const ping = (d: IngestDeps) => handlePing(new Request("https://site.example/api/contentsathi", { headers: { Authorization: `Bearer ${KEY}` } }), d);
  assert.deepEqual(((await ping(deps()).json()) as { accepts: string[] }).accepts, ["post"]);
  assert.deepEqual(((await ping(wide()).json()) as { accepts: string[] }).accepts, ["post", "schedule", "announcement"]);
});
