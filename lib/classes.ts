/**
 * The weekly programme, exactly as listed on Toolieka's earlier website
 * (bollywood/index.html → script.js): 28 classes, a name, an age or level, a day,
 * and a time of DAY ("Morning", "After School", "Evening") — never a clock time.
 * There is no price, no room and no address in it, and none is made up here.
 *
 * CONFIRM BEFORE RELYING ON IT. That site cycled the same few photos across its
 * class cards and says "Call for the full schedule", so this reads as an outline of
 * the week, not a timetable. `scheduleConfirmed` stays false until Toolieka has
 * checked every row; while it is false the classes page tells visitors to call and
 * confirm, in her own words. Flip it, and edit the rows, when she has.
 *
 * ContentSathi can replace this whole programme (a "schedule" update, approved in
 * ContentSathi first): the pages read content/schedule.json when it exists and fall
 * back to this list when it does not. See lib/schedule-source.ts and CONTENTSATHI.md.
 */

export const scheduleConfirmed = false;

export type Day = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
export type TimeOfDay = "Morning" | "Late Morning" | "Afternoon" | "After School" | "Evening";
export type AudienceId = "kids" | "teens" | "adults" | "open" | "team";

export interface ClassEntry {
  name: string;
  /** As listed: an age range or a level. */
  level: string;
  day: Day;
  time: TimeOfDay;
  audiences: readonly AudienceId[];
  /** A clock time such as "5:30–6:30 pm", when ContentSathi has sent one. The built-in programme has none. */
  clock?: string;
  /** Where the class is held, when ContentSathi has sent it. */
  location?: string;
}

export const DAYS: readonly Day[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const DAY_NAMES: Record<Day, string> = { Sun: "Sunday", Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday" };
const TIMES: readonly TimeOfDay[] = ["Morning", "Late Morning", "Afternoon", "After School", "Evening"];

export const AUDIENCES: ReadonlyArray<{ id: AudienceId; label: string; blurb: string }> = [
  { id: "kids", label: "Kids", blurb: "Little Movers from age 4, through to the 12s." },
  { id: "teens", label: "Teens", blurb: "Ages 12–17, from beginner Bollywood to fusion." },
  { id: "adults", label: "Adults", blurb: "Bollywood and fusion, beginner to intermediate." },
  { id: "open", label: "Open levels & families", blurb: "Listed by level, not age — including a family workshop." },
  { id: "team", label: "Teams, events & private coaching", blurb: "By audition, invitation or appointment." },
];

/** The built-in programme: the fallback until ContentSathi sends a schedule. */
export const schedule: readonly ClassEntry[] = [
  // Sunday
  { day: "Sun", time: "Morning", name: "Semi-Classical Kids", level: "Ages 5–10", audiences: ["kids"] },
  { day: "Sun", time: "Late Morning", name: "Bollywood Juniors", level: "Ages 6–12", audiences: ["kids"] },
  { day: "Sun", time: "Afternoon", name: "Indo-Fusion", level: "Ages 7–12", audiences: ["kids"] },
  { day: "Sun", time: "Evening", name: "Open Rehearsal", level: "All Levels", audiences: ["open"] },
  // Monday
  { day: "Mon", time: "Evening", name: "Bollywood Beginner", level: "Teens & Adults", audiences: ["teens", "adults"] },
  { day: "Mon", time: "Evening", name: "Classical Technique", level: "Intermediate", audiences: ["open"] },
  { day: "Mon", time: "Evening", name: "Performance Team", level: "By Audition", audiences: ["team"] },
  { day: "Mon", time: "Evening", name: "Adult Bollywood", level: "All Levels", audiences: ["adults"] },
  // Tuesday
  { day: "Tue", time: "After School", name: "Kids Bollywood", level: "Ages 5–9", audiences: ["kids"] },
  { day: "Tue", time: "Evening", name: "Teen Fusion", level: "Ages 12–17", audiences: ["teens"] },
  { day: "Tue", time: "Evening", name: "Sangeet Prep", level: "Private / Events", audiences: ["team"] },
  { day: "Tue", time: "Evening", name: "Choreo Lab", level: "All Levels", audiences: ["open"] },
  // Wednesday
  { day: "Wed", time: "After School", name: "Little Movers", level: "Ages 4–7", audiences: ["kids"] },
  { day: "Wed", time: "Evening", name: "Bollywood Kids", level: "Ages 8–12", audiences: ["kids"] },
  { day: "Wed", time: "Evening", name: "Semi-Classical", level: "Beginner", audiences: ["open"] },
  { day: "Wed", time: "Evening", name: "Adult Fusion", level: "Intermediate", audiences: ["adults"] },
  // Thursday
  { day: "Thu", time: "After School", name: "Boys Crew", level: "Ages 6–12", audiences: ["kids"] },
  { day: "Thu", time: "Evening", name: "Bollywood Intermediate", level: "Teens", audiences: ["teens"] },
  { day: "Thu", time: "Evening", name: "Showcase Prep", level: "Performance", audiences: ["team"] },
  { day: "Thu", time: "Evening", name: "Private Coaching", level: "By Appointment", audiences: ["team"] },
  // Friday
  { day: "Fri", time: "After School", name: "Kids Party Mix", level: "Ages 5–10", audiences: ["kids"] },
  { day: "Fri", time: "Evening", name: "Teen Bollywood", level: "Ages 13–17", audiences: ["teens"] },
  { day: "Fri", time: "Evening", name: "Classical & Fusion", level: "All Levels", audiences: ["open"] },
  { day: "Fri", time: "Evening", name: "Community Class", level: "Open Floor", audiences: ["open"] },
  // Saturday
  { day: "Sat", time: "Morning", name: "Semi-Classical", level: "Kids & Teens", audiences: ["kids", "teens"] },
  { day: "Sat", time: "Late Morning", name: "Bollywood Masterclass", level: "Open Level", audiences: ["open"] },
  { day: "Sat", time: "Afternoon", name: "Competition Team", level: "By Invitation", audiences: ["team"] },
  { day: "Sat", time: "Afternoon", name: "Family Workshop", level: "All Ages", audiences: ["open"] },
];

const order = (a: ClassEntry, b: ClassEntry) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day) || TIMES.indexOf(a.time) - TIMES.indexOf(b.time);

/** The classes for one audience, Sunday first and morning before evening. */
export function classesFor(audience: AudienceId, entries: readonly ClassEntry[] = schedule): ClassEntry[] {
  return entries.filter((c) => c.audiences.includes(audience)).sort(order);
}

export function classesOn(day: Day, entries: readonly ClassEntry[] = schedule): ClassEntry[] {
  return entries.filter((c) => c.day === day).sort(order);
}
