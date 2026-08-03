"use client";

type Props = {
  score: number;
  correct: number;
  total: number;
  onReplay: () => void;
};

export function Results({ score, correct, total, onReplay }: Props) {
  return (
    <section>
      <h1>Done!</h1>
      <p>Score: {score}</p>
      <p>
        {correct}/{total} correct
      </p>
      <button type="button" onClick={onReplay}>
        Play again
      </button>
    </section>
  );
}
