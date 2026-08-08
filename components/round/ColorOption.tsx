import type { CSSProperties } from "react";
import { BLOB_EDGE } from "@/lib/blobs";
import { swatchStroke, type Color } from "@/lib/colors";
import { cn } from "@/lib/utils";

type ColorOptionProps = {
  color: Color;
  blobPath: string;
  revealed: boolean;
  isPicked: boolean;
  isCorrect: boolean;
  onAnswer: (picked: Color) => void;
};

export function ColorOption({
  color,
  blobPath,
  revealed,
  isPicked,
  isCorrect,
  onAnswer,
}: ColorOptionProps) {
  const stroke = swatchStroke(color.hex);

  return (
    <div className="relative w-30 h-30">
      <button
        type="button"
        disabled={revealed}
        aria-label={color.name}
        onClick={() => onAnswer(color)}
        className={cn(
          "size-full border-0 rounded-md bg-transparent p-0 transition-transform duration-75",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-(--ring)",
          !revealed && "cursor-pointer hover:scale-105",
        )}
        style={{ "--ring": color.hex } as CSSProperties}
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
      {revealed && isCorrect && (
        <svg
          width="34"
          height="34"
          viewBox="0 0 34 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden={!isPicked}
          aria-label={isPicked ? "Correct" : undefined}
          role={isPicked ? "img" : undefined}
          className="pointer-events-none absolute inset-0 top-[34%] left-[33%] w-[34%] h-[34%]"
        >
          <path
            d="M11.4118 17.7752C12.5307 20.1864 14.8543 25.1104 15.1241 25.4706C16.2542 21.2615 19.3467 12.8128 20.9631 9.81645C21.2974 9.30464 21.6517 8.80078 22.7059 7.58826"
            pathLength={1}
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-draw stroke-draw-check"
          />
        </svg>
      )}
      {revealed && isPicked && !isCorrect && (
        <svg
          height="21"
          viewBox="0 0 20 21"
          width="20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden={!isPicked}
          aria-label={isPicked ? "Incorrect" : undefined}
          role={isPicked ? "img" : undefined}
          className="pointer-events-none absolute inset-0 top-[41%] left-[41%] w-[20%] h-[20%]"
        >
          <path
            d="m2.00193 1c-.01306.4612.01406 1.98682.94306 4.09303.4694 1.06421 1.63047 2.57902 3.27279 4.55875 1.64231 1.97972 3.86102 4.30682 5.46602 5.86432s2.5291 2.2749 3.1429 2.722c.6138.4472.8894.6022 1.1733.7619"
            pathLength={1}
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-draw stroke-draw-x"
          />
          <path
            d="m19 3c-.0071 0-.0142 0-.1359.04535-.1216.04535-.3575.13605-3.2917 2.8694s-8.55945 8.10665-14.5724 14.08525"
            pathLength={1}
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-draw stroke-draw-x stroke-draw-x-second"
          />
        </svg>
      )}
    </div>
  );
}
