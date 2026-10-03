import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { bio, credentials, timeline } from "@/lib/content";
import { photos } from "@/lib/photos";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Director Toolieka Prakash Nikam — Bollywood Dance Academy",
  description:
    "Learn about Director Toolieka Prakash Nikam: international musical lead, UNESCO/CID Paris certified dance educator, and founder of Chicagoland's premier Bollywood Dance Academy.",
  alternates: { canonical: "/about" },
};

const studioPillars = [
  {
    num: "01",
    title: "Classical Foundation × Commercial Energy",
    desc: "We don't teach quick TikTok trends. Every student learns authentic posture, hand mudras, expressive abhinaya (facial emotion), and rhythmic footwork rooted in classical Kathak, fused with the electric energy of modern Bollywood.",
  },
  {
    num: "02",
    title: "Safe, Joyful & Zero-Judgment Environment",
    desc: "Whether you are a 5-year-old child taking their very first dance step or an adult professional who hasn't danced in twenty years, our studios are welcoming, encouraging, and physically safe.",
  },
  {
    num: "03",
    title: "Real Stage Performance Culture",
    desc: "Dance belongs on stage under real lights. Every session culminates in professional theatrical productions where students gain undeniable stage presence, public confidence, and lifelong memories.",
  },
  {
    num: "04",
    title: "State-of-the-Art Facilities",
    desc: "Our Schaumburg and Naperville studio spaces are equipped with professional shock-absorbing sprung dance floors to protect developing joints, wall-to-wall mirrors, and comfortable viewing lounges for parents.",
  },
];

export default function About() {
  return (
    <>
      {/* ── Director Hero ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#24102C] text-white pt-24 pb-20 md:pt-36 md:pb-28">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#B0104B]/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8 z-10">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#F5A800]/40 bg-[#F5A800]/10 text-[#F5A800] text-xs font-mono font-bold tracking-widest uppercase mb-6">
                Director &amp; Master Educator
              </div>

              <h1 className="font-display font-extrabold text-[clamp(2.5rem,6vw,4.8rem)] tracking-tight leading-[1.02]">
                Toolieka Prakash Nikam.
              </h1>

              <p className="mt-6 text-xl text-rose font-medium leading-relaxed">
                {bio.lead}
              </p>

              <div className="mt-6 space-y-4 text-white/80 leading-relaxed text-base">
                {bio.body.map((para) => (
                  <p key={para}>{para}</p>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/contact" className="btn btn-primary shadow-xl">
                  Book a Trial with Toolieka
                </Link>
                {site.weddingsUrl && (
                  <a
                    href={site.weddingsUrl}
                    className="btn btn-ghost text-xs uppercase tracking-wider font-bold"
                  >
                    Wedding Direction Atelier →
                  </a>
                )}
              </div>
            </div>

            {/* Framed Studio Image */}
            <div className="relative">
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-[#B0104B] to-[#F5A800] opacity-30 blur-xl" />
              <div className="relative rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black">
                <Image
                  src={photos.instructorMagenta.src}
                  alt={photos.instructorMagenta.alt}
                  width={photos.instructorMagenta.w}
                  height={photos.instructorMagenta.h}
                  priority
                  sizes="(min-width: 1024px) 38vw, 92vw"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#24102C]/80 backdrop-blur-md border border-white/10 text-white">
                  <p className="font-mono text-xs uppercase tracking-widest text-[#F5A800] font-bold">
                    UNESCO CID Paris Certified
                  </p>
                  <p className="text-xs text-white/80 mt-1">
                    Cine Dancers Association Member · Lead Artist, International Musicals Bharati &amp; Merchants of Bollywood
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Studio Pedagogy & Pillars ───────────────────────────── */}
      <section className="bg-[#FFF6E8] text-[#24102C] py-20 sm:py-28">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs uppercase tracking-widest text-[#B0104B] font-bold">
              The Academy Philosophy
            </span>
            <h2 className="font-display font-black text-[clamp(2rem,4.5vw,3.5rem)] tracking-tight mt-2">
              Why Students Flourish Here
            </h2>
            <p className="mt-3 text-[#24102C]/70 text-base">
              A studio built on joy, discipline, and authentic Indian performing arts traditions.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            {studioPillars.map((p) => (
              <div
                key={p.num}
                className="card p-8 bg-white hover:-translate-y-1 transition-transform duration-300"
              >
                <span className="font-mono text-xs uppercase tracking-widest text-[#B0104B] font-extrabold">
                  Pillar {p.num}
                </span>
                <h3 className="font-display font-extrabold text-2xl text-[#24102C] mt-3 mb-3">
                  {p.title}
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-[#24102C]/75">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Credentials & Accreditations ────────────────────────── */}
      <section className="bg-[#24102C] text-white py-20 sm:py-28 border-t border-white/10">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-mono text-xs uppercase tracking-widest text-[#F5A800] font-bold">
              Verified Experience
            </span>
            <h2 className="font-display font-black text-[clamp(2rem,4vw,3.2rem)] tracking-tight mt-2">
              Accredited International Rigor
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {credentials.map((c) => (
              <div
                key={c.label}
                className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 text-center hover:border-[#F5A800]/50 transition-colors"
              >
                <div className="font-display font-black text-4xl sm:text-5xl text-[#F5A800]">
                  {c.value}
                </div>
                <div className="mt-3 font-mono text-xs uppercase tracking-wider text-white/80 font-semibold">
                  {c.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Path / Career Timeline ───────────────────────────── */}
      <section className="bg-[#FBE9D0] text-[#24102C] py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <div className="text-center mb-14">
            <span className="font-mono text-xs uppercase tracking-widest text-[#B0104B] font-bold">
              The Journey
            </span>
            <h2 className="font-display font-black text-[clamp(2rem,4vw,3.2rem)] tracking-tight mt-2">
              From Global Theatres to the Studio Floor
            </h2>
          </div>

          <ol className="space-y-8 border-l-2 border-[#B0104B]/30 pl-6 sm:pl-8">
            {timeline.map((t) => (
              <li key={t.year} className="relative">
                <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#B0104B] border-4 border-[#FBE9D0]" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#B0104B] font-bold">
                  {t.year}
                </span>
                <h3 className="font-display font-extrabold text-2xl text-[#24102C] mt-1">
                  {t.title}
                </h3>
                <p className="mt-2 text-sm sm:text-base leading-relaxed text-[#24102C]/80">
                  {t.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Closing CTA ────────────────────────────────────────── */}
      <section className="bg-[#24102C] text-white py-20 sm:py-28 text-center relative overflow-hidden border-t border-white/10">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 relative z-10">
          <span className="font-mono text-xs uppercase tracking-widest text-[#F5A800] font-bold mb-3 block">
            Join Our Studio Family
          </span>
          <h2 className="font-display font-black text-[clamp(2.2rem,5vw,4rem)] tracking-tight max-w-2xl mx-auto">
            Come and experience the energy in person.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80 font-light">
            We welcome dancers of all ages and levels. Book your first trial class today.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact" className="btn btn-primary px-8 py-4 text-base font-bold shadow-xl">
              Book a Trial Class
            </Link>
            <Link href="/classes" className="btn btn-ghost px-8 py-4 text-base font-bold">
              View Class Schedule →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
