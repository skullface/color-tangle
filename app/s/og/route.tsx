import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { size } from "@/app/s/og/size";
import {
  franklinSemiBold,
  invalidShareImageResponse,
  shareImageHeaders,
} from "@/app/s/share-image";
import { parseShareToken } from "@/lib/scoring";

export const runtime = "nodejs";

const bgSrcPromise = readFile(
  join(process.cwd(), "public/og-bg.png"),
).then((bg) => `data:image/png;base64,${bg.toString("base64")}`);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const correct = parseShareToken(searchParams.get("t"));
  if (correct === null) {
    return invalidShareImageResponse();
  }

  const [bgSrc, semibold] = await Promise.all([
    bgSrcPromise,
    franklinSemiBold,
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "flex-start",
        color: "000000",
        fontSize: 48,
        fontFamily: "Libre Franklin",
        backgroundImage: `url(${bgSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          paddingTop: 120,
          paddingRight: 120,
          fontSize: 120,
          maxWidth: 920,
          letterSpacing: -2,
          lineHeight: 1.1,
          fontWeight: 600,
          textAlign: "right",
        }}
      >
        Can you guess {correct} out of 10 weird, rare color names?
      </div>
      <div
        style={{
          display: "flex",
          paddingRight: 100,
          marginTop: 24,
          fontSize: 56,
          lineHeight: 1.4,
          width: 520,
          opacity: 0.5,
          textAlign: "right",
        }}
      >
        Because I can. Try to beat me.
      </div>
    </div>,
    {
      ...size,
      headers: shareImageHeaders,
      fonts: [
        {
          name: "Libre Franklin",
          data: semibold,
          style: "normal",
          weight: 600,
        },
      ],
    },
  );
}
