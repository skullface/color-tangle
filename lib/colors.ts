export type Color = {
  name: string;
  hex: string;
  description: string;
  etymology: string;
  source?: string;
};

export const DEFAULT_COLORS: Color[] = [
  {
    name: "Glaucous",
    hex: "#6082B6",
    description: "Dusty blue-gray or blue-green shade",
    etymology:
      "From Greek “glaukos”, meaning gleaming, gray, or blue-green. Often loosely linked to “glaux” (owl), via Athena’s epithet “glaukōpis” (gray-eyed/owl-eyed).",
    source: "https://www.etymonline.com/word/glaucous",
  },
  {
    name: "Eburnean",
    hex: "#FFFFEE",
    description: "Ivory-white or creamy off-white shade",
    etymology:
      "From Latin “eburneus”, meaning “made of ivory”, from “ebur” for “ivory’.",
    source: "https://en.wiktionary.org/wiki/eburnean",
  },
  {
    name: "Smaragdine",
    hex: "#50C878",
    description: "Vivid emerald green",
    etymology:
      "From Greek “smaragdos” and Latin “smaragdus”, meaning “emerald’.",
    source: "https://en.wiktionary.org/wiki/smaragdine",
  },
  {
    name: "Fulvous",
    hex: "#E48400",
    description: "Tawny yellow-brown or orangish-brown color",
    etymology: "From Latin “fulvus”: a bright brown, orange, or golden color used in elevated poetry.",
    source: "https://en.wiktionary.org/wiki/fulvus",
  },
  {
    name: "Puce",
    hex: "#CC8899",
    description: "Dusty dark pink with brownish-purple undertones",
    etymology:
      "From French “puce”, meaning “flea” — supposedly the color of a flea or flea stain.",
    source: "https://www.etymonline.com/word/puce",
  },
  {
    name: "Sinopia",
    hex: "#CB410B",
    description: "Reddish earth-orange pigment",
    etymology:
      "Named after Sinop, an ancient Black Sea city known for red ochre pigments.",
    source: "https://en.wikipedia.org/wiki/Sinopia",
  },
  {
    name: "Mindaro",
    hex: "#E3F988",
    description: "Pale yellow-green shade",
    etymology: "A modern color name with unclear origin. Someone might have made it up and put it on Wikipedia.",
    source: "https://en.wikipedia.org/wiki/Chartreuse_(color)#Mindaro",
  },
  {
    name: "Grullo",
    hex: "#A99A86",
    description: "Smoky gray-brown, often associated with horse coats",
    etymology:
      "From Spanish “grullo”, derived from the common crane (’grulla’).",
    source: "https://en.wiktionary.org/wiki/grullo",
  },
  {
    name: "Zomp",
    hex: "#39A78E",
    description: "Medium teal-green color",
    etymology: "Modern color name with unclear origin, but the Internet likes it because it’s weird.",
    source: "https://knowyourmeme.com/memes/zomp",
  },
  {
    name: "Xanthic",
    hex: "#EEED09",
    description: "Bright yellow or golden-yellow shade",
    etymology: "From Greek “xanthos”, meaning yellow or golden.",
  },
  {
    name: "Zaffre",
    hex: "#0014A8",
    description: "Deep, intense cobalt blue",
    etymology:
      "Cobalt oxide pigment, from the Italian “zaffera”, meaning “sapphire”.",
    source: "https://en.wikipedia.org/wiki/Zaffre",
  },
  {
    name: "Smalt",
    hex: "#0014A8",
    description: "Vibrant, deep powder-blue",
    etymology:
      "Ground blue potassium glass, borrowed from the Proto-Germanic word for smelting.",
    source: "https://www.webexhibits.org/pigments/indiv/overview/smalt.html",
  },
  {
    name: "Caput mortuum",
    hex: "#592720",
    description: "Dark, dead reddish-brown or purplish-brown",
    etymology:
      "Latin for “dead head”, likely derived from the same alchemical term for the residue left after a reaction.",
    source: "https://en.wikipedia.org/wiki/Caput_mortuum_(pigment)",
  },
  {
    name: "Wenge",
    hex: "#645452",
    description: "Dark brown with muted grayish or purplish tones",
    etymology: "Named after wenge wood from the Congolese rosewood tree.",
    source: "https://en.wiktionary.org/wiki/wenge",
  },
  {
    name: "Falu",
    hex: "#801818",
    description: "Deep rustic red",
    etymology:
      "From Falun, Sweden, source of the pigment used in traditional Falu red paint.",
    source: "https://en.wikipedia.org/wiki/Falun_red",
    },
  {
    name: "Aureolin",
    hex: "#FDEE00",
    description: "Bright golden yellow",
    etymology: "From Latin “aureolus”, meaning golden.",
    source: "https://en.wiktionary.org/wiki/aureolin",
  },
  {
    name: "Coquelicot",
    hex: "#FF3800",
    description: "Vivid poppy red-orange",
    etymology:
      "French for the corn poppy (Papaver rhoeas), evoking a rooster’s (“coq”) comb.",
    source: "https://en.wikipedia.org/wiki/Coquelicot",
  },
  {
    name: "Heliotrope",
    hex: "#DF73FF",
    description: "Pinkish purple or floral violet shade",
    etymology:
      "Named after the heliotrope flower, whose petals turn (Greek, “tropos”) to face and follow the sun (Greek, “helios”).",
    source: "https://en.wikipedia.org/wiki/Heliotrope",
  },
  {
    name: "Gamboge",
    hex: "#E49B0F",
    description: "Rich saffron-yellow to yellow-orange",
    etymology:
      "From Gamboge, an old name for Cambodia, source of the resin pigment.",
    source: "https://en.wikipedia.org/wiki/Gamboge",
  },
  {
    name: "Cinereous",
    hex: "#98817B",
    description: "Ash-gray with brownish warmth",
    etymology: "From Latin “cinereus” for ashen.",
    source: "https://en.wiktionary.org/wiki/cinereous",
  },
  {
    name: "Feldgrau",
    hex: "#4D5D53",
    description: "Muted gray-green military shade",
    etymology: "German for “field gray”, as the German military uniforms in the early 20th century.",
    source: "https://en.wiktionary.org/wiki/feldgrau",
  },
  {
    name: "Byzantium",
    hex: "#702963",
    description: "Rich imperial purple with magenta undertones",
    etymology:
      "Named for Byzantium, associated with Byzantine luxury and imperial purple.",
    source: "https://en.wikipedia.org/wiki/Byzantium",
  },
  {
    name: "Bole",
    hex: "#79443B",
    description: "Earthy reddish-brown clay color",
    etymology:
      "From Latin “bolus”, from Greek “bolos”, meaning a clod or lump of earth.",
    source: "https://en.wiktionary.org/wiki/bole#Etymology_2",
  },
  {
    name: "Kobicha",
    hex: "#6B4423",
    description: "Deep tea-brown shade",
    etymology:
      "The color of Japanese “aphrodisiac tea”-dyed fabric. Originally called kelp tea (昆布茶), it was later renamed to “kobi” (媚, charm/coquetry) and “cha” (茶, tea).",
    source: "https://ja.wikipedia.org/wiki/%E5%AA%9A%E8%8C%B6",
  },
  {
    name: "Rufous",
    hex: "#A81C07",
    description: "Reddish-brown, rusty red",
    etymology: "From Latin “rufus”, meaning red or red-haired.",
    source: "https://en.wiktionary.org/wiki/rufus",
  },
  {
    name: "Phlox",
    hex: "#DF00FF",
    description: "Intense magenta-purple",
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
      "Named after the jonquil flower, from Spanish “junquillo”, meaning “little rush’.",
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

export function pickRoundColors(colors: Color[], count: number): Color[] {
  return shuffle(colors).slice(0, Math.min(count, colors.length));
}

export function buildOptions(correct: Color, pool: Color[]): Color[] {
  const distractors = shuffle(pool.filter((c) => c.name !== correct.name)).slice(
    0,
    3,
  );
  return shuffle([correct, ...distractors]);
}

/** Light swatches need a visible border against white backgrounds. */
export function swatchBorder(hex: string): string {
  const normalized = hex.replace("#", "").toLowerCase();
  if (normalized === "ffffff" || normalized === "ffff00") {
    return "1px solid #ccc";
  }
  return "1px solid transparent";
}
