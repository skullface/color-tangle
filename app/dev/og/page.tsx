import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { size } from "@/app/s/og/size";

export const metadata: Metadata = {
  title: "OG preview",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ score?: string; correct?: string }>;
};

export default async function DevOgPreview({ searchParams }: Props) {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const { score = "700", correct = "7" } = await searchParams;
  const imageSrc = `/s/og?score=${encodeURIComponent(score)}&correct=${encodeURIComponent(correct)}`;

  return (
    <main className="mx-auto flex flex-col gap-8 p-4 font-franklin">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Results share OG preview
        </h1>
        <p className="max-w-prose">
          Edit{" "}
          <code className="rounded bg-(--fg)/10 px-1.5 py-0.5">
            app/s/og/route.tsx
          </code>{" "}
          and refresh. Image is {size.width}×{size.height}.
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
        <a
          href={imageSrc}
          target="_blank"
          rel="noreferrer"
          className="px-2 py-2 underline"
        >
          Open raw image
        </a>
      </form>

      <div
        className="overflow-hidden border border-red-500"
        style={{ aspectRatio: `${size.width} / ${size.height}` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- intentional: live OG ImageResponse */}
        <img
          src={imageSrc}
          alt={`OG preview: ${correct}/10 correct`}
          width={size.width}
          height={size.height}
          className="h-auto w-full bg-white"
        />
      </div>
    </main>
  );
}
