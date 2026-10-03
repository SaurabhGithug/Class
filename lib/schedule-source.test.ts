import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { loadSchedule } from "./schedule-source.ts";
import { classesFor, classesOn, schedule } from "./classes.ts";

const DOC = {
  confirmed: true,
  note: "No classes 22 Dec – 2 Jan.",
  classes: [
    { day: "Mon", time: "Evening", clock: "6:30–7:30 pm", location: "Schaumburg studio", name: "Bollywood Beginner", level: "Teens & Adults", audiences: ["teens", "adults"] },
    { day: "Sat", time: "Morning", clock: "", location: "", name: "Semi-Classical", level: "Kids & Teens", audiences: ["kids", "teens"] },
  ],
  updatedAt: "2026-10-02T10:00:00.000Z",
};

async function withFile(content: string | null, fn: (file: string) => Promise<void>) {
  const dir = await mkdtemp(path.join(tmpdir(), "csched-"));
  try {
    const file = path.join(dir, "schedule.json");
    if (content !== null) await writeFile(file, content);
    await fn(file);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

test("with no file, the built-in programme is used and is not claimed as confirmed", async () => {
  await withFile(null, async (file) => {
    const s = await loadSchedule(file);
    assert.equal(s.fromFile, false);
    assert.equal(s.entries, schedule);
    assert.equal(s.confirmed, false);
    assert.equal(s.updatedAt, null);
  });
});

test("a valid file from ContentSathi replaces the whole programme, with its confirmed flag, note, clock times and places", async () => {
  await withFile(JSON.stringify(DOC), async (file) => {
    const s = await loadSchedule(file);
    assert.equal(s.fromFile, true);
    assert.equal(s.confirmed, true);
    assert.equal(s.note, "No classes 22 Dec – 2 Jan.");
    assert.equal(s.entries.length, 2);
    assert.deepEqual(s.entries[0], { day: "Mon", time: "Evening", name: "Bollywood Beginner", level: "Teens & Adults", audiences: ["teens", "adults"], clock: "6:30–7:30 pm", location: "Schaumburg studio" });
    assert.equal("clock" in s.entries[1], false, "an empty clock is left out, not shown as blank");
    assert.equal(s.updatedAt, DOC.updatedAt);
  });
});

test("the page helpers work on the received rows", async () => {
  await withFile(JSON.stringify(DOC), async (file) => {
    const s = await loadSchedule(file);
    assert.deepEqual(classesFor("kids", s.entries).map((c) => c.name), ["Semi-Classical"]);
    assert.deepEqual(classesFor("teens", s.entries).map((c) => c.name), ["Bollywood Beginner", "Semi-Classical"]);
    assert.deepEqual(classesOn("Mon", s.entries).map((c) => c.name), ["Bollywood Beginner"]);
    assert.equal(classesFor("team", s.entries).length, 0);
  });
});

test("a broken, empty or no-longer-valid file falls back to the built-in programme — it never blanks the page", async () => {
  for (const bad of ["{ not json", "[]", JSON.stringify({ ...DOC, classes: [] }), JSON.stringify({ ...DOC, classes: [{ ...DOC.classes[0], day: "Funday" }] }), JSON.stringify({ ...DOC, injected: "<script>" })]) {
    await withFile(bad, async (file) => {
      const s = await loadSchedule(file);
      assert.equal(s.fromFile, false, bad.slice(0, 30));
      assert.equal(s.entries, schedule);
      assert.ok(s.entries.length > 0);
    });
  }
});
