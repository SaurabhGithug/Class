// The key ContentSathi shows once when a website connection is created.
//
// FAIL CLOSED. With no key configured the receiver refuses everything — it never
// falls back to "open". Comparison is constant-time over SHA-256 digests, so
// neither the key's length nor how much of it matched can be timed.

import { createHash, timingSafeEqual } from "node:crypto";

const digest = (s: string) => createHash("sha256").update(s).digest();

/** The configured keys. CONTENTSATHI_WEBHOOK_KEY may list several, comma-separated, so a key can be rotated without a gap. */
export function configuredKeys(env: Record<string, string | undefined>): string[] {
  return (env.CONTENTSATHI_WEBHOOK_KEY ?? "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
}

/** Whether `provided` equals any configured key. Always compares against every key. */
export function keyMatches(provided: string | undefined | null, keys: string[]): boolean {
  if (!provided || keys.length === 0) return false;
  const given = digest(provided);
  let ok = false;
  for (const key of keys) if (timingSafeEqual(given, digest(key))) ok = true;
  return ok;
}

/** The key a request carries: a Bearer header, else the apiKey field ContentSathi's connection payload uses. */
export function presentedKey(headers: Headers, body: unknown): string | undefined {
  const bearer = /^Bearer\s+(.+)$/i.exec(headers.get("authorization") ?? "")?.[1]?.trim();
  if (bearer) return bearer;
  const field = body && typeof body === "object" ? (body as Record<string, unknown>).apiKey : undefined;
  return typeof field === "string" && field.trim() ? field.trim() : undefined;
}
