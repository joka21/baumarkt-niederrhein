import { ImageResponse } from "next/og";

// "BN" auf primary-strong (#047857) – gemeinsame Vorlage für Favicon und Apple-Touch-Icon.
export function iconBild(groesse: number, rundung: number) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#047857",
          color: "#ffffff",
          borderRadius: rundung,
          fontSize: Math.round(groesse * 0.46),
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        BN
      </div>
    ),
    { width: groesse, height: groesse }
  );
}
