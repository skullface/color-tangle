import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { size } from "@/app/s/story/size";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const franklinRegular = readFile(
  join(process.cwd(), "assets/fonts/LibreFranklin-Regular.woff"),
);
const franklinSemiBold = readFile(
  join(process.cwd(), "assets/fonts/LibreFranklin-SemiBold.woff"),
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const correct = searchParams.get("correct") ?? "0";

  const [bg, regular, semibold] = await Promise.all([
    readFile(join(process.cwd(), "public/og-bg-portrait.png")),
    franklinRegular,
    franklinSemiBold,
  ]);
  const bgSrc = `data:image/png;base64,${bg.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        textAlign: "center",
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
          justifyContent: "center",
          paddingTop: 520,
          fontSize: 60,
          width: "100%",
          letterSpacing: -1.5,
          fontWeight: 600,
          textAlign: "center",
        }}
      >
        Can you guess {correct} out of 10
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          fontSize: 60,
          width: "100%",
          letterSpacing: -1.5,
          fontWeight: 600,
          textAlign: "center",
        }}
      >
        weird, rare color names?
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 24,
          fontSize: 40,
          lineHeight: 1.4,
          width: "100%",
          opacity: 0.5,
          textAlign: "center",
        }}
      >
        Because I can. Try to beat me.
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Libre Franklin",
          data: regular,
          style: "normal",
          weight: 400,
        },
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
