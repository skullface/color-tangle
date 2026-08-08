"use client";

import { useSyncExternalStore } from "react";

type ThemeColors = { bg: string; fg: string };

const serverThemeColors: ThemeColors = { bg: "#ffffff", fg: "#111111" };
let cachedThemeColors: ThemeColors = serverThemeColors;

function getThemeColors(): ThemeColors {
  const styles = getComputedStyle(document.documentElement);
  const next: ThemeColors = {
    bg: styles.getPropertyValue("--bg").trim() || "#ffffff",
    fg: styles.getPropertyValue("--fg").trim() || "#111111",
  };
  if (next.bg === cachedThemeColors.bg && next.fg === cachedThemeColors.fg) {
    return cachedThemeColors;
  }
  cachedThemeColors = next;
  return cachedThemeColors;
}

function subscribeTheme(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

export function useThemeColors(): ThemeColors {
  return useSyncExternalStore(
    subscribeTheme,
    getThemeColors,
    () => serverThemeColors,
  );
}
