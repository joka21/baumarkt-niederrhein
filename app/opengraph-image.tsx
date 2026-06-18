import { ImageResponse } from "next/og";

export const alt = "Baumarkt Niederrhein – Handwerk & Material am Niederrhein";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "linear-gradient(135deg, #EA580C 0%, #E11D48 100%)",
          color: "white",
          padding: "90px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 104,
            height: 104,
            borderRadius: 28,
            background: "rgba(255,255,255,0.18)",
            fontSize: 46,
            fontWeight: 700,
            marginBottom: 44,
          }}
        >
          BN
        </div>
        <div style={{ display: "flex", fontSize: 78, fontWeight: 700, lineHeight: 1.1 }}>
          Baumarkt Niederrhein
        </div>
        <div style={{ display: "flex", fontSize: 38, marginTop: 26, opacity: 0.92 }}>
          Handwerk & Material am Niederrhein
        </div>
      </div>
    ),
    { ...size }
  );
}
