/**
 * Facts about the business, in one place. Everything here is taken from Toolieka's
 * own two websites (bollywood/index.html and bollywood/toolieka/lib/content.ts);
 * nothing is invented, and nothing is stated that those sites do not state.
 */

const env = globalThis.process?.env ?? {};

/** True once NEXT_PUBLIC_SITE_URL names the real address. Until then the site tells search engines not to index it. */
export const siteUrlConfigured = Boolean(env.NEXT_PUBLIC_SITE_URL);

export const site = {
  name: "Toolieka Prakash Nikam",
  short: "Toolieka",
  // The trading name of the classes is unconfirmed; this is what her site calls her.
  brand: "Toolieka — Bollywood Dance Classes",
  phone: "+12242583880",
  phoneDisplay: "224.258.3880",
  email: "tlobcali@gmail.com",
  basedIn: "Chicago, Illinois",
  areas: ["Schaumburg, Illinois", "Naperville, Illinois"],
  instagram: [
    { handle: "@choreographer_toolieka", url: "https://www.instagram.com/choreographer_toolieka/" },
    { handle: "@tlob_usa", url: "https://www.instagram.com/tlob_usa" },
    { handle: "@tea_t_tee_", url: "https://www.instagram.com/tea_t_tee_/" },
  ],
  /** Set NEXT_PUBLIC_SITE_URL on the host. The fallback is for local development only. */
  url: (env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, ""),
  /** Her wedding site, linked only once its address is set (NEXT_PUBLIC_WEDDINGS_URL). */
  weddingsUrl: env.NEXT_PUBLIC_WEDDINGS_URL ? env.NEXT_PUBLIC_WEDDINGS_URL.replace(/\/+$/, "") : null,
} as const;
