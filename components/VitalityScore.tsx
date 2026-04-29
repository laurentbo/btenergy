"use client"

interface Props {
  score: number
  trend: number
}

export default function VitalityScore({ score, trend }: Props) {
  const r = 28
  const circ = 2 * Math.PI * r          // ≈ 175.9
  const filled = (score / 100) * circ
  const dash = `${filled} ${circ}`

  const label =
    trend > 0 ? "Vitalité en hausse" :
    trend < 0 ? "À surveiller"       :
                "Vitalité stable"

  const arrow = trend > 0 ? "↑" : trend < 0 ? "↓" : "→"
  const arrowColor =
    trend > 0 ? "var(--green-dim)" :
    trend < 0 ? "#f87171"          :
                "var(--text-muted)"

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "16px",
      background: "var(--bg-secondary)", borderRadius: "16px",
      padding: "14px 18px",
      border: "1px solid rgba(255,255,255,0.08)",
    }}>
      {/* Cercle SVG */}
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none"
          stroke="rgba(255,255,255,0.07)" strokeWidth="6" />
        <circle cx="36" cy="36" r={r} fill="none"
          stroke="var(--green-dim)" strokeWidth="6"
          strokeDasharray={dash} strokeDashoffset="0"
          strokeLinecap="round"
          style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }} />
        <text x="36" y="33" textAnchor="middle"
          fill="#fff" fontSize="13" fontWeight="800" fontFamily="Plus Jakarta Sans, system-ui">
          {score}
        </text>
        <text x="36" y="45" textAnchor="middle"
          fill="rgba(255,255,255,0.45)" fontSize="9" fontFamily="Plus Jakarta Sans, system-ui">
          /100
        </text>
      </svg>

      {/* Label */}
      <div>
        <p style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)", marginBottom: "2px" }}>
          {label}
        </p>
        <p style={{ fontSize: "12px", color: arrowColor, fontWeight: 600 }}>
          {arrow} Score de vitalité
        </p>
        <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
          Mis à jour chaque jour
        </p>
      </div>
    </div>
  )
}
