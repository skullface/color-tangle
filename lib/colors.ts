export type Color = {
  name: string;
  hex: string;
};

export const DEFAULT_COLORS: Color[] = [
  { name: "Red", hex: "#FF0000" },
  { name: "Blue", hex: "#0000FF" },
  { name: "Green", hex: "#008000" },
  { name: "Yellow", hex: "#FFFF00" },
  { name: "Orange", hex: "#FFA500" },
  { name: "Purple", hex: "#800080" },
  { name: "Pink", hex: "#FFC0CB" },
  { name: "Brown", hex: "#A52A2A" },
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Gray", hex: "#808080" },
  { name: "Cyan", hex: "#00FFFF" },
  { name: "Magenta", hex: "#FF00FF" },
  { name: "Lime", hex: "#00FF00" },
  { name: "Navy", hex: "#000080" },
  { name: "Teal", hex: "#008080" },
  { name: "Maroon", hex: "#800000" },
  { name: "Olive", hex: "#808000" },
  { name: "Coral", hex: "#FF7F50" },
  { name: "Gold", hex: "#FFD700" },
  { name: "Indigo", hex: "#4B0082" },
  { name: "Crimson", hex: "#DC143C" },
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
