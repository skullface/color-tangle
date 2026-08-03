import Link from "next/link";
import type { Metadata } from "next";

type Props = {
  searchParams: Promise<{ score?: string; correct?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { score = "0", correct = "0" } = await searchParams;

  return {
    title: `Color Tangle — ${score} points`,
    description: `Scored ${correct}/10 in Color Tangle. Can you beat it?`,
    openGraph: {
      title: `Color Tangle — ${score} points`,
      description: `${correct}/10 correct. Can you beat this score?`,
      images: [`/s/opengraph-image?score=${score}&correct=${correct}`],
    },
  };
}

export default async function SharePage({ searchParams }: Props) {
  const { score = "0", correct = "0" } = await searchParams;

  return (
    <main>
      <h1>Color Tangle</h1>
      <p>
        They scored {score} ({correct}/10).
      </p>
      <p>Can you beat that?</p>
      <Link href="/">Play</Link>
    </main>
  );
}
