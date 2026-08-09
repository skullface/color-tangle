import type { Color } from "./colors";

export type Answer = {
  picked: Color;
  correct: boolean;
};

const MAX_CORRECT = 10;

export function clampCorrect(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(MAX_CORRECT, Math.max(0, Math.trunc(value)));
}

export function parseCorrectParam(value: string | null | undefined): number {
  return clampCorrect(Number.parseInt(value ?? "0", 10));
}

export function buildSharePath(correct: number): string {
  return `/s?correct=${clampCorrect(correct)}`;
}

export function buildStoryPath(correct: number): string {
  return `/s/story?correct=${clampCorrect(correct)}`;
}

export function buildShareText(url: string): string {
  return `🕶️ ${url}`;
}
