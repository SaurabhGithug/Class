import type { MetadataRoute } from "next";
import { site, siteUrlConfigured } from "@/lib/site";

/** Built once at deploy time (required by the static GitHub Pages export; the same on Vercel). */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // Until NEXT_PUBLIC_SITE_URL names the real address, nothing here should be crawled.
  if (!siteUrlConfigured) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: `${site.url}/sitemap.xml` };
}
