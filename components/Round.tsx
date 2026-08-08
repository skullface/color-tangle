"use client";

import { useEffect, useSyncExternalStore } from "react";

import {
  softAccentColor,
  swatchStroke,
  type Color,
} from "@/lib/colors";
import { cn } from "@/lib/utils";

type ThemeColors = { bg: string; fg: string };

const serverThemeColors: ThemeColors = { bg: "#ffffff", fg: "#111111" };
let cachedThemeColors: ThemeColors = serverThemeColors;

/**
 * Squarish organic blobs: each side uses two cubics so mid-edges
 * bulge or dip instead of reading as a plain rounded rect.
 */
const OPTION_BLOB_PATHS = [
  // Top dips mid, right bulges, bottom waves, left tucks
  [
    "M20 16",
    "C34 8 42 20 55 12C68 6 76 14 82 16",
    "C92 24 90 38 94 52C96 66 90 78 84 86",
    "C74 96 58 90 46 94C34 98 24 90 18 86",
    "C10 76 12 60 8 48C6 34 12 22 20 16",
    "Z",
  ].join(""),
  // Flatter top-left, right dips in, bottom-right heavy, left bows out
  [
    "M18 20",
    "C32 10 48 8 62 10C74 12 84 18 86 24",
    "C94 36 88 48 92 60C94 74 86 86 74 90",
    "C60 96 46 92 34 94C22 96 12 86 12 74",
    "C8 60 4 46 10 34C14 26 12 24 18 20",
    "Z",
  ].join(""),
  // Top rises right, right soft, bottom tucked left, left mid-bulge
  [
    "M22 14",
    "C38 10 50 6 64 8C76 10 86 16 88 22",
    "C96 34 94 48 90 62C88 76 78 88 66 90",
    "C52 96 40 90 28 92C18 90 10 80 10 68",
    "C6 54 4 40 12 28C16 20 14 16 22 14",
    "Z",
  ].join(""),
  // Slightly cocked: top waves, right high bulge, bottom flat-ish, left dips
  [
    "M16 22",
    "C28 12 40 16 54 10C66 6 78 14 82 18",
    "C92 28 96 42 94 56C96 70 88 84 76 90",
    "C64 96 50 92 38 94C26 96 14 88 12 76",
    "C8 62 4 48 10 36C12 28 10 26 16 22",
    "Z",
  ].join(""),
] as const;

const BLOB_EDGE =
  "color-mix(in srgb, var(--fg) 12%, transparent)";

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
  onAnswer: (picked: Color) => void;
  onBack: () => void;
  onNext: () => void;
};

type RoundNavProps = {
  /** 1-based round, or `null` when no round is active (start / results). */
  roundNumber: number | null;
  totalRounds: number;
  maxReachable: number;
  showingResults: boolean;
  resultsReachable: boolean;
  onGoTo: (index: number) => void;
  onGoToResults: () => void;
};

export function RoundNav({
  roundNumber,
  totalRounds,
  maxReachable,
  showingResults,
  resultsReachable,
  onGoTo,
  onGoToResults,
}: RoundNavProps) {
  const viewIndex = roundNumber === null ? -1 : roundNumber - 1;
  const ariaLabel = showingResults
    ? "Results"
    : roundNumber === null
      ? `${totalRounds} colors`
      : `Round ${roundNumber} of ${totalRounds}`;

  return (
    <div
      role="navigation"
      aria-label={ariaLabel}
      className="flex justify-center items-center mb-2"
    >
      {Array.from({ length: totalRounds }, (_, i) => {
        const isCurrent = !showingResults && i === viewIndex;
        const canNavigate = !isCurrent && i <= maxReachable;

        if (canNavigate) {
          return (
            <button
              key={i}
              type="button"
              onClick={() => onGoTo(i)}
              aria-label={
                viewIndex < 0 || i < viewIndex
                  ? `Go to color ${i + 1}`
                  : "Next color"
              }
              className={cn(
                "p-2 first:pl-0",
                "border-0 cursor-pointer",
                "opacity-33 hover:opacity-100",
              )}
            >
              <span className="block size-1.5 rounded-full bg-current" />
            </button>
          );
        }

        return (
          <span
            key={i}
            aria-hidden
            className={cn(
              "bg-transparent p-2 first:pl-0 border-0",
              isCurrent ? "opacity-100" : "opacity-33",
            )}
          >
            <span className="block size-1.5 rounded-full bg-current" />
          </span>
        );
      })}
      {resultsReachable && !showingResults ? (
        <button
          type="button"
          onClick={onGoToResults}
          aria-label="See results"
          className="p-2 border-0 cursor-pointer opacity-33 hover:opacity-100 text-current select-none text-[0.6rem]"
        >
          &#9733;
        </button>
      ) : (
        <span
          aria-hidden={!showingResults}
          className={cn(
            "bg-transparent p-2 border-0 text-current select-none text-[0.6rem]",
            showingResults ? "opacity-100" : "opacity-33",
          )}
        >
          &#9733;
        </span>
      )}
    </div>
  );
}

export function Round({
  target,
  options,
  answer,
  roundNumber,
  totalRounds,
  onAnswer,
  onBack,
  onNext,
}: Props) {
  const showingFeedback = answer !== null;
  const locked = answer !== null;
  const picked = answer?.picked ?? null;
  const canGoBack = roundNumber > 1;
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

  function optionStroke(color: Color): string {
    return swatchStroke(color.hex);
  }

  return (
    <main className="flex flex-col items-center justify-center gap-8">
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
        className="flex flex-wrap gap-6 mx-6 items-center justify-center"
      >
        {options.map((color, index) => {
          const isPicked = picked?.name === color.name;
          const isCorrect = color.name === target.name;
          const blobPath =
            OPTION_BLOB_PATHS[index % OPTION_BLOB_PATHS.length];

          return (
            <div key={color.name} className="relative w-25 h-25">
              <button
                type="button"
                disabled={locked}
                aria-label={color.name}
                onClick={() => onAnswer(color)}
                className={cn(
                  "size-full border-0 bg-transparent p-0 transition-transform duration-75",
                  !showingFeedback && "cursor-pointer hover:scale-105",
                )}
              >
                <svg
                  viewBox="0 0 100 100"
                  className="size-full overflow-visible"
                  aria-hidden
                >
                  <path
                    d={blobPath}
                    fill={color.hex}
                    stroke={BLOB_EDGE}
                    strokeWidth={1}
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </button>
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
      <div id="feedback" className="flex flex-col items-center gap-4 h-26">
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
    </main>
  );
}
