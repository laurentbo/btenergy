"use client"
import { useState } from "react"

const MOODS = [
  {
    score: 1,
    label: "À plat",
    ack: "Merci de l'avoir partagé. Prends soin de toi aujourd'hui.",
    icon: (
      <svg viewBox="0 0 28 28" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* nuage + gouttes */}
        <path d="M7.5 18a4 4 0 0 1 .4-8 6 6 0 0 1 11.3 2.5h.3a3.5 3.5 0 0 1 0 7H7.5z" />
        <line x1="10" y1="21.5" x2="10" y2="24" />
        <line x1="14" y1="22" x2="14" y2="25" />
        <line x1="18" y1="21.5" x2="18" y2="23.5" />
      </svg>
    ),
  },
  {
    score: 2,
    label: "Ça va",
    ack: "Noté. Le rythme se pose jour après jour.",
    icon: (
      <svg viewBox="0 0 28 28" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="14" cy="14" r="9" />
        <line x1="10.5" y1="17" x2="17.5" y2="17" />
        <circle cx="11" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="17" cy="12" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    score: 3,
    label: "Léger",
    ack: "C'est une belle sensation. Le corps avance bien.",
    icon: (
      <svg viewBox="0 0 28 28" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* feuille */}
        <path d="M7 21 C7 21 9 9 21 7 C21 7 19 19 7 21z" />
        <line x1="7" y1="21" x2="15" y2="13" />
      </svg>
    ),
  },
  {
    score: 4,
    label: "Plein d'énergie",
    ack: "Super ! Profite de cette énergie.",
    icon: (
      <svg viewBox="0 0 28 28" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="14" cy="14" r="5" />
        <line x1="14" y1="3.5" x2="14" y2="6.5" />
        <line x1="14" y1="21.5" x2="14" y2="24.5" />
        <line x1="3.5" y1="14" x2="6.5" y2="14" />
        <line x1="21.5" y1="14" x2="24.5" y2="14" />
        <line x1="7.3" y1="7.3" x2="9.4" y2="9.4" />
        <line x1="18.6" y1="18.6" x2="20.7" y2="20.7" />
        <line x1="20.7" y1="7.3" x2="18.6" y2="9.4" />
        <line x1="9.4" y1="18.6" x2="7.3" y2="20.7" />
      </svg>
    ),
  },
]

type Props = {
  initialScore: number | null
  onSelect: (score: number) => Promise<void>
}

export default function MoodPicker({ initialScore, onSelect }: Props) {
  const [selected, setSelected] = useState<number | null>(initialScore)
  const [saving, setSaving] = useState(false)

  const mood = MOODS.find((m) => m.score === selected)

  const handleSelect = async (score: number) => {
    if (saving) return
    setSelected(score)
    setSaving(true)
    try { await onSelect(score) } finally { setSaving(false) }
  }

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-center"
        style={{ color: "var(--text-mute)" }}>
        Comment tu te sens aujourd'hui ?
      </p>

      <div className="grid grid-cols-4 gap-2">
        {MOODS.map(({ score, label, icon }) => {
          const isSelected = selected === score
          return (
            <button
              key={score}
              onClick={() => handleSelect(score)}
              className="flex flex-col items-center gap-2 py-3 px-1 rounded-2xl transition-all"
              style={{
                background: isSelected ? "rgba(62,142,79,0.08)" : "var(--bg-surface)",
                border: isSelected
                  ? "1.5px solid #3E8E4F"
                  : "1.5px solid var(--line)",
                boxShadow: isSelected ? "0 2px 12px rgba(62,142,79,0.10)" : "none",
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  display: "block",
                  color: isSelected ? "#3E8E4F" : "#235236",
                  stroke: isSelected ? "#3E8E4F" : "#235236",
                  strokeWidth: 1.6,
                }}
              >
                {icon}
              </span>
              <span
                className="text-xs font-semibold leading-tight text-center"
                style={{ color: isSelected ? "#235236" : "var(--text-mute)" }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Accusé doux */}
      <p
        className="text-xs text-center transition-all"
        style={{
          color: "var(--accent)",
          minHeight: "18px",
          opacity: mood ? 1 : 0,
          fontStyle: "italic",
        }}
      >
        {mood?.ack ?? ""}
      </p>
    </div>
  )
}
