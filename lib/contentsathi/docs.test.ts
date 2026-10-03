import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { currentAnnouncement, readAnnouncement, readSchedule } from "./docs.ts";

const tmp = () => mkdtemp(path.join(tmpdir(), "csdocs-"));
const NOW = new Date("2026-03-12T12:00:00Z");
const SCHEDULE = { confirmed: true, note: "", classes: [{ day: "Tue", time: "After School", clock: "", location: "", name: "Kids Bollywood", level: "Ages 5–9", audiences: ["kids"] }], updatedAt: "2026-03-01T00:00:00.000Z" };
const BANNER = { active: true, text: "Hi", linkLabel: "", linkHref: "", tone: "info", startsAt: null, expiresAt: null, updatedAt: "2026-03-01T00:00:00.000Z" };

async function withFile(name: string, content: string, fn: (file: string) => Promise<void>) {
  const dir = await tmp();
  try {
    const file = path.join(dir, name);
    await writeFile(file, content);
    await fn(file);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

test("a valid schedule file reads back with its stamp", async () => {
  await withFile("schedule.json", JSON.stringify(SCHEDULE), async (f) => {
    const s = await readSchedule(f);
    assert.equal(s?.classes[0].name, "Kids Bollywood");
    assert.equal(s?.updatedAt, "2026-03-01T00:00:00.000Z");
  });
});

test("a missing, broken or no-longer-valid file reads as null — it never blanks a page", async () => {
  assert.equal(await readSchedule("/nonexistent/schedule.json"), null);
  await withFile("schedule.json", "{ not json", async (f) => assert.equal(await readSchedule(f), null));
  await withFile("schedule.json", JSON.stringify({ ...SCHEDULE, classes: [] }), async (f) => assert.equal(await readSchedule(f), null));
  await withFile("schedule.json", JSON.stringify({ ...SCHEDULE, injected: "<script>" }), async (f) => assert.equal(await readSchedule(f), null), );
  await withFile("announcement.json", JSON.stringify({ ...BANNER, linkLabel: "Go", linkHref: "javascript:alert(1)" }), async (f) => assert.equal(await readAnnouncement(f), null));
  await withFile("announcement.json", "[]", async (f) => assert.equal(await readAnnouncement(f), null));
});

test("a hand-edited file with a hostile link is refused at read time too, not just at receive time", async () => {
  await withFile("announcement.json", JSON.stringify({ ...BANNER, linkLabel: "Go", linkHref: "javascript:alert(1)" }), async (f) => {
    assert.equal(await currentAnnouncement(NOW, f), null);
  });
});

test("currentAnnouncement: only while active and inside its window", async () => {
  await withFile("announcement.json", JSON.stringify(BANNER), async (f) => assert.equal((await currentAnnouncement(NOW, f))?.text, "Hi"));
  await withFile("announcement.json", JSON.stringify({ ...BANNER, active: false }), async (f) => assert.equal(await currentAnnouncement(NOW, f), null));
  await withFile("announcement.json", JSON.stringify({ ...BANNER, expiresAt: "2026-03-12T11:59:59.000Z" }), async (f) => assert.equal(await currentAnnouncement(NOW, f), null));
  await withFile("announcement.json", JSON.stringify({ ...BANNER, startsAt: "2026-03-12T12:00:01.000Z" }), async (f) => assert.equal(await currentAnnouncement(NOW, f), null));
  assert.equal(await currentAnnouncement(NOW, "/nonexistent/announcement.json"), null);
});
