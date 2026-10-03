// Reading typed updates for the pages: always from the repository's own
// content/schedule.json and content/announcement.json, whichever store wrote
// them. Server-only (node:fs).
//
// A file that is missing, not JSON, or no longer a valid schedule/announcement
// reads as null — and the page falls back to its built-in content or shows
// nothing. A bad file must never blank a page or take the site down.

import { readFile } from "node:fs/promises";
import path from "node:path";
import { announcementShowing, parseAnnouncement, parseSchedule } from "./typed.ts";
import type { AnnouncementContent, ScheduleContent, StoredDoc } from "./typed.ts";

async function readJson(file: string): Promise<unknown> {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    return null;
  }
}

function stamp(raw: unknown): { content: unknown; updatedAt: string } | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const { updatedAt, ...content } = raw as Record<string, unknown>;
  return { content, updatedAt: typeof updatedAt === "string" ? updatedAt : new Date(0).toISOString() };
}

// Paths are written out literally (not built from a shared constant): Next's bundler can
// only scope a file-system read to a folder it can see.
const scheduleFile = () => path.join(process.cwd(), "content", "schedule.json");
const announcementFile = () => path.join(process.cwd(), "content", "announcement.json");

export async function readSchedule(file: string = scheduleFile()): Promise<StoredDoc<ScheduleContent> | null> {
  const s = stamp(await readJson(file));
  if (!s) return null;
  const parsed = parseSchedule(s.content);
  return parsed.ok ? { ...parsed.value, updatedAt: s.updatedAt } : null;
}

export async function readAnnouncement(file: string = announcementFile()): Promise<StoredDoc<AnnouncementContent> | null> {
  const s = stamp(await readJson(file));
  if (!s) return null;
  const parsed = parseAnnouncement(s.content);
  return parsed.ok ? { ...parsed.value, updatedAt: s.updatedAt } : null;
}

/** The announcement to show right now, or null: absent, switched off, not started, or expired. */
export async function currentAnnouncement(now: Date = new Date(), file?: string): Promise<StoredDoc<AnnouncementContent> | null> {
  const a = await readAnnouncement(file);
  return a && announcementShowing(a, now) ? a : null;
}
