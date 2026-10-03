// Small, pure display helpers shared by both sites' blog pages.

/** "2 October 2026", always in UTC so a statically built page never differs from the same page rendered elsewhere. */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(t));
}

/** Whole minutes to read `body` at 200 words a minute; never less than 1. */
export function readingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
