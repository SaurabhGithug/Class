import { test } from "node:test";
import assert from "node:assert/strict";
import { LIMITS, isHttpsUrl, parsePost, slugify } from "./payload.ts";

const ok = (raw: unknown) => {
  const r = parsePost(raw);
  assert.ok(r.ok, r.ok ? "" : r.issues.join(" | "));
  return r.post;
};
const bad = (raw: unknown) => {
  const r = parsePost(raw);
  assert.ok(!r.ok, "expected the post to be refused");
  return r.issues;
};

test("slugify makes a-z, 0-9 and single hyphens, and never ends on one", () => {
  assert.equal(slugify("Bollywood Wedding: 5 Tips!"), "bollywood-wedding-5-tips");
  assert.equal(slugify("  --Café Sangeet--  "), "cafe-sangeet");
  assert.equal(slugify("***"), "");
  assert.ok(slugify("a".repeat(300)).length <= LIMITS.slug);
  assert.ok(!slugify(`${"a".repeat(99)}-b`).endsWith("-"));
});

test("the calendar publish flow's payload (publish/website)", () => {
  const p = ok({
    source: "contentsathi", apiKey: "k", title: "Sangeet Tips", slug: "sangeet-tips-", body: "## Tip one\n\nDance.",
    category: "Weddings", tags: ["sangeet", "Sangeet", "dance", ""], featuredImage: "https://cdn.example/a.jpg",
    publishImmediately: true, timestamp: "2026-10-02T00:00:00.000Z",
  });
  assert.equal(p.slug, "sangeet-tips");
  assert.deepEqual(p.tags, ["sangeet", "dance"]); // case-insensitive de-dupe, blanks dropped
  assert.equal(p.category, "Weddings");
  assert.equal(p.publishImmediately, true);
});

test("the SEO harness's payload: text in both body and content, meta fields, no category", () => {
  const p = ok({
    source: "contentsathi", apiKey: "k", idempotencyKey: "seo-harness:c1:s:abc", title: "T", slug: "t",
    body: "Same text.", content: "Same text.", metaTitle: "Meta title", metaDescription: "Meta description", publishImmediately: true,
  });
  assert.equal(p.body, "Same text.");
  assert.equal(p.metaTitle, "Meta title");
  assert.equal(p.category, "General");
});

test("the env ingest payload: `content` only, no publishImmediately — published", () => {
  const p = ok({ title: "T", slug: "t", content: "Words here.", metaTitle: "m", metaDescription: "d", idempotencyKey: "x" });
  assert.equal(p.body, "Words here.");
  assert.equal(p.publishImmediately, true);
});

test("only an explicit false makes a draft", () => {
  assert.equal(ok({ title: "T", body: "b", publishImmediately: false }).publishImmediately, false);
  assert.equal(ok({ title: "T", body: "b" }).publishImmediately, true);
  assert.ok(bad({ title: "T", body: "b", publishImmediately: "no" }).some((i) => /publishImmediately/.test(i)));
});

test("the slug is made from the title when it is missing or empties out", () => {
  assert.equal(ok({ title: "Kids Bollywood Classes", body: "b" }).slug, "kids-bollywood-classes");
  assert.equal(ok({ title: "Kids Bollywood Classes", slug: "---", body: "b" }).slug, "kids-bollywood-classes");
  assert.ok(bad({ title: "***", body: "b" }).some((i) => /slug/.test(i)));
});

test("a slug can never carry a path", () => {
  assert.equal(ok({ title: "T", slug: "../../etc/passwd", body: "b" }).slug, "etc-passwd");
  assert.equal(ok({ title: "T", slug: "a/b\\c", body: "b" }).slug, "a-b-c");
});

test("every problem is listed at once", () => {
  const issues = bad({ title: "", body: "", featuredImage: "http://insecure.example/a.jpg", tags: "x", publishImmediately: 1 });
  for (const word of ["title", "body", "featuredImage", "tags", "publishImmediately"]) assert.ok(issues.some((i) => i.includes(word)), word);
});

test("limits", () => {
  assert.ok(bad({ title: "t".repeat(LIMITS.title + 1), body: "b" }).some((i) => /title/.test(i)));
  assert.ok(bad({ title: "T", body: "b".repeat(LIMITS.body + 1) }).some((i) => /body/.test(i)));
  assert.equal(ok({ title: "T", body: "b", tags: Array.from({ length: 30 }, (_, i) => `t${i}`) }).tags.length, LIMITS.tags);
  assert.equal(ok({ title: "T", body: "b", metaDescription: "m".repeat(1000) }).metaDescription.length, LIMITS.metaDescription);
});

test("an unknown type is refused, so a payload meant for something else is never stored as an article", () => {
  assert.ok(bad({ type: "schedule", title: "T", body: "b" }).some((i) => /Unsupported type/.test(i)));
  ok({ type: "post", title: "T", body: "b" });
});

test("not an object", () => {
  for (const raw of [null, "x", 5, [], undefined]) assert.ok(bad(raw).length > 0);
});

test("featuredImage must be https", () => {
  assert.equal(isHttpsUrl("https://a.example/x.jpg"), true);
  for (const v of ["http://a.example", "javascript:alert(1)", "data:image/png;base64,AA", "https://u:p@a.example/x"]) assert.equal(isHttpsUrl(v), false, v);
});

test("HTML bodies are normalised on the way in", () => {
  assert.equal(ok({ title: "T", body: "<p>Hello <strong>there</strong></p>" }).body, "Hello **there**");
});
