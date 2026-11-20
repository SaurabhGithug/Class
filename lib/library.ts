/**
 * The Legends of Bollywood photo library: every photo from the TLOB website's gallery
 * (tlob-site/src/gallery.json — already curated there: no stock photos, film posters or
 * stills owned by others, no logos). Four that this site already has at another size are
 * left out. Files live in public/images/tlob/. Generated 2026-11-20; regenerate rather than
 * hand-edit if the TLOB gallery changes. The four extra-* entries at the end come from the
 * owner's own uploads in bollywood/images (Mail/, tlob-site/), added 2026-11-20. Entries with a
 * section came from the rest of bollywood/images on the owner's instruction to add every image;
 * left out: exact duplicates, icons, a blank theme graphic and an Instagram profile picture.
 * screen-b4 and screen-d3 carry Getty Images watermarks and were added on the owner's instruction
 * (2026-11-20): they need a Getty licence; remove these two entries and files if there is none.
 */
export interface LibraryPhoto {
  file: string;
  w: number;
  h: number;
  alt: string;
  showsChildren?: true;
  /**
   * Where it shows on the gallery page. Unset = the main gallery (TLOB's own photos).
   * "screen" = film and TV stills (the producers' copyright; she appears in them).
   * "recognition" = certificates and association logos.
   * "archive" = images from the earlier TLOB website; several are stock photography.
   */
  section?: "screen" | "recognition" | "archive";
}

