import Image from "next/image";
import Link from "next/link";
import { AUDIENCES, classesFor } from "@/lib/classes";
import { beyondClass, bio, credentials, styles, tagline } from "@/lib/content";
import { formatDate } from "@/lib/contentsathi/format.ts";
import { excerpt, listPublished } from "@/lib/contentsathi/posts.ts";
import { heroPhoto, onStage, photos } from "@/lib/photos";
import { loadSchedule } from "@/lib/schedule-source";
import { site } from "@/lib/site";
import WeekFinder, { type FinderGroup } from "@/components/WeekFinder";

export default async function Home() {
  const posts = (await listPublished()).slice(0, 3);
  const { entries, confirmed, note } = await loadSchedule();
  const groups: FinderGroup[] = AUDIENCES.map((a) => ({ id: a.id, label: a.label, blurb: a.blurb, classes: classesFor(a.id, entries) })).filter(
    (g) => g.classes.length > 0,
  );

  return (
    <>
      {/* ══ HERO: the promise, then the week ══ */}
      <section data-surface="cream" className="overflow-hidden">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-5 pb-14 pt-12 sm:px-8 md:pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="kicker rise">The Legends of Bollywood, with Toolieka Prakash Nikam</p>
            <h1 className="display rise rise-2 mt-4 text-[clamp(2.6rem,6.6vw,5.4rem)]">
              Learn Bollywood from a <span className="whitespace-nowrap">film-industry</span> performer.
            </h1>
            <p className="rise rise-3 mt-6 max-w-xl text-lg leading-relaxed text-plum/85 sm:text-xl">{tagline}</p>
            <div className="rise rise-3 mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="btn btn-primary">Book a trial class</Link>
              <a href={`tel:${site.phone}`} className="btn btn-ghost">Call {site.phoneDisplay}</a>
            </div>
          </div>
          <div className="rise rise-2 relative mx-auto w-full max-w-md lg:max-w-none">
            <div aria-hidden="true" className="absolute -bottom-4 -left-4 h-full w-full rounded-[1.75rem] bg-marigold" />
            <Image
              src={heroPhoto.src}
              alt={heroPhoto.alt}
              width={heroPhoto.w}
              height={heroPhoto.h}
              priority
              sizes="(min-width: 1024px) 36vw, 92vw"
              className="relative aspect-[4/3.6] w-full rounded-[1.75rem] border-4 border-plum object-cover"
            />
          </div>
        </div>
        <div className="mx-auto max-w-[1280px] px-3 pb-20 sm:px-8 md:pb-28">
          <WeekFinder groups={groups} confirmed={confirmed} note={note} phone={site.phone} phoneDisplay={site.phoneDisplay} />
        </div>
      </section>

      {/* ══ STYLES ══ */}
      <section data-surface="sun">
        <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 md:py-28">
          <p className="kicker !text-plum">Styles</p>
          <h2 className="display mt-3 max-w-2xl text-[clamp(2rem,5vw,3.6rem)]">Four ways to move.</h2>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {styles.map((s) => (
              <li key={s.name} className="card p-6">
                <p className="display text-2xl">{s.name}</p>
                <p className="mt-3 leading-relaxed text-plum/85">{s.line}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ MEET TOOLIEKA ══ */}
      <section data-surface="warm">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Image
            src={photos.instructorMagenta.src}
            alt={photos.instructorMagenta.alt}
            width={photos.instructorMagenta.w}
            height={photos.instructorMagenta.h}
            sizes="(min-width: 1024px) 34vw, 92vw"
            className="mx-auto w-full max-w-md rounded-[1.75rem] border-4 border-plum object-cover"
          />
          <div>
            <p className="kicker">Your teacher</p>
            <h2 className="display mt-3 text-[clamp(2rem,5vw,3.4rem)]">Meet Toolieka.</h2>
            <p className="mt-6 text-lg leading-relaxed">{bio.lead}</p>
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-t-2 border-plum pt-8">
              {credentials.map((c) => (
                <div key={c.label}>
                  <dt className="display text-4xl text-magenta">{c.value}</dt>
                  <dd className="mt-1 text-sm font-bold leading-snug">{c.label}</dd>
                </div>
              ))}
            </dl>
            <Link href="/about" className="btn btn-ghost mt-9">Read her story</Link>
          </div>
        </div>
      </section>

      {/* ══ ON STAGE ══ */}
      <section data-surface="plum">
        <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 md:py-28">
          <p className="kicker">On stage</p>
          <h2 className="display mt-3 max-w-2xl text-[clamp(2rem,5vw,3.6rem)]">{onStage.heading}</h2>
          <p className="mt-5 max-w-xl text-cream/80">{onStage.line}</p>
          <ul className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {onStage.photos.map((ph) => (
              <li key={ph.src} className="aspect-[4/5] overflow-hidden rounded-2xl border-2 border-marigold">
                <Image src={ph.src} alt={ph.alt} width={ph.w} height={ph.h} sizes="(min-width: 768px) 25vw, 46vw" className="h-full w-full object-cover" />
              </li>
            ))}
          </ul>
          <Link href="/gallery" className="btn btn-ghost mt-10">See the gallery</Link>
        </div>
      </section>

      {/* ══ BEYOND THE CLASSROOM ══ */}
      <section data-surface="cream">
        <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 md:py-24">
          <p className="kicker">Beyond the classroom</p>
          <p className="display mt-4 max-w-3xl text-[clamp(1.6rem,3.6vw,2.6rem)] !leading-[1.1]">{beyondClass}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn-primary">Ask about an event</Link>
            {site.weddingsUrl && (
              <a href={site.weddingsUrl} className="btn btn-ghost">Wedding choreography</a>
            )}
          </div>
        </div>
      </section>

      {/* ══ JOURNAL (only when there is something in it) ══ */}
      {posts.length > 0 && (
        <section data-surface="warm">
          <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 md:py-24">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="kicker">Journal</p>
                <h2 className="display mt-3 text-[clamp(2rem,5vw,3.2rem)]">Latest from the studio.</h2>
              </div>
              <Link href="/blog" className="font-extrabold text-magenta underline underline-offset-4">All articles</Link>
            </div>
            <ul className="mt-10 grid gap-5 md:grid-cols-3">
              {posts.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="card block h-full p-6 hover:-translate-y-1 hover:shadow-lg">
                    <p className="kicker">{p.category}</p>
                    <p className="display mt-3 text-2xl !leading-tight">{p.title}</p>
                    <p className="mt-3 leading-relaxed text-plum/80">{excerpt(p, 120)}</p>
                    <p className="mt-4 text-sm font-bold text-plum/60">{formatDate(p.publishedAt)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ══ FINAL CTA ══ */}
      <section data-surface="sun">
        <div className="mx-auto max-w-[1280px] px-5 py-20 text-center sm:px-8 md:py-28">
          <h2 className="display mx-auto max-w-3xl text-[clamp(2.2rem,6vw,4.4rem)]">Ready to try a class?</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed">Tell us who is dancing and what they would like to try. Toolieka will get back to you.</p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/contact" className="btn btn-primary">Book a trial class</Link>
            <a href={`tel:${site.phone}`} className="btn btn-ghost">{site.phoneDisplay}</a>
          </div>
        </div>
      </section>
    </>
  );
}
