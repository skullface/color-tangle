"use client";

import { track } from "@vercel/analytics";
import { useState } from "react";

import { buildSharePath, buildShareText } from "@/lib/scoring";

type Props = {
  score: number;
  correct: number;
  total: number;
  onReplay: () => void;
};

function getShareUrl(score: number, correct: number): string {
  return `${window.location.origin}${buildSharePath(score, correct)}`;
}

export function Results({ score, correct, total, onReplay }: Props) {
  const [copied, setCopied] = useState(false);
  const frown = correct <= total / 2;

  const shareUrl = getShareUrl(score, correct);
  const shareText = buildShareText(score, correct, total, shareUrl);

  async function handleShare() {
    track("quiz_share", { method: "web_share" });

    if (navigator.share) {
      try {
        await navigator.share({ text: shareText, url: shareUrl });
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

  return (
    <main className="flex flex-col items-center justify-center gap-8">
      <h1 className="font-franklin text-4xl tracking-tight font-semibold">
        {correct} out of {total} colors
      </h1>
      <div className="font-source-serif text-center">
        <p className="max-w-prose text-balance">
          {frown ? "Oh… you only " : "Whoa! You "} got{" "}
          {Math.round((correct / total) * 100)}% correct.{" "}
          {frown ? (
            <>
              Looks like you got <em>tangled</em> up in those color names. Want
              to try again?
            </>
          ) : (
            "Well done, but why do you even know these strange color names?"
          )}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleShare}
          className="cursor-pointer py-2 px-3 rounded-sm text-sm font-franklin font-semibold border border-(--fg) bg-(--fg) text-(--bg) hover:bg-transparent hover:text-(--fg) hover:border-(--fg)/50 focus:outline-none focus-visible:ring-4 focus-visible:ring-(--fg)/50"
        >
          Share results
        </button>
        <button
          type="button"
          onClick={handleXShare}
          className="cursor-pointer py-2 px-3 rounded-sm text-sm font-franklin font-semibold border border-(--fg) bg-(--fg) text-(--bg) hover:bg-transparent hover:text-(--fg) hover:border-(--fg)/50 focus:outline-none focus-visible:ring-4 focus-visible:ring-(--fg)/50"
        >
          Share to Twitter
        </button>
      </div>
      <button
        type="button"
        onClick={onReplay}
        className="group cursor-pointer py-2 px-3 rounded-sm text-sm font-franklin font-semibold border border-(--fg)/50 hover:bg-(--fg) hover:text-(--bg) hover:border-(--fg)"
      >
        Start over{" "}
        <span className="opacity-50 group-hover:opacity-100">&rarr;</span>
      </button>
    </main>
  );
}
