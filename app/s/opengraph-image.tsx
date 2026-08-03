import { ImageResponse } from "next/og";

export const alt = "Color Tangle score";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

type Props = {
  searchParams?: Promise<{ score?: string; correct?: string }>;
};

export default async function Image({ searchParams }: Props) {
  const params = searchParams ? await searchParams : {};
  const score = params.score ?? "0";
  const correct = params.correct ?? "0";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          color: "#111111",
          fontSize: 48,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700 }}>Color Tangle</div>
        <div style={{ marginTop: 24 }}>{score} points</div>
        <div style={{ marginTop: 12, fontSize: 36 }}>{correct}/10 correct</div>
        <div style={{ marginTop: 32, fontSize: 28 }}>Can you beat this?</div>
      </div>
    ),
    { ...size },
  );
}
