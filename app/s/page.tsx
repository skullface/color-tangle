import Link from "next/link";
import type { Metadata } from "next";
import { parseCorrectParam } from "@/lib/scoring";

type Props = {
  searchParams: Promise<{ correct?: string }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { correct: raw } = await searchParams;
  const correct = parseCorrectParam(raw);

  return {
    title: `Color Tangle: Quiz guessing game`,
    description: `I guessed ${correct}/10 correctly. How many rare, weird color names do you know?`,
    openGraph: {
      title: `Color Tangle: Quiz guessing game`,
      description: `I guessed ${correct}/10 correctly. How many rare, weird color names do you know?`,
      images: [`/s/og?correct=${correct}`],
    },
  };
}

export default async function SharePage({ searchParams }: Props) {
  const { correct: raw } = await searchParams;
  const correct = parseCorrectParam(raw);

  return (
    <main>
      <h1>Color Tangle</h1>
      <p>They got {correct}/10.</p>
      <p>Can you beat that?</p>
      <Link href="/">Play</Link>
    </main>
  );
}
