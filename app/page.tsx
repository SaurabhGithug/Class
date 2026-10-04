import Image from "next/image";
import Link from "next/link";
import ClassMatcher from "@/components/ClassMatcher";
import StudioReviews from "@/components/StudioReviews";
import { AUDIENCES, classesFor } from "@/lib/classes";
import { beyondClass, bio, credentials, styles, tagline } from "@/lib/content";
import { heroPhoto, onStage, photos } from "@/lib/photos";
import { loadSchedule } from "@/lib/schedule-source";
import { site } from "@/lib/site";

export default async function Home() {
  const { entries } = await loadSchedule();
  const groups = AUDIENCES.map((a) => ({ a, n: classesFor(a.id, entries).length })).filter((g) => g.n > 0);

  return (
    <>
      {/* ══════════════ 1. RADIANT, SUNNY STUDIO HERO ══════════════ */}
      <section className="relative overflow-hidden bg-[#FFFDF9] text-[#1E0A28] pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-[#1E0A28]/10">
        {/* Energetic sunburst aura */}
        <div className="absolute -top-32 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#FFB300]/25 via-[#D81B60]/15 to-transparent rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 -left-20 w-[400px] h-[400px] bg-[#D81B60]/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="relative z-10 mx-auto grid max-w-[1280px] gap-12 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#D81B60]/10 border border-[#D81B60]/20 text-[#D81B60] text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#D81B60] animate-pulse" />
              Schaumburg &amp; Naperville, IL · Spring Term Open
            </div>

            <h1 className="font-display font-black text-[clamp(2.75rem,7vw,5.5rem)] text-[#1E0A28] leading-[0.98] tracking-tight">
              Energy, Rhythm, &amp; <br />
              <span className="text-[#D81B60]">Stage Confidence.</span>
            </h1>

            <p className="max-w-xl text-lg sm:text-xl leading-relaxed text-[#1E0A28]/80 font-normal">
              Chicagoland&rsquo;s premier Bollywood dance academy for <strong className="text-[#1E0A28] font-bold">Kids (from age 4)</strong>, <strong className="text-[#1E0A28] font-bold">Teens</strong>, and <strong className="text-[#1E0A28] font-bold">Adult Beginners</strong>. Directed by UNESCO/CID Paris certified artist Toolieka Prakash Nikam.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="btn btn-primary text-sm font-bold shadow-xl shadow-[#D81B60]/30 hover:scale-105 transition-all"
              >
                Claim $20 Trial Class Pass
              </Link>
              <Link
                href="/classes"
                className="px-6 py-3.5 rounded-full border-2 border-[#1E0A28]/15 bg-white text-[#1E0A28] font-bold text-sm hover:border-[#D81B60] hover:text-[#D81B60] transition-colors"
              >
                View Weekly Timetable →
              </Link>
            </div>

            {/* Authority Badges */}
            <div className="pt-6 border-t border-[#1E0A28]/10 flex flex-wrap gap-2 text-xs font-mono font-bold text-[#1E0A28]/80">
              <span className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
                ★ 4.9/5 Rating (450+ Families)
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-pink-50 border border-pink-200 text-pink-800">
                UNESCO CID Paris Certified
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-800">
                Sprung Hardwood Floors
              </span>
            </div>
          </div>

          {/* Hero Action Image Card */}
          <div className="relative group">
            <div className="absolute -inset-2 rounded-[2.5rem] bg-gradient-to-tr from-[#D81B60] via-[#FFB300] to-[#FF4081] opacity-30 blur-2xl group-hover:opacity-50 transition duration-700" />
            <div className="relative aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] overflow-hidden rounded-[2.25rem] border-2 border-[#1E0A28]/10 shadow-2xl bg-[#FAF7F2]">
              <Image
                src={heroPhoto.src}
                alt={heroPhoto.alt}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 92vw"
                className="object-cover object-center group-hover:scale-105 transition duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E0A28]/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-[#1E0A28]/10 text-[#1E0A28]">
                <p className="font-mono text-[0.68rem] uppercase tracking-wider text-[#D81B60] font-bold">
                  Annual Theater Showcase
                </p>
                <p className="text-xs font-bold text-[#1E0A28] mt-0.5">
                  Every enrolled dancer takes center stage under real theatrical lights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ 2. KINETIC TICKER MARQUEE ══════════════ */}
      <div className="bg-[#1E0A28] text-white py-3.5 overflow-hidden whitespace-nowrap border-y border-[#1E0A28]/20">
        <div className="inline-block animate-marquee text-xs font-mono uppercase tracking-[0.2em] font-bold text-amber-300">
          BOLLYWOOD COMMERCIAL • KATHAK CLASSICAL FUSION • BHANGRA CARDIO • HIP HOP FUSION • AGES 4 TO ADULT • SPRUNG HARDWOOD FLOORS • 100% MONEY-BACK TRIAL GUARANTEE • SPRING TERM NOW ENROLLING •
        </div>
      </div>

      {/* ══════════════ 3. INTERACTIVE 10-SECOND CLASS MATCHER ══════════════ */}
      <section className="bg-[#FAF7F2] py-20 sm:py-28 border-b border-[#1E0A28]/10">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <ClassMatcher />
        </div>
      </section>

      {/* ══════════════ 4. WHY PARENTS & DANCERS LOVE OUR ACADEMY ══════════════ */}
      <section className="bg-white py-20 sm:py-28 border-b border-[#1E0A28]/10">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs uppercase tracking-widest text-[#D81B60] font-bold block mb-2">
              The Studio Standard
            </span>
            <h2 className="font-display font-black text-[clamp(2.2rem,4.5vw,3.8rem)] text-[#1E0A28] tracking-tight">
              Why Chicagoland Families Choose Toolieka
            </h2>
            <p className="mt-3 text-[#1E0A28]/70 text-base">
              A studio environment engineered for physical safety, technical excellence, and infectious joy.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-7 rounded-3xl bg-[#FAF7F2] border border-[#1E0A28]/10 hover:border-[#D81B60] transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#D81B60]/10 text-[#D81B60] flex items-center justify-center text-2xl font-bold mb-4">
                🛡️
              </div>
              <h3 className="font-display font-bold text-xl text-[#1E0A28] mb-2">
                Sprung Hardwood Floors
              </h3>
              <p className="text-xs sm:text-sm text-[#1E0A28]/75 leading-relaxed">
                Both our Schaumburg and Naperville studios feature shock-absorbing sprung dance floors to protect developing children&rsquo;s joints and adult knees.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-[#FAF7F2] border border-[#1E0A28]/10 hover:border-[#D81B60] transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl font-bold mb-4">
                🎭
              </div>
              <h3 className="font-display font-bold text-xl text-[#1E0A28] mb-2">
                Annual Theater Showcase
              </h3>
              <p className="text-xs sm:text-sm text-[#1E0A28]/75 leading-relaxed">
                No dance studio experience is complete without performing. Every student dances in our grand annual theater recital with custom costumes and lighting.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-[#FAF7F2] border border-[#1E0A28]/10 hover:border-[#D81B60] transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-2xl font-bold mb-4">
                🤝
              </div>
              <h3 className="font-display font-bold text-xl text-[#1E0A28] mb-2">
                100% Love-It Guarantee
              </h3>
              <p className="text-xs sm:text-sm text-[#1E0A28]/75 leading-relaxed">
                If your dancer does not leave their trial class smiling and excited, your $20 trial fee is refunded immediately. Zero financial risk.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-[#FAF7F2] border border-[#1E0A28]/10 hover:border-[#D81B60] transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center text-2xl font-bold mb-4">
                👑
              </div>
              <h3 className="font-display font-bold text-xl text-[#1E0A28] mb-2">
                UNESCO Certified Master
              </h3>
              <p className="text-xs sm:text-sm text-[#1E0A28]/75 leading-relaxed">
                Taught directly by Toolieka Prakash Nikam, certified by the International Dance Council at UNESCO Paris and 13+ years on Bollywood film sets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ 5. TRANSPARENT TUITION PASSES ══════════════ */}
      <section className="bg-[#FAF7F2] py-20 sm:py-28 border-b border-[#1E0A28]/10">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs uppercase tracking-widest text-[#D81B60] font-bold block mb-2">
              Straightforward Pricing
            </span>
            <h2 className="font-display font-black text-[clamp(2.2rem,4.5vw,3.8rem)] text-[#1E0A28] tracking-tight">
              Honest, Transparent Class Passes
            </h2>
            <p className="mt-3 text-[#1E0A28]/70 text-base">
              No hidden annual registration fees, uniform markups, or lock-in contracts.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 items-stretch">
            {/* Trial Pass */}
            <div className="p-8 rounded-3xl bg-white border border-[#1E0A28]/10 shadow-lg flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 inline-block mb-4">
                  Step 1 · Try A Class
                </span>
                <h3 className="font-display font-black text-2xl text-[#1E0A28]">Single Trial Pass</h3>
                <div className="flex items-baseline gap-2 my-4">
                  <span className="font-display font-black text-5xl text-[#1E0A28]">$20</span>
                  <span className="text-xs font-mono text-[#1E0A28]/60">One-time introduction</span>
                </div>
                <p className="text-xs text-[#1E0A28]/70 leading-relaxed mb-6">
                  Experience any 60-minute class. 100% of the $20 fee is credited toward your term session upon enrollment.
                </p>
                <ul className="space-y-3 text-xs text-[#1E0A28]/80 mb-8">
                  <li className="flex items-center gap-2">✓ Full 60-min studio class experience</li>
                  <li className="flex items-center gap-2">✓ Direct level assessment with Toolieka</li>
                  <li className="flex items-center gap-2">✓ Parent observation permitted</li>
                </ul>
              </div>
              <Link
                href="/contact"
                className="w-full py-3.5 rounded-xl border-2 border-[#1E0A28] text-[#1E0A28] font-bold text-xs uppercase tracking-wider text-center hover:bg-[#1E0A28] hover:text-white transition-all block"
              >
                Claim $20 Trial Pass
              </Link>
            </div>

            {/* Core 8-Week Session (Highlighted) */}
            <div className="p-8 rounded-3xl bg-[#1E0A28] text-white shadow-2xl scale-105 z-10 border-2 border-[#D81B60] flex flex-col justify-between relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#D81B60] to-[#FF4081] text-white text-[0.68rem] font-mono font-bold uppercase tracking-wider shadow-lg">
                Most Popular for Families
              </span>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 text-amber-300 inline-block mb-4">
                  Step 2 · Seasonal Term
                </span>
                <h3 className="font-display font-black text-2xl text-white">8-Week Seasonal Term</h3>
                <div className="flex items-baseline gap-2 my-4">
                  <span className="font-display font-black text-5xl text-white">$185</span>
                  <span className="text-xs font-mono text-white/60">Per 8-week term</span>
                </div>
                <p className="text-xs text-white/80 leading-relaxed mb-6">
                  Our signature progressive curriculum. Dancers learn complete choreography, posture, and prepare for the recital stage.
                </p>
                <ul className="space-y-3 text-xs text-white/90 mb-8">
                  <li className="flex items-center gap-2"><span className="text-amber-300 font-bold">✓</span> 1 scheduled weekly 60-min class</li>
                  <li className="flex items-center gap-2"><span className="text-amber-300 font-bold">✓</span> Access to 4K practice video review portal</li>
                  <li className="flex items-center gap-2"><span className="text-amber-300 font-bold">✓</span> Recital stage choreography inclusion</li>
                  <li className="flex items-center gap-2"><span className="text-amber-300 font-bold">✓</span> 1 excused makeup class per term</li>
                </ul>
              </div>
              <Link
                href="/contact"
                className="btn btn-primary w-full py-4 text-xs font-bold uppercase tracking-wider text-center shadow-xl block"
              >
                Enroll In 8-Week Term →
              </Link>
            </div>

            {/* All-Access Master Pass */}
            <div className="p-8 rounded-3xl bg-white border border-[#1E0A28]/10 shadow-lg flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-purple-50 text-purple-800 inline-block mb-4">
                  Passionate Dancers
                </span>
                <h3 className="font-display font-black text-2xl text-[#1E0A28]">All-Access Master Pass</h3>
                <div className="flex items-baseline gap-2 my-4">
                  <span className="font-display font-black text-5xl text-[#1E0A28]">$320</span>
                  <span className="text-xs font-mono text-[#1E0A28]/60">Per 8-week term</span>
                </div>
                <p className="text-xs text-[#1E0A28]/70 leading-relaxed mb-6">
                  For dancers wanting to master multiple styles: train in Bollywood, Classical Kathak, and Hip Hop simultaneously.
                </p>
                <ul className="space-y-3 text-xs text-[#1E0A28]/80 mb-8">
                  <li className="flex items-center gap-2">✓ Unlimited weekly classes across styles</li>
                  <li className="flex items-center gap-2">✓ Showcase Troupe audition priority</li>
                  <li className="flex items-center gap-2">✓ Guest choreographer masterclass access</li>
                </ul>
              </div>
              <Link
                href="/contact"
                className="w-full py-3.5 rounded-xl border-2 border-[#1E0A28] text-[#1E0A28] font-bold text-xs uppercase tracking-wider text-center hover:bg-[#1E0A28] hover:text-white transition-all block"
              >
                Inquire All-Access Pass
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ 6. GOOGLE REVIEWS & SOCIAL PROOF ══════════════ */}
      <section className="bg-white py-20 sm:py-28 border-b border-[#1E0A28]/10">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs uppercase tracking-widest text-[#D81B60] font-bold block mb-2">
              Community Trust
            </span>
            <h2 className="font-display font-black text-[clamp(2.2rem,4.5vw,3.8rem)] text-[#1E0A28] tracking-tight">
              What Chicagoland Parents Say
            </h2>
            <p className="mt-3 text-[#1E0A28]/70 text-base">
              Real stories from families whose dancers found poise, technique, and lifelong stage confidence.
            </p>
          </div>

          <StudioReviews />
        </div>
      </section>

      {/* ══════════════ 7. CLOSING STUDIO REGISTRATION BANNER ══════════════ */}
      <section className="bg-[#1E0A28] text-white py-20 sm:py-28 text-center relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D81B60]/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-[1280px] px-5 sm:px-8">
          <span className="font-mono text-xs uppercase tracking-widest text-amber-300 font-bold mb-3 block">
            Spring Term Enrollment Open
          </span>
          <h2 className="font-display font-black text-[clamp(2.4rem,5.5vw,4.5rem)] tracking-tight max-w-3xl mx-auto leading-tight">
            Step onto the studio floor this week.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80 font-light">
            Claim your $20 trial class pass. If you or your child doesn&rsquo;t love it, we refund your $20 immediately.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact" className="btn btn-primary px-9 py-4 text-sm font-bold shadow-2xl">
              Claim $20 Trial Pass Now
            </Link>
            <a
              href={`tel:${site.phone}`}
              className="px-8 py-4 rounded-full border border-white/20 bg-white/5 text-white font-bold text-sm hover:bg-white/10 transition"
            >
              Call Studio: {site.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════ FLOATING MOBILE BOOKING BAR (Conversion Booster) ══════════════ */}
      <div className="fixed inset-x-4 bottom-4 z-40 flex gap-2 sm:hidden">
        <a
          href={`tel:${site.phone}`}
          className="flex-1 py-3 text-center rounded-xl bg-white border border-[#1E0A28]/20 font-bold text-xs text-[#1E0A28] shadow-xl"
        >
          Call Studio
        </a>
        <Link
          href="/contact"
          className="flex-[2] py-3 text-center rounded-xl bg-gradient-to-r from-[#D81B60] to-[#FF4081] text-white font-bold text-xs uppercase tracking-wider shadow-xl"
        >
          Book $20 Trial Pass →
        </Link>
      </div>
    </>
  );
}
