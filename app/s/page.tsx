import type { Metadata } from "next";
import { Game } from "@/components/Game";
import { getGameConfig } from "@/lib/config";
import {
  buildOgPath,
  parseShareToken,
  signCorrect,
  verifyShareToken,
} from "@/lib/scoring";

type Props = {
  searchParams: Promise<{ t?: string }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { t } = await searchParams;
  const correct = verifyShareToken(t);
  const token = signCorrect(correct);
  const title = "Color Tangle: A color quiz guessing game";
  const description = `I guessed ${correct * 10}% correctly. How many rare, weird color names do you know?`;
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
  const challengeCorrect = parseShareToken(t);
  const config = await getGameConfig();

  return <Game config={config} challengeCorrect={challengeCorrect} />;
}
