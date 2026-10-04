"use client";

import { useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";

interface ClassOption {
  id: string;
  category: string;
  age: string;
  recommendedClass: string;
  style: string;
  schedule: string;
  location: string;
  benefit: string;
  icon: string;
}

const CATEGORIES: ClassOption[] = [
  {
    id: "little-movers",
    category: "Little Movers",
    age: "Ages 4–7",
    recommendedClass: "Little Movers & Bollywood Starlets",
    style: "Foundational Rhythm, Creative Movement & Bollywood Beats",
    schedule: "Wednesdays 4:30 PM & Saturdays 10:00 AM",
    location: "Schaumburg Studio",
    benefit: "Develops musicality, motor skills, and unshakeable childhood confidence in a warm, encouraging circle.",
    icon: "🌟",
  },
  {
    id: "juniors",
    category: "Juniors",
    age: "Ages 8–12",
    recommendedClass: "Bollywood Juniors & Semi-Classical Kids",
    style: "Expressive Bollywood, Classical Kathak Posture & Stage Formations",
    schedule: "Tuesdays 5:15 PM & Sundays 11:30 AM",
    location: "Schaumburg & Naperville Studios",
    benefit: "Builds posture, synchronized hand mudras, and teamwork ready for the annual theater showcase.",
    icon: "🚀",
  },
  {
    id: "teens",
    category: "Teens & Pre-Pro",
    age: "Ages 13–17",
    recommendedClass: "Teen Fusion & Urban Bollywood",
    style: "High-Energy Hip Hop isolations, Contemporary Indian & Viral Choreo",
    schedule: "Thursdays 6:00 PM & Saturdays 1:00 PM",
    location: "Schaumburg Studio",
    benefit: "Fast-paced, athletic choreography designed to build stage presence, performance swagger, and video reel chops.",
    icon: "⚡",
  },
  {
    id: "adults",
    category: "Adults (Zero Experience)",
    age: "Ages 18+",
    recommendedClass: "Adult Bollywood Cardio & Lyrical Beginner",
    style: "Joyful Bollywood Cardio, Classic Hooks & Lyrical Grace",
    schedule: "Mondays 7:00 PM & Wednesdays 7:15 PM",
    location: "Schaumburg & Naperville Studios",
    benefit: "Zero judgment, zero auditions. A heart-pumping, fun workout where you learn authentic choreography and sweat with a supportive community.",
    icon: "💃",
  },
  {
    id: "troupe",
    category: "Performance Troupe",
    age: "Audition Only",
    recommendedClass: "Showcase Competition Troupe",
    style: "Advanced Theatrical Bollywood & Classical Fusion",
    schedule: "Saturdays 2:30 PM (2-Hour Intensive)",
    location: "Main Studio Stage",
    benefit: "High-intensity training for dancers wanting to compete, tour cultural festivals, and perform featured showcase solos.",
    icon: "👑",
  },
];

export default function ClassMatcher() {
  const [selectedId, setSelectedId] = useState<string>("little-movers");
  const current = CATEGORIES.find((c) => c.id === selectedId) || CATEGORIES[0];

  return (
    <div className="rounded-3xl p-6 sm:p-10 bg-white border-2 border-[#1E0A28]/10 shadow-2xl relative overflow-hidden">
      {/* Radiant energy aura */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#D81B60]/10 via-[#FFB300]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#1E0A28]/10">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D81B60]/10 text-[#D81B60] font-mono text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-[#D81B60] animate-ping" />
            10-Second Class Finder
          </span>
          <h3 className="font-display font-black text-2xl sm:text-4xl text-[#1E0A28] tracking-tight">
            Find the Perfect Class for Your Dancer
          </h3>
          <p className="text-[#1E0A28]/70 text-sm mt-1">
            Click your age group below to see recommended classes, schedules, and claim a $20 trial pass.
          </p>
        </div>

        <div className="text-left md:text-right shrink-0">
          <div className="inline-block px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold font-mono">
            ★ 100% Risk-Free Guarantee
          </div>
        </div>
      </div>

      {/* Interactive Category Selector Pills */}
      <div className="relative z-10 pt-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {CATEGORIES.map((cat) => {
            const active = selectedId === cat.id;
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => setSelectedId(cat.id)}
                className={`p-3.5 rounded-2xl text-left transition-all duration-300 border flex flex-col justify-between ${
                  active
                    ? "bg-[#1E0A28] text-white border-[#1E0A28] shadow-lg scale-102"
                    : "bg-[#FAF7F2] text-[#1E0A28] border-transparent hover:border-[#1E0A28]/20"
                }`}
              >
                <span className="text-2xl mb-1">{cat.icon}</span>
                <div>
                  <p className="font-bold text-xs sm:text-sm leading-tight">{cat.category}</p>
                  <p className={`text-[0.68rem] font-mono mt-0.5 ${active ? "text-amber-300" : "text-[#1E0A28]/60"}`}>
                    {cat.age}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Matching Result Showcase Card */}
      <div className="relative z-10 mt-8 p-6 sm:p-8 rounded-2xl bg-[#FAF7F2] border border-[#1E0A28]/10 grid md:grid-cols-[1.3fr_0.7fr] gap-6 items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#D81B60] text-white text-[0.68rem] font-mono font-bold uppercase">
              Recommended Match
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-[#FFB300]/20 text-[#1E0A28] text-[0.68rem] font-mono font-bold">
              {current.age}
            </span>
          </div>

          <h4 className="font-display font-black text-2xl sm:text-3xl text-[#1E0A28] mb-2 leading-tight">
            {current.recommendedClass}
          </h4>

          <p className="text-sm font-semibold text-[#D81B60] mb-2">
            Style Focus: {current.style}
          </p>

          <p className="text-xs sm:text-sm text-[#1E0A28]/80 leading-relaxed mb-4">
            {current.benefit}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-[#1E0A28]/70 pt-3 border-t border-[#1E0A28]/10">
            <div>
              <strong className="text-[#1E0A28] block">Class Timing:</strong>
              {current.schedule}
            </div>
            <div>
              <strong className="text-[#1E0A28] block">Studio Location:</strong>
              {current.location}
            </div>
          </div>
        </div>

        {/* Action Callout Box */}
        <div className="p-6 rounded-2xl bg-white border-2 border-[#D81B60]/30 shadow-xl flex flex-col justify-between text-center space-y-4">
          <div>
            <span className="text-[0.68rem] font-mono uppercase tracking-wider text-[#D81B60] font-bold block mb-1">
              Introduction Pass
            </span>
            <div className="font-display font-black text-4xl text-[#1E0A28]">
              $20 <span className="text-xs font-mono text-[#1E0A28]/50 font-normal">/ trial class</span>
            </div>
            <p className="text-[0.68rem] text-[#1E0A28]/60 mt-1 leading-snug">
              100% credited toward term session fee upon registration.
            </p>
          </div>

          <Link
            href="/contact"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#D81B60] to-[#FF4081] text-white font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-md shadow-[#D81B60]/30 transition-all block text-center"
          >
            Claim $20 Trial Pass Now →
          </Link>

          <a
            href={`tel:${site.phone}`}
            className="text-[0.7rem] font-mono text-[#1E0A28]/70 hover:text-[#D81B60] transition block"
          >
            Or Call Studio: {site.phoneDisplay}
          </a>
        </div>
      </div>
    </div>
  );
}
