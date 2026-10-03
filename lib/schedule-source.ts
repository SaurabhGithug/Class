/**
 * Where the pages get the class programme: the schedule ContentSathi has sent
 * (content/schedule.json) if there is a valid one, otherwise the built-in list in
 * classes.ts. A missing, broken or no-longer-valid file falls back to the built-in
 * list — a bad file must never blank /classes.
 */
// Relative imports with their extensions, so the node:test suite can load this file (Node does not know the "@/" alias).
import { readSchedule } from "./contentsathi/docs.ts";
import { schedule as builtin, scheduleConfirmed as builtinConfirmed } from "./classes.ts";
import type { ClassEntry } from "./classes.ts";

export interface LoadedSchedule {
  entries: readonly ClassEntry[];
  /** Whether the owner has said every row is checked. The built-in list never is. */
  confirmed: boolean;
  /** A line to show with the schedule ("No classes 22 Dec – 2 Jan."), or "". */
  note: string;
  fromFile: boolean;
  updatedAt: string | null;
}

export async function loadSchedule(file?: string): Promise<LoadedSchedule> {
  const doc = await readSchedule(file);
  if (!doc) return { entries: builtin, confirmed: builtinConfirmed, note: "", fromFile: false, updatedAt: null };
  return {
    entries: doc.classes.map((c) => ({
      day: c.day,
      time: c.time,
      name: c.name,
      level: c.level,
      audiences: c.audiences,
      ...(c.clock ? { clock: c.clock } : {}),
      ...(c.location ? { location: c.location } : {}),
    })),
    confirmed: doc.confirmed,
    note: doc.note,
    fromFile: true,
    updatedAt: doc.updatedAt,
  };
}
