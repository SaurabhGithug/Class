import Link from "next/link";
import { site } from "@/lib/site";
import { tagline } from "@/lib/content";

export default function Footer({ showJournal = false }: { showJournal?: boolean }) {
  return (
    <footer className="bg-[#1A0B20] text-white border-t border-white/10 pb-28 md:pb-0">
      <div className="h-1 bg-gradient-to-r from-[#B0104B] via-[#E9437D] to-[#F5A800]" aria-hidden="true" />
      <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 md:py-24">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#B0104B] to-[#F5A800] flex items-center justify-center font-display font-black text-lg text-white">
                T
              </div>
              <p className="font-display font-extrabold text-3xl tracking-tight">Toolieka</p>
            </div>
            <p className="font-mono text-xs uppercase tracking-widest text-[#F5A800] mt-2 font-semibold">
              Bollywood Dance Academy & Studio
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/75">
              {tagline} High-energy Bollywood, semi-classical Kathak fusion, and urban choreographies taught by UNESCO/CID Paris certified director Toolieka Prakash Nikam.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact" className="btn btn-primary !min-h-[2.75rem] !py-2 !px-5 text-sm font-bold">
                Book a Free Trial Class
              </Link>
            </div>
          </div>

          <div>
            <h2 className="font-mono text-xs uppercase tracking-widest text-[#F5A800] font-bold">
              Studio Locations
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-white/80">
              {site.areas.map((a) => (
                <li key={a} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E9437D]" />
                  <span>{a}</span>
                </li>
              ))}
              <li className="flex items-center gap-2 text-white/60">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5A800]" />
                <span>Private Workshops Across the USA</span>
              </li>
            </ul>
            <p className="mt-5 text-xs text-white/50 leading-relaxed">
              Sprung dance floors, mirrored walls, and family viewing areas across all studio spaces.
            </p>
          </div>

          <div>
            <h2 className="font-mono text-xs uppercase tracking-widest text-[#F5A800] font-bold">
              Direct Contact & Studio Desk
            </h2>
            <ul className="mt-5 space-y-3.5 text-sm">
              <li>
                <span className="block font-mono text-[0.68rem] uppercase tracking-wider text-white/50 mb-0.5">
                  Direct Phone
                </span>
                <a href={`tel:${site.phone}`} className="font-display text-xl font-bold text-white hover:text-[#F5A800] transition-colors">
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <span className="block font-mono text-[0.68rem] uppercase tracking-wider text-white/50 mb-0.5">
                  General Inquiries
                </span>
                <a href={`mailto:${site.email}`} className="text-white/80 hover:text-[#F5A800] transition-colors">
                  {site.email}
                </a>
              </li>
              <li>
                <span className="block font-mono text-[0.68rem] uppercase tracking-wider text-white/50 mb-0.5">
                  Instagram
                </span>
                {site.instagram.map((ig) => (
                  <a
                    key={ig.handle}
                    href={ig.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-[#E9437D] font-bold hover:text-[#F5A800] transition-colors"
                  >
                    {ig.handle} ↗
                  </a>
                ))}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between font-mono">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer">
            <Link href="/classes" className="hover:text-white transition-colors">Classes & Schedule</Link>
            <Link href="/about" className="hover:text-white transition-colors">About Toolieka</Link>
            <Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link>
            {showJournal && <Link href="/blog" className="hover:text-white transition-colors">Journal</Link>}
            <Link href="/contact" className="hover:text-white transition-colors">Contact & Studios</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
