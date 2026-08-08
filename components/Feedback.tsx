"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { softAccentColor, type Color } from "@/lib/colors";
import { useThemeColors } from "./useThemeColors";
import { cn } from "@/lib/utils";

type FeedbackProps = {
  target: Color;
  roundNumber: number;
  totalRounds: number;
  onNext: () => void;
};

export function Feedback({
  target,
  roundNumber,
  totalRounds,
  onNext,
}: FeedbackProps) {
  const { bg: backgroundHex, fg: foregroundHex } = useThemeColors();
  const accent = softAccentColor(target.hex, backgroundHex, foregroundHex);

  return (
    <>
      <p className="font-source-serif max-w-[62ch] text-center text-balance">
        {target.description}. {target.etymology}
        &nbsp;
        <Link
          href={target.source}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "hover:decoration-inherit! underline underline-offset-2 italic",
            "rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)",
          )}
          style={
            {
              textDecorationColor: accent,
              "--accent": accent,
            } as CSSProperties
          }
        >
          (Source)
        </Link>
      </p>
      <button
        type="button"
        onClick={onNext}
        className={cn(
          "group cursor-pointer py-2 px-3",
          "rounded-sm border",
          "text-sm font-franklin font-semibold",
          "hover:bg-(--fg) hover:text-(--bg) hover:border-(--fg)!",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)",
        )}
        style={
          {
            borderColor: accent,
            "--accent": accent,
          } as CSSProperties
        }
      >
        {roundNumber === totalRounds ? "See results" : "Next color"}
        &nbsp;
        <span className="group-hover:text-inherit!" style={{ color: accent }}>
          &rarr;
        </span>
      </button>
    </>
  );
}
