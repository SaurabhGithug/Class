import type { Metadata } from "next";
import { Archivo, Fraunces, Space_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { heroPhoto } from "@/lib/photos";
import { site, siteUrlConfigured } from "@/lib/site";
import { tagline } from "@/lib/content";
import { currentAnnouncement } from "@/lib/contentsathi/docs.ts";
import { listPublished } from "@/lib/contentsathi/posts.ts";
import AnnouncementBar from "@/components/AnnouncementBar";

/** Archivo (heavy, tight) for display and body, Fraunces italic for the odd accent word, Space Mono rationed to small kickers. */
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], style: ["italic"], weight: ["500"], variable: "--font-fraunces", display: "swap" });
const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Bollywood Dance Classes for Kids, Teens & Adults | Toolieka", template: "%s | Toolieka Bollywood Dance Classes" },
  description: tagline,
  openGraph: {
    type: "website",
    title: "Bollywood Dance Classes — Toolieka",
    description: tagline,
    images: [{ url: heroPhoto.src, width: heroPhoto.w, height: heroPhoto.h, alt: heroPhoto.alt }],
    locale: "en_US",
  },
  // An unconfigured deployment must not be indexed under a placeholder address.
  robots: siteUrlConfigured ? { index: true, follow: true } : { index: false, follow: false },
};

/**
 * EducationalOrganization, not LocalBusiness: there is no street address or opening
 * hours on record, and a LocalBusiness without them would be invented. Nothing here
 * asserts a rating, a price, a student count or an award — none has been supplied.
 */
function StructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${site.url}/#org`,
    name: site.brand,
    description: tagline,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    areaServed: site.areas.map((a) => ({ "@type": "City", name: a })),
    founder: { "@type": "Person", name: site.name },
    sameAs: site.instagram.map((i) => i.url),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />;
}

/**
 * These pages are built ahead of time, so "is the banner showing now?" would be frozen at
 * build time. Refreshing at most every 15 minutes keeps an announcement's start and expiry
 * honest to within that, without making every page render on every visit.
 */
export const revalidate = 900;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const showJournal = (await listPublished()).length > 0;
  const announcement = await currentAnnouncement();
  return (
    <html lang="en" className={`${archivo.variable} ${fraunces.variable} ${mono.variable}`}>
      <body className="bg-cream text-plum antialiased">
        <StructuredData />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-magenta focus:px-5 focus:py-3 focus:font-extrabold focus:text-cream">
          Skip to content
        </a>
        <AnnouncementBar a={announcement} />
        <Nav showJournal={showJournal} />
        <main id="main">{children}</main>
        <Footer showJournal={showJournal} />
      </body>
    </html>
  );
}
