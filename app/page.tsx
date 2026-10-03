import Image from "next/image";
import Link from "next/link";
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
      {/* ══════════════ 1. HIGH-ENERGY STUDIO HERO ══════════════ */}
      <section data-surface="plum" className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Ambient background lighting */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-magenta/25 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-marigold/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 mx-auto grid max-w-[1280px] gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-cream text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-marigold animate-pulse" />
              Schaumburg &amp; Naperville, IL · Across the USA
            </div>

            <h1 className="display text-[clamp(2.75rem,7.5vw,5.5rem)] text-cream leading-[0.98]">
              Ignite Your <span className="serif-accent text-marigold">Rhythm.</span><br />
              Bollywood, Fusion &amp; Confidence.
            </h1>

            <p className="max-w-xl text-lg sm:text-xl leading-relaxed text-cream/85 font-normal">
              Authentic Bollywood storytelling, semi-classical roots, and street fusion for <strong className="text-white font-semibold">Kids (from age 4)</strong>, <strong className="text-white font-semibold">Teens</strong>, and <strong className="text-white font-semibold">Adults</strong>. Taught by film-industry performer Toolieka Prakash Nikam.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link href="/contact" className="btn btn-primary text-sm shadow-xl">
                Book a $20 Trial Class
              </Link>
              <Link href="/classes" className="btn btn-ghost text-sm">
                View Class Schedules →
              </Link>
            </div>

            <ul className="pt-6 flex flex-wrap gap-2.5 text-cream/90 border-t border-cream/15">
              <li className="chip">13+ years film &amp; stage</li>
              <li className="chip">UNESCO / CID Paris certified</li>
              <li className="chip">Kids · Teens · Adults</li>
              <li className="chip">Zero intimidation</li>
            </ul>
          </div>

          {/* Hero Portrait with Modern Aura */}
          <div className="relative group">
            <div aria-hidden="true" className="absolute -inset-2 rounded-[2.5rem] bg-gradient-to-tr from-magenta/40 via-marigold/30 to-rose/40 opacity-70 blur-2xl group-hover:opacity-95 transition duration-700" />
            <div className="relative aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] overflow-hidden rounded-[2.25rem] border border-white/20 shadow-2xl bg-plum-soft">
              <Image
                src={heroPhoto.src}
                alt={heroPhoto.alt}
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 92vw"
                className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-plum via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-plum/80 border border-white/15 backdrop-blur-md flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-marigold uppercase tracking-wider">Toolieka Dance Academy</p>
                  <p className="text-xs text-cream/80">Fall &amp; Spring Term Registrations Open</p>
                </div>
                <span className="text-[11px] font-bold px-2 py-1 rounded bg-magenta text-cream">
                  Trial Available
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ 2. CLASS SELECTOR ("WHO IS DANCING?") ══════════════ */}
      <section data-surface="cream" className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="kicker">Curriculum</p>
              <h2 className="display mt-2 text-[clamp(2.2rem,5vw,3.6rem)] text-plum">
                Who Is Dancing?
              </h2>
              <p className="mt-3 text-base sm:text-lg text-plum/80 max-w-xl">
                Programs thoughtfully grouped by age, developmental milestone, and dance experience.
              </p>
            </div>
            <Link href="/classes" className="btn btn-ghost self-start md:self-auto text-xs font-bold">
              View Full Studio Timetable →
            </Link>
          </div>

          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map(({ a, n }) => (
              <li key={a.id}>
                <Link
                  href={`/classes#${a.id}`}
                  className="card group flex flex-col justify-between h-full p-8 transition-all duration-300 hover:-translate-y-1.5"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-magenta/10 text-magenta border border-magenta/20">
                        {n} Classes Available
                      </span>
                      <span className="text-xs text-plum/50 font-mono">Schaumburg &amp; Naperville</span>
                    </div>
                    <p className="display text-3xl text-plum group-hover:text-magenta transition">
                      {a.label}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-plum/80 font-normal">
                      {a.blurb}
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-plum/10 flex items-center justify-between text-xs font-bold text-magenta">
                    <span>Explore Schedule</span>
                    <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══════════════ 3. FOUR MOVEMENT STYLES ══════════════ */}
      <section data-surface="sun" className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <p className="kicker !text-plum">Signature Disciplines</p>
          <h2 className="display mt-2 text-[clamp(2.2rem,5vw,3.6rem)] text-plum">
            Four Ways To Move.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-plum/85 max-w-xl">
            From classical roots to current chartbusters, every class is grounded in authentic technique.
          </p>

          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {styles.map((s, i) => (
              <li key={s.name} className="card p-7 group hover:-translate-y-1 transition duration-300">
                <p className="serif-accent text-5xl text-magenta font-bold" aria-hidden="true">
                  0{i + 1}
                </p>
                <p className="display mt-4 text-2xl text-plum group-hover:text-magenta transition">{s.name}</p>
                <p className="mt-3 text-sm leading-relaxed text-plum/85">{s.line}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══════════════ 4. WHY TOOLIEKA ACADEMY (STUDIO PILLARS) ══════════════ */}
      <section data-surface="cream" className="py-20 sm:py-28 border-t border-plum/10">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="kicker">Why Dance With Us</p>
            <h2 className="display mt-2 text-[clamp(2.2rem,5vw,3.6rem)] text-plum">
              A Studio Built On Joy &amp; Pedigree.
            </h2>
            <p className="mt-3 text-base text-plum/80">
              We combine the rigor of authentic film performance with a warm, uplifting community.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card p-6 bg-white">
              <div className="w-10 h-10 rounded-xl bg-magenta/10 text-magenta flex items-center justify-center font-bold text-lg mb-4">
                ✓
              </div>
              <h3 className="display text-xl text-plum">Film-Set Pedigree</h3>
              <p className="mt-2 text-xs leading-relaxed text-plum/75">
                Learn directly from an artist who performed in international musicals and Indian film productions.
              </p>
            </div>

            <div className="card p-6 bg-white">
              <div className="w-10 h-10 rounded-xl bg-magenta/10 text-magenta flex items-center justify-center font-bold text-lg mb-4">
                ✓
              </div>
              <h3 className="display text-xl text-plum">Zero Intimidation</h3>
              <p className="mt-2 text-xs leading-relaxed text-plum/75">
                Whether a shy 4-year-old or an adult who has never danced, every student is welcomed with encouragement.
              </p>
            </div>

            <div className="card p-6 bg-white">
              <div className="w-10 h-10 rounded-xl bg-magenta/10 text-magenta flex items-center justify-center font-bold text-lg mb-4">
                ✓
              </div>
              <h3 className="display text-xl text-plum">Annual Grand Recital</h3>
              <p className="mt-2 text-xs leading-relaxed text-plum/75">
                Students perform in real stage costumes under professional theater lighting in an unforgettable showcase.
              </p>
            </div>

            <div className="card p-6 bg-white">
              <div className="w-10 h-10 rounded-xl bg-magenta/10 text-magenta flex items-center justify-center font-bold text-lg mb-4">
                ✓
              </div>
              <h3 className="display text-xl text-plum">Convenient Studios</h3>
              <p className="mt-2 text-xs leading-relaxed text-plum/75">
                Prime studio locations in Schaumburg and Naperville with weekend and weekday evening options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ 5. MEET TOOLIEKA ══════════════ */}
      <section data-surface="warm" className="py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative group mx-auto w-full max-w-md">
            <div aria-hidden="true" className="absolute -inset-2 rounded-[2.5rem] bg-gradient-to-tr from-rose-500/30 to-amber-500/20 blur-xl group-hover:opacity-100 opacity-60 transition duration-500" />
            <div className="relative aspect-[3/4] overflow-hidden rounded-[2.25rem] border border-white/20 shadow-2xl bg-plum">
              <Image
                src={photos.instructorMagenta.src}
                alt={photos.instructorMagenta.alt}
                fill
                sizes="(min-width: 1024px) 34vw, 92vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
          <div className="space-y-6">
            <p className="kicker">Artistic Director</p>
            <h2 className="display text-[clamp(2.2rem,5vw,3.6rem)] text-plum">
              Meet Toolieka.
            </h2>
            <p className="text-lg leading-relaxed text-plum/85">
              {bio.lead}
            </p>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-plum/15 pt-6">
              {credentials.map((c) => (
                <div key={c.label}>
                  <dt className="display text-4xl text-magenta">{c.value}</dt>
                  <dd className="mt-1 text-xs font-bold uppercase tracking-wider text-plum/70">{c.label}</dd>
                </div>
              ))}
            </dl>
            <div className="pt-2">
              <Link href="/about" className="btn btn-ghost">
                Read Her Full Story →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ 6. ON STAGE GALLERY ══════════════ */}
      <section data-surface="plum" className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="kicker">Stage Days</p>
              <h2 className="display mt-2 text-[clamp(2.2rem,5vw,3.6rem)] text-cream">
                {onStage.heading}
              </h2>
              <p className="mt-3 text-cream/80 text-base sm:text-lg max-w-xl">{onStage.line}</p>
            </div>
            <Link href="/gallery" className="btn btn-ghost self-start md:self-auto text-xs">
              View Student Gallery →
            </Link>
          </div>

          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {onStage.photos.map((ph) => (
              <li key={ph.src} className="aspect-[4/5] overflow-hidden rounded-2xl border border-white/15 shadow-xl group hover:scale-[1.03] transition-all duration-300 relative bg-black">
                <Image
                  src={ph.src}
                  alt={ph.alt}
                  fill
                  sizes="(min-width: 768px) 25vw, 46vw"
                  className="object-cover group-hover:brightness-105 transition duration-500"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══════════════ 7. TRANSPARENT PASS OPTIONS ══════════════ */}
      <section data-surface="cream" className="py-20 sm:py-28 border-t border-plum/10">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="kicker">Tuition &amp; Passes</p>
            <h2 className="display mt-2 text-[clamp(2.2rem,5vw,3.6rem)] text-plum">
              Simple, Transparent Pricing.
            </h2>
            <p className="mt-3 text-base text-plum/80">
              No long-term contracts. Start with a trial class and experience the energy.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {/* Card 1: Trial */}
            <div className="card p-8 bg-white flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-plum/60">Introductory</span>
                <h3 className="display text-2xl text-plum mt-1">Trial Pass</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="display text-4xl text-plum">$20</span>
                  <span className="text-xs text-plum/60">/ single class</span>
                </div>
                <p className="mt-3 text-xs text-plum/70 leading-relaxed">
                  Try any class on the schedule with zero commitment. Perfect for meeting the instructor.
                </p>
                <ul className="mt-6 space-y-2 text-xs text-plum/80 font-medium">
                  <li className="flex items-center gap-2">✓ 60-minute trial session</li>
                  <li className="flex items-center gap-2">✓ Meet instructor Toolieka</li>
                  <li className="flex items-center gap-2">✓ Studio placement advice</li>
                </ul>
              </div>
              <Link href="/contact" className="btn btn-ghost w-full mt-8 text-xs font-bold">
                Book Trial Pass
              </Link>
            </div>

            {/* Card 2: Term (Featured) */}
            <div className="card p-8 bg-gradient-to-b from-plum to-plum-soft text-cream border-2 border-magenta flex flex-col justify-between relative shadow-2xl">
              <span className="absolute -top-3.5 right-6 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-magenta text-cream">
                Most Popular
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-marigold">Full Term</span>
                <h3 className="display text-2xl text-cream mt-1">8-Week Session</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="display text-4xl text-cream">$185</span>
                  <span className="text-xs text-cream/70">/ 8 weeks</span>
                </div>
                <p className="mt-3 text-xs text-cream/80 leading-relaxed">
                  Structured progression from fundamentals to a complete show routine and recital preparation.
                </p>
                <ul className="mt-6 space-y-2 text-xs text-cream/90 font-medium">
                  <li className="flex items-center gap-2">✓ 8 weekly 60-min classes</li>
                  <li className="flex items-center gap-2">✓ Complete routine mastery</li>
                  <li className="flex items-center gap-2">✓ Video drill access at home</li>
                  <li className="flex items-center gap-2">✓ Recital eligibility</li>
                </ul>
              </div>
              <Link href="/contact" className="btn btn-primary w-full mt-8 text-xs font-bold">
                Enroll In Session
              </Link>
            </div>

            {/* Card 3: All-Access */}
            <div className="card p-8 bg-white flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-plum/60">Dedicated Dancers</span>
                <h3 className="display text-2xl text-plum mt-1">Studio All-Access</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="display text-4xl text-plum">$320</span>
                  <span className="text-xs text-plum/60">/ monthly</span>
                </div>
                <p className="mt-3 text-xs text-plum/70 leading-relaxed">
                  Unlimited classes across all age-appropriate styles. Ideal for teens &amp; troupe members.
                </p>
                <ul className="mt-6 space-y-2 text-xs text-plum/80 font-medium">
                  <li className="flex items-center gap-2">✓ Unlimited weekly classes</li>
                  <li className="flex items-center gap-2">✓ Performance troupe audition</li>
                  <li className="flex items-center gap-2">✓ Priority private coaching</li>
                </ul>
              </div>
              <Link href="/contact" className="btn btn-ghost w-full mt-8 text-xs font-bold">
                Inquire All-Access
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ 8. READY TO TRY A CLASS CTA ══════════════ */}
      <section data-surface="sun" className="py-24 sm:py-32 text-center relative overflow-hidden">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 relative z-10">
          <p className="kicker !text-plum">Join Our Studio Family</p>
          <h2 className="display mx-auto max-w-3xl text-[clamp(2.5rem,6.5vw,4.5rem)] text-plum leading-[1.02]">
            Ready To Try A Class?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg sm:text-xl text-plum/85 leading-relaxed">
            Tell us who is dancing and what style they would like to explore. Toolieka will personally guide your placement.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact" className="btn btn-primary text-sm px-9 py-4 shadow-xl">
              Book a $20 Trial Class
            </Link>
            <a href={`tel:${site.phone}`} className="btn btn-ghost text-sm px-8 py-4">
              Call {site.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
