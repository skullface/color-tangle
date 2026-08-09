import type { Color } from "./colors";

export const BASE_POINTS = 100;

export type Answer = {
  picked: Color;
  correct: boolean;
  points: number;
};

export function scoreRound(correct: boolean): number {
  return correct ? BASE_POINTS : 0;
}

export function buildSharePath(score: number, correct: number): string {
  return `/s?score=${score}&correct=${correct}`;
}

export function buildStoryPath(score: number, correct: number): string {
  return `/s/story?score=${score}&correct=${correct}`;
}

export function buildShareText(
  score: number,
  correct: number,
  total: number,
  url: string,
): string {
  return `ｒｉｄｅ　ｔｈｅ　Ｃｏｌｏｒ　Ｔａｎｇｌｅ　🕶️ ${url}`;
}
