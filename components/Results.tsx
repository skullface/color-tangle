"use client";

import { track } from "@vercel/analytics";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import { finishPlay } from "@/app/actions/play";
import { buildShareText } from "@/lib/scoring";
import { Button } from "./Button";

function drawIndex(i: number): CSSProperties {
  return { "--i": i } as CSSProperties;
}

type Props = {
  correct: number;
  total: number;
  playToken: string;
  picks: string[];
  onReplay: () => void;
};

type ShareLinks = {
  shareText: string;
  storyPath: string;
};

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function Results({
  correct,
  total,
  playToken,
  picks,
  onReplay,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [sharingStory, setSharingStory] = useState(false);
  const [share, setShare] = useState<ShareLinks | null>(null);
  const frown = correct <= total / 2;
  const picksKey = picks.join("\0");

  useEffect(() => {
    let cancelled = false;

    finishPlay(playToken, picks).then((result) => {
      if (cancelled || !result) return;
      const shareUrl = `${window.location.origin}${result.path}`;
      setShare({
        shareText: buildShareText(shareUrl),
        storyPath: result.storyPath,
      });
    });

    return () => {
      cancelled = true;
    };
    // picksKey stands in for picks contents without depending on array identity
    // eslint-disable-next-line react-hooks/exhaustive-deps -- picksKey encodes picks
  }, [playToken, picksKey]);

  async function handleShare() {
    if (!share) return;
    track("quiz_share", { method: "web_share" });

    if (navigator.share) {
      try {
        await navigator.share({ text: share.shareText });
        return;
      } catch {
        // User cancelled or share failed — fall through to copy.
      }
    }

    await handleCopy();
  }

  async function handleCopy() {
    if (!share) return;
    track("quiz_share", { method: "copy" });
    await navigator.clipboard.writeText(share.shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleXShare() {
    if (!share) return;
    track("quiz_share", { method: "x" });
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(share.shareText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function handleInstaShare() {
    if (!share || sharingStory) return;

    track("quiz_share", { method: "instagram" });
    setSharingStory(true);

    try {
      const response = await fetch(share.storyPath);
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
            text: share.shareText,
          });
          return;
        } catch {
          // User cancelled or share failed — fall through to download.
        }
      }

      downloadBlob(blob, "color-tangle-story.png");
    } catch {
      // Image fetch failed — copy link as a last resort.
      await navigator.clipboard.writeText(share.shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } finally {
      setSharingStory(false);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center gap-8">
      <h1 className="font-franklin text-4xl tracking-tight font-semibold relative">
        {Math.round((correct / total) * 100)}% correct
        <svg
          fill="none"
          height="45"
          viewBox="0 0 247 45"
          width="247"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-20 top-[-10%] left-[-10%] absolute"
        >
          <path
            d="m105.31 2c.018 0 .037 0-6.1007.12791-6.1374.12791-18.4311.38372-30.9109 1.70745-12.4797 1.32373-24.7729 3.70763-33.3316 5.791-8.5587 2.08334-13.0104 3.79404-16.9021 5.57524-11.58308 5.3013-14.52153 9.2283-15.92787 12.0008-.41919.8264.1928 1.8491.9475 2.9037.79914 1.1167 4.6723 2.6022 21.50027 5.7915 13.6878 2.5941 38.4094 4.8469 66.2285 6.1859 27.8189 1.3389 58.1349 1.102 80.9429-.0091 22.807-1.111 37.188-3.0891 46.239-4.5246 12.414-1.9688 14.738-3.8617 18.183-5.1771 8.763-4.1417 9.362-9.7059 8.566-11.9704-.651-1.1152-5.411-8.7367-23.507-12.02124-16.882-3.0641-23.293-3.04431-43.864-4.5457-20.687-1.50984-48.331-.48139-52.914-.43325-6.276.25396-9.55.81164-13.399 1.90713-2.321.74987-5.387 1.89351-8.545 3.07182"
            pathLength={1}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
            className="stroke-draw"
            style={{ animationDuration: "750ms" }}
          />
        </svg>
      </h1>
      <div className="font-source-serif text-center">
        <p className="max-w-[65ch] text-balance">
          {frown ? "Oof, you only " : "Whoa! You "} got {correct} out of {total}{" "}
          colors.{" "}
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
      <div className="flex flex-col items-center justify-center gap-3">
        <button
          onClick={handleShare}
          disabled={!share}
          className="group cursor-pointer flex-1 disabled:cursor-default disabled:opacity-50"
        >
          <span className="underline decoration-(--fg)/33 underline-offset-2 group-hover:decoration-(--fg)">
            {copied ? "Copied!" : "Share results"}
          </span>
          :
        </button>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            className="group/draw inline-flex items-center gap-1.5"
            onClick={handleXShare}
            disabled={!share}
          >
            <TwitterIcon />
            Twitter
          </Button>
          <Button
            className="group/draw inline-flex items-center gap-1.5 w-25"
            onClick={handleInstaShare}
            disabled={!share || sharingStory}
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
