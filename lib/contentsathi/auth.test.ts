import { test } from "node:test";
import assert from "node:assert/strict";
import { configuredKeys, keyMatches, presentedKey } from "./auth.ts";

test("keyMatches is FALSE whenever there is no key to match — never open when unset", () => {
  assert.equal(keyMatches("anything", []), false);
  assert.equal(keyMatches("", []), false);
  assert.equal(keyMatches(undefined, []), false);
  assert.equal(keyMatches(null, ["k"]), false);
  assert.equal(keyMatches("", ["k"]), false);
});

test("keyMatches is exact: no prefix, suffix, case change or whitespace passes", () => {
  const keys = ["Abc123-secret"];
  assert.equal(keyMatches("Abc123-secret", keys), true);
  for (const wrong of ["abc123-secret", "Abc123-secre", "Abc123-secrett", " Abc123-secret", "Abc123-secret ", "Abc123"]) {
    assert.equal(keyMatches(wrong, keys), false, JSON.stringify(wrong));
  }
});

test("configuredKeys splits, trims and drops blanks; several keys allow rotation", () => {
  assert.deepEqual(configuredKeys({}), []);
  assert.deepEqual(configuredKeys({ CONTENTSATHI_WEBHOOK_KEY: "" }), []);
  assert.deepEqual(configuredKeys({ CONTENTSATHI_WEBHOOK_KEY: " a , ,b,, " }), ["a", "b"]);
  assert.equal(keyMatches("b", configuredKeys({ CONTENTSATHI_WEBHOOK_KEY: "a,b" })), true);
});

test("presentedKey reads a Bearer header first, else the apiKey field, else nothing", () => {
  assert.equal(presentedKey(new Headers({ Authorization: "Bearer tok" }), {}), "tok");
  assert.equal(presentedKey(new Headers({ Authorization: "bearer  tok " }), {}), "tok");
  assert.equal(presentedKey(new Headers(), { apiKey: " body-key " }), "body-key");
  assert.equal(presentedKey(new Headers({ Authorization: "Bearer h" }), { apiKey: "b" }), "h", "the header wins");
  assert.equal(presentedKey(new Headers({ Authorization: "tok" }), {}), undefined, "no scheme, no key");
  assert.equal(presentedKey(new Headers(), { apiKey: 5 }), undefined);
  assert.equal(presentedKey(new Headers(), null), undefined);
  assert.equal(presentedKey(new Headers(), "x"), undefined);
});
