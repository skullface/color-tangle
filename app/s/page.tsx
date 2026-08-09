import Link from "next/link";
import type { Metadata } from "next";

type Props = {
  searchParams: Promise<{ correct?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { correct = "0" } = await searchParams;

  return {
    title: `Color Tangle — ${correct}/10`,
    description: `Got ${correct}/10 in Color Tangle. Can you beat it?`,
    openGraph: {
      title: `Color Tangle — ${correct}/10`,
      description: `${correct}/10 correct. Can you beat this?`,
      images: [`/s/og?correct=${correct}`],
    },
  };
}

export default async function SharePage({ searchParams }: Props) {
  const { correct = "0" } = await searchParams;

  return (
    <main>
      <h1>Color Tangle</h1>
      <p>They got {correct}/10.</p>
      <p>Can you beat that?</p>
      <Link href="/">Play</Link>
    </main>
  );
}
