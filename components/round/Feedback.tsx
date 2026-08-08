"use client";

import { softAccentColor, type Color } from "@/lib/colors";
import { useThemeColors } from "./useThemeColors";

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
        <a
          href={target.source}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:decoration-inherit! underline underline-offset-2 italic"
          style={{
            textDecorationColor: accent,
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
          borderColor: accent,
        }}
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
