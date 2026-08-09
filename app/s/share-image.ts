import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Valid score tokens are stable → CDN can keep images forever. */
export const SHARE_IMAGE_CACHE_CONTROL =
  "public, max-age=31536000, immutable";

export const shareImageHeaders = {
  "Cache-Control": SHARE_IMAGE_CACHE_CONTROL,
} as const;

/** Cheap reject so forged/random `t` values never hit ImageResponse. */
export function invalidShareImageResponse(): Response {
  return new Response("Invalid share token", {
    status: 404,
    headers: {
      "Cache-Control": "public, max-age=60, s-maxage=300",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

/** Module-scoped load — one read per isolate, shared by og + story routes. */
export const franklinSemiBold = readFile(
  join(process.cwd(), "assets/fonts/LibreFranklin-SemiBold.woff"),
);
