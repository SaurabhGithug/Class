import type { Metadata } from "next";
import TrialForm from "@/components/TrialForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a Trial Class & Studio Locations — Toolieka Dance Academy",
  description:
    "Book your first trial class at Toolieka Dance Academy. Visit our studios in Schaumburg and Naperville, or contact our studio desk directly.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <section className="bg-[#FFF6E8] text-[#24102C] py-16 sm:py-24">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] items-start">
          {/* Studio Info Column */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B0104B]/10 text-[#B0104B] text-xs font-mono font-bold tracking-widest uppercase mb-4">
              Studio Welcome Desk
            </div>

            <h1 className="font-display font-black text-[clamp(2.5rem,5.5vw,4.4rem)] tracking-tight leading-[1.02]">
              Book your trial class.
            </h1>

            <p className="mt-6 text-lg text-[#24102C]/80 leading-relaxed font-normal">
              Tell us who is dancing and what style they would like to experience. For same-day drop-in confirmation, phone or text is the fastest way to connect directly with the studio.
            </p>

            <div className="mt-10 space-y-8">
              {/* Phone & SMS */}
              <div className="p-6 rounded-2xl bg-white border border-[#24102C]/10 shadow-sm">
                <span className="font-mono text-xs uppercase tracking-widest text-[#B0104B] font-bold block mb-1">
                  Call or Text Studio Desk
                </span>
                <a
                  href={`tel:${site.phone}`}
                  className="font-display font-extrabold text-3xl text-[#24102C] hover:text-[#B0104B] transition-colors"
                >
                  {site.phoneDisplay}
                </a>
                <p className="text-xs text-[#24102C]/60 mt-1 font-mono">
                  Parent inquiries &amp; trial scheduling
                </p>
              </div>

              {/* Locations */}
              <div className="p-6 rounded-2xl bg-white border border-[#24102C]/10 shadow-sm">
                <span className="font-mono text-xs uppercase tracking-widest text-[#B0104B] font-bold block mb-3">
                  Studio Locations
                </span>
                <ul className="space-y-3 text-sm">
                  {site.areas.map((area) => (
                    <li key={area} className="flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#B0104B] mt-1.5 shrink-0" />
                      <div>
                        <strong className="text-base text-[#24102C]">{area} Studio</strong>
                        <p className="text-xs text-[#24102C]/70 mt-0.5">
                          Professional sprung hardwood dance floor, mirrors &amp; parent lounge
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Email & Instagram */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-white border border-[#24102C]/10">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#B0104B] font-bold block mb-1">
                    Email Desk
                  </span>
                  <a
                    href={`mailto:${site.email}`}
                    className="font-bold text-sm text-[#24102C] hover:text-[#B0104B] break-all underline underline-offset-4"
                  >
                    {site.email}
                  </a>
                </div>

                <div className="p-5 rounded-xl bg-white border border-[#24102C]/10">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#B0104B] font-bold block mb-1">
                    Instagram Reel
                  </span>
                  {site.instagram.map((ig) => (
                    <a
                      key={ig.handle}
                      href={ig.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-sm text-[#B0104B] hover:text-rose block"
                    >
                      {ig.handle} ↗
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#24102C]/15 shadow-xl">
            <h2 className="font-display font-extrabold text-2xl text-[#24102C] mb-2">
              Reserve Your Studio Pass
            </h2>
            <p className="text-xs text-[#24102C]/60 mb-6 font-mono">
              Fill in your details below to confirm class time and level fit.
            </p>
            <TrialForm />
          </div>
        </div>
      </div>
    </section>
  );
}
