"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";

import { pickRoundColors } from "@/lib/colors";
import type { GameConfig } from "@/lib/config";

import { Results } from "./Results";
import { Round } from "./Round";

type Phase = "start" | "playing" | "results";

type RoundResult = {
  correct: boolean;
  points: number;
};

export function Game({ config }: { config: GameConfig }) {
  const [phase, setPhase] = useState<Phase>("start");
  const [roundColors, setRoundColors] = useState<
    ReturnType<typeof pickRoundColors>
  >([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  function start() {
    track("quiz_start");
    setRoundColors(pickRoundColors(config.colors, config.rounds));
    setRoundIndex(0);
    setScore(0);
    setCorrectCount(0);
    setPhase("playing");
  }

  function handleRoundComplete(result: RoundResult) {
    setScore((current) => current + result.points);
    if (result.correct) {
      setCorrectCount((current) => current + 1);
    }

    const nextIndex = roundIndex + 1;
    if (nextIndex >= roundColors.length) {
      track("quiz_complete", {
        score: score + result.points,
        correct: correctCount + (result.correct ? 1 : 0),
      });
      setPhase("results");
      return;
    }
    setRoundIndex(nextIndex);
  }

  if (phase === "start") {
    return (
      <section>
        <h1>Color Tangle</h1>
        <p>
          Match the color name to the swatch. {config.rounds} rounds,{" "}
          {config.roundMs / 1000}s each.
        </p>
        <button type="button" onClick={start}>
          Start
        </button>
      </section>
    );
  }

  if (phase === "results") {
    return (
      <Results
        score={score}
        correct={correctCount}
        total={config.rounds}
        onReplay={start}
      />
    );
  }

  const target = roundColors[roundIndex];
  return (
    <Round
      key={roundIndex}
      target={target}
      pool={config.colors}
      roundMs={config.roundMs}
      roundNumber={roundIndex + 1}
      totalRounds={config.rounds}
      onComplete={handleRoundComplete}
    />
  );
}
