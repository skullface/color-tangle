"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { softAccentColor, type Color } from "@/lib/colors";
import { Button } from "./Button";
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
      <p className="font-source-serif sm:w-[62ch] text-center text-balance max-sm:text-sm">
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
      <Button variant="secondary" arrow accent={accent} onClick={onNext}>
        {roundNumber === totalRounds ? "See results" : "Next color"}
      </Button>
    </>
  );
}
