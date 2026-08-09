import Link from "next/link";
import type { Metadata } from "next";
import { buildOgPath, signCorrect, verifyShareToken } from "@/lib/scoring";

type Props = {
  searchParams: Promise<{ t?: string }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { t } = await searchParams;
  const correct = verifyShareToken(t);
  const token = signCorrect(correct);
  const title = "Color Tangle: Quiz guessing game";
  const description = `I guessed ${correct}/10 correctly. How many rare, weird color names do you know?`;
  const image = buildOgPath(token);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function SharePage({ searchParams }: Props) {
  const { t } = await searchParams;
  const correct = verifyShareToken(t);

  return (
    <main>
      <h1>Color Tangle</h1>
      <p>They got {correct}/10.</p>
      <p>Can you beat that?</p>
      <Link href="/">Play</Link>
    </main>
  );
}
