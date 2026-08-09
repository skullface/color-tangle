import { createHmac, timingSafeEqual } from "node:crypto";

type PlayPayload = {
  v: 1;
  targets: string[];
};

function getShareSecret(): string {
  const secret = process.env.SHARE_SECRET;
  if (!secret) {
    throw new Error("SHARE_SECRET is not set");
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getShareSecret())
    .update(`play:v1:${payload}`)
    .digest("base64url");
}

export function signPlayToken(targets: string[]): string {
  const payload = Buffer.from(
    JSON.stringify({ v: 1, targets } satisfies PlayPayload),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyPlayToken(token: string): string[] | null {
  if (!process.env.SHARE_SECRET) return null;

  const [payload, sig, ...rest] = token.split(".");
  if (!payload || !sig || rest.length > 0) return null;

  const expected = sign(payload);
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length) return null;
  if (!timingSafeEqual(sigBuf, expectedBuf)) return null;

  try {
    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as PlayPayload;
    if (
      parsed?.v !== 1 ||
      !Array.isArray(parsed.targets) ||
      !parsed.targets.every((name) => typeof name === "string")
    ) {
      return null;
    }
    return parsed.targets;
  } catch {
    return null;
  }
}
