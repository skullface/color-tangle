"use client";

import { useEffect, useSyncExternalStore } from "react";

import {
  softAccentColor,
  swatchBorder,
  swatchStroke,
  type Color,
} from "@/lib/colors";
import { cn } from "@/lib/utils";

type ThemeColors = { bg: string; fg: string };

const serverThemeColors: ThemeColors = { bg: "#ffffff", fg: "#111111" };
let cachedThemeColors: ThemeColors = serverThemeColors;

function getThemeColors(): ThemeColors {
  const styles = getComputedStyle(document.documentElement);
  const next: ThemeColors = {
    bg: styles.getPropertyValue("--bg").trim() || "#ffffff",
    fg: styles.getPropertyValue("--fg").trim() || "#111111",
  };
  if (next.bg === cachedThemeColors.bg && next.fg === cachedThemeColors.fg) {
    return cachedThemeColors;
  }
  cachedThemeColors = next;
  return cachedThemeColors;
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
  const { bg: backgroundHex, fg: foregroundHex } = useSyncExternalStore(
    subscribeTheme,
    getThemeColors,
    () => serverThemeColors,
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
        className="flex items-center gap-1 py-2 h-12"
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
                className={cn(
                  "p-1 border-0 cursor-pointer opacity-33 hover:opacity-50",
                )}
              >
                <span className="block size-1 rounded-full bg-current" />
              </button>
            );
          }

          return (
            <span
              key={i}
              aria-hidden
              className={cn(
                "bg-transparent p-1 border-0",
                isCurrent ? "opacity-100" : "opacity-33",
              )}
            >
              <span className="block size-1 rounded-full bg-current" />
            </span>
          );
        })}
      </div>
      <div className="flex flex-col items-center justify-center gap-8">
        <p className="font-newsreader text-center text-lg">
          What color is{" "}
          <strong className="font-semibold font-franklin px-px">
            {target.name.toLowerCase()}
          </strong>
          ?
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
                      d="M19.7354 19.7158C31.0736 13.9876 42.0783 8.42786 48.5941 5.36843C57.0769 1.7663 62.7421 0.796999 73.3939 1.03348C79.587 2.25438 86.1588 3.10683 92.3369 11.2418C101.381 23.1505 111.068 39.0926 110.868 50.6754C110.653 63.2311 110.401 70.7142 106.131 76.1602C101.413 82.1772 96.3567 91.0155 81.4357 96.0284C71.4202 99.3933 54.4883 103.524 40.9921 97.6066C31.6613 93.5156 19.6965 88.4468 10.9519 75.2312C3.53392 64.0206 -0.354358 56.8726 1.42942 44.918C2.24556 39.4484 3.41834 34.8909 6.85876 32.2679C13.3925 27.2866 30.6371 14.6551 51.4235 12.7447C62.6374 11.7141 70.8697 11.1653 75.6573 10.6806"
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
              </div>
            );
          })}
        </div>
        <div id="feedback" className="flex flex-col items-center gap-4 h-34">
          {showingFeedback && (
            <>
              <p className="font-source-serif max-w-[62ch] text-center text-balance">
                {target.description}. {target.etymology}
                &nbsp;
                <a
                  href={target.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:decoration-inherit! underline underline-offset-2 italic"
                  style={{
                    textDecorationColor: softAccentColor(
                      target.hex,
                      backgroundHex,
                      foregroundHex,
                    ),
                  }}
                >
                  (Source)
                </a>
              </p>
              <button
                type="button"
                onClick={onNext}
                className="group cursor-pointer py-2 px-3 rounded-sm text-sm font-franklin font-semibold border hover:bg-(--fg) hover:text-(--bg) hover:border-(--fg)!"
                style={{
                  borderColor: softAccentColor(
                    target.hex,
                    backgroundHex,
                    foregroundHex,
                  ),
                }}
              >
                {roundNumber === totalRounds ? "See results" : "Next color"}
                &nbsp;
                <span
                  className="group-hover:text-inherit!"
                  style={{
                    color: softAccentColor(
                      target.hex,
                      backgroundHex,
                      foregroundHex,
                    ),
                  }}
                >
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
