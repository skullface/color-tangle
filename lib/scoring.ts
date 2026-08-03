export const BASE_POINTS = 100;
export const MAX_SPEED_BONUS = 50;

export function scoreRound(
  correct: boolean,
  remainingMs: number,
  roundMs: number,
): number {
  if (!correct) {
    return 0;
  }
  const speedBonus = Math.round(MAX_SPEED_BONUS * (remainingMs / roundMs));
  return BASE_POINTS + speedBonus;
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
