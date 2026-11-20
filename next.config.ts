import type { NextConfig } from "next";

/**
 * Two ways to ship this site:
 *  - Vercel (default): a normal Next.js server build. The ContentSathi receiver
 *    (app/api/contentsathi) works and images are optimised on the fly.
 *  - GitHub Pages (GITHUB_PAGES=true): a static export served under /Class/.
 *    Pages has no server, so the build workflow (.github/workflows/pages.yml)
 *    removes app/api before building, images are served as they are, and the
 *    base path is added to every image src via NEXT_PUBLIC_BASE_PATH (lib/photos.ts).
 */
const pages = process.env.GITHUB_PAGES === "true";
const basePath = pages ? "/Class" : "";

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  ...(pages
    ? {
        output: "export",
        basePath,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
