// Typed updates: content other than an article that ContentSathi can send.
//
//   schedule      the classes site's weekly programme
//   announcement  a site-wide banner (shown, or cleared with active:false)
//
// STRICT, on purpose. These are written into the site's repository and shown to
// the public, so an unknown field is refused ("unknown field") rather than
// ignored, every problem is reported at once, and text is held to one line.
// ContentSathi's side (src/lib/website/typed-content.ts) validates the same shapes
// before it ever sends; the contract-fixtures.json both suites read keeps the two
// from drifting.
//
// Whether a site ACCEPTS a type is that site's choice (lib/contentsathi-site.ts);
// this file only knows what a valid one looks like.

export const DOC_NAMES = ["schedule", "announcement"] as const;
export type DocName = (typeof DOC_NAMES)[number];
export type UpdateType = "post" | DocName;

export const isDocName = (v: unknown): v is DocName => typeof v === "string" && (DOC_NAMES as readonly string[]).includes(v);

export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
export const TIMES = ["Morning", "Late Morning", "Afternoon", "After School", "Evening"] as const;
export const AUDIENCE_IDS = ["kids", "teens", "adults", "open", "team"] as const;
export const TONES = ["info", "notice"] as const;

export type Day = (typeof DAYS)[number];
export type TimeOfDay = (typeof TIMES)[number];
export type AudienceId = (typeof AUDIENCE_IDS)[number];
export type Tone = (typeof TONES)[number];

export const TYPED_LIMITS = { classes: 80, name: 60, level: 60, clock: 24, location: 80, note: 200, text: 240, linkLabel: 40, linkHref: 300 } as const;

export interface ScheduleClass {
  day: Day;
  time: TimeOfDay;
  /** "5:30–6:30 pm" or ""; the time of day is always present, a clock time only when it is known. */
  clock: string;
  location: string;
  name: string;
  level: string;
  audiences: AudienceId[];
}
export interface ScheduleContent {
  /** True only when the owner has said every row has been checked. */
  confirmed: boolean;
  note: string;
  classes: ScheduleClass[];
}
export interface AnnouncementContent {
  active: boolean;
  text: string;
  linkLabel: string;
  linkHref: string;
  tone: Tone;
  startsAt: string | null;
  expiresAt: string | null;
}

export type StoredDoc<T> = T & { updatedAt: string };

export type TypedParsed<T> = { ok: true; value: T } | { ok: false; issues: string[] };

type Rec = Record<string, unknown>;
const isRec = (v: unknown): v is Rec => Boolean(v) && typeof v === "object" && !Array.isArray(v);

/** One line: control characters and runs of whitespace become single spaces. */
const oneLine = (s: string) => s.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim();

function unknownKeys(o: Rec, allowed: readonly string[], where: string, issues: string[]) {
  for (const k of Object.keys(o)) if (!allowed.includes(k)) issues.push(`${where}unknown field "${k}".`);
}

function text(o: Rec, key: string, where: string, max: number, issues: string[], opts: { required?: boolean } = {}): string {
  const raw = o[key];
  if (raw === undefined || raw === null || raw === "") {
    if (opts.required) issues.push(`${where}${key} is required.`);
    return "";
  }
  if (typeof raw !== "string") {
    issues.push(`${where}${key} must be text.`);
    return "";
  }
  const v = oneLine(raw);
  if (opts.required && !v) issues.push(`${where}${key} is required.`);
  if (v.length > max) issues.push(`${where}${key} is longer than ${max} characters.`);
  return v;
}

function oneOf<T extends string>(o: Rec, key: string, where: string, allowed: readonly T[], issues: string[], fallback?: T): T {
  const raw = o[key];
  if (raw === undefined && fallback !== undefined) return fallback;
  if (typeof raw === "string" && (allowed as readonly string[]).includes(raw)) return raw as T;
  issues.push(`${where}${key} must be one of ${allowed.join(", ")}.`);
  return allowed[0];
}

/** A link a banner may carry: a path on this site, https, mailto or tel. Never http, javascript:, data:, or "//host". */
export function isAnnouncementLink(v: string): boolean {
  if (!v || v.length > TYPED_LIMITS.linkHref || /[\u0000-\u001f\u007f\s]/.test(v)) return false;
  if (v.startsWith("/")) return !v.startsWith("//");
  if (/^(mailto|tel):[^\s]+$/i.test(v)) return true;
  try {
    const u = new URL(v);
    return u.protocol === "https:" && !u.username && !u.password;
  } catch {
    return false;
  }
}

function instant(o: Rec, key: string, issues: string[]): string | null {
  const raw = o[key];
  if (raw === undefined || raw === null || raw === "") return null;
  if (typeof raw !== "string" || Number.isNaN(Date.parse(raw))) {
    issues.push(`${key} must be a date and time such as 2026-12-31T23:59:00Z.`);
    return null;
  }
  return new Date(raw).toISOString();
}

