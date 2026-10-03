import { test } from "node:test";
import assert from "node:assert/strict";
import { formatDate, readingMinutes } from "./format.ts";

test("formatDate is UTC and tolerant of nothing", () => {
  assert.equal(formatDate("2026-10-02T23:59:59.000Z"), "2 October 2026");
  assert.equal(formatDate("2026-10-03T00:00:00.000Z"), "3 October 2026");
  for (const v of [null, undefined, "", "not a date"]) assert.equal(formatDate(v as string), "");
});

test("readingMinutes rounds at 200 wpm and is never below 1", () => {
  assert.equal(readingMinutes(""), 1);
  assert.equal(readingMinutes("word ".repeat(50)), 1);
  assert.equal(readingMinutes("word ".repeat(400)), 2);
  assert.equal(readingMinutes("word ".repeat(1000)), 5);
});
