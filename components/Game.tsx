"use client";

import { useState, type ReactNode } from "react";
import { track } from "@vercel/analytics";

import { buildOptions, pickRoundColors, type Color } from "@/lib/colors";
import type { GameConfig } from "@/lib/config";
import { scoreRound } from "@/lib/scoring";

import { Results } from "./Results";
import { Round, RoundNav, type RoundAnswer } from "./Round";

type Phase = "start" | "playing" | "results";

function GameShell({
  children,
  footerNav,
}: {
  children: ReactNode;
  footerNav?: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex-1 lg:flex lg:items-center lg:justify-center max-md:pt-10 max-md:px-6">
        {children}
      </div>
      <footer className="font-source-serif text-sm">{footerNav}</footer>
    </div>
  );
}

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
  const maxReachable =
    phase === "start" ? -1 : frontier === -1 ? answers.length - 1 : frontier;

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
      <GameShell>
        <main className="flex flex-col items-center justify-center gap-8">
          <h1 className="font-franklin text-3xl font-semibold">Color Tangle</h1>
          <p className="font-source-serif text-center text-balance">
            Match the color name to its swatch. Inspired by the Iron Tangle from{" "}
            <cite>The Dungeon Anarchist’s Cookbook</cite> by Matt Dinniman.
          </p>
          <button
            type="button"
            onClick={start}
            className="cursor-pointer py-2 px-3 rounded-sm text-sm font-franklin font-semibold border border-(--fg) hover:bg-(--fg) hover:text-(--bg)"
          >
            Start
          </button>
        </main>
      </GameShell>
    );
  }

  if (phase === "results") {
    return (
      <GameShell>
        <Results
          score={score}
          correct={correctCount}
          total={config.rounds}
          onReplay={start}
        />
      </GameShell>
    );
  }

  return (
    <GameShell
      footerNav={
        <RoundNav
          roundNumber={viewIndex + 1}
          totalRounds={config.rounds}
          maxReachable={maxReachable}
          onGoTo={goTo}
        />
      }
    >
      <Round
        target={targets[viewIndex]}
        options={optionsByRound[viewIndex]}
        answer={answers[viewIndex]}
        roundNumber={viewIndex + 1}
        totalRounds={config.rounds}
        onAnswer={handleAnswer}
        onBack={goBack}
        onNext={goNext}
      />
    </GameShell>
  );
}
