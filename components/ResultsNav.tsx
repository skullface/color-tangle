import { cn } from "@/lib/utils";

import { ResultsNavIcons } from "./ResultsNavIcons";

type ResultsNavProps = {
  roundNumber: number | null;
  totalRounds: number;
  correctCount: number;
  maxReachable: number;
  showingResults: boolean;
  resultsReachable: boolean;
  onGoTo: (index: number) => void;
  onGoToResults: () => void;
};

export function ResultsNav({
  roundNumber,
  totalRounds,
  correctCount,
  maxReachable,
  showingResults,
  resultsReachable,
  onGoTo,
  onGoToResults,
}: ResultsNavProps) {
  const viewIndex = roundNumber === null ? -1 : roundNumber - 1; // 1-based round, or `null` when no round is active (start / results).
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
