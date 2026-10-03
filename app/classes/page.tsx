import type { Metadata } from "next";
import Link from "next/link";
import { AUDIENCES, DAYS, DAY_NAMES, classesFor, classesOn } from "@/lib/classes";
import { loadSchedule } from "@/lib/schedule-source";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Classes & Schedule — Bollywood, Kathak Fusion, Hip-Hop",
  description:
    "Explore our complete curriculum for kids, teens, and adults. Authentic Bollywood, semi-classical Kathak, and high-energy hip-hop classes in Schaumburg, Naperville, and Chicago.",
  alternates: { canonical: "/classes" },
};

const tuitionPlans = [
  {
    name: "Single Trial Class Pass",
    price: "$20",
    period: "One-time introduction",
    badge: "Most Popular",
    desc: "Experience any 60-minute studio class with no ongoing commitment. 100% credited toward your full session fee upon enrollment.",
    features: [
      "Access to any beginner or age-matched class",
      "Direct instructor level assessment",
      "Parent studio observation permitted",
      "Zero registration or equipment fees",
    ],
    cta: "Claim Trial Class Pass",
    highlight: false,
  },
  {
    name: "8-Week Term Enrollment",
    price: "$185",
    period: "Per 8-week seasonal session",
    badge: "Core Programme",
    desc: "Our signature progressive curriculum. Build authentic technique, musicality, and stage confidence with peers.",
    features: [
      "1 scheduled 60-minute class per week",
      "Full access to online video review modules",
      "Recital stage choreography training",
      "Costume fittings & makeup workshop",
      "1 excused class rollover per term",
    ],
    cta: "Enroll in 8-Week Session",
    highlight: true,
  },
  {
    name: "All-Access Master Pass",
    price: "$320",
    period: "Per 8-week seasonal session",
    badge: "Multi-Style Dancer",
    desc: "For passionate dancers who want to train across Bollywood, Semi-Classical Kathak, and Urban Fusion simultaneously.",
    features: [
      "Unlimited classes across all weekly schedules",
      "Performance team & competition priority",
      "Guest artist masterclass invitations",
      "Dedicated 1-on-1 solo video feedback",
      "Priority showcase stage placement",
    ],
    cta: "Join All-Access",
    highlight: false,
  },
];

const studioFaqs = [
  {
    q: "What should my child or I wear to the first trial class?",
    a: "Comfortable athletic clothing such as leggings, joggers, or track pants and a breathable t-shirt. For footwear, clean indoor sneakers, jazz shoes, or bare feet are ideal depending on whether the class is urban Bollywood or semi-classical.",
  },
  {
    q: "Can adult beginners with zero dance experience join?",
    a: "Absolutely. Over 65% of our adult students started with zero prior dance background. Our Adult Bollywood Beginner classes are unhurried, joyful, and designed to break down footwork and rhythm in a zero-judgment environment.",
  },
  {
    q: "Do students get to perform on real theater stages?",
    a: "Yes! Every enrolled student has the opportunity to perform in our annual professional theater showcase, complete with theatrical lighting, sound design, and custom designer stage costumes.",
  },
  {
    q: "Where are the classes held in Chicagoland?",
    a: "We operate in premier, fully-equipped dance studios in Schaumburg and Naperville, featuring shock-absorbent sprung dance floors, wall-to-wall mirrors, and comfortable viewing lounges for parents.",
  },
];

