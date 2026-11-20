import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { childrenPhotosCleared, gallery, heroPhoto, onStage, photos, type Photo } from "./photos.ts";
import { tlobLibrary } from "./library.ts";

const dir = path.join(process.cwd(), "public", "images");
/** Photos of children wait here, unserved, until the parents' permission is confirmed. */
const held = path.join(process.cwd(), "photos-awaiting-permission");
const fileOf = (ph: Photo) => ph.src.replace("/images/", "");
const isHeld = (ph: Photo) => Boolean(ph.showsChildren) && !childrenPhotosCleared;
const jpgs = (d: string) => readdirSync(d).filter((f) => f.endsWith(".jpg")).sort();

/** Width and height from a JPEG's start-of-frame marker; asserts the bytes really are a JPEG. */
function jpegSize(file: string, from = dir) {
  const b = readFileSync(path.join(from, file));
  assert.ok(b[0] === 0xff && b[1] === 0xd8, `${file} is not JPEG data`);
  let i = 2;
  while (i + 9 < b.length) {
    assert.equal(b[i], 0xff, `${file}: bad marker at ${i}`);
    const marker = b[i + 1];
    const len = b.readUInt16BE(i + 2);
    // SOF0–SOF15, except DHT (c4), JPG (c8) and DAC (cc).
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) };
    i += 2 + len;
  }
  assert.fail(`${file}: no frame header found`);
}

test("every registered photo is a real JPEG and its declared size is its real size (no layout shift)", () => {
  for (const [key, ph] of Object.entries(photos)) {
    assert.ok(ph.src.startsWith("/images/") && ph.src.endsWith(".jpg"), key); // the extension says what the bytes are
    assert.deepEqual(jpegSize(fileOf(ph), isHeld(ph) ? held : dir), { w: ph.w, h: ph.h }, key);
  }
});

test("every photo has alt text that says something, and no two alts are the same", () => {
  const alts = Object.values(photos).map((p) => p.alt);
  for (const a of alts) assert.ok(a.length >= 20 && !/\.(png|jpe?g)$/i.test(a), a);
  assert.equal(new Set(alts).size, alts.length);
});

test("the gallery shows each photo once, and nothing on disk is unused or unregistered", () => {
  assert.equal(new Set(gallery.map((g) => g.src)).size, gallery.length);
  const all = Object.values(photos);
  const files = readdirSync(dir).filter((f) => f !== "tlob");
  assert.deepEqual(files.sort(), all.filter((p) => !isHeld(p)).map(fileOf).sort(), "public/images matches the registry");
  assert.deepEqual(readdirSync(path.join(dir, "tlob")).sort(), tlobLibrary.map((l) => l.file).sort(), "public/images/tlob matches the library");
  assert.deepEqual(jpgs(held), all.filter(isHeld).map(fileOf).sort(), "photos-awaiting-permission matches the held photos");
});

test("until the parents' permission is confirmed, no photo of children is served or shown anywhere", () => {
  if (childrenPhotosCleared) return;
  const children = Object.values(photos).filter((p) => p.showsChildren);
  assert.ok(children.length > 0, "the photos of children are still marked");
  const served = new Set(readdirSync(dir));
  for (const ph of children) assert.ok(!served.has(fileOf(ph)), `${fileOf(ph)} is under public/ (anyone with the address can open it)`);
  for (const ph of [heroPhoto, ...onStage.photos, ...gallery]) assert.ok(!ph.showsChildren, ph.src);
  assert.ok(!/troph/i.test(onStage.heading + onStage.line), "the trophy line went with the trophy photo");
});

test("the wedding-scene photo from the other site is not in this one", () => {
  assert.ok(!readdirSync(dir).includes("hero-premium.jpg"));
});

test("every TLOB library photo is a real JPEG of its declared size, with its own alt text", () => {
  const tlobDir = path.join(dir, "tlob");
  for (const l of tlobLibrary) {
    assert.ok(l.file.endsWith(".jpg"), l.file);
    assert.deepEqual(jpegSize(l.file, tlobDir), { w: l.w, h: l.h }, l.file);
    assert.ok(l.alt.length >= 20, l.file);
  }
  const alts = [...Object.values(photos).map((p) => p.alt), ...tlobLibrary.map((l) => l.alt)];
  assert.equal(new Set(alts).size, alts.length, "no two photos share alt text");
});

test("the gallery follows the children switch for library photos too", () => {
  const kids = tlobLibrary.filter((l) => l.showsChildren).length;
  const shownKids = gallery.filter((g) => g.src.startsWith("/images/tlob/") && g.showsChildren).length;
  assert.equal(shownKids, childrenPhotosCleared ? kids : 0);
});