export function parseSchedule(raw: unknown): TypedParsed<ScheduleContent> {
  if (!isRec(raw)) return { ok: false, issues: ["The schedule must be an object."] };
  const issues: string[] = [];
  unknownKeys(raw, ["confirmed", "note", "classes"], "", issues);

  if (typeof raw.confirmed !== "boolean") issues.push("confirmed must be true or false.");
  const note = text(raw, "note", "", TYPED_LIMITS.note, issues);

  const classes: ScheduleClass[] = [];
  if (!Array.isArray(raw.classes) || raw.classes.length === 0) issues.push("classes must be a list with at least one class.");
  else if (raw.classes.length > TYPED_LIMITS.classes) issues.push(`classes has more than ${TYPED_LIMITS.classes} rows.`);
  else {
    const seen = new Set<string>();
    raw.classes.forEach((c, i) => {
      const where = `classes[${i}].`;
      if (!isRec(c)) {
        issues.push(`classes[${i}] must be an object.`);
        return;
      }
      unknownKeys(c, ["day", "time", "clock", "location", "name", "level", "audiences"], where, issues);
      const day = oneOf(c, "day", where, DAYS, issues);
      const time = oneOf(c, "time", where, TIMES, issues);
      const name = text(c, "name", where, TYPED_LIMITS.name, issues, { required: true });
      const level = text(c, "level", where, TYPED_LIMITS.level, issues, { required: true });
      const clock = text(c, "clock", where, TYPED_LIMITS.clock, issues);
      const location = text(c, "location", where, TYPED_LIMITS.location, issues);
      const audiences: AudienceId[] = [];
      if (!Array.isArray(c.audiences) || c.audiences.length === 0 || c.audiences.length > AUDIENCE_IDS.length) {
        issues.push(`${where}audiences must list one or more of ${AUDIENCE_IDS.join(", ")}.`);
      } else {
        for (const a of c.audiences) {
          if (typeof a !== "string" || !(AUDIENCE_IDS as readonly string[]).includes(a)) issues.push(`${where}audiences has "${String(a)}", which is not one of ${AUDIENCE_IDS.join(", ")}.`);
          else if (!audiences.includes(a as AudienceId)) audiences.push(a as AudienceId);
        }
      }
      const key = `${day}|${time}|${name.toLowerCase()}`;
      if (seen.has(key)) issues.push(`${where}is a duplicate of an earlier ${day} ${time} "${name}".`);
      seen.add(key);
      classes.push({ day, time, clock, location, name, level, audiences });
    });
  }

  if (issues.length) return { ok: false, issues };
  return { ok: true, value: { confirmed: raw.confirmed as boolean, note, classes } };
}

export function parseAnnouncement(raw: unknown): TypedParsed<AnnouncementContent> {
  if (!isRec(raw)) return { ok: false, issues: ["The announcement must be an object."] };
  const issues: string[] = [];
  unknownKeys(raw, ["active", "text", "linkLabel", "linkHref", "tone", "startsAt", "expiresAt"], "", issues);

  if (typeof raw.active !== "boolean") issues.push("active must be true or false.");
  const active = raw.active === true;
  // Clearing a banner needs no words; showing one does.
  const body = text(raw, "text", "", TYPED_LIMITS.text, issues, { required: active });
  const linkLabel = text(raw, "linkLabel", "", TYPED_LIMITS.linkLabel, issues);
  const linkHref = text(raw, "linkHref", "", TYPED_LIMITS.linkHref, issues);
  if (linkHref && !isAnnouncementLink(linkHref)) issues.push("linkHref must be a path on this site, an https address, mailto: or tel:.");
  if (Boolean(linkHref) !== Boolean(linkLabel)) issues.push("A link needs both linkLabel and linkHref, or neither.");
  const tone = oneOf(raw, "tone", "", TONES, issues, "info");
  const startsAt = instant(raw, "startsAt", issues);
  const expiresAt = instant(raw, "expiresAt", issues);
  if (startsAt && expiresAt && Date.parse(expiresAt) <= Date.parse(startsAt)) issues.push("expiresAt must be after startsAt.");

  if (issues.length) return { ok: false, issues };
  return { ok: true, value: { active, text: body, linkLabel, linkHref, tone, startsAt, expiresAt } };
}

export function parseTyped(type: DocName, raw: unknown): TypedParsed<ScheduleContent> | TypedParsed<AnnouncementContent> {
  return type === "schedule" ? parseSchedule(raw) : parseAnnouncement(raw);
}

/** JSON with sorted keys, so two documents with the same content compare equal whatever their key order. */
export function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (isRec(value)) return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(",")}}`;
  return JSON.stringify(value) ?? "null";
}

/** The stored document without its bookkeeping, for comparing "is this the same content". */
export function withoutStamp(doc: unknown): unknown {
  if (!isRec(doc)) return doc;
  return Object.fromEntries(Object.entries(doc).filter(([k]) => k !== "updatedAt"));
}

/** Whether an announcement should be on the page at `now`. */
export function announcementShowing(a: AnnouncementContent, now: Date = new Date()): boolean {
  if (!a.active || !a.text) return false;
  if (a.startsAt && now.getTime() < Date.parse(a.startsAt)) return false;
  if (a.expiresAt && now.getTime() >= Date.parse(a.expiresAt)) return false;
  return true;
}
