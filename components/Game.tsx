"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";

import { buildOptions, pickRoundColors, type Color } from "@/lib/colors";
import type { GameConfig } from "@/lib/config";
import { scoreRound } from "@/lib/scoring";

import { Results } from "./Results";
import { Round, type RoundAnswer } from "./Round";

type Phase = "start" | "playing" | "results";

export function Game({ config }: { config: GameConfig }) {
  const [phase, setPhase] = useState<Phase>("start");
  const [targets, setTargets] = useState<Color[]>([]);
  const [optionsByRound, setOptionsByRound] = useState<Color[][]>([]);
  const [answers, setAnswers] = useState<(RoundAnswer | null)[]>([]);
  const [viewIndex, setViewIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  function start() {
    track("quiz_start");
    const nextTargets = pickRoundColors(config.colors, config.rounds);
    setTargets(nextTargets);
    setOptionsByRound(
      nextTargets.map((target) => buildOptions(target, config.colors)),
    );
    setAnswers(nextTargets.map(() => null));
    setViewIndex(0);
    setScore(0);
    setCorrectCount(0);
    setPhase("playing");
  }

  const frontier = answers.findIndex((answer) => answer === null);
  const maxReachable = frontier === -1 ? answers.length - 1 : frontier;

  function handleAnswer(picked: Color) {
    if (answers[viewIndex]) {
      return;
    }

    const correct = picked.name === targets[viewIndex].name;
    const points = scoreRound(correct);
    setAnswers((current) => {
      const next = [...current];
      next[viewIndex] = { picked, correct, points };
      return next;
    });
    setScore((current) => current + points);
    if (correct) {
      setCorrectCount((current) => current + 1);
    }
  }

  function goTo(index: number) {
    if (index < 0 || index > maxReachable) {
      return;
    }
    setViewIndex(index);
  }

  function goBack() {
    goTo(viewIndex - 1);
  }

  function goNext() {
    if (!answers[viewIndex]) {
      return;
    }

    if (viewIndex >= targets.length - 1) {
      track("quiz_complete", {
        score,
        correct: correctCount,
      });
      setPhase("results");
      return;
    }

    setViewIndex(viewIndex + 1);
  }

  if (phase === "start") {
    return (
      <section>
        <h1>Color Tangle</h1>
        <p>Match the color name to the swatch. {config.rounds} rounds.</p>
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

  return (
    <Round
      target={targets[viewIndex]}
      options={optionsByRound[viewIndex]}
      answer={answers[viewIndex]}
      roundNumber={viewIndex + 1}
      totalRounds={config.rounds}
      maxReachable={maxReachable}
      onAnswer={handleAnswer}
      onGoTo={goTo}
      onBack={goBack}
      onNext={goNext}
    />
  );
}
