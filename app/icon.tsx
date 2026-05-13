import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "linear-gradient(135deg, #16a34a, #22c55e)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
          <div style={{ width: 4, height: 10, background: "white", borderRadius: 2 }} />
          <div style={{ width: 4, height: 16, background: "white", borderRadius: 2 }} />
          <div style={{ width: 4, height: 12, background: "white", borderRadius: 2 }} />
        </div>
      </div>
    ),
    { ...size }
  )
}