export default async function Classes() {
  const { entries, confirmed, note } = await loadSchedule();
  const audiences = AUDIENCES.filter((a) => classesFor(a.id, entries).length > 0);

  return (
    <>
      {/* ── Studio Hero ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#24102C] text-white pt-24 pb-20 md:pt-36 md:pb-28">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#B0104B]/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-[#F5A800]/15 rounded-full blur-[130px] pointer-events-none" />

        <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8 z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#F5A800]/40 bg-[#F5A800]/10 text-[#F5A800] text-xs font-mono font-bold tracking-widest uppercase mb-6">
            Curriculum &amp; Schedule
          </div>

          <h1 className="font-display font-extrabold text-[clamp(2.5rem,6.5vw,5rem)] tracking-tight leading-[1.02]">
            Find the right class. <br />
            <span className="serif-accent font-normal text-rose">Train with film-grade energy.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg sm:text-xl text-white/80 leading-relaxed font-light">
            From 4-year-old Little Movers discovering rhythm to adults seeking a joyful workout, our curriculum is calibrated by UNESCO/CID Paris certified director Toolieka.
          </p>

          {!confirmed && (
            <div className="mt-8 max-w-2xl rounded-2xl border border-[#F5A800]/40 bg-white/[0.04] p-5 backdrop-blur-md">
              <p className="font-bold text-[#F5A800] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F5A800] animate-ping" />
                Live Schedule Notice
              </p>
              <p className="mt-1 text-sm text-white/80 leading-relaxed">
                New term registrations are currently underway. Call or text the studio desk at{" "}
                <a href={`tel:${site.phone}`} className="font-bold text-rose underline underline-offset-4">
                  {site.phoneDisplay}
                </a>{" "}
                for exact studio room allocations and drop-in trial availability.
              </p>
            </div>
          )}

          {note && (
            <p className="mt-4 max-w-2xl rounded-2xl border border-white/20 bg-[#F5A800] px-5 py-3 text-sm font-bold text-[#24102C]">
              {note}
            </p>
          )}

          {/* Audience Filter Chips */}
          <div className="mt-10 flex flex-wrap gap-2.5">
            <span className="text-xs font-mono uppercase tracking-widest text-white/50 self-center mr-2">
              Browse Category:
            </span>
            {audiences.map((a) => (
              <a
                key={a.id}
                href={`#${a.id}`}
                className="chip hover:bg-[#B0104B] hover:text-white transition-all duration-200"
              >
                {a.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Audience Sections ──────────────────────────────────── */}
      {audiences.map((a, i) => (
        <section
          key={a.id}
          id={a.id}
          className={`scroll-mt-24 py-16 sm:py-24 ${
            i % 2 === 0 ? "bg-[#FFF6E8] text-[#24102C]" : "bg-[#FBE9D0] text-[#24102C]"
          }`}
        >
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#24102C]/10 pb-6 mb-10">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#B0104B] font-bold">
                  Curriculum Stream
                </span>
                <h2 className="font-display font-black text-[clamp(2rem,4.5vw,3.5rem)] tracking-tight mt-1">
                  {a.label}
                </h2>
              </div>
              <p className="text-sm font-medium text-[#24102C]/70 max-w-md">
                {a.blurb}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {classesFor(a.id, entries).map((c) => (
                <div
                  key={`${c.day}-${c.name}`}
                  className="card p-6 sm:p-7 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-3">
                      <span className="px-2.5 py-1 rounded-md bg-[#24102C]/5 font-bold text-[#B0104B]">
                        {DAY_NAMES[c.day]}
                      </span>
                      <span className="text-[#24102C]/60 font-semibold">
                        {c.time}{c.clock ? ` (${c.clock})` : ""}
                      </span>
                    </div>

                    <h3 className="font-display font-extrabold text-2xl text-[#24102C] group-hover:text-[#B0104B] transition-colors leading-tight">
                      {c.name}
                    </h3>
                    <p className="mt-2 text-sm font-bold text-[#24102C]/70">
                      Level: <span className="font-medium">{c.level}</span>
                    </p>

                    {c.location && (
                      <p className="mt-1 text-xs text-[#24102C]/60 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F5A800]" />
                        {c.location}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-5 border-t border-[#24102C]/10 flex items-center justify-between">
                    <span className="text-xs font-mono text-[#24102C]/60">Studio Rehearsal</span>
                    <Link
                      href="/contact"
                      className="text-xs font-bold text-[#B0104B] group-hover:text-rose flex items-center gap-1"
                    >
                      Book Trial <span>→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ── The Week at a Glance Timetable ─────────────────────── */}
      <section className="bg-[#24102C] text-white py-20 sm:py-28 border-t border-white/10">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-mono text-xs uppercase tracking-widest text-[#F5A800] font-bold">
              Weekly Timetable
            </span>
            <h2 className="font-display font-black text-[clamp(2rem,4vw,3.2rem)] tracking-tight mt-2">
              The Week at a Glance
            </h2>
            <p className="mt-3 text-white/70 text-sm">
              Multiple time slots accommodate after-school hours, weekend mornings, and evening adult sessions.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {DAYS.filter((d) => classesOn(d, entries).length > 0).map((d) => (
              <div
                key={d}
                className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors"
              >
                <div className="flex items-center justify-between border-b border-white/15 pb-3">
                  <h3 className="font-display font-bold text-lg text-white">{DAY_NAMES[d]}</h3>
                  <span className="font-mono text-xs text-[#F5A800] font-bold">{d.toUpperCase()}</span>
                </div>

                <ul className="mt-4 space-y-4">
                  {classesOn(d, entries).map((c) => (
                    <li key={c.name} className="border-b border-white/5 pb-3 last:border-b-0">
                      <p className="font-bold text-sm text-white">{c.name}</p>
                      <p className="text-xs text-white/60 mt-0.5">
                        {c.level} · {c.time}
                        {c.clock ? ` (${c.clock})` : ""}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Transparent Tuition & Class Passes ─────────────────── */}
      <section className="bg-[#FFF6E8] text-[#24102C] py-20 sm:py-28 border-t border-[#24102C]/10">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs uppercase tracking-widest text-[#B0104B] font-bold">
              Tuition Transparency
            </span>
            <h2 className="font-display font-black text-[clamp(2.2rem,4.5vw,3.6rem)] tracking-tight mt-2">
              Simple, Honest Class Passes
            </h2>
            <p className="mt-3 text-[#24102C]/70 text-base">
              No hidden registration fees or lock-in contracts. Try a single class first, or enroll in our full 8-week seasonal session.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {tuitionPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between ${
                  plan.highlight
                    ? "bg-[#24102C] text-white shadow-2xl scale-105 z-10 border-2 border-[#E9437D]"
                    : "card bg-white text-[#24102C]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                        plan.highlight
                          ? "bg-[#E9437D] text-white"
                          : "bg-[#24102C]/10 text-[#B0104B]"
                      }`}
                    >
                      {plan.badge}
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-2xl mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-display font-black text-4xl sm:text-5xl">{plan.price}</span>
                    <span className={`text-xs font-mono ${plan.highlight ? "text-white/60" : "text-[#24102C]/60"}`}>
                      {plan.period}
                    </span>
                  </div>

                  <p className={`text-sm mb-6 leading-relaxed ${plan.highlight ? "text-white/80" : "text-[#24102C]/70"}`}>
                    {plan.desc}
                  </p>

                  <ul className="space-y-3 mb-8 text-sm">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5">
                        <span className={`mt-0.5 font-bold ${plan.highlight ? "text-[#F5A800]" : "text-[#B0104B]"}`}>
                          ✓
                        </span>
                        <span className={plan.highlight ? "text-white/90" : "text-[#24102C]/80"}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/contact"
                  className={`btn w-full text-center py-3.5 font-bold tracking-wider uppercase text-xs ${
                    plan.highlight
                      ? "btn-primary shadow-xl"
                      : "bg-[#24102C] text-white hover:bg-[#3A1745]"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Studio FAQs ────────────────────────────────────────── */}
      <section className="bg-[#FBE9D0] text-[#24102C] py-20 sm:py-28 border-t border-[#24102C]/10">
        <div className="mx-auto max-w-[900px] px-5 sm:px-8">
          <div className="text-center mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#B0104B] font-bold">
              Parent &amp; Dancer Guide
            </span>
            <h2 className="font-display font-black text-[clamp(2rem,4vw,3.2rem)] tracking-tight mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {studioFaqs.map((faq) => (
              <div key={faq.q} className="card p-6 sm:p-8 bg-white">
                <h3 className="font-display font-bold text-lg sm:text-xl text-[#24102C]">
                  {faq.q}
                </h3>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#24102C]/80">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing Studio CTA ─────────────────────────────────── */}
      <section className="bg-[#24102C] text-white py-20 sm:py-28 text-center relative overflow-hidden border-t border-white/10">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 relative z-10">
          <span className="font-mono text-xs uppercase tracking-widest text-[#F5A800] font-bold mb-3 block">
            Begin with a $20 Trial Pass
          </span>
          <h2 className="font-display font-black text-[clamp(2.2rem,5vw,4rem)] tracking-tight max-w-2xl mx-auto">
            Step onto the studio floor this week.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80 font-light">
            Tell us who is dancing and what style you want to explore. Toolieka will guide you to the perfect group.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact" className="btn btn-primary px-8 py-4 text-base font-bold shadow-xl">
              Claim Your Trial Pass
            </Link>
            <a
              href={`tel:${site.phone}`}
              className="btn btn-ghost px-8 py-4 text-base font-bold"
            >
              Call {site.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
