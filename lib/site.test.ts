import { test } from "node:test";
import assert from "node:assert/strict";

// site.ts reads the environment once, when it is loaded: load a fresh copy per case.
let n = 0;
async function siteWith(env: Record<string, string | undefined>) {
  const saved = { ...process.env };
  for (const k of ["NEXT_PUBLIC_SITE_URL", "VERCEL_PROJECT_PRODUCTION_URL"]) delete process.env[k];
  Object.assign(process.env, env);
  try {
    return await import(`./site.ts?case=${n++}`);
  } finally {
    for (const k of Object.keys(process.env)) if (!(k in saved)) delete process.env[k];
    Object.assign(process.env, saved);
  }
}

test("no address anywhere: localhost, and search engines are told not to index", async () => {
  const m = await siteWith({});
  assert.equal(m.site.url, "http://localhost:3000");
  assert.equal(m.siteUrlConfigured, false);
});

test("on Vercel without a domain: its own production address for previews, still not indexed", async () => {
  const m = await siteWith({ VERCEL_PROJECT_PRODUCTION_URL: "toolieka-dance-classes.vercel.app" });
  assert.equal(m.site.url, "https://toolieka-dance-classes.vercel.app");
  assert.equal(m.siteUrlConfigured, false);
});

test("the configured address wins, and only it switches indexing on", async () => {
  const m = await siteWith({ NEXT_PUBLIC_SITE_URL: "https://classes.example/", VERCEL_PROJECT_PRODUCTION_URL: "x.vercel.app" });
  assert.equal(m.site.url, "https://classes.example");
  assert.equal(m.siteUrlConfigured, true);
});

test("a blank address counts as no address (it would otherwise switch indexing on, or break the build)", async () => {
  const m = await siteWith({ NEXT_PUBLIC_SITE_URL: "  ", VERCEL_PROJECT_PRODUCTION_URL: "x.vercel.app" });
  assert.equal(m.site.url, "https://x.vercel.app");
  assert.equal(m.siteUrlConfigured, false);
});
