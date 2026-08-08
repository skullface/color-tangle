"use client";

import { useEffect, useSyncExternalStore } from "react";

import {
  softAccentColor,
  swatchBorder,
  swatchStroke,
  type Color,
} from "@/lib/colors";
import { cn } from "@/lib/utils";

function getBackgroundHex(): string {
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue("--bg")
      .trim() || "#ffffff"
  );
}

function subscribeTheme(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

export type RoundAnswer = {
  picked: Color;
  correct: boolean;
  points: number;
};

type Props = {
  target: Color;
  options: Color[];
  answer: RoundAnswer | null;
  roundNumber: number;
  totalRounds: number;
  maxReachable: number;
  onAnswer: (picked: Color) => void;
  onGoTo: (index: number) => void;
  onBack: () => void;
  onNext: () => void;
};

export function Round({
  target,
  options,
  answer,
  roundNumber,
  totalRounds,
  maxReachable,
  onAnswer,
  onGoTo,
  onBack,
  onNext,
}: Props) {
  const showingFeedback = answer !== null;
  const locked = answer !== null;
  const picked = answer?.picked ?? null;
  const canGoBack = roundNumber > 1;
  const viewIndex = roundNumber - 1;
  const backgroundHex = useSyncExternalStore(
    subscribeTheme,
    getBackgroundHex,
    () => "#ffffff",
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        if (!canGoBack) {
          return;
        }
        event.preventDefault();
        onBack();
        return;
      }

      if (event.key === "ArrowRight") {
        if (!showingFeedback) {
          return;
        }
        event.preventDefault();
        onNext();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canGoBack, showingFeedback, onBack, onNext]);

  function optionBorder(color: Color): string {
    return swatchBorder(color.hex);
  }

  function optionStroke(color: Color): string {
    return swatchStroke(color.hex);
  }

  return (
    <section className="h-screen flex flex-col items-center justify-between">
      <div
        role="navigation"
        aria-label={`Round ${roundNumber} of ${totalRounds}`}
        className="flex items-center gap-4 py-2 h-12"
      >
        {Array.from({ length: totalRounds }, (_, i) => {
          const isCurrent = i === viewIndex;
          const canNavigate = !isCurrent && i <= maxReachable;

          if (canNavigate) {
            return (
              <button
                key={i}
                type="button"
                onClick={() => onGoTo(i)}
                aria-label={
                  i < viewIndex ? `Go to color ${i + 1}` : "Next color"
                }
                className="size-1 rounded-full bg-current p-0 border-0 cursor-pointer"
                style={{ opacity: 0.33 }}
              />
            );
          }

          return (
            <span
              key={i}
              aria-hidden
              className="size-1 rounded-full bg-current"
              style={{ opacity: isCurrent ? 1 : 0.33 }}
            />
          );
        })}
      </div>
      <div className="flex flex-col items-center justify-center gap-8">
        <p className="font-newsreader text-center">
          What does{" "}
          <strong className="font-semibold font-franklin px-px">
            {target.name.toLowerCase()}
          </strong>{" "}
          look like?
        </p>
        <div
          role="group"
          aria-label="Color options"
          className="flex flex-wrap gap-6"
        >
          {options.map((color) => {
            const isPicked = picked?.name === color.name;
            const isCorrect = color.name === target.name;

            return (
              <div key={color.name} className="relative w-25 h-25">
                <button
                  type="button"
                  disabled={locked}
                  aria-label={color.name}
                  onClick={() => onAnswer(color)}
                  className={cn(
                    "size-full rounded-sm transition-transform duration-75",
                    !showingFeedback && "cursor-pointer hover:scale-105",
                  )}
                  style={{
                    backgroundColor: color.hex,
                    boxShadow: optionBorder(color),
                  }}
                />
                {isPicked && (
                  <svg
                    width="112"
                    height="102"
                    viewBox="0 0 112 102"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                    className="pointer-events-none absolute top-[-12.5%] left-[-12.5%] max-w-[125%] w-[125%] h-[125%]"
                  >
                    <path
                      d="M75.6573 10.6806C70.8697 11.1653 62.6374 11.7141 51.4235 12.7447C30.6371 14.6551 13.3925 27.2866 6.85876 32.2679C3.41834 34.8909 2.24556 39.4484 1.42942 44.918C-0.354358 56.8726 3.53392 64.0206 10.9519 75.2312C19.6965 88.4468 31.6613 93.5156 40.9921 97.6066C54.4883 103.524 71.4202 99.3933 81.4357 96.0284C96.3567 91.0155 101.413 82.1772 106.131 76.1602C110.401 70.7142 110.653 63.2311 110.868 50.6754C111.068 39.0926 101.381 23.1505 92.3369 11.2418C86.1588 3.10683 79.587 2.25438 73.3939 1.03348C62.7421 0.796999 57.0769 1.7663 48.5941 5.36843C42.0783 8.42786 31.0736 13.9876 19.7354 19.7158"
                      pathLength={1}
                      stroke={optionStroke(color)}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="stroke-draw stroke-draw-selection"
                    />
                  </svg>
                )}
                {showingFeedback && isCorrect && (
                  <svg
                    width="34"
                    height="34"
                    viewBox="0 0 34 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden={!isPicked}
                    aria-label={isPicked ? "Correct" : undefined}
                    role={isPicked ? "img" : undefined}
                    className="pointer-events-none absolute inset-0 top-[33%] left-[33%] max-w-[125%] w-[33%] h-[33%]"
                  >
                    <path
                      d="M11.4118 17.7752C12.5307 20.1864 14.8543 25.1104 15.1241 25.4706C16.2542 21.2615 19.3467 12.8128 20.9631 9.81645C21.2974 9.30464 21.6517 8.80078 22.7059 7.58826"
                      pathLength={1}
                      stroke={optionStroke(color)}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="stroke-draw stroke-draw-check"
                    />
                  </svg>
                )}
                {/*
                {showingFeedback && isPicked && !isCorrect && (
                  <svg
                    width="100"
                    height="104"
                    viewBox="0 0 100 104"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-label="Miss"
                    className="pointer-events-none absolute top-[-12.5%] left-[-12.5%] max-w-[125%] w-[125%] h-[125%]"
                    stroke={optionStroke(color)}
                  >
                    <path
                      d="M5.54686 1C5.47467 3.47355 5.6246 11.6559 10.7607 22.9521C13.3559 28.6597 19.7751 36.7841 28.8549 47.4019C37.9347 58.0198 50.2014 70.5005 59.0749 78.8539C67.9484 87.2072 73.0569 91.0551 76.4505 93.453C79.844 95.851 81.3676 96.6824 82.9375 97.5391"
                      pathLength={1}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="stroke-draw"
                    />
                    <path
                      d="M98.7617 12.9062C98.723 12.9062 98.6844 12.9062 98.0238 13.146C97.3632 13.3858 96.0819 13.8653 80.1458 28.3165C64.2096 42.7677 33.6576 71.1761 1 102.785"
                      pathLength={1}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="stroke-draw stroke-draw-x-second"
                    />
                  </svg>
                  */}
                {/*)}*/}
              </div>
            );
          })}
        </div>
        <div id="feedback" className="flex flex-col items-center gap-4 h-34">
          {showingFeedback && (
            <>
              <p className="font-source-serif max-w-[56ch] text-center text-balance">
                <span
                  className="underline underline-offset-2"
                  style={{
                    textDecorationColor: softAccentColor(
                      target.hex,
                      backgroundHex,
                    ),
                  }}
                >
                  {target.description}
                </span>
                . {target.etymology}
                &nbsp;
                <a
                  href={target.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-50 hover:opacity-100 italic"
                >
                  (Source)
                </a>
              </p>
              <button
                type="button"
                onClick={onNext}
                className="group cursor-pointer py-2 px-3 rounded-sm text-sm font-franklin font-semibold hover:bg-(--fg) hover:text-(--bg)"
                aria-label="Next color"
              >
                Next&nbsp;
                <span className="opacity-50 group-hover:opacity-100">
                  &rarr;
                </span>
              </button>
            </>
          )}
        </div>
      </div>
      <div className="py-2 h-12 font-source-serif text-sm">
        Inspired by the Iron Tangle from{" "}
        <cite>The Dungeon Anarchist’s Cookbook</cite> by Matt Dinniman
      </div>
    </section>
  );
}
