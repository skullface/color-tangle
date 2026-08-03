import { get } from "@vercel/global-config";

import { DEFAULT_COLORS, type Color } from "./colors";

export type GameConfig = {
  colors: Color[];
  rounds: number;
};

const DEFAULTS: GameConfig = {
  colors: DEFAULT_COLORS,
  rounds: 10,
};

function isColor(value: unknown): value is Color {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "hex" in value &&
    typeof value.name === "string" &&
    typeof value.hex === "string"
  );
}

function parseColors(value: unknown): Color[] | undefined {
  if (!Array.isArray(value) || value.length === 0) {
    return undefined;
  }
  if (!value.every(isColor)) {
    return undefined;
  }
  return value;
}

export async function getGameConfig(): Promise<GameConfig> {
  if (!process.env.GLOBAL_CONFIG && !process.env.EDGE_CONFIG) {
    return DEFAULTS;
  }

  try {
    const [colors, rounds] = await Promise.all([
      get<unknown>("colors"),
      get<number>("rounds"),
    ]);

    return {
      colors: parseColors(colors) ?? DEFAULTS.colors,
      rounds:
        typeof rounds === "number" && rounds > 0 ? rounds : DEFAULTS.rounds,
    };
  } catch {
    return DEFAULTS;
  }
}
