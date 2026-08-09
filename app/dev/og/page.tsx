import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { size as ogSize } from "@/app/s/og/size";
import { size as storySize } from "@/app/s/story/size";
import {
  buildOgPath,
  buildStoryPath,
  clampCorrect,
  signCorrect,
} from "@/lib/scoring";

export const metadata: Metadata = {
  title: "OG preview",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ correct?: string }>;
};

export default async function DevOgPreview({ searchParams }: Props) {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const { correct: raw = "7" } = await searchParams;
  const correct = clampCorrect(Number.parseInt(raw, 10));
  const token = signCorrect(correct);
  const ogSrc = buildOgPath(token);
  const storySrc = buildStoryPath(token);

  return (
    <main className="mx-auto flex flex-col gap-8 p-4 font-franklin">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Results share image preview
        </h1>
        <p className="max-w-prose">
          Edit{" "}
          <code className="rounded bg-(--fg)/10 px-1.5 py-0.5">
            app/s/og/route.tsx
          </code>{" "}
          or{" "}
          <code className="rounded bg-(--fg)/10 px-1.5 py-0.5">
            app/s/story/route.tsx
          </code>{" "}
          and refresh.
        </p>
      </header>

      <form method="get" className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1">
          <label className="font-medium" htmlFor="correct">
            Correct
          </label>
          <input
            name="correct"
            type="number"
            id="correct"
            min={0}
            max={10}
            defaultValue={correct}
            className="w-28 rounded border border-current/20 bg-transparent px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="rounded bg-(--fg) px-4 py-2 font-medium cursor-pointer text-(--bg)"
        >
          Update
        </button>
      </form>

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-xl font-semibold tracking-tight">
            Open Graph ({ogSize.width}×{ogSize.height})
          </h2>
          <a
            href={ogSrc}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Open raw image
          </a>
        </div>
        <div
          className="overflow-hidden border border-red-500"
          style={{ aspectRatio: `${ogSize.width} / ${ogSize.height}` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- intentional: live OG ImageResponse */}
          <img
            src={ogSrc}
            alt={`OG preview: ${correct}/10 correct`}
            width={ogSize.width}
            height={ogSize.height}
            className="h-auto w-full bg-white"
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-xl font-semibold tracking-tight">
            Instagram story ({storySize.width}×{storySize.height})
          </h2>
          <a
            href={storySrc}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Open raw image
          </a>
        </div>
        <div
          className="mx-auto w-full max-w-sm overflow-hidden border border-red-500"
          style={{ aspectRatio: `${storySize.width} / ${storySize.height}` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- intentional: live OG ImageResponse */}
          <img
            src={storySrc}
            alt={`Story preview: ${correct}/10 correct`}
            width={storySize.width}
            height={storySize.height}
            className="h-auto w-full bg-white"
          />
        </div>
      </section>
    </main>
  );
}
