import type { MetadataRoute } from "next";
import { site, siteUrlConfigured } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Until NEXT_PUBLIC_SITE_URL names the real address, nothing here should be crawled.
  if (!siteUrlConfigured) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: `${site.url}/sitemap.xml` };
}
