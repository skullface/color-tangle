"use client";

import { useEffect, useSyncExternalStore } from "react";

import { softAccentColor, swatchStroke, type Color } from "@/lib/colors";
import { cn } from "@/lib/utils";

type ThemeColors = { bg: string; fg: string };

const serverThemeColors: ThemeColors = { bg: "#ffffff", fg: "#111111" };
let cachedThemeColors: ThemeColors = serverThemeColors;

/**
 * Predefined organic blob silhouettes. Swapping `d` on a path is cheap;
 * generating geometry at runtime (or morphing) would cost more for no gain.
 */
const OPTION_BLOB_PATHS = [
  // 0 — top dips mid, right bulges
  [
    "M20 16",
    "C34 8 42 20 55 12C68 6 76 14 82 16",
    "C92 24 90 38 94 52C96 66 90 78 84 86",
    "C74 96 58 90 46 94C34 98 24 90 18 86",
    "C10 76 12 60 8 48C6 34 12 22 20 16",
    "Z",
  ].join(""),
  // 1 — flatter top-left, left bows out
  [
    "M18 20",
    "C32 10 48 8 62 10C74 12 84 18 86 24",
    "C94 36 88 48 92 60C94 74 86 86 74 90",
    "C60 96 46 92 34 94C22 96 12 86 12 74",
    "C8 60 4 46 10 34C14 26 12 24 18 20",
    "Z",
  ].join(""),
  // 2 — top rises right, left mid-bulge
  [
    "M22 14",
    "C38 10 50 6 64 8C76 10 86 16 88 22",
    "C96 34 94 48 90 62C88 76 78 88 66 90",
    "C52 96 40 90 28 92C18 90 10 80 10 68",
    "C6 54 4 40 12 28C16 20 14 16 22 14",
    "Z",
  ].join(""),
  // 3 — slightly cocked
  [
    "M16 22",
    "C28 12 40 16 54 10C66 6 78 14 82 18",
    "C92 28 96 42 94 56C96 70 88 84 76 90",
    "C64 96 50 92 38 94C26 96 14 88 12 76",
    "C8 62 4 48 10 36C12 28 10 26 16 22",
    "Z",
  ].join(""),
  // 4 — softer even silhouette
  [
    "M18 18",
    "C34 12 48 10 64 12C76 14 84 20 86 26",
    "C92 38 90 50 90 62C90 76 82 88 70 90",
    "C56 94 42 92 30 90C20 88 12 80 12 68",
    "C10 54 8 42 12 32C14 24 12 22 18 18",
    "Z",
  ].join(""),
  // 5 — soft top dip, mild bottom wave
  [
    "M20 16",
    "C36 10 44 16 58 12C70 10 78 14 82 18",
    "C90 28 92 40 92 54C92 68 88 80 80 86",
    "C70 94 56 92 44 92C32 94 22 88 18 82",
    "C12 72 10 58 10 46C10 32 14 22 20 16",
    "Z",
  ].join(""),
  // 6 — soft rise on top-right
  [
    "M20 14",
    "C38 12 50 8 66 12C78 14 86 20 88 26",
    "C94 38 92 52 90 64C88 78 78 88 66 90",
    "C52 94 40 90 28 90C18 88 12 78 12 66",
    "C10 52 8 40 14 28C16 20 14 16 20 14",
    "Z",
  ].join(""),
  // 7 — gentle cock, soft right high point
  [
    "M18 20",
    "C32 14 42 14 56 12C70 10 80 16 84 20",
    "C92 30 94 44 92 58C92 72 84 86 72 90",
    "C58 94 46 92 34 92C24 92 14 84 14 72",
    "C12 58 8 46 12 36C14 28 12 24 18 20",
    "Z",
  ].join(""),
] as const;

const BLOB_EDGE = "color-mix(in srgb, var(--fg) 12%, transparent)";

/** Tiny deterministic PRNG so blob picks are stable across re-renders. */
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/** Unique blob paths for this round — reshuffles when `roundNumber` changes. */
function blobPathsForRound(roundNumber: number, count: number): string[] {
  const order = OPTION_BLOB_PATHS.map((_, i) => i);
  const rand = mulberry32(roundNumber * 0x9e3779b9 + 1);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = order[i]!;
    order[i] = order[j]!;
    order[j] = tmp;
  }
  return order.slice(0, count).map((i) => OPTION_BLOB_PATHS[i]!);
}

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
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
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
  correctCount: number;
  maxReachable: number;
  showingResults: boolean;
  resultsReachable: boolean;
  onGoTo: (index: number) => void;
  onGoToResults: () => void;
};

function PendingResultsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 36 35"
      width="36"
      height="35"
      className="w-3 h-3"
    >
      <g
        stroke="var(--fg)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      >
        <path d="m17.1527 7.51196c.0226-.04613.0452-.09226.0529-.30194s-.0003-.5815-.092-1.38333c-.0918-.80184-.2671-2.02242-.594-3.82635" />
        <path d="m25.8029 9.28697c.0072-.01794.176-.43701.6892-1.43039.3481-.58356.8743-1.32842 1.2361-1.80955.3617-.48114.543-.67597.7779-.9805" />
        <path d="m27.9784 17.3939c.0532.0214 1.1406.4448 2.9988 1.1259.7982.2686 1.3025.3811 1.7125.495.4099.1139.7102.2258 1.0195.3411" />
        <path d="m23.1686 26.0003c.0111.026.2431.4877.7665 1.4336.2972.4975.6585 1.0308 1.0313 1.5026.3728.4719.7462.8662 1.4916 1.5167" />
        <path d="m14.5381 25.8236-2.5861 6.4206" />
        <path d="m8.45095 19.9501c-.00867-.0035-.01734-.007-1.04302.2581-1.02568.265-3.0681.7987-5.40745 1.4328" />
        <path d="m11.3273 12.7073c-.018-.0072-.0359-.0145-.9206-.3708-.88461-.3563-2.63543-1.0615-3.66417-1.5034-1.02873-.4418-1.28233-.5988-2.23386-1.03864" />
      </g>
    </svg>
  );
}

function ResultsFaceIcon({ frown }: { frown: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="34"
      height="29"
      viewBox="0 0 34 29"
      fill="none"
      className="w-3 h-3"
    >
      <path
        d="M3.17316 3.06863L3.22491 2.67703"
        stroke="var(--fg)"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30.3948 2.00027L30.4525 2.39481"
        stroke="var(--fg)"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M31.2806 12.8284C31.2806 13.2225 31.1903 14.4618 30.6691 15.9262C29.5347 19.113 27.5497 21.3588 25.7107 23.0237C24.5318 24.091 22.2213 24.8403 19.47 25.6782C14.8512 27.0848 12.1863 26.0513 10.2447 25.0799C7.20003 23.5566 4.92306 20.3097 3.0299 16.9574C2.67396 16.0587 2.46577 15.1699 2.33887 14.5437C2.21197 13.9174 2.17265 13.5806 2.00031 12.6018"
        stroke="var(--fg)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform={frown ? "rotate(180 16.64 19.14)" : undefined}
      />
    </svg>
  );
}

function ResultsNavIcons({
  showingResults,
  frown,
}: {
  showingResults: boolean;
  frown: boolean;
}) {
  return (
    <span className="relative inline-grid size-3 place-items-center">
      <span
        className={cn(
          "col-start-1 row-start-1 inline-flex",
          "motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.19,1,0.22,1)]",
          "motion-reduce:transition-opacity motion-reduce:duration-150",
          showingResults
            ? "pointer-events-none scale-0 motion-reduce:scale-100 motion-reduce:opacity-0"
            : "scale-100 motion-reduce:opacity-100",
        )}
      >
        <PendingResultsIcon />
      </span>
      <span
        className={cn(
          "col-start-1 row-start-1 inline-flex",
          "motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.19,1,0.22,1)]",
          "motion-reduce:transition-opacity motion-reduce:duration-150",
          showingResults
            ? "scale-100 motion-reduce:opacity-100"
            : "pointer-events-none scale-0 motion-reduce:scale-100 motion-reduce:opacity-0",
        )}
      >
        <ResultsFaceIcon frown={frown} />
      </span>
    </span>
  );
}

export function RoundNav({
  roundNumber,
  totalRounds,
  correctCount,
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
  const frown = correctCount <= totalRounds / 2;
  const canOpenResults = resultsReachable && !showingResults;

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
      <span
        className={cn(
          "relative bg-transparent p-2 border-0 text-current select-none",
          showingResults ? "opacity-100" : "opacity-33",
          canOpenResults && "hover:opacity-100",
        )}
      >
        {canOpenResults ? (
          <button
            type="button"
            onClick={onGoToResults}
            aria-label="See results"
            className="absolute inset-0 cursor-pointer border-0 bg-transparent"
          />
        ) : null}
        <span aria-hidden={!showingResults}>
          <ResultsNavIcons showingResults={showingResults} frown={frown} />
        </span>
      </span>
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

  const blobPaths = blobPathsForRound(roundNumber, options.length);

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
        className="flex flex-wrap gap-2 mx-6 items-center justify-center"
      >
        {options.map((color, index) => {
          const isPicked = picked?.name === color.name;
          const isCorrect = color.name === target.name;
          const blobPath = blobPaths[index]!;

          return (
            <div key={color.name} className="relative w-30 h-30">
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
