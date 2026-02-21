import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ZEEK — AI/Tech Daily Digest";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
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
          backgroundColor: "#0a0a0a",
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 700, letterSpacing: "-0.02em" }}>
          ZEEK
        </div>
        <div style={{ fontSize: 28, color: "#a3a3a3", marginTop: 16 }}>
          AI/Tech Daily Digest
        </div>
      </div>
    ),
    { ...size }
  );
}
