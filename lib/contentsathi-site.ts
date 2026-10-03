import type { UpdateType } from "@/lib/contentsathi/typed.ts";

/**
 * What this site accepts from ContentSathi. The receiver refuses everything else.
 * Articles (the Journal), the class schedule (/classes and the home page), and the
 * site-wide announcement banner.
 */
export const acceptedTypes: readonly UpdateType[] = ["post", "schedule", "announcement"];