export const tlobLibrary: readonly LibraryPhoto[] = [
  { file: "extra-sangeet-stage.jpg", w: 1400, h: 906, alt: "A sangeet celebration on stage under red stage lights, guests in lehengas and sarees (photo: Rutul Photography)" },
  { file: "extra-solo-stage.jpg", w: 933, h: 1400, alt: "Toolieka performing solo on stage in front of a Durga backdrop" },
  { file: "extra-white-jackets-stairs.jpg", w: 1239, h: 1400, alt: "A dance team in white jackets and black outfits posing on a staircase" },
  { file: "extra-red-lehengas.jpg", w: 1050, h: 1400, alt: "Dancers in black tops and red lehengas posing in a courtyard" },
  { file: "extra-portrait-lehenga-wide.jpg", w: 1400, h: 788, alt: "Toolieka in a green embroidered lehenga in a dance studio" },
  { file: "extra-portrait-lehenga.jpg", w: 713, h: 1112, alt: "Toolieka in a green embroidered lehenga, full-length portrait" },
  { file: "gallery-1.jpg", w: 1400, h: 1050, alt: "Large group of young dancers in colourful costumes posing on stage", showsChildren: true },
  { file: "gallery-2.jpg", w: 1024, h: 576, alt: "Young dancers and women in green and pink costumes posing backstage", showsChildren: true },
  { file: "gallery-3.jpg", w: 1024, h: 768, alt: "Young dancers in silver outfits posing in front of wooden doors", showsChildren: true },
  { file: "gallery-4.jpg", w: 1400, h: 1050, alt: "Girls in blue and red sarees posing together", showsChildren: true },
  { file: "gallery-5.jpg", w: 1050, h: 1400, alt: "Young dancers in silver bell-bottom costumes with their teacher", showsChildren: true },
  { file: "gallery-6.jpg", w: 1050, h: 1400, alt: "Three people on stage, one in a green outfit holding flowers" },
  { file: "gallery-8.jpg", w: 1400, h: 1174, alt: "Rows of gold dance trophies on a table" },
  { file: "gallery-9.jpg", w: 1024, h: 768, alt: "Young dancers in colourful lehengas and red tops in front of wooden doors", showsChildren: true },
  { file: "gallery-11.jpg", w: 1400, h: 933, alt: "Large group of adults in colourful traditional outfits posing on stage" },
  { file: "gallery-12.jpg", w: 768, h: 1024, alt: "A group in traditional outfits posing outdoors" },
  { file: "gallery-13.jpg", w: 1024, h: 768, alt: "Dancers in red embroidered lehengas seated in a circle on a studio floor", showsChildren: true },
  { file: "gallery-14.jpg", w: 1050, h: 1400, alt: "Three women posing on a stage" },
  { file: "gallery-15.jpg", w: 1024, h: 768, alt: "A dance team in gold and maroon outfits in front of wooden doors", showsChildren: true },
  { file: "gallery-16.jpg", w: 1024, h: 768, alt: "Young dancers in lilac and red-and-black costumes posing together", showsChildren: true },
  { file: "gallery-17.jpg", w: 960, h: 1280, alt: "Two children in traditional outfits", showsChildren: true },
  { file: "gallery-18.jpg", w: 1333, h: 723, alt: "Five women in black outfits posing together" },
  { file: "gallery-19.jpg", w: 1050, h: 1400, alt: "Two young boys in red tops and white dhotis posing", showsChildren: true },
  { file: "gallery-20.jpg", w: 1400, h: 1054, alt: "Dancers in yellow ruffled costumes in front of a marigold garland backdrop", showsChildren: true },
  { file: "gallery-21.jpg", w: 768, h: 1024, alt: "Four young boys in red and black outfits", showsChildren: true },
  { file: "gallery-22.jpg", w: 1024, h: 652, alt: "A large group of young dancers in lilac costumes with their instructors", showsChildren: true },
  { file: "gallery-23.jpg", w: 768, h: 1024, alt: "Young dancers in teal costumes with their teacher backstage", showsChildren: true },
  { file: "gallery-25.jpg", w: 1050, h: 1400, alt: "Four women posing together in a studio" },
  { file: "gallery-26.jpg", w: 1050, h: 1400, alt: "Teacher with two young girls in lilac outfits in front of a marigold backdrop", showsChildren: true },
  { file: "gallery-27.jpg", w: 1142, h: 1388, alt: "A young girl and a woman in blue sarees with hands in namaste", showsChildren: true },
  { file: "gallery-28.jpg", w: 1024, h: 576, alt: "A large group in black and white outfits posing in front of the Lewisville Grand Theater banner", showsChildren: true },
  { file: "gallery-29.jpg", w: 1024, h: 768, alt: "Girls in yellow ruffled costumes posing together with their teacher, in a glass-walled lobby", showsChildren: true },
  { file: "gallery-30.jpg", w: 690, h: 1024, alt: "Children in traditional outfits posing outdoors", showsChildren: true },
  { file: "gallery-31.jpg", w: 768, h: 1024, alt: "Two dancers in red lehengas with arms outstretched", showsChildren: true },
  { file: "gallery-33.jpg", w: 768, h: 1024, alt: "Dancers in yellow and red Punjabi costumes in front of a floral wall", showsChildren: true },
  { file: "gallery-34.jpg", w: 1280, h: 960, alt: "Children in colourful costumes standing in a circle with their teachers", showsChildren: true },
  { file: "gallery-35.jpg", w: 1024, h: 682, alt: "Two women and a man posing in front of a pink floral backdrop" },
  { file: "gallery-36.jpg", w: 1050, h: 1400, alt: "Young dancers in teal costumes with a teacher", showsChildren: true },
  { file: "gallery-38.jpg", w: 929, h: 1400, alt: "A group of women sitting together on a wooden deck" },
  { file: "gallery-39.jpg", w: 768, h: 1024, alt: "Young dancers in teal and red costumes striking poses backstage by an exit sign", showsChildren: true },
  { file: "gallery-40.jpg", w: 768, h: 1024, alt: "Young dancers in teal and red costumes in a second backstage pose with their teacher", showsChildren: true },
  { file: "gallery-41.jpg", w: 768, h: 1024, alt: "Young dancers kneeling in front of wooden doors", showsChildren: true },
  { file: "gallery-42.jpg", w: 1050, h: 1400, alt: "A boy with a trophy and his teacher", showsChildren: true },
  { file: "gallery-43.jpg", w: 1050, h: 1400, alt: "Two young girls with their teacher in front of a marigold backdrop", showsChildren: true },
  { file: "gallery-44.jpg", w: 1400, h: 1050, alt: "Dancers in red lehengas posing in front of wooden doors", showsChildren: true },
  { file: "gallery-45.jpg", w: 646, h: 1400, alt: "A group of dancers in black costumes, winter session photo", showsChildren: true },
  { file: "gallery-47.jpg", w: 1320, h: 967, alt: "A group of adults in colourful outfits in front of a yellow backdrop" },
  { file: "gallery-48.jpg", w: 562, h: 1024, alt: "A smaller group posing under the Lewisville Grand Theater sign, one in a white sherwani" },
  { file: "gallery-49.jpg", w: 768, h: 1024, alt: "Three young girls in classical dance poses", showsChildren: true },
  { file: "gallery-50.jpg", w: 1024, h: 768, alt: "A group of young dancers in lilac and red outfits", showsChildren: true },
  { file: "gallery-51.jpg", w: 768, h: 1024, alt: "A girl and her dance teacher taking a selfie", showsChildren: true },
  { file: "gallery-53.jpg", w: 1050, h: 1400, alt: "Children holding trophies with their teacher", showsChildren: true },
  { file: "gallery-54.jpg", w: 1024, h: 768, alt: "Six women in dark outfits in front of wooden doors" },
  { file: "gallery-55.jpg", w: 768, h: 1024, alt: "A man and a woman in a saree posing together" },
  { file: "gallery-56.jpg", w: 1050, h: 1400, alt: "A teacher with three young students holding trophies", showsChildren: true },
  { file: "gallery-57.jpg", w: 768, h: 1024, alt: "Two young dancers in silver costumes striking poses", showsChildren: true },
  { file: "gallery-58.jpg", w: 1024, h: 768, alt: "Girls in yellow ruffled costumes in a second group pose, hands on hearts", showsChildren: true },
  { file: "gallery-59.jpg", w: 1050, h: 1400, alt: "Women seated around a dinner table" },
  { file: "gallery-60.jpg", w: 1024, h: 806, alt: "Young dancers in blue and red costumes posing together", showsChildren: true },
  { file: "gallery-61.jpg", w: 1024, h: 768, alt: "A teacher taking a selfie with young dancers in lilac outfits", showsChildren: true },
  { file: "extra-united-office.jpg", w: 1050, h: 1400, alt: "Toolieka with two colleagues in the lobby of a United Airlines office" },
  { file: "extra-toolieka-white.jpg", w: 500, h: 500, alt: "Toolieka in a white outfit, studio portrait against a soft green and lilac backdrop" },
  { file: "extra-silver-costumes.jpg", w: 620, h: 720, alt: "Young dancers in silver jackets and trousers posing in front of wooden studio doors", showsChildren: true },
  { file: "extra-cid-certificate.jpg", w: 300, h: 196, alt: "Toolieka Prakash Nikam's 2023 membership confirmation from the International Dance Council (CID)", section: "recognition" },
  { file: "screen-01.jpg", w: 350, h: 200, alt: "TV serial title card with three women; Toolieka is circled and labelled", section: "screen" },
  { file: "screen-02.jpg", w: 350, h: 200, alt: "TV studio set styled as a radio show, a woman speaking into a microphone beside a male host", section: "screen" },
  { file: "screen-03.jpg", w: 350, h: 200, alt: "Film scene in an ornate room lit by candles, with elders seated on cushions", section: "screen" },
  { file: "screen-04.jpg", w: 350, h: 200, alt: "Tamil film poster with a crowd of dancers; Toolieka is circled and labelled", section: "screen" },
  { file: "screen-05.jpg", w: 350, h: 200, alt: "Film close-up of Toolieka in a green and yellow dupatta, circled and labelled", section: "screen" },
  { file: "screen-06.jpg", w: 350, h: 200, alt: "Marathi film poster dated 26 February 2016; Toolieka is circled and labelled twice", section: "screen" },
  { file: "screen-a1.jpg", w: 350, h: 200, alt: "Stage dance number with dancers in white and red around a lead dancer in red", section: "screen" },
  { file: "screen-a2.jpg", w: 350, h: 200, alt: "Film song with dancers in red saris around a lead in a black sari", section: "screen" },
  { file: "screen-a3.jpg", w: 350, h: 200, alt: "Film street-dance scene, two men in bright shirts leading a colourful crowd", section: "screen" },
  { file: "screen-a4.jpg", w: 350, h: 200, alt: "Film song with dancers swirling red, green and yellow lehengas", section: "screen" },
  { file: "screen-a5.jpg", w: 350, h: 200, alt: "Film song with a lead in a black top and dancers in pink and white", section: "screen" },
  { file: "screen-a6.jpg", w: 350, h: 200, alt: "Film song with a man in a black shirt, a woman in a pink sari and dancers in bright saris", section: "screen" },
  { file: "screen-b1.jpg", w: 350, h: 200, alt: "Poster for the musical Bollywood: In a World of Music; Toolieka is circled and labelled", section: "screen" },
  { file: "screen-b2.jpg", w: 350, h: 200, alt: "Stage dance number with dancers in black and red under warm lights", section: "screen" },
  { file: "screen-b3.jpg", w: 350, h: 200, alt: "Film song at night under stadium lights, a couple dancing in casual clothes", section: "screen" },
  { file: "screen-b4.jpg", w: 350, h: 200, alt: "Stage show with a lead in a pale green outfit among dancers in purple and blue (Getty Images photo)", section: "screen" },
  { file: "screen-b5.jpg", w: 350, h: 200, alt: "Outdoor stage show, two men in bright shirts leading dancers in blue and pink", section: "screen" },
  { file: "screen-b6.jpg", w: 350, h: 200, alt: "Stage event with a man in a striped shirt and a woman in black among dancers", section: "screen" },
  { file: "screen-d1.jpg", w: 350, h: 200, alt: "Indian Culture Week stage in China, dancers performing to a seated audience", section: "screen" },
  { file: "screen-d2.jpg", w: 350, h: 200, alt: "TV stage show with a lead in silver and black among dancers in red and gold", section: "screen" },
  { file: "screen-d3.jpg", w: 350, h: 200, alt: "Stage performance with dancers in red, white and gold costumes (Getty Images photo)", section: "screen" },
  { file: "screen-d4.jpg", w: 350, h: 200, alt: "Stage dance with performers in yellow and red Rajasthani-style costumes", section: "screen" },
  { file: "screen-d5.jpg", w: 350, h: 200, alt: "TV award-show stage, a man in a grey jacket with dancers under neon light", section: "screen" },
  { file: "badge-cid.jpg", w: 1024, h: 915, alt: "Logo of the Conseil International de la Danse (International Dance Council, CID)", section: "recognition" },
  { file: "badge-cda.jpg", w: 500, h: 500, alt: "CDA lettering: the Cine Dancers Association of the Indian film industry", section: "recognition" },
  { file: "old-sangeet-stage.jpg", w: 1376, h: 768, alt: "A sangeet stage under chandeliers and flowers, women dancing in lehengas", section: "archive" },
  { file: "old-couple-stone-wall.jpg", w: 500, h: 500, alt: "A couple dancing by a stone wall, he in a grey coat and she in a white dress", section: "archive" },
  { file: "old-private-classes-banner.jpg", w: 1356, h: 555, alt: "Banner of a dance class in a studio with a yellow wall", section: "archive" },
  { file: "old-black-white-dancers.jpg", w: 1400, h: 788, alt: "Black and white photo of dancers mid-move in a studio", section: "archive" },
  { file: "old-birthday-party.jpg", w: 468, h: 390, alt: "Friends celebrating with confetti and party hats", section: "archive" },
  { file: "old-studio-jump.jpg", w: 500, h: 500, alt: "Dancers in a studio with a yellow wall, one man jumping", section: "archive" },
  { file: "old-studio-group.jpg", w: 500, h: 500, alt: "A group dancing in a studio under hexagon ceiling lights", section: "archive" },
  { file: "old-white-tshirt-formation.jpg", w: 468, h: 390, alt: "A group in white T-shirts dancing in formation against a pale wall", section: "archive" },
  { file: "old-window-studio.jpg", w: 500, h: 500, alt: "Dancers in black practising by tall studio windows", section: "archive" },
  { file: "old-living-room-couple.jpg", w: 468, h: 390, alt: "A couple dancing hand in hand in a living room", section: "archive" },
  { file: "old-indian-costume-tiles.jpg", w: 500, h: 500, alt: "A dancer in Indian costume posing against a patterned tile wall", section: "archive" },
  { file: "old-hip-hop-blue.jpg", w: 500, h: 500, alt: "A hip-hop dancer in a cap and jersey against a blue backdrop", section: "archive" },
  { file: "old-neon-pair.jpg", w: 500, h: 500, alt: "Two dancers in streetwear under pink and blue neon light", section: "archive" },
  { file: "old-breakdance.jpg", w: 500, h: 500, alt: "A breakdancer in a one-handed freeze against a lilac backdrop", section: "archive" },
  { file: "old-red-dress-kick.jpg", w: 500, h: 500, alt: "A dancer in a flowing red dress mid-kick on a dark background", section: "archive" },
  { file: "old-hip-hop-studio.jpg", w: 500, h: 500, alt: "A hip-hop class in a studio, a woman in a white top at the front", section: "archive" },
  { file: "old-faded-group.jpg", w: 1400, h: 656, alt: "A faded, softly blurred group of dancers", section: "archive" },
  { file: "old-indo-fusion-stage.jpg", w: 500, h: 500, alt: "A stage group in black with yellow and green sashes, arms raised", section: "archive" },
  { file: "old-private-lesson.jpg", w: 500, h: 500, alt: "A teacher and a young student in black practising by a white wall", section: "archive" },
  { file: "old-ballet-barre.jpg", w: 468, h: 390, alt: "Two ballet dancers stretching at a barre in a sunlit studio", section: "archive" },
  { file: "old-red-black-lehenga.jpg", w: 468, h: 390, alt: "A dancer in a red and black lehenga posing in a white room", section: "archive" },
  { file: "old-studio-windows-group.jpg", w: 468, h: 390, alt: "A group of dancers in black by large windows over a city", section: "archive" },
  { file: "old-red-lehenga-screen.jpg", w: 500, h: 500, alt: "A dancer in a red lehenga in front of a carved wooden screen", section: "archive" },
  { file: "old-suits-in-snow.jpg", w: 500, h: 500, alt: "Young men in suits and scarves posing playfully in the snow", section: "archive" },
  { file: "old-bharatanatyam-pose.jpg", w: 500, h: 500, alt: "A Bharatanatyam dancer in green and red holding a classical pose", section: "archive" },
  { file: "old-smiling-portrait.jpg", w: 500, h: 447, alt: "A smiling woman in a black top against a white background", section: "archive" },
];
