"use client";

import { useEffect, useRef, useState } from "react";

import { buildOptions, swatchBorder, type Color } from "@/lib/colors";
import { scoreRound } from "@/lib/scoring";
import { cn } from "@/lib/utils";

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
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">(
    "idle",
  );
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

  useEffect(() => {
    if (!showingFeedback) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "ArrowRight") {
        return;
      }
      event.preventDefault();
      advance();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showingFeedback]);

  function optionBorder(color: Color): string {
    return swatchBorder(color.hex);
  }

  return (
    <section className="h-screen flex flex-col items-center justify-between">
      <div
        role="status"
        aria-label={`Round ${roundNumber} of ${totalRounds}`}
        className="flex items-center gap-4 py-2 h-12"
      >
        {Array.from({ length: totalRounds }, (_, i) => {
          const step = i + 1;
          const isCurrent = step === roundNumber;
          const isNext = step === roundNumber + 1;
          const canAdvance = showingFeedback && isNext;

          if (canAdvance) {
            return (
              <button
                key={i}
                type="button"
                onClick={advance}
                aria-label="Next color"
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
                  onClick={() => handlePick(color)}
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
                onClick={advance}
                className="group cursor-pointer py-2 px-3 rounded-sm text-xs uppercase h-8 font-franklin font-semibold hover:bg-(--fg) hover:text-(--bg)"
                aria-label="Next color"
              >
                Next &rarr;
              </button>
            </>
          )}
        </div>
      </div>
      <div className="py-2 h-12 font-source-serif"></div>
    </section>
  );
}
