"use server";

import { buildOptions, pickRoundColors } from "@/lib/colors";
import { getGameConfig } from "@/lib/config";
import { signPlayToken, verifyPlayToken } from "@/lib/play";
import {
  buildSharePath,
  buildStoryPath,
  signCorrect,
} from "@/lib/scoring";

export async function startPlay() {
  const config = await getGameConfig();
  const targets = pickRoundColors(config.colors, config.rounds);
  const optionsByRound = targets.map((target) =>
    buildOptions(target, config.colors),
  );
  const playToken = signPlayToken(targets.map((target) => target.name));

  return { targets, optionsByRound, playToken };
}

export async function finishPlay(playToken: string, picks: string[]) {
  if (typeof playToken !== "string" || !Array.isArray(picks)) {
    return null;
  }
  if (!picks.every((pick) => typeof pick === "string")) {
    return null;
  }

  const targets = verifyPlayToken(playToken);
  if (!targets || picks.length !== targets.length) {
    return null;
  }

  const correct = targets.reduce(
    (count, target, index) => count + (target === picks[index] ? 1 : 0),
    0,
  );

  try {
    const token = signCorrect(correct);
    return {
      correct,
      path: buildSharePath(token),
      storyPath: buildStoryPath(token),
    };
  } catch {
    return null;
  }
}
