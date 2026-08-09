import type { Color } from "./colors";

export type Answer = {
  picked: Color;
  correct: boolean;
};

export function buildSharePath(correct: number): string {
  return `/s?correct=${correct}`;
}

export function buildStoryPath(correct: number): string {
  return `/s/story?correct=${correct}`;
}

export function buildShareText(url: string): string {
  return `ｒｉｄｅ　ｔｈｅ　Ｃｏｌｏｒ　Ｔａｎｇｌｅ　🕶️ ${url}`;
}
