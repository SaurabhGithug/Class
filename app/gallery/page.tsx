import type { Metadata } from "next";
import Image from "next/image";
import { gallery } from "@/lib/photos";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photographs from class, stage and competition season.",
  alternates: { canonical: "/gallery" },
};

export default function Gallery() {
  return (
    <section data-surface="cream">
      <div className="mx-auto max-w-[1280px] px-5 pb-20 pt-14 sm:px-8 md:pb-28 md:pt-20">
        <p className="kicker rise">Gallery</p>
        <h1 className="display rise rise-2 mt-3 max-w-3xl text-[clamp(2.4rem,6.5vw,5rem)]">On stage and in class.</h1>
        <p className="rise rise-3 mt-6 max-w-xl text-lg leading-relaxed">
          A selection, not the whole archive. More on Instagram at{" "}
          <a href={site.instagram[0].url} target="_blank" rel="noopener noreferrer" className="font-extrabold text-magenta underline underline-offset-4">
            {site.instagram[0].handle}
          </a>
          .
        </p>
        <ul className="mt-12 columns-2 gap-3 md:columns-3 md:gap-5 lg:columns-4">
          {gallery.map((ph) => (
            <li key={ph.src} className="mb-3 break-inside-avoid overflow-hidden rounded-2xl border-2 border-plum md:mb-5">
              <Image src={ph.src} alt={ph.alt} width={ph.w} height={ph.h} sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw" className="h-auto w-full" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
