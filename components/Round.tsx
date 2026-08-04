"use client";

import { useEffect } from "react";

import { swatchBorder, type Color } from "@/lib/colors";
import { cn } from "@/lib/utils";

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
                  <img
                    src="/circle.svg"
                    alt=""
                    aria-hidden
                    className="pointer-events-none absolute top-[-12.5%] left-[-12.5%] max-w-[125%] w-[125%] h-[125%] object-contain"
                  />
                )}
                {showingFeedback && isCorrect && (
                  <img
                    src="/check.svg"
                    alt={(isPicked && "Correct") || ""}
                    aria-hidden
                    className="pointer-events-none absolute inset-0 top-[33%] left-[33%] max-w-[125%] w-[33%] h-[33%] object-contain"
                  />
                )}
                {showingFeedback && isPicked && !isCorrect && (
                  <img
                    src="/x.svg"
                    alt="Miss"
                    className="pointer-events-none absolute top-[-12.5%] left-[-12.5%] max-w-[125%] w-[125%] h-[125%]"
                  />
                )}
              </div>
            );
          })}
        </div>
        <div id="feedback" className="flex flex-col items-center gap-4 h-34">
          {showingFeedback && (
            <>
              <p className="font-source-serif max-w-[56ch] text-center text-balance">
                {target.description}. {target.etymology}
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
                className="group cursor-pointer py-2 px-3 rounded-sm font-franklin font-semibold hover:bg-(--fg) hover:text-(--bg)"
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
      <div className="py-2 h-12 font-source-serif"></div>
    </section>
  );
}
