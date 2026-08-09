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

  return {
    title: `Color Tangle: Quiz guessing game`,
    description: `I guessed ${correct}/10 correctly. How many rare, weird color names do you know?`,
    openGraph: {
      title: `Color Tangle: Quiz guessing game`,
      description: `I guessed ${correct}/10 correctly. How many rare, weird color names do you know?`,
      images: [buildOgPath(token)],
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
