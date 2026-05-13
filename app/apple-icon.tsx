import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: "linear-gradient(145deg, #16a34a, #22c55e)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        {/* Barres d'énergie */}
        <div style={{ display: "flex", gap: 7, alignItems: "flex-end", marginBottom: 4 }}>
          <div style={{ width: 18, height: 42, background: "rgba(255,255,255,0.7)", borderRadius: 6 }} />
          <div style={{ width: 18, height: 66, background: "white", borderRadius: 6 }} />
          <div style={{ width: 18, height: 52, background: "rgba(255,255,255,0.85)", borderRadius: 6 }} />
        </div>
        {/* Texte BTE */}
        <div style={{ fontSize: 22, fontWeight: 900, color: "white", letterSpacing: 1 }}>BTE</div>
      </div>
    ),
    { ...size }
  )
}
