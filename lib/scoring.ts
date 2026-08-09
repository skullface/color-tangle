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

/** Truncated HMAC length in base64url chars (~48 bits). */
const SIG_CHARS = 8;

function signPayload(value: string): string {
  return createHmac("sha256", getShareSecret())
    .update(`v1:${value}`)
    .digest("base64url")
    .slice(0, SIG_CHARS);
}

/** Mint a tamper-evident share token for a clamped score. Server-only. */
export function signCorrect(correct: number): string {
  const value = String(clampCorrect(correct));
  return `${value}.${signPayload(value)}`;
}

/**
 * Verify a share token and return the score, or `null` if missing/forged.
 * Prefer this when invalid input must not be treated like a real 0.
 */
export function parseShareToken(
  token: string | null | undefined,
): number | null {
  if (!token || !process.env.SHARE_SECRET) return null;

  const [value, sig, ...rest] = token.split(".");
  if (!value || !sig || rest.length > 0) return null;

  const correct = clampCorrect(Number.parseInt(value, 10));
  if (value !== String(correct)) return null;

  const expected = signPayload(value);
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length) return null;
  if (!timingSafeEqual(sigBuf, expectedBuf)) return null;

  return correct;
}

/**
 * Verify a share token and return the score.
 * Invalid / missing / forged tokens resolve to 0.
 */
export function verifyShareToken(token: string | null | undefined): number {
  return parseShareToken(token) ?? 0;
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
