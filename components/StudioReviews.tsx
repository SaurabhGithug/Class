import React from "react";

const REVIEWS = [
  {
    author: "Pooja & Amit Shah",
    location: "Schaumburg, IL",
    role: "Parents of Anika (Age 7)",
    text: "Anika was painfully shy and hesitant to participate in group activities. After just 6 weeks with Toolieka, she walked onto the theater stage during the annual showcase with a huge smile and danced her heart out. Toolieka is patient, warm, and truly understands children.",
    rating: 5,
  },
  {
    author: "Dr. Rohini Verma",
    location: "Naperville, IL",
    role: "Adult Bollywood Student (No Prior Dance)",
    text: "As a busy physician, I needed a workout that wasn't monotonous gym time. Adult Bollywood on Monday evenings is pure joy and therapy! No judgment, wonderful community of women, and Toolieka breaks every step down so thoroughly that anyone can follow.",
    rating: 5,
  },
  {
    author: "Rajesh & Priya Nair",
    location: "Hoffman Estates, IL",
    role: "Parents of Rohan (Age 11) & Riya (Age 14)",
    text: "What sets Toolieka Dance Academy apart is the authentic technique. They don't just teach quick trend choreographies; they teach classical posture, hand mudras, and musicality. Both our kids have developed incredible discipline and stage confidence.",
    rating: 5,
  },
];

export default function StudioReviews() {
  return (
    <div className="space-y-8">
      {/* Summary Score Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-[#1E0A28]/10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center font-display font-black text-2xl text-amber-500">
            4.9
          </div>
          <div>
            <div className="flex items-center gap-1 text-amber-400 text-lg">
              {"★".repeat(5)}
            </div>
            <p className="text-xs font-mono text-[#1E0A28]/70 mt-0.5">
              Verified Reviews from Chicagoland Families &amp; Dancers
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-[#1E0A28]/60 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>450+ Active Students &amp; Families in Chicagoland</span>
        </div>
      </div>

      {/* Reviews Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {REVIEWS.map((r, i) => (
          <div
            key={i}
            className="p-6 sm:p-7 rounded-2xl bg-white border border-[#1E0A28]/10 shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-amber-400 text-sm">{"★".repeat(r.rating)}</span>
                <span className="text-[0.68rem] font-mono text-[#1E0A28]/50 uppercase">{r.location}</span>
              </div>
              <p className="text-xs sm:text-sm text-[#1E0A28]/80 leading-relaxed italic mb-6">
                &ldquo;{r.text}&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-[#1E0A28]/10">
              <p className="font-bold text-sm text-[#1E0A28]">{r.author}</p>
              <p className="text-[0.68rem] font-mono text-[#D81B60] mt-0.5 font-semibold">{r.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
