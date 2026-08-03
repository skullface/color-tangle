"use client";

import { useRef, useState } from "react";

import { buildOptions, swatchBorder, type Color } from "@/lib/colors";
import { scoreRound } from "@/lib/scoring";

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

  function optionBorder(color: Color): string {
    return swatchBorder(color.hex);
  }

  return (
    <section>
      <p>
        Round {roundNumber} of {totalRounds}
      </p>
      <p className="font-newsreader">
        What does{" "}
        <strong className="font-semibold font-franklin">
          {target.name.toLowerCase()}
        </strong>{" "}
        look like?
      </p>
      <div
        role="group"
        aria-label="Color options"
        className="flex flex-wrap gap-4"
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
                className="size-full"
                style={{
                  backgroundColor: color.hex,
                  border: optionBorder(color),
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
      <div id="feedback">
        {showingFeedback && (
          <div className="font-source-serif">
            <p>
              {target.description}. {target.etymology}{" "}
              <i>
                (
                <a
                  href={target.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Source
                </a>
                )
              </i>
            </p>
            <button
              type="button"
              onClick={advance}
              className="p-3 font-franklin font-semibold bg-black text-white"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
