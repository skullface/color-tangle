"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { buildOptions, swatchBorder, type Color } from "@/lib/colors";
import { scoreRound } from "@/lib/scoring";

const FEEDBACK_MS = 600;

type RoundResult = {
  correct: boolean;
  points: number;
};

type Props = {
  target: Color;
  pool: Color[];
  roundMs: number;
  roundNumber: number;
  totalRounds: number;
  onComplete: (result: RoundResult) => void;
};

export function Round({
  target,
  pool,
  roundMs,
  roundNumber,
  totalRounds,
  onComplete,
}: Props) {
  const [options] = useState(() => buildOptions(target, pool));
  const [remainingMs, setRemainingMs] = useState(roundMs);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [locked, setLocked] = useState(false);
  const completedRef = useRef(false);

  const finish = useCallback(
    (correct: boolean, remaining: number) => {
      if (completedRef.current) {
        return;
      }
      completedRef.current = true;
      setLocked(true);
      setFeedback(correct ? "correct" : "wrong");
      const points = scoreRound(correct, remaining, roundMs);
      setTimeout(() => onComplete({ correct, points }), FEEDBACK_MS);
    },
    [onComplete, roundMs],
  );

  useEffect(() => {
    if (locked) {
      return;
    }

    const start = performance.now();
    const id = setInterval(() => {
      const elapsed = performance.now() - start;
      const remaining = Math.max(0, roundMs - elapsed);
      setRemainingMs(remaining);
      if (remaining <= 0) {
        clearInterval(id);
        finish(false, 0);
      }
    }, 50);

    return () => clearInterval(id);
  }, [target, roundMs, locked, finish]);

  function handlePick(picked: Color) {
    if (locked) {
      return;
    }
    finish(picked.name === target.name, remainingMs);
  }

  return (
    <section>
      <p>
        Round {roundNumber} of {totalRounds}
      </p>
      <p>
        Pick: <strong>{target.name}</strong>
      </p>
      <progress max={roundMs} value={remainingMs} />
      {feedback === "correct" && <p>Correct!</p>}
      {feedback === "wrong" && <p>Miss</p>}
      <div role="group" aria-label="Color options">
        {options.map((color) => (
          <button
            key={color.name}
            type="button"
            disabled={locked}
            aria-label={color.name}
            onClick={() => handlePick(color)}
            style={{
              backgroundColor: color.hex,
              border: swatchBorder(color.hex),
              width: 80,
              height: 80,
            }}
          />
        ))}
      </div>
    </section>
  );
}
