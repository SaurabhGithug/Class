import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { gallery } from "@/lib/photos";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Studio Gallery & Stage Highlights — Toolieka Dance Academy",
  description:
    "Explore photo highlights from our annual recitals, competitions, stage showcases, and studio rehearsal sessions across Chicagoland.",
  alternates: { canonical: "/gallery" },
};

export default function Gallery() {
  return (
    <>
      {/* ── Gallery Hero ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#24102C] text-white pt-24 pb-20 md:pt-36 md:pb-28">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#B0104B]/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8 z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#F5A800]/40 bg-[#F5A800]/10 text-[#F5A800] text-xs font-mono font-bold tracking-widest uppercase mb-6">
            Stage Highlights &amp; Studio Life
          </div>

          <h1 className="font-display font-extrabold text-[clamp(2.5rem,6.5vw,5rem)] tracking-tight leading-[1.02]">
            On stage, in costume, <br />
            <span className="serif-accent font-normal text-rose">and under the lights.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg sm:text-xl text-white/80 leading-relaxed font-light">
            Every step in class leads to the excitement of real stage performance. Here is a curated selection of our annual showcases, theatrical productions, and studio rehearsals.
          </p>

          <div className="mt-8 flex items-center gap-4 text-xs font-mono text-white/60">
            <span>More live clips and rehearsals on Instagram:</span>
            <a
              href={site.instagram[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F5A800] font-bold underline underline-offset-4 hover:text-white"
            >
              {site.instagram[0].handle} ↗
            </a>
          </div>
        </div>
      </section>

      {/* ── Photo Grid ──────────────────────────────────────────── */}
      <section className="bg-[#FFF6E8] text-[#24102C] py-20 sm:py-28">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {gallery.map((ph, idx) => (
              <div
                key={ph.src}
                className="group relative overflow-hidden rounded-3xl bg-white border border-[#24102C]/10 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                  <Image
                    src={ph.src}
                    alt={ph.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-[#24102C]/80 backdrop-blur-md text-[0.68rem] font-mono text-[#F5A800] uppercase tracking-wider font-bold">
                    Archive #{String(idx + 1).padStart(2, "0")}
                  </div>
                </div>

                <div className="p-5 sm:p-6 bg-white">
                  <p className="text-xs text-[#24102C]/80 leading-relaxed font-medium">
                    {ph.alt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recital & Stage Showcase Invite ─────────────────────── */}
      <section className="bg-[#24102C] text-white py-20 sm:py-28 text-center relative overflow-hidden border-t border-white/10">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 relative z-10">
          <span className="font-mono text-xs uppercase tracking-widest text-[#F5A800] font-bold mb-3 block">
            Annual Showcase Season
          </span>
          <h2 className="font-display font-black text-[clamp(2.2rem,5vw,4rem)] tracking-tight max-w-2xl mx-auto">
            Ready to perform with our team?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80 font-light">
            Every enrolled dancer has a spot under the theater lights. Secure your trial pass for the upcoming term.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact" className="btn btn-primary px-8 py-4 text-base font-bold shadow-xl">
              Book a Trial Class Pass
            </Link>
            <Link href="/classes" className="btn btn-ghost px-8 py-4 text-base font-bold">
              Explore All Classes →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
