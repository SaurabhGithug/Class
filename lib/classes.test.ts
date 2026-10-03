import { test } from "node:test";
import assert from "node:assert/strict";
import { AUDIENCES, DAYS, classesFor, classesOn, schedule } from "./classes.ts";

test("the programme is the 28 classes the earlier site listed — four on each of seven days", () => {
  assert.equal(schedule.length, 28);
  for (const d of DAYS) assert.equal(classesOn(d).length, 4, d);
});

test("every class belongs to at least one audience, and every audience has classes", () => {
  for (const c of schedule) assert.ok(c.audiences.length > 0, c.name);
  for (const a of AUDIENCES) assert.ok(classesFor(a.id).length > 0, a.id);
});

test("an audience agrees with the age or level the class is listed with", () => {
  for (const c of schedule) {
    const ages = /Ages (\d+)–(\d+)/.exec(c.level);
    if (ages) {
      const [lo, hi] = [Number(ages[1]), Number(ages[2])];
      if (hi <= 12) assert.ok(c.audiences.includes("kids"), `${c.name} (${c.level}) should be kids`);
      if (lo >= 12) assert.ok(c.audiences.includes("teens"), `${c.name} (${c.level}) should be teens`);
      assert.ok(!c.audiences.includes("adults"), `${c.name} is for ages, so not adults`);
    }
    if (/Teens/.test(c.level)) assert.ok(c.audiences.includes("teens"), c.name);
    if (/Adult/i.test(c.name)) assert.ok(c.audiences.includes("adults"), c.name);
    if (/Audition|Invitation|Appointment|Private|Performance/.test(c.level)) assert.ok(c.audiences.includes("team"), c.name);
  }
});

test("classes read in week order: Sunday first, morning before evening", () => {
  const kids = classesFor("kids");
  const days = kids.map((c) => DAYS.indexOf(c.day));
  assert.deepEqual(days, [...days].sort((a, b) => a - b));
  assert.equal(kids[0].day, "Sun");
  assert.equal(kids[0].time, "Morning");
  const sunday = classesOn("Sun").map((c) => c.time);
  assert.deepEqual(sunday, ["Morning", "Late Morning", "Afternoon", "Evening"]);
});

test("no clock time, price or address crept into the data", () => {
  const blob = JSON.stringify(schedule);
  assert.ok(!/\d{1,2}:\d{2}|\bAM\b|\bPM\b|\$\d|\bfree\b/i.test(blob));
});

test("the programme is not claimed as confirmed until someone has confirmed it", async () => {
  const mod = await import("./classes.ts");
  assert.equal(mod.scheduleConfirmed, false);
});
