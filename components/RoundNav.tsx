"use client";

import { Tooltip } from "@base-ui/react/tooltip";
import { OutcomeIcon } from "./OutcomeIcon";
import { cn } from "@/lib/utils";

type RoundNavProps = {
  roundNumber: number | null;
  totalRounds: number;
  correctCount: number;
  maxReachable: number;
  showingResults: boolean;
  resultsReachable: boolean;
  onGoTo: (index: number) => void;
  onGoToResults: () => void;
};

function outcomeIconTooltip({
  resultsReachable,
  frown,
}: {
  resultsReachable: boolean;
  frown: boolean;
}) {
  if (resultsReachable) {
    return frown ? "Maybe next time!" : "Nice work!";
  }
  return "Finish the game to see your score!";
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
  const viewIndex = roundNumber === null ? -1 : roundNumber - 1; // 1-based round, or `null` when no round is active (start / results).
  const ariaLabel = showingResults
    ? "Results"
    : roundNumber === null
      ? `${totalRounds} colors`
      : `Round ${roundNumber} of ${totalRounds}`;
  const frown = correctCount <= totalRounds / 2;
  const canOpenResults = resultsReachable && !showingResults;
  const tooltip = outcomeIconTooltip({ resultsReachable, frown });

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
                "group",
                "p-2 rounded-full cursor-pointer",
                "focus:outline-none focus-visible:opacity-100",
              )}
            >
              <span
                className="block size-2 rounded-full bg-transparent ring ring-current group-hover:bg-current 
                opacity-33 group-hover:opacity-100  group-focus-visible:ring group-focus-visible:ring-(--fg) group-focus-visible:bg-(--fg)"
              />
            </button>
          );
        }

        return (
          <span
            key={i}
            aria-hidden
            className={cn(
              "bg-transparent p-2",
              isCurrent ? "opacity-100" : "opacity-33",
            )}
          >
            <span
              className={cn(
                "block size-2 rounded-full",
                isCurrent ? "bg-current" : "bg-transparent ring ring-current",
              )}
            />
          </span>
        );
      })}
      <Tooltip.Root>
        <Tooltip.Trigger
          delay={50}
          aria-label={tooltip}
          onClick={canOpenResults ? onGoToResults : undefined}
          className={cn(
            "group/wait bg-transparent p-2 text-current select-none",
            "focus:outline-none focus-visible:opacity-100 hover:opacity-100",
            showingResults ? "opacity-100" : "opacity-33",
            canOpenResults
              ? "cursor-pointer hover:opacity-100"
              : "cursor-default",
          )}
        >
          <span aria-hidden>
            <OutcomeIcon showFace={resultsReachable} frown={frown} />
          </span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner sideOffset={8}>
            <Tooltip.Popup
              className={cn(
                "font-franklin text-sm font-medium px-2 py-1 rounded-sm",
                "bg-(--fg) text-(--bg)",
                "origin-(--transform-origin)",
                "transition-[transform,opacity] duration-100 ease-out",
                "data-starting-style:opacity-0 data-starting-style:scale-[0.98]",
                "data-ending-style:opacity-0 data-ending-style:scale-[0.98]",
              )}
            >
              {tooltip}
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </div>
  );
}
