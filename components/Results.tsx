"use client";

import { track } from "@vercel/analytics";
import type { CSSProperties } from "react";
import { useState } from "react";

import { buildSharePath, buildShareText, buildStoryPath } from "@/lib/scoring";
import { Button } from "./Button";

function drawIndex(i: number): CSSProperties {
  return { "--i": i } as CSSProperties;
}

type Props = {
  correct: number;
  total: number;
  onReplay: () => void;
};

function getShareUrl(correct: number): string {
  return `${window.location.origin}${buildSharePath(correct)}`;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function Results({ correct, total, onReplay }: Props) {
  const [copied, setCopied] = useState(false);
  const [sharingStory, setSharingStory] = useState(false);
  const frown = correct <= total / 2;

  const shareUrl = getShareUrl(correct);
  const shareText = buildShareText(shareUrl);
  const storyPath = buildStoryPath(correct);

  async function handleShare() {
    track("quiz_share", { method: "web_share" });

    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
        return;
      } catch {
        // User cancelled or share failed — fall through to copy.
      }
    }

    await handleCopy();
  }

  async function handleCopy() {
    track("quiz_share", { method: "copy" });
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleXShare() {
    track("quiz_share", { method: "x" });
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function handleInstaShare() {
    if (sharingStory) return;

    track("quiz_share", { method: "instagram" });
    setSharingStory(true);

    try {
      const response = await fetch(storyPath);
      if (!response.ok) throw new Error("Failed to load story image");

      const blob = await response.blob();
      const file = new File([blob], "color-tangle-story.png", {
        type: blob.type || "image/png",
      });

      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: "Color Tangle",
            text: shareText,
          });
          return;
        } catch {
          // User cancelled or share failed — fall through to download.
        }
      }

      downloadBlob(blob, "color-tangle-story.png");
    } catch {
      // Image fetch failed — copy link as a last resort.
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } finally {
      setSharingStory(false);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center gap-8">
      <h1 className="font-franklin text-4xl tracking-tight font-semibold">
        {correct} out of {total} colors
      </h1>
      <div className="font-source-serif text-center">
        <p className="max-w-[60ch] text-balance">
          {frown ? "Oof, you only " : "Whoa! You "} got{" "}
          {Math.round((correct / total) * 100)}% correct.{" "}
          {frown ? (
            <>
              Looks like you got <em>tangled</em> up in those color names.{" "}
              <button
                onClick={onReplay}
                className="underline decoration-(--fg)/33 underline-offset-2 hover:decoration-(--fg) cursor-pointer"
              >
                Try again
              </button>
              ?
            </>
          ) : (
            <>
              Well done, but I wonder if you can{" "}
              <button
                onClick={onReplay}
                className="underline decoration-(--fg)/33 underline-offset-2 hover:decoration-(--fg) cursor-pointer"
              >
                repeat your success
              </button>
              ?
            </>
          )}
        </p>
      </div>
      <div className="flex items-center justify-center gap-3">
        <button onClick={handleShare} className="group cursor-pointer">
          <span className="underline decoration-(--fg)/33 font-serif underline-offset-2 group-hover:decoration-(--fg)">
            Share results
          </span>
          :
        </button>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            className="group/draw inline-flex items-center gap-1.5"
            onClick={handleXShare}
          >
            <TwitterIcon />
            Twitter
          </Button>
          <Button
            className="group/draw inline-flex items-center gap-1.5 w-25"
            onClick={handleInstaShare}
            disabled={sharingStory}
          >
            <InstagramIcon />
            {sharingStory ? "Saving…" : "IG story"}
          </Button>
        </div>
      </div>
    </main>
  );
}

