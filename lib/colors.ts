export type Color = {
  name: string;
  hex: string;
  description: string;
  etymology: string;
  source: string;
};

export const DEFAULT_COLORS: Color[] = [
  {
    name: "Glaucous",
    hex: "#6082B6",
    description: "Dusty blue-green",
    etymology:
      "From Greek “glaukos”, meaning gleaming, gray, or blue-green. Often loosely linked to “glaux” (owl) via Athena’s nickname “glaukōpis” (gray-eyed/owl-eyed).",
    source: "https://www.etymonline.com/word/glaucous",
  },
  {
    name: "Eburnean",
    hex: "#FFFFEE",
    description: "Creamy off-white",
    etymology:
      "From Latin “eburneus”: “made of ivory.”",
    source: "https://en.wiktionary.org/wiki/eburnean",
  },
  {
    name: "Smaragdine",
    hex: "#50C878",
    description: "Vivid emerald green",
    etymology:
      "From Greek “smaragdos” and Latin “smaragdus” meaning emerald.",
    source: "https://en.wiktionary.org/wiki/smaragdine",
  },
  {
    name: "Fulvous",
    hex: "#E48400",
    description: "Tawny yellow brown",
    etymology: "From Latin “fulvus”: a bright brown, orange, or golden color. Used in elevated poetry.",
    source: "https://en.wiktionary.org/wiki/fulvus",
  },
  {
    name: "Puce",
    hex: "#CC8899",
    description: "Dusty, dark pink",
    etymology:
      "From French “puce,” meaning “flea,” as the color of a flea stain.",
    source: "https://www.etymonline.com/word/puce",
  },
  {
    name: "Sinopia",
    hex: "#CB410B",
    description: "Reddish earth orange",
    etymology:
      "Named after Sinop, an ancient Black Sea city known for red ochre pigments.",
    source: "https://en.wikipedia.org/wiki/Sinopia",
  },
  {
    name: "Mindaro",
    hex: "#E3F988",
    description: "Pale yellow-green",
    etymology: "Honestly, someone probably made this color name up and put it on Wikipedia.",
    source: "https://en.wikipedia.org/wiki/Chartreuse_(color)#Mindaro",
  },
  {
    name: "Grullo",
    hex: "#A99A86",
    description: "Smoky gray brown",
    etymology:
      "From Spanish “grullo,” derived from the common crane.",
    source: "https://en.wiktionary.org/wiki/grullo",
  },
  {
    name: "Zomp",
    hex: "#39A78E",
    description: "Medium teal",
    etymology: "Modern color name with unclear origin, but the Internet likes it because it’s weird.",
    source: "https://knowyourmeme.com/memes/zomp",
  },
  {
    name: "Xanthic",
    hex: "#EEED09",
    description: "Bright yellow",
    etymology: "From Ancient Greek “xanthos” meaning yellow.",
    source: "https://en.wiktionary.org/wiki/xanthic",
  },
  {
    name: "Zaffre",
    hex: "#0014A8",
    description: "Deep, intense cobalt blue",
    etymology:
      "Cobalt oxide pigment, from the Italian “zaffera” meaning sapphire.",
    source: "https://en.wikipedia.org/wiki/Zaffre",
  },
  {
    name: "Smalt",
    hex: "#0014A8",
    description: "Vibrant, deep powder blue",
    etymology:
      "Pigment added to glass, borrowed from the Proto-Germanic word for smelting.",
    source: "https://www.webexhibits.org/pigments/indiv/overview/smalt.html",
  },
  {
    name: "Caput mortuum",
    hex: "#592720",
    description: "Dark, dead, red-purple brown",
    etymology:
      "Latin for “dead head,” likely derived from the same alchemical term for the residue left after a reaction.",
    source: "https://en.wikipedia.org/wiki/Caput_mortuum_(pigment)",
  },
  {
    name: "Wenge",
    hex: "#645452",
    description: "Dark brown with muted cool tones",
    etymology: "Named after wenge wood from the Congolese rosewood tree.",
    source: "https://en.wiktionary.org/wiki/wenge",
  },
  {
    name: "Falu",
    hex: "#801818",
    description: "Deep rustic red",
    etymology:
      "From Falun, Sweden, the source of the pigment used in traditional Falu red paint.",
    source: "https://en.wikipedia.org/wiki/Falun_red",
    },
  {
    name: "Aureolin",
    hex: "#FDEE00",
    description: "Bright golden yellow",
    etymology: "From Latin “aureolus,” meaning golden.",
    source: "https://en.wiktionary.org/wiki/aureolin",
  },
  {
    name: "Coquelicot",
    hex: "#FF3800",
    description: "Vivid red orange",
    etymology:
      "French for the corn poppy flower, evoking a rooster’s (“coq”) comb.",
    source: "https://en.wikipedia.org/wiki/Coquelicot",
  },
  {
    name: "Heliotrope",
    hex: "#DF73FF",
    description: "Pinkish purple",
    etymology:
      "Named after the heliotrope flower (Greek), whose petals turn (“tropos”) to face and the sun (“helios”).",
    source: "https://en.wikipedia.org/wiki/Heliotrope",
  },
  {
    name: "Gamboge",
    hex: "#E49B0F",
    description: "Rich, saffron yellow",
    etymology:
      "From an old name for Cambodia, the source of the resin pigment.",
    source: "https://en.wikipedia.org/wiki/Gamboge",
  },
  {
    name: "Cinereous",
    hex: "#98817B",
    description: "Warm ash gray",
    etymology: "From Latin “cinereus” meaning ashen.",
    source: "https://en.wiktionary.org/wiki/cinereous",
  },
  {
    name: "Feldgrau",
    hex: "#4D5D53",
    description: "Muted, gray-green",
    etymology: "German for “field gray,” as used in German military uniforms in the early 20th century.",
    source: "https://en.wiktionary.org/wiki/feldgrau",
  },
  {
    name: "Byzantium",
    hex: "#702963",
    description: "Rich, imperial purple",
    etymology:
      "Named after the city. Associated with luxury and royalty.",
    source: "https://en.wikipedia.org/wiki/Byzantium",
  },
  {
    name: "Bole",
    hex: "#79443B",
    description: "Earthen clay reddish-brown",
    etymology:
      "From Latin “bolus,” from Greek “bolos,” meaning a clod or lump of earth.",
    source: "https://en.wiktionary.org/wiki/bole#Etymology_2",
  },
  {
    name: "Kobicha",
    hex: "#6B4423",
    description: "Deep, tea brown",
    etymology:
      "The color of Japanese “aphrodisiac tea”-dyed fabric, from “kobi” (媚 charm/coquetry) and “cha” (茶 tea).",
    source: "https://ja.wikipedia.org/wiki/%E5%AA%9A%E8%8C%B6",
  },
  {
    name: "Rufous",
    hex: "#A81C07",
    description: "Rusty, reddish brown",
    etymology: "From Latin “rufus,” meaning red.",
    source: "https://en.wiktionary.org/wiki/rufus",
  },
  {
    name: "Phlox",
    hex: "#DF00FF",
    description: "Intense magenta purple",
    etymology: "Named after the phlox flower genius; from Greek “phlox” meaning flame.",
    source: "https://en.wikipedia.org/wiki/Phlox",
  },
  {
    name: "Cordovan",
    hex: "#893F45",
    description: "Rich, dark burgundy",
    etymology: "From Córdoba, Spain, famous for cordovan leather.",
    source: "https://en.wikipedia.org/wiki/Cordovan",
  },
  {
    name: "Jonquil",
    hex: "#F4CA16",
    description: "Warm, flower-like yellow",
    etymology:
      "Named after the jonquil flower, from Spanish “junquillo” meaning “little rush.”",
    source: "https://en.wikipedia.org/wiki/Shades_of_yellow#Jonquil",
  },
];

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace("#", "").toLowerCase();
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

function srgbToLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** CIE L*a*b* via D65 XYZ — used for perceptual distance. */
function hexToLab(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex).map(srgbToLinear);
  const x = (r * 0.4124564 + g * 0.3575761 + b * 0.1804375) / 0.95047;
  const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
  const z = (r * 0.0193339 + g * 0.119192 + b * 0.9503041) / 1.08883;

  const f = (t: number) =>
    t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;

  const fx = f(x);
  const fy = f(y);
  const fz = f(z);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

/** CIE76 ΔE — higher means more visually distinct. */
export function colorDistance(a: string, b: string): number {
  const [l1, a1, b1] = hexToLab(a);
  const [l2, a2, b2] = hexToLab(b);
  return Math.hypot(l1 - l2, a1 - a2, b1 - b2);
}

/** Minimum ΔE between any two options (~just-noticeable is ~2). */
const MIN_OPTION_DELTA_E = 28;
const DISTRACTOR_COUNT = 3;

export function pickRoundColors(colors: Color[], count: number): Color[] {
  return shuffle(colors).slice(0, Math.min(count, colors.length));
}

function isDistinctFrom(hex: string, others: Color[], minDeltaE: number): boolean {
  return others.every((c) => colorDistance(hex, c.hex) >= minDeltaE);
}

function pickDistractors(
  candidates: Color[],
  selected: Color[],
  minDeltaE: number,
  count: number,
): Color[] {
  const picks: Color[] = [];
  for (const candidate of candidates) {
    if (picks.length >= count) break;
    if (isDistinctFrom(candidate.hex, [...selected, ...picks], minDeltaE)) {
      picks.push(candidate);
    }
  }
  return picks;
}

export function buildOptions(correct: Color, pool: Color[]): Color[] {
  const candidates = shuffle(
    pool.filter((c) => c.name !== correct.name),
  );

  // Prefer options that are mutually distinct; relax if the pool is thin.
  let distractors = pickDistractors(
    candidates,
    [correct],
    MIN_OPTION_DELTA_E,
    DISTRACTOR_COUNT,
  );
  if (distractors.length < DISTRACTOR_COUNT) {
    const remaining = candidates.filter(
      (c) => !distractors.some((d) => d.name === c.name),
    );
    distractors = [
      ...distractors,
      ...pickDistractors(remaining, [correct, ...distractors], 0, DISTRACTOR_COUNT - distractors.length),
    ];
  }

  return shuffle([correct, ...distractors]);
}

/** Near-white/near-black swatches need a border so they read on both themes. */
export function swatchBorder(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  const luminance =
    0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
  if (luminance > 0.9 || luminance < 0.08) {
    return "inset 0 0 0 1px rgba(0, 0, 0, 0.1)";
  }
  return "inset 0 0 0 1px rgba(0, 0, 0, 0.1)";
}
