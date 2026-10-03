import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { announcementShowing, isAnnouncementLink, parseAnnouncement, parseSchedule, parseTyped, stableStringify, withoutStamp, TYPED_LIMITS } from "./typed.ts";

interface Case { name: string; data: unknown }
const fixtures = JSON.parse(readFileSync(new URL("./contract-fixtures.json", import.meta.url), "utf8")) as {
  schedule: { valid: Case[]; invalid: Case[] };
  announcement: { valid: Case[]; invalid: Case[] };
};

for (const [type, parse] of [["schedule", parseSchedule], ["announcement", parseAnnouncement]] as const) {
  for (const c of fixtures[type].valid) {
    test(`contract: ${type} accepts ${c.name}, unchanged`, () => {
      const r = parse(c.data);
      assert.ok(r.ok, r.ok ? "" : r.issues.join(" | "));
      assert.deepEqual(r.value, c.data, "a valid fixture is already in normal form");
    });
  }
  for (const c of fixtures[type].invalid) {
    test(`contract: ${type} refuses ${c.name}`, () => {
      const r = parse(c.data);
      assert.ok(!r.ok, "expected a refusal");
      assert.ok(r.issues.length > 0);
    });
  }
}

const klass = (over: Record<string, unknown> = {}) => ({ day: "Mon", time: "Evening", clock: "", location: "", name: "A", level: "B", audiences: ["kids"], ...over });
const sched = (classes: unknown[], over: Record<string, unknown> = {}) => ({ confirmed: true, note: "", classes, ...over });

test("every problem in a schedule is listed at once, with where it is", () => {
  const r = parseSchedule(sched([klass({ day: "X", name: "" }), klass({ audiences: [] }), "nope"], { confirmed: 1, price: 5 }));
  assert.ok(!r.ok);
  for (const needle of ["confirmed", 'unknown field "price"', "classes[0].day", "classes[0].name", "classes[1].audiences", "classes[2] must be an object"]) {
    assert.ok(r.issues.some((i) => i.includes(needle)), needle);
  }
});

test("schedule limits", () => {
  assert.ok(!parseSchedule(sched(Array.from({ length: TYPED_LIMITS.classes + 1 }, (_, i) => klass({ name: `C${i}` })))).ok);
  assert.ok(parseSchedule(sched(Array.from({ length: TYPED_LIMITS.classes }, (_, i) => klass({ name: `C${i}` })))).ok);
  assert.ok(!parseSchedule(sched([klass({ name: "n".repeat(TYPED_LIMITS.name + 1) })])).ok);
  assert.ok(!parseSchedule(sched([klass({ location: "l".repeat(TYPED_LIMITS.location + 1) })])).ok);
  assert.ok(!parseSchedule(sched([klass()], { note: "n".repeat(TYPED_LIMITS.note + 1) })).ok);
});

test("text is one line: newlines and control characters become spaces, and nothing is lost to them", () => {
  const r = parseSchedule(sched([klass({ name: "Kids\nBollywood\u0007  Class" })], { note: "Line one\r\nLine two" }));
  assert.ok(r.ok);
  assert.equal(r.value.classes[0].name, "Kids Bollywood Class");
  assert.equal(r.value.note, "Line one Line two");
});

test("duplicate audiences collapse; the same class on different days is fine", () => {
  const r = parseSchedule(sched([klass({ audiences: ["kids", "kids", "teens"] }), klass({ day: "Tue" })]));
  assert.ok(r.ok);
  assert.deepEqual(r.value.classes[0].audiences, ["kids", "teens"]);
});

test("announcement: dates are normalised to ISO, limits hold, tone defaults to info", () => {
  const r = parseAnnouncement({ active: true, text: "Hi", startsAt: "2026-03-10T05:30:00+05:30", expiresAt: "2026-03-12" });
  assert.ok(r.ok);
  assert.equal(r.value.startsAt, "2026-03-10T00:00:00.000Z");
  assert.equal(r.value.expiresAt, "2026-03-12T00:00:00.000Z");
  assert.equal(r.value.tone, "info");
  assert.ok(!parseAnnouncement({ active: true, text: "t".repeat(TYPED_LIMITS.text + 1) }).ok);
  assert.ok(parseAnnouncement({ active: true, text: "t".repeat(TYPED_LIMITS.text) }).ok);
});

test("an announcement link is a path on the site, https, mailto or tel — nothing else", () => {
  for (const ok of ["/classes", "/blog/x?y=1", "https://a.example/x", "mailto:a@b.co", "tel:+12242583880", "TEL:+1"]) assert.equal(isAnnouncementLink(ok), true, ok);
  for (const bad of ["", "javascript:alert(1)", " /x", "/x y", "//evil.example", "http://a.example", "data:text/html,x", "https://u:p@a.example", "ftp://a.example", "/\u0000x", "x".repeat(400)]) {
    assert.equal(isAnnouncementLink(bad), false, JSON.stringify(bad));
  }
});

test("when an announcement is showing: active, text present, inside its window", () => {
  const a = (over: Record<string, unknown>) => {
    const r = parseAnnouncement({ active: true, text: "Hi", ...over });
    assert.ok(r.ok);
    return r.value;
  };
  const t = new Date("2026-03-12T12:00:00Z");
  assert.equal(announcementShowing(a({}), t), true);
  assert.equal(announcementShowing(a({ active: false }), t), false);
  assert.equal(announcementShowing(a({ startsAt: "2026-03-13T00:00:00Z" }), t), false, "not started");
  assert.equal(announcementShowing(a({ startsAt: "2026-03-12T12:00:00Z" }), t), true, "starts exactly now");
  assert.equal(announcementShowing(a({ expiresAt: "2026-03-12T12:00:00Z" }), t), false, "expires exactly now");
  assert.equal(announcementShowing(a({ expiresAt: "2026-03-12T12:00:01Z" }), t), true);
});

test("stableStringify ignores key order; withoutStamp drops only updatedAt", () => {
  assert.equal(stableStringify({ b: 1, a: [{ d: 1, c: 2 }] }), stableStringify({ a: [{ c: 2, d: 1 }], b: 1 }));
  assert.notEqual(stableStringify({ a: 1 }), stableStringify({ a: 2 }));
  assert.deepEqual(withoutStamp({ a: 1, updatedAt: "x" }), { a: 1 });
  assert.equal(withoutStamp("x"), "x");
});

test("parseTyped picks the parser by type", () => {
  assert.ok(parseTyped("schedule", fixtures.schedule.valid[0].data).ok);
  assert.ok(parseTyped("announcement", fixtures.announcement.valid[0].data).ok);
  assert.ok(!parseTyped("schedule", fixtures.announcement.valid[0].data).ok);
});
