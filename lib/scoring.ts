export const BASE_POINTS = 100;

export function scoreRound(correct: boolean): number {
  return correct ? BASE_POINTS : 0;
}

export function buildSharePath(score: number, correct: number): string {
  return `/s?score=${score}&correct=${correct}`;
}

export function buildShareText(
  score: number,
  correct: number,
  total: number,
  url: string,
): string {
  return `I scored ${score} in Color Tangle (${correct}/${total})! Can you beat me?\n${url}`;
}