function TwitterIcon() {
  return (
    <svg
      aria-hidden
      fill="none"
      viewBox="0 0 30 29"
      className="size-3.5 overflow-visible"
    >
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      >
        <path
          pathLength={1}
          className="stroke-draw-hover"
          style={drawIndex(0)}
          d="m2.00024 4.43988c.95664 1.43688 8.81976 9.70412 13.02606 14.11422 1.5371 2.3184 2.4962 3.5517 3.1788 4.405.3355.4679.6486 1.0066 1.7951 2.4808"
        />
        <path
          pathLength={1}
          className="stroke-draw-hover"
          style={drawIndex(1)}
          d="m19.7854 25.6528h5.2949"
        />
        <path
          pathLength={1}
          className="stroke-draw-hover"
          style={drawIndex(2)}
          d="m2.50024 2.43988c2.47623 0 4.32748-1.67078 8.49996 1.50002 3.3485 3.67238 11.4893 13.2792 14.6995 16.7807.4708.65.9516 1.5105 2.0818 3.5259"
        />
        <path
          pathLength={1}
          className="stroke-draw-hover"
          style={drawIndex(3)}
          d="m3.49438 26.02c.38479-.4653 2.20887-1.9988 4.45826-3.5964.96772-.6499 2.07746-1.7793 3.24526-3.238.513-.6221.8643-1.0043 1.2262-1.3981"
        />
        <path
          pathLength={1}
          className="stroke-draw-hover"
          style={drawIndex(4)}
          d="m28.0002 3.43988c-.1084.1048-.8746 1.03185-2.1836 2.6713-.5987.76638-1.0641 1.39964-1.7237 2.29517s-1.4991 2.03415-3.0927 4.03355"
        />
      </g>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      aria-hidden
      fill="none"
      viewBox="0 0 32 31"
      className="size-3.5 overflow-visible"
    >
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      >
        <path
          pathLength={1}
          className="stroke-draw-hover"
          style={drawIndex(0)}
          d="m16.2454 2.05914c1.4324.01252 1.4324.01808 1.4324.02365l3.5777.38897c.5334-.04038.7319-.07133 1.1298-.08878 1.701-.00073 2.9057-.06704 3.7828.74512.576.53335 1.1995 1.431 1.5546 4.32581.1543 1.25753.3062 3.04899.6324 4.99509s.8461 3.9781 1.1181 5.4428c.4288 2.308.6409 3.5985.4646 4.3782-.1666.7373-.4637 1.5022-1.1154 2.1656-.7652.7789-1.9712 1.7902-3.3607 2.6011-.86.502-1.6831.9158-3.9544 1.2138-1.742.2285-4.6229.5158-6.6444.649-2.0214.1333-3.1621.1836-4.7626-.1601-3.65055-.784-5.90422-1.1713-6.10032-1.3551-.18186-.1705-.67664-.5495-1.08636-5.6178-.28137-3.4805-.64921-9.5659-.80365-12.73179-.15443-3.16595-.12901-3.41845-.02939-3.62326.40141-.82531 1.03905-1.94161 3.41254-2.97195.88946-.38613 2.00781-.46243 4.60518-.43308 1.8497.0209 4.7146.0402 6.1471.05272z"
        />
        <path
          pathLength={1}
          className="stroke-draw-hover"
          style={drawIndex(1)}
          d="m12.0048 11.927c-.2362.0534-1.0347.6831-1.6077 1.4159-.48023.6143-.55205 1.6126-.54242 4.3266.00447 1.2611.42072 2.0794.65802 2.5564.3075.6182 1.7497.84 4.3413.9689.9117.0454 3.2855-2.332 4.616-3.653.4233-.4203-.0668-1.3779-1.6677-4.2417-.7927-1.418-1.5237-2.049-1.8044-2.2707-.1365-.094-.2609-.1505-.7168-.1959-.4559-.0453-1.2394-.0777-2.0468-.1111"
        />
        <path
          pathLength={1}
          className="stroke-draw-hover"
          style={drawIndex(2)}
          strokeWidth="6"
          d="m21.2568 8.78836.0303.10205"
        />
      </g>
    </svg>
  );
}
