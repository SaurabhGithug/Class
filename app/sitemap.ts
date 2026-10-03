import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { listPublished } from "@/lib/contentsathi/posts.ts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await listPublished();
  const pages: MetadataRoute.Sitemap = ["", "/classes", "/about", "/gallery", "/contact"].map((r) => ({
    url: `${site.url}${r}`,
    lastModified: new Date(),
    changeFrequency: r === "" || r === "/classes" ? "weekly" : "monthly",
    priority: r === "" ? 1 : r === "/classes" ? 0.9 : 0.7,
  }));
  if (posts.length === 0) return pages;
  return [
    ...pages,
    { url: `${site.url}/blog`, lastModified: new Date(posts[0].updatedAt), changeFrequency: "weekly", priority: 0.6 },
    ...posts.map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: new Date(p.updatedAt), changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
