import { createHmac, timingSafeEqual } from "node:crypto";

import type { Color } from "./colors";

export type Answer = {
  picked: Color;
  correct: boolean;
};

const MAX_CORRECT = 10;

export function clampCorrect(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(MAX_CORRECT, Math.max(0, Math.trunc(value)));
}

function getShareSecret(): string {
  const secret = process.env.SHARE_SECRET;
  if (!secret) {
    throw new Error("SHARE_SECRET is not set");
  }
  return secret;
}

function signPayload(value: string): string {
  return createHmac("sha256", getShareSecret())
    .update(`v1:${value}`)
    .digest("base64url");
}

/** Mint a tamper-evident share token for a clamped score. Server-only. */
export function signCorrect(correct: number): string {
  const value = String(clampCorrect(correct));
  return `${value}.${signPayload(value)}`;
}

/**
 * Verify a share token and return the score.
 * Invalid / missing / forged tokens resolve to 0.
 */
export function verifyShareToken(token: string | null | undefined): number {
  if (!token || !process.env.SHARE_SECRET) return 0;

  const [value, sig, ...rest] = token.split(".");
  if (!value || !sig || rest.length > 0) return 0;

  const correct = clampCorrect(Number.parseInt(value, 10));
  if (value !== String(correct)) return 0;

  const expected = signPayload(value);
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length) return 0;
  if (!timingSafeEqual(sigBuf, expectedBuf)) return 0;

  return correct;
}

export function buildSharePath(token: string): string {
  return `/s?t=${encodeURIComponent(token)}`;
}

export function buildStoryPath(token: string): string {
  return `/s/story?t=${encodeURIComponent(token)}`;
}

export function buildOgPath(token: string): string {
  return `/s/og?t=${encodeURIComponent(token)}`;
}

export function buildShareText(url: string): string {
  return `🕶️ ${url}`;
}
