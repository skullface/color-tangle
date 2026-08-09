"use client";

import { useEffect, useEffectEvent, useState, type ReactNode } from "react";
import { track } from "@vercel/analytics";

import { buildOptions, pickRoundColors, type Color } from "@/lib/colors";
import type { GameConfig } from "@/lib/config";
import { scoreRound, type Answer } from "@/lib/scoring";

import { Results } from "./Results";
import { RoundNav } from "./RoundNav";
import { Round } from "./Round";
import { Info } from "./Info";
import { Start } from "./Start";

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
      <Info />
      <footer className="font-source-serif text-sm">{footerNav}</footer>
    </div>
  );
}

export function Game({ config }: { config: GameConfig }) {
  const [phase, setPhase] = useState<Phase>("start");
  const [targets, setTargets] = useState<Color[]>([]);
  const [optionsByRound, setOptionsByRound] = useState<Color[][]>([]);
  const [answers, setAnswers] = useState<(Answer | null)[]>([]);
  const [viewIndex, setViewIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

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
    setHasCompleted(false);
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
    if (phase === "results") {
      setPhase("playing");
    }
  }

  function goNext() {
    if (!answers[viewIndex]) {
      return;
    }

    if (viewIndex >= targets.length - 1) {
      goToResults();
      return;
    }

    setViewIndex(viewIndex + 1);
  }

  function goToResults() {
    if (frontier !== -1) {
      return;
    }
    if (!hasCompleted) {
      track("quiz_complete", {
        score,
        correct: correctCount,
      });
      setHasCompleted(true);
    }
    setPhase("results");
  }

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      if (phase === "results" && maxReachable >= 0) {
        event.preventDefault();
        setViewIndex(maxReachable);
        setPhase("playing");
        return;
      }

      if (phase === "playing" && viewIndex > 0) {
        event.preventDefault();
        setViewIndex(viewIndex - 1);
      }
      return;
    }

    if (event.key === "ArrowRight" && phase === "playing") {
      if (!answers[viewIndex]) {
        return;
      }
      event.preventDefault();
      goNext();
    }
  });

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      onKeyDown(event);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const resultsReachable = answers.length > 0 && frontier === -1;

  const footerNav = (
    <RoundNav
      roundNumber={phase === "playing" ? viewIndex + 1 : null}
      totalRounds={config.rounds}
      roundNames={targets.map((target) => target.name)}
      correctCount={correctCount}
      maxReachable={maxReachable}
      showingResults={phase === "results"}
      resultsReachable={resultsReachable}
      onGoTo={goTo}
      onGoToResults={goToResults}
    />
  );

  if (phase === "start") {
    return (
      <GameShell footerNav={footerNav}>
        <Start onStart={start} />
      </GameShell>
    );
  }

  if (phase === "results") {
    return (
      <GameShell footerNav={footerNav}>
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
    <GameShell footerNav={footerNav}>
      <Round
        target={targets[viewIndex]}
        options={optionsByRound[viewIndex]}
        answer={answers[viewIndex]}
        roundNumber={viewIndex + 1}
        totalRounds={config.rounds}
        onAnswer={handleAnswer}
        onNext={goNext}
      />
    </GameShell>
  );
}
