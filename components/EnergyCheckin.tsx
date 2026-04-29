"use client"
import { useState, useEffect } from "react"

const EMOJIS = [
  { value: 1, emoji: "😴", label: "Épuisé·e" },
  { value: 2, emoji: "😐", label: "Fatigué·e" },
  { value: 3, emoji: "🙂", label: "Correct" },
  { value: 4, emoji: "⚡", label: "Bien" },
  { value: 5, emoji: "🔥", label: "Au top" },
]

interface Props {
  currentDay: number
  onCheckin: (value: number) => void
}

export default function EnergyCheckin({ currentDay, onCheckin }: Props) {
  const key = `btenergy_checkin_day_${currentDay}`
  const [selected, setSelected] = useState<number | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(key)
    if (stored) { setSelected(Number(stored)); setSaved(true) }
  }, [key])

  const handleValidate = () => {
    if (selected === null) return
    localStorage.setItem(key, String(selected))
    setSaved(true)
    onCheckin(selected)
  }

  return (
    <div style={{
      background: "var(--bg-secondary)", borderRadius: "16px",
      padding: "16px 18px", border: "1px solid rgba(255,255,255,0.08)",
    }}>
      <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)",
        textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>
        Comment vous sentez-vous aujourd&apos;hui ?
      </p>

      <div style={{ display: "flex", gap: "8px", justifyContent: "space-between" }}>
        {EMOJIS.map(({ value, emoji, label }) => (
          <button key={value} onClick={() => !saved && setSelected(value)}
            style={{
              flex: 1, padding: "10px 4px", borderRadius: "12px", cursor: saved ? "default" : "pointer",
              border: selected === value
                ? "1.5px solid var(--green-dim)"
                : "1px solid rgba(255,255,255,0.08)",
              background: selected === value
                ? "rgba(220,224,61,0.12)"
                : "rgba(255,255,255,0.04)",
              transition: "all 0.15s",
              display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
            }}>
            <span style={{ fontSize: "22px" }}>{emoji}</span>
            <span style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 600 }}>{label}</span>
          </button>
        ))}
      </div>

      {!saved && selected !== null && (
        <button onClick={handleValidate}
          className="btn-primary w-full mt-3"
          style={{ width: "100%", marginTop: "12px" }}>
          Valider mon ressenti
        </button>
      )}

      {saved && (
        <p style={{ fontSize: "12px", color: "var(--green-dim)", marginTop: "10px",
          textAlign: "center", fontWeight: 600 }}>
          ✓ Ressenti enregistré
        </p>
      )}
    </div>
  )
}
