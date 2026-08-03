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
    <section>
      <h1>Done!</h1>
      <p>Score: {score}</p>
      <p>
        {correct}/{total} correct
      </p>
      <div>
        <button type="button" onClick={handleShare}>
          Share
        </button>
        <button type="button" onClick={handleXShare}>
          Post on X
        </button>
        <button type="button" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
      <button type="button" onClick={onReplay}>
        Play again
      </button>
    </section>
  );
}
