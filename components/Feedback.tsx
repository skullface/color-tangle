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
      <p className="font-source-serif max-w-[62ch] text-center text-balance">
        {target.description}. {target.etymology}
        &nbsp;
        <Link
          href={target.source}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "group",
            "rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)",
          )}
          style={
            {
              "--accent": accent,
            } as CSSProperties
          }
        >
          <span className="italic underline decoration-(--accent) underline-offset-2 group-hover:decoration-(--fg)">
            Source
          </span>
          &nbsp;
          <span className="text-xs text-(--accent) group-hover:text-(--fg)">
            ↗
          </span>
        </Link>
      </p>
      <Button arrow accent={accent} onClick={onNext}>
        {roundNumber === totalRounds ? "See results" : "Next color"}
      </Button>
    </>
  );
}
