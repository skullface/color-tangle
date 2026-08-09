import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { size } from "@/app/s/og/size";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const score = searchParams.get("score") ?? "0";
  const correct = searchParams.get("correct") ?? "0";

  const bg = await readFile(join(process.cwd(), "public/og-bg.png"));
  const bgSrc = `data:image/png;base64,${bg.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#111111",
        fontSize: 48,
        fontFamily: "sans-serif",
        backgroundImage: `url(${bgSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div style={{ display: "flex", fontSize: 64, fontWeight: 700 }}>
        Color Tangle
      </div>
      <div style={{ display: "flex", marginTop: 24 }}>{`${score} points`}</div>
      <div style={{ display: "flex", marginTop: 12, fontSize: 36 }}>
        {`${correct}/10 correct`}
      </div>
      <div style={{ display: "flex", marginTop: 32, fontSize: 28 }}>
        Can you beat this?
      </div>
    </div>,
    { ...size },
  );
}
