"use client";

import { track } from "@vercel/analytics";
import { useState } from "react";

import { buildSharePath, buildShareText, buildStoryPath } from "@/lib/scoring";
import { Button } from "./Button";

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
        <p className="max-w-prose text-balance">
          {frown ? "Oof, you only " : "Whoa! You "} got{" "}
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
        <Button onClick={handleShare}>Share results</Button>
        <Button onClick={handleXShare}>Twitter</Button>
        <Button
          className="w-20"
          onClick={handleInstaShare}
          disabled={sharingStory}
        >
          {sharingStory ? "Saving…" : "IG story"}
        </Button>
      </div>
      <Button variant="secondary" arrow onClick={onReplay}>
        Start over
      </Button>
    </main>
  );
}
