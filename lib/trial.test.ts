import { test } from "node:test";
import assert from "node:assert/strict";
import { MESSAGE_LIMIT, buildTrialRequest } from "./trial.ts";
import type { Fields } from "./trial.ts";

const fields = (single: Record<string, unknown>, multi: Record<string, unknown[]> = {}): Fields => ({
  get: (k) => single[k] ?? null,
  getAll: (k) => multi[k] ?? [],
});

const TO = "owner@example.com";

test("the email carries what the visitor entered, readable, with the subject naming them", () => {
  const r = buildTrialRequest(
    fields(
      { name: "Asha Rao", email: "asha@example.com", phone: "+1 555 000 1111", forWhom: "My child", age: "8", level: "Brand new to dance", message: "She loves films.\nThanks!" },
      { styles: ["Bollywood", "Indo-fusion"], days: ["Wed", "Sat"] },
    ),
    TO,
  );
  assert.equal(r.subject, "Trial class request — Asha Rao");
  for (const line of ["Name: Asha Rao", "Trial class for: My child", "Age: 8", "Styles: Bollywood, Indo-fusion", "Days that suit: Wed, Sat", "Email: asha@example.com", "Phone: +1 555 000 1111", "She loves films.\nThanks!"]) {
    assert.ok(r.body.includes(line), line);
  }
  assert.ok(r.href.startsWith(`mailto:${TO}?subject=`));
  assert.equal(decodeURIComponent(r.href.split("body=")[1]), r.body);
});

test("empty optional fields read as a dash, never as 'undefined' or 'null'", () => {
  const r = buildTrialRequest(fields({ name: "A", email: "a@b.co", phone: "1" }), TO);
  assert.ok(!/undefined|null/.test(r.body));
  assert.ok(r.body.includes("Age: —") && r.body.includes("Styles: —") && r.body.includes("Days that suit: —"));
  assert.ok(r.body.trimEnd().endsWith("—"));
});

test("a visitor cannot add a recipient or a header: everything typed stays inside the encoded value", () => {
  const evil = "Asha&cc=attacker@evil.example&bcc=x@evil.example\r\nBcc: y@evil.example";
  const r = buildTrialRequest(fields({ name: evil, email: "a@b.co", phone: "1", message: "hi&cc=z@evil.example" }), TO);
  const query = r.href.slice(r.href.indexOf("?") + 1);
  const params = query.split("&").map((p) => p.split("=")[0]);
  assert.deepEqual(params, ["subject", "body"], "only the two parameters the form set");
  assert.ok(!/[\r\n]/.test(r.subject), "a name cannot break the subject line");
  assert.ok(!r.href.includes("\n") && !r.href.includes("\r"));
});

test("long fields are capped so the link stays usable", () => {
  const r = buildTrialRequest(fields({ name: "n".repeat(500), email: "a@b.co", phone: "1", message: "m".repeat(5000) }), TO);
  assert.ok(r.body.length < MESSAGE_LIMIT + 600);
  assert.ok(r.subject.length < 130);
});

test("non-string input is ignored rather than printed", () => {
  const r = buildTrialRequest(fields({ name: { toString: () => "x" }, email: 5, phone: null, age: [], message: 7 }), TO);
  assert.ok(!/\[object|x$/m.test(r.body));
  assert.equal(r.subject, "Trial class request — new enquiry");
});
