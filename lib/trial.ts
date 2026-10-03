/**
 * Turns the trial-class form into the email the visitor sends. Pure, so it can be
 * tested: no DOM, no network.
 *
 * Every field is encodeURIComponent'd, so nothing a visitor types can add a header
 * or a second recipient to the mailto: link ("&cc=", "%0D%0ABcc:" stay inert text).
 */

export interface Fields {
  get(name: string): unknown;
  getAll(name: string): unknown[];
}

export const FOR_WHOM = ["My child", "My teen", "Myself", "My family"] as const;
export const LEVELS = ["Brand new to dance", "Some experience", "Experienced", "Not sure"] as const;

/** A mailto: URL is read by a mail client, which may stop long ones — keep the free text modest. */
export const MESSAGE_LIMIT = 1200;

const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.replace(/[\r\n\t]+/g, " ").trim().slice(0, max) : "");
const list = (values: unknown[]) => values.map((v) => clean(v, 60)).filter(Boolean);

export function buildTrialRequest(f: Fields, to: string) {
  const name = clean(f.get("name"), 100);
  const lines = [
    "ABOUT THE DANCER",
    `Name: ${name}`,
    `Trial class for: ${clean(f.get("forWhom"), 40) || "—"}`,
    `Age: ${clean(f.get("age"), 20) || "—"}`,
    `Experience: ${clean(f.get("level"), 40) || "—"}`,
    "",
    "WHAT THEY WANT TO TRY",
    `Styles: ${list(f.getAll("styles")).join(", ") || "—"}`,
    `Days that suit: ${list(f.getAll("days")).join(", ") || "—"}`,
    "",
    "HOW TO REACH ME",
    `Email: ${clean(f.get("email"), 120)}`,
    `Phone: ${clean(f.get("phone"), 40)}`,
    "",
    "ANYTHING ELSE",
    // The message keeps its line breaks; everything else is single-line.
    (typeof f.get("message") === "string" ? (f.get("message") as string).replace(/\r\n?/g, "\n").trim().slice(0, MESSAGE_LIMIT) : "") || "—",
  ];
  const subject = `Trial class request — ${name || "new enquiry"}`;
  const body = lines.join("\n");
  return { subject, body, href: `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` };
}
