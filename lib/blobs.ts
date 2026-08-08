/**
 * Predefined organic blob silhouettes. Swapping `d` on a path is cheap;
 * generating geometry at runtime (or morphing) would cost more for no gain.
 */
const OPTION_BLOB_PATHS = [
  // 0 — top dips mid, right bulges
  [
    "M20 16",
    "C34 8 42 20 55 12C68 6 76 14 82 16",
    "C92 24 90 38 94 52C96 66 90 78 84 86",
    "C74 96 58 90 46 94C34 98 24 90 18 86",
    "C10 76 12 60 8 48C6 34 12 22 20 16",
    "Z",
  ].join(""),
  // 1 — flatter top-left, left bows out
  [
    "M18 20",
    "C32 10 48 8 62 10C74 12 84 18 86 24",
    "C94 36 88 48 92 60C94 74 86 86 74 90",
    "C60 96 46 92 34 94C22 96 12 86 12 74",
    "C8 60 4 46 10 34C14 26 12 24 18 20",
    "Z",
  ].join(""),
  // 2 — top rises right, left mid-bulge
  [
    "M22 14",
    "C38 10 50 6 64 8C76 10 86 16 88 22",
    "C96 34 94 48 90 62C88 76 78 88 66 90",
    "C52 96 40 90 28 92C18 90 10 80 10 68",
    "C6 54 4 40 12 28C16 20 14 16 22 14",
    "Z",
  ].join(""),
  // 3 — slightly cocked
  [
    "M16 22",
    "C28 12 40 16 54 10C66 6 78 14 82 18",
    "C92 28 96 42 94 56C96 70 88 84 76 90",
    "C64 96 50 92 38 94C26 96 14 88 12 76",
    "C8 62 4 48 10 36C12 28 10 26 16 22",
    "Z",
  ].join(""),
  // 4 — softer even silhouette
  [
    "M18 18",
    "C34 12 48 10 64 12C76 14 84 20 86 26",
    "C92 38 90 50 90 62C90 76 82 88 70 90",
    "C56 94 42 92 30 90C20 88 12 80 12 68",
    "C10 54 8 42 12 32C14 24 12 22 18 18",
    "Z",
  ].join(""),
  // 5 — soft top dip, mild bottom wave
  [
    "M20 16",
    "C36 10 44 16 58 12C70 10 78 14 82 18",
    "C90 28 92 40 92 54C92 68 88 80 80 86",
    "C70 94 56 92 44 92C32 94 22 88 18 82",
    "C12 72 10 58 10 46C10 32 14 22 20 16",
    "Z",
  ].join(""),
  // 6 — soft rise on top-right
  [
    "M20 14",
    "C38 12 50 8 66 12C78 14 86 20 88 26",
    "C94 38 92 52 90 64C88 78 78 88 66 90",
    "C52 94 40 90 28 90C18 88 12 78 12 66",
    "C10 52 8 40 14 28C16 20 14 16 20 14",
    "Z",
  ].join(""),
  // 7 — gentle cock, soft right high point
  [
    "M18 20",
    "C32 14 42 14 56 12C70 10 80 16 84 20",
    "C92 30 94 44 92 58C92 72 84 86 72 90",
    "C58 94 46 92 34 92C24 92 14 84 14 72",
    "C12 58 8 46 12 36C14 28 12 24 18 20",
    "Z",
  ].join(""),
] as const;

export const BLOB_EDGE = "color-mix(in srgb, var(--fg) 12%, transparent)";

/** Tiny deterministic PRNG so blob picks are stable across re-renders. */
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/** Unique blob paths for this round — reshuffles when `roundNumber` changes. */
export function blobPathsForRound(roundNumber: number, count: number): string[] {
  const order = OPTION_BLOB_PATHS.map((_, i) => i);
  const rand = mulberry32(roundNumber * 0x9e3779b9 + 1);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = order[i]!;
    order[i] = order[j]!;
    order[j] = tmp;
  }
  return order.slice(0, count).map((i) => OPTION_BLOB_PATHS[i]!);
}
