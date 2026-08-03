"use client";

import { useRef, useState } from "react";

import { buildOptions, swatchBorder, type Color } from "@/lib/colors";
import { scoreRound } from "@/lib/scoring";

type RoundResult = {
  correct: boolean;
  points: number;
};

type Props = {
  target: Color;
  pool: Color[];
  roundNumber: number;
  totalRounds: number;
  onComplete: (result: RoundResult) => void;
};

export function Round({
  target,
  pool,
  roundNumber,
  totalRounds,
  onComplete,
}: Props) {
  const [options] = useState(() => buildOptions(target, pool));
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [locked, setLocked] = useState(false);
  const [picked, setPicked] = useState<Color | null>(null);
  const completedRef = useRef(false);
  const pendingResultRef = useRef<RoundResult | null>(null);

  function advance() {
    const result = pendingResultRef.current;
    if (!result) {
      return;
    }
    pendingResultRef.current = null;
    onComplete(result);
  }

  function finish(correct: boolean, selection: Color | null) {
    if (completedRef.current) {
      return;
    }
    completedRef.current = true;
    setLocked(true);
    setPicked(selection);
    setFeedback(correct ? "correct" : "wrong");
    pendingResultRef.current = { correct, points: scoreRound(correct) };
  }

  function handlePick(selection: Color) {
    if (locked) {
      return;
    }
    finish(selection.name === target.name, selection);
  }

  const showingFeedback = feedback !== "idle";

  function optionBorder(color: Color): string {
    if (!showingFeedback) {
      return swatchBorder(color.hex);
    }
    const isPicked = picked?.name === color.name;
    const isCorrect = color.name === target.name;
    if (isPicked && isCorrect) {
      return "3px solid #1a7f37";
    }
    if (isPicked) {
      return "3px solid #cf222e";
    }
    if (isCorrect && feedback === "wrong") {
      return "3px solid #1a7f37";
    }
    return swatchBorder(color.hex);
  }

  return (
    <section>
      <p>
        Round {roundNumber} of {totalRounds}
      </p>
      <p>
        Pick: <strong>{target.name}</strong>
      </p>
      {feedback === "correct" && <p>Correct!</p>}
      {feedback === "wrong" && <p>Miss</p>}
      {showingFeedback && (
        <div>
          <p>{target.description}</p>
          <p>{target.etymology}</p>
          {target.source && (
            <p>
              <a href={target.source} target="_blank" rel="noopener noreferrer">
                Source
              </a>
            </p>
          )}
          <button type="button" onClick={advance}>
            Next
          </button>
        </div>
      )}
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
              border: optionBorder(color),
              width: 80,
              height: 80,
            }}
          />
        ))}
      </div>
    </section>
  );
}
