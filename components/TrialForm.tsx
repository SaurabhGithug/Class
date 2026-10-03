"use client";

import { useState } from "react";
import { DAYS } from "@/lib/classes";
import { styles } from "@/lib/content";
import { site } from "@/lib/site";
import { FOR_WHOM, LEVELS, buildTrialRequest } from "@/lib/trial";

export default function TrialForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const req = buildTrialRequest(new FormData(e.currentTarget), site.email);
    window.location.href = req.href;
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Notice Card */}
      <div className="p-4 rounded-xl bg-[#24102C]/5 border border-[#24102C]/10 text-sm leading-relaxed text-[#24102C]/80">
        <p className="font-bold text-[#B0104B] mb-0.5">Quick Studio Booking Notice</p>
        Submitting this form prepares your trial class pass request directly to Toolieka. If your email app does not open immediately, call or text us at{" "}
        <a href={`tel:${site.phone}`} className="font-bold text-[#B0104B] underline underline-offset-2">
          {site.phoneDisplay}
        </a>
        .
      </div>

      {/* ── Dancer Profile ────────────────────────────────────────── */}
      <fieldset className="space-y-4">
        <legend className="font-mono text-xs uppercase tracking-widest text-[#B0104B] font-bold">
          01. Dancer Information
        </legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-[#24102C]/80 uppercase tracking-wider mb-1.5" htmlFor="name">
              Dancer Full Name <span className="text-[#B0104B]">*</span>
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl border-2 border-[#24102C]/15 bg-white text-[#24102C] focus:border-[#B0104B] focus:outline-none transition-colors"
              id="name"
              name="name"
              required
              autoComplete="name"
              placeholder="e.g. Maya Sharma"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24102C]/80 uppercase tracking-wider mb-1.5" htmlFor="forWhom">
              Class Is For
            </label>
            <select
              className="w-full px-4 py-3 rounded-xl border-2 border-[#24102C]/15 bg-white text-[#24102C] focus:border-[#B0104B] focus:outline-none transition-colors"
              id="forWhom"
              name="forWhom"
              defaultValue=""
            >
              <option value="" disabled>Select category…</option>
              {FOR_WHOM.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24102C]/80 uppercase tracking-wider mb-1.5" htmlFor="age">
              Dancer Age <span className="font-normal text-[#24102C]/50">(if child/teen)</span>
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl border-2 border-[#24102C]/15 bg-white text-[#24102C] focus:border-[#B0104B] focus:outline-none transition-colors"
              id="age"
              name="age"
              inputMode="numeric"
              maxLength={3}
              placeholder="e.g. 7"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-[#24102C]/80 uppercase tracking-wider mb-1.5" htmlFor="level">
              Prior Dance Experience
            </label>
            <select
              className="w-full px-4 py-3 rounded-xl border-2 border-[#24102C]/15 bg-white text-[#24102C] focus:border-[#B0104B] focus:outline-none transition-colors"
              id="level"
              name="level"
              defaultValue=""
            >
              <option value="" disabled>Select experience level…</option>
              {LEVELS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      {/* ── Dance Styles & Schedule ─────────────────────────────────── */}
      <fieldset className="space-y-4">
        <legend className="font-mono text-xs uppercase tracking-widest text-[#B0104B] font-bold">
          02. Style Preferences & Availability
        </legend>

        <div>
          <span className="block text-xs font-bold text-[#24102C]/80 uppercase tracking-wider mb-2">
            Styles You Wish to Explore
          </span>
          <div className="grid gap-2 sm:grid-cols-2">
            {styles.map((s) => (
              <label
                key={s.name}
                className="flex items-center gap-3 p-3 rounded-xl border border-[#24102C]/15 hover:border-[#B0104B]/50 hover:bg-[#B0104B]/5 cursor-pointer transition-colors text-sm font-semibold"
              >
                <input
                  type="checkbox"
                  name="styles"
                  value={s.name}
                  className="w-4 h-4 rounded text-[#B0104B] accent-[#B0104B]"
                />
                <span>{s.name}</span>
              </label>
            ))}
            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#24102C]/15 hover:border-[#B0104B]/50 hover:bg-[#B0104B]/5 cursor-pointer transition-colors text-sm font-semibold">
              <input
                type="checkbox"
                name="styles"
                value="Not sure yet"
                className="w-4 h-4 rounded text-[#B0104B] accent-[#B0104B]"
              />
              <span>Not sure yet (Help me choose)</span>
            </label>
          </div>
        </div>

        <div>
          <span className="block text-xs font-bold text-[#24102C]/80 uppercase tracking-wider mb-2 mt-4">
            Preferred Days of the Week
          </span>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((d) => (
              <label
                key={d}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#24102C]/15 hover:border-[#B0104B]/50 hover:bg-[#B0104B]/5 cursor-pointer transition-colors text-xs font-bold"
              >
                <input
                  type="checkbox"
                  name="days"
                  value={d}
                  className="w-3.5 h-3.5 rounded text-[#B0104B] accent-[#B0104B]"
                />
                <span>{d.toUpperCase()}</span>
              </label>
            ))}
          </div>
        </div>
      </fieldset>

      {/* ── Contact Info ────────────────────────────────────────────── */}
      <fieldset className="space-y-4">
        <legend className="font-mono text-xs uppercase tracking-widest text-[#B0104B] font-bold">
          03. Parent / Guardian / Dancer Contact
        </legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold text-[#24102C]/80 uppercase tracking-wider mb-1.5" htmlFor="email">
              Email Address <span className="text-[#B0104B]">*</span>
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl border-2 border-[#24102C]/15 bg-white text-[#24102C] focus:border-[#B0104B] focus:outline-none transition-colors"
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="parent@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24102C]/80 uppercase tracking-wider mb-1.5" htmlFor="phone">
              Mobile Phone <span className="text-[#B0104B]">*</span>
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl border-2 border-[#24102C]/15 bg-white text-[#24102C] focus:border-[#B0104B] focus:outline-none transition-colors"
              id="phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              placeholder="(847) 555-0123"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-[#24102C]/80 uppercase tracking-wider mb-1.5" htmlFor="message">
              Questions or Notes (Optional)
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border-2 border-[#24102C]/15 bg-white text-[#24102C] focus:border-[#B0104B] focus:outline-none transition-colors"
              id="message"
              name="message"
              rows={3}
              maxLength={1200}
              placeholder="e.g. Looking for a class with friends, or starting dance for the first time..."
            />
          </div>
        </div>
      </fieldset>

      <div>
        <button
          type="submit"
          className="btn btn-primary w-full py-4 text-base font-bold shadow-lg"
        >
          Confirm &amp; Request Trial Class Pass
        </button>

        {sent && (
          <p className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium text-center">
            Your mail client was opened. We look forward to welcoming you to the studio!
          </p>
        )}
      </div>
    </form>
  );
}
