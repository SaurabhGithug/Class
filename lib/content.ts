/**
 * Copy for the classes site. HARD RULE, carried over from her wedding site: every
 * claim here is one her own sites make, in her own words or closer to them than
 * ours. No student counts, no testimonials, no prices, no studio address or hours,
 * no results — none of that has been supplied. Add them here only when they are real.
 *
 * CREDIT LANGUAGE: "productions that also featured performers including…" is the
 * precise claim. It is not "choreographed for" or "performed with", and this file
 * has no basis for the stronger one.
 */

export const credentials = [
  { value: "13+", label: "Years in film & stage" },
  { value: "2015", label: "UNESCO / CID Paris certified" },
  { value: "2008", label: "Cine Dancers Association of Indian Film Industry" },
  { value: "2005", label: "Lead dancer, international musicals" },
] as const;

export const bio = {
  lead: "Toolieka is an accomplished Bollywood film-industry performer, known for her grace, striking movement, and winsome nuance.",
  body: [
    "She began with the international musicals Bharati and Merchants of Bollywood in 2005, as lead dancer and actor — productions that toured stages far outside India.",
    "Her work since has spanned films, award shows and television — productions and stages that also featured performers including Priyanka Chopra, Shah Rukh Khan and Madhuri Dixit. She is also a trained theatre actress, with credits in Indian and international musical theatre, Indian films, and television serials.",
    "Today she teaches authentic Bollywood, classical and semi-classical styles across the USA.",
  ],
} as const;

export const timeline = [
  { year: "2005", title: "Lead dancer & actor, international musicals", body: "Bharati and Merchants of Bollywood — productions that toured stages far outside India." },
  { year: "2008", title: "Cine Dancers Association", body: "Cine Dancers Association of Indian Film Industry, since 2008." },
  { year: "2015", title: "UNESCO / CID Paris certified", body: "Certified as a dance educator." },
  { year: "Today", title: "Teaching across the USA", body: "Authentic Bollywood, classical and semi-classical styles for kids, teens and adults." },
] as const;

/** The styles her earlier site lists, each with the line her sites use for it. */
export const styles = [
  { name: "Bollywood", line: "Authentic Bollywood storytelling with confidence, expression and joy." },
  { name: "Semi-classical", line: "Classical roots — heritage, ritual and stage craft." },
  { name: "Indo-fusion", line: "Indo-contemporary movement that crosses over with hip-hop." },
  { name: "Hip-hop & freestyle", line: "Taught with authentic technique, alongside the Indian styles." },
] as const;

export const beyondClass =
  "Private events, sangeet, mehendi, corporate and community performances.";

export const tagline =
  "Authentic Bollywood, classical and fusion dance for kids, teens and adults — in Schaumburg, Naperville and across the USA.";
