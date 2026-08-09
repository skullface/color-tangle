"use client";

import { useEffect, useRef } from "react";
import { blobPathsForRound } from "@/lib/blobs";
import type { Color } from "@/lib/colors";
import type { Answer } from "@/lib/scoring";
import { ColorOption } from "./ColorOption";
import { Feedback } from "./Feedback";

type Props = {
  target: Color;
  options: Color[];
  answer: Answer | null;
  roundNumber: number;
  totalRounds: number;
  onAnswer: (picked: Color) => void;
  onNext: () => void;
};

export function Round({
  target,
  options,
  answer,
  roundNumber,
  totalRounds,
  onAnswer,
  onNext,
}: Props) {
  const revealed = answer !== null;
  const picked = answer?.picked ?? null;
  const blobPaths = blobPathsForRound(roundNumber, options.length);
  const optionsRef = useRef<HTMLDivElement>(null);

  // When advancing to a new unanswered round, the "Next color" control unmounts
  // and focus would otherwise fall to the footer nav. Move it to the first option.
  useEffect(() => {
    if (revealed) {
      return;
    }
    const firstOption =
      optionsRef.current?.querySelector<HTMLButtonElement>("button");
    firstOption?.focus();
  }, [roundNumber, revealed]);

  return (
    <main className="flex flex-col items-center justify-center gap-6 md:gap-8">
      <p className="text-center md:text-lg">
        <span
          className="opacity-50 tabular-nums"
          aria-label={`Round ${roundNumber}`}
        >
          {roundNumber}.
        </span>{" "}
        What color is{" "}
        <strong className="font-semibold font-franklin px-px">
          {target.name.toLowerCase()}
        </strong>
        ?
      </p>
      <div
        ref={optionsRef}
        role="group"
        aria-label="Color options"
        className="flex flex-wrap gap-2 mx-6 items-center justify-center"
      >
        {options.map((color, index) => (
          <ColorOption
            key={color.name}
            color={color}
            blobPath={blobPaths[index]!}
            revealed={revealed}
            isPicked={picked?.name === color.name}
            isCorrect={color.name === target.name}
            onAnswer={onAnswer}
          />
        ))}
      </div>
      <div id="feedback" className="flex flex-col items-center gap-4 h-26">
        {revealed && (
          <Feedback
            target={target}
            roundNumber={roundNumber}
            totalRounds={totalRounds}
            onNext={onNext}
          />
        )}
      </div>
    </main>
  );
}
