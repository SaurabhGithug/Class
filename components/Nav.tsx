"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

const base = [
  { href: "/classes", label: "Classes & Schedule" },
  { href: "/about", label: "About Toolieka" },
  { href: "/gallery", label: "Studio Gallery" },
  { href: "/contact", label: "Contact & Studios" },
];

/** The Journal appears once there is something in it. */
const withJournal = (show: boolean) =>
  show ? [...base.slice(0, 3), { href: "/blog", label: "Journal" }, base[3]] : base;

export default function Nav({ showJournal = false }: { showJournal?: boolean }) {
  const links = withJournal(showJournal);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#24102C]/90 backdrop-blur-xl border-b border-white/10 text-white">
        <div className="mx-auto flex h-[4.75rem] max-w-[1280px] items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3.5 group" aria-label={`${site.brand} — home`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#B0104B] to-[#F5A800] flex items-center justify-center font-display font-black text-xl text-white shadow-lg group-hover:scale-105 transition-transform">
              T
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-extrabold text-2xl tracking-tight text-white group-hover:text-rose transition-colors">
                Toolieka
              </span>
              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-[#F5A800] font-semibold mt-1">
                Bollywood Dance Academy
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
            {links.map((l) => {
              const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-sm font-semibold tracking-wide transition-colors relative py-1 ${
                    active ? "text-[#F5A800]" : "text-white/80 hover:text-white"
                  }`}
                >
                  {l.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#F5A800]" />
                  )}
                </Link>
              );
            })}
            <Link
              href="/contact"
              className="btn btn-primary !min-h-[2.5rem] !py-2 !px-5 text-sm font-bold shadow-md hover:shadow-rose/30"
            >
              Book Free Trial
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 md:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden="true" className="relative block h-3.5 w-5">
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-white transition-transform ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-white transition-transform ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="fixed inset-0 top-[4.75rem] z-40 flex flex-col justify-between bg-[#24102C]/95 backdrop-blur-2xl p-8 md:hidden text-white"
      >
        <nav className="flex flex-col gap-2 pt-4" aria-label="Primary mobile">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={close}
              className="font-display font-bold py-3.5 text-3xl border-b border-white/10 hover:text-[#F5A800] transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="space-y-4 pb-12">
          <Link href="/contact" onClick={close} className="btn btn-primary w-full py-4 text-center">
            Book a Free Trial Class
          </Link>
          <a
            href={`tel:${site.phone}`}
            className="block text-center font-mono text-sm text-white/70 hover:text-white"
          >
            Call Studio: {site.phoneDisplay}
          </a>
        </div>
      </div>

      {/* Persistent mobile floating CTA */}
      <div className="fixed inset-x-4 bottom-4 z-30 flex gap-2.5 md:hidden">
        <a
          href={`tel:${site.phone}`}
          className="btn btn-ghost flex-1 bg-[#24102C]/90 backdrop-blur-lg border border-white/20 text-white shadow-xl text-xs py-3"
          aria-label={`Call ${site.phoneDisplay}`}
        >
          Call Studio
        </a>
        <Link
          href="/contact"
          className="btn btn-primary flex-[2] shadow-xl text-xs py-3"
        >
          Book Trial Class
        </Link>
      </div>
    </>
  );
}
