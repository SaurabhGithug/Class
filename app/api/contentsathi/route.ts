import { revalidatePath } from "next/cache";
import { handleIngest, handlePing } from "@/lib/contentsathi/ingest.ts";
import { storeFromEnv } from "@/lib/contentsathi/store.ts";
import { acceptedTypes } from "@/lib/contentsathi-site";
import type { ContentStore } from "@/lib/contentsathi/types.ts";

// ContentSathi's website push lands here. Everything that matters is in
// lib/contentsathi/ingest.ts (and tested there); this file only supplies the
// environment and refreshes the pages that list posts.
//
// What this site accepts is lib/contentsathi-site.ts — the site's own choice, never overwritten by sync.sh.
//
// Register in ContentSathi → SEO Harness → connect a website:
//   Website URL  https://<your-domain>/blog      (ContentSathi records <URL>/<slug> as the post's address)
//   Webhook URL  https://<your-domain>/api/contentsathi
// then put the key it shows you ONCE into CONTENTSATHI_WEBHOOK_KEY. See CONTENTSATHI.md.

export const runtime = "nodejs";

function setup(): { store: ContentStore | null; storeProblem?: string } {
  try {
    return { store: storeFromEnv(process.env) };
  } catch (e) {
    // Messages thrown while choosing a store name a variable, never a value.
    return { store: null, storeProblem: e instanceof Error ? e.message : "The content store is misconfigured." };
  }
}

const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/+$/, "");

export async function POST(req: Request) {
  const res = await handleIngest(req, { env: process.env, ...setup(), accepts: acceptedTypes, siteUrl: siteUrl(), log: (line) => console.log(line) });
  if (res.ok) {
    revalidatePath("/blog");
    revalidatePath("/blog/[slug]", "page");
    revalidatePath("/", "layout"); // the nav shows Journal once there is a post
    revalidatePath("/sitemap.xml");
  }
  return res;
}

export async function GET(req: Request) {
  return handlePing(req, { env: process.env, ...setup(), accepts: acceptedTypes });
}
