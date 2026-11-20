/**
 * Her photographs. Only images her earlier site marks as her own uploads (its
 * gallery-data.js, source "upload") are used; the ones fetched from another
 * site and from Instagram are not. Alt text describes what is in each picture.
 *
 * Alt text follows what is in each picture and, where her earlier site names the
 * person in it, that site's own words. hero-premium.jpg (a wedding sangeet scene on
 * her wedding site) is deliberately not used here.
 *
 * Several show children. They stay off the public site until Toolieka confirms she has
 * the parents' permission to show them on the web — then, and only on her word, move
 * their files from photos-awaiting-permission/ back to public/images/ and set
 * childrenPhotosCleared to true. (Files under public/ are served to anyone who knows the
 * address, so leaving them there unreferenced would not keep them private.)
 */
import { tlobLibrary, type LibraryPhoto } from "./library.ts";

// 2026-11-20: switched on because the site owner said to add all images (as on the TLOB site, where
// student photos are shown at the owner's request). Parents' permission is still to be confirmed —
// set this back to false to hide every photo marked showsChildren in one step.
export const childrenPhotosCleared = true;

export interface Photo {
  src: string;
  alt: string;
  w: number;
  h: number;
  /** Young children are recognisable in it (needs the parents' permission). */
  showsChildren?: true;
}

const p = (file: string, w: number, h: number, alt: string): Photo => ({ src: `/images/${file}`, w, h, alt });
const child = (ph: Photo): Photo => ({ ...ph, showsChildren: true });
const fromLibrary = (l: LibraryPhoto): Photo => {
  const ph = p(`tlob/${l.file}`, l.w, l.h, l.alt);
  return l.showsChildren ? child(ph) : ph;
};

export const photos = {
  goldStage: child(p("kids-gold-stage.jpg", 1024, 858, "A large group of young dancers in matching gold, orange and blue costumes posing together on stage")),
  orangeStage: child(p("kids-orange-stage.jpg", 1024, 858, "Young dancers in orange and blue costumes posing on a stage")),
  stagePose: child(p("kids-stage-pose.jpg", 1024, 627, "A row of young dancers in orange and blue striking a pose on stage")),
  backstage: child(p("kids-bollywood-backstage.jpg", 576, 1024, "Young dancers in gold and magenta costumes gathered backstage with their teacher")),
  ganesha: p("bharatanatyam-ganesha.jpg", 1024, 860, "Four dancers in green and red classical costumes offering flowers at a small altar with a Ganesha figure"),
  magentaSarees: p("magenta-saree-team.jpg", 1024, 861, "A team of five women in magenta sarees with gold-yellow blouses posing together"),
  stageLights: p("stage-eye-costume.jpg", 1024, 858, "A team of dancers in matching grey and blue outfits performing on a stage lit in red and green"),
  whiteJackets: p("team-white-jackets.jpg", 1024, 861, "A performance team in white jackets posing in two rows"),
  outdoor: p("team-outdoor.jpg", 683, 1024, "Toolieka with her performance team in white and black, in an outdoor portrait"),
  trophies2024: child(p("trophies-2024.jpg", 1024, 859, "A crowd of students and parents in a school hallway, holding up their trophies")),
  trophiesGroup: child(p("trophies-group.jpg", 1024, 768, "Students holding trophies and smiling in a group")),
  trophiesHallway: child(p("trophies-hallway.jpg", 576, 1024, "Students and parents with trophies in a school hallway")),
  boys: child(p("boys-lunch.jpg", 576, 1024, "Four young children in matching blue tops and orange trousers")),
  saree: p("saree-duo.jpg", 1024, 861, "Toolieka with a dancer, both in traditional sarees"),
  // Her earlier site names these two as her: "Toolieka Prakash Nikam portrait" / "Toolieka portrait".
  instructorMagenta: p("instructor-magenta.jpg", 683, 1024, "Toolieka Prakash Nikam in a magenta dress, studio portrait"),
  instructor: p("instructor-portrait.jpg", 682, 1024, "Portrait of Toolieka"),
} as const;

const shown = (ph: Photo) => childrenPhotosCleared || !ph.showsChildren;

/** The home hero and the site's link-preview image. */
export const heroPhoto: Photo = childrenPhotosCleared ? photos.goldStage : photos.magentaSarees;

/** The home page's "On stage" strip. The trophy line goes with the trophy photo. */
export const onStage: { photos: readonly Photo[]; heading: string; line: string } = childrenPhotosCleared
  ? {
      photos: [photos.orangeStage, photos.trophies2024, photos.whiteJackets, photos.magentaSarees],
      heading: "Costumes, lights, and trophy days.",
      line: "Competition season — students bringing home trophies.",
    }
  : {
      photos: [photos.stageLights, photos.whiteJackets, photos.outdoor, photos.saree],
      heading: "Costumes, lights, and stage days.",
      line: "Performance teams on stage and in costume.",
    };

/** The gallery order: stage and costume first, trophies after, portraits last. */
export const gallery: readonly Photo[] = [
  photos.goldStage, photos.ganesha, photos.stageLights, photos.magentaSarees, photos.orangeStage, photos.whiteJackets,
  photos.backstage, photos.stagePose, photos.outdoor, photos.trophies2024, photos.trophiesGroup, photos.trophiesHallway,
  photos.boys, photos.saree, photos.instructorMagenta, photos.instructor,
  ...tlobLibrary.filter((l) => !l.section).map(fromLibrary),
].filter(shown);

/** The gallery page's other sections, each in library order. */
export const librarySection = (section: NonNullable<LibraryPhoto["section"]>): Photo[] =>
  tlobLibrary.filter((l) => l.section === section).map(fromLibrary).filter(shown);
