import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Rudraksha Sacred Store — Home-grown organic rudraksha";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
          background: "linear-gradient(135deg, #fae8d6 0%, #fffaf3 45%, #fef3c7 100%)",
          fontFamily: "Georgia, serif",
          padding: 80,
        }}
      >
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: 9999,
            background: "radial-gradient(circle at 38% 32%, #c96a2b, #7c3f1a 55%, #4a230d)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff7ed",
            fontSize: 80,
            boxShadow: "0 20px 40px rgba(74,35,13,0.35)",
          }}
        >
          ॐ
        </div>
        <div style={{ marginTop: 40, fontSize: 68, fontWeight: 700, color: "#4a230d", textAlign: "center" }}>
          Rudraksha Sacred
        </div>
        <div style={{ marginTop: 16, fontSize: 34, color: "#7c3f1a", textAlign: "center" }}>
          Home-grown · Pure Organic · Mangalore, Karnataka
        </div>
        <div style={{ marginTop: 28, fontSize: 26, color: "#a9521f" }}>
          1–14 Mukhi & rare specials · Worldwide shipping
        </div>
      </div>
    ),
    { ...size }
  );
}
