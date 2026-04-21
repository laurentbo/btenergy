"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

type JournalEntry = {
  energie: number
  humeur: number
  hydratation: number
  sommeil: number
  note: string
}

const SLIDERS = [
  { key: "energie",     label: "Énergie",    icon: "⚡", color: "var(--green)" },
  { key: "humeur",      label: "Humeur",      icon: "😊", color: "var(--blue)" },
  { key: "hydratation", label: "Hydratation", icon: "💧", color: "#38bdf8" },
  { key: "sommeil",     label: "Sommeil",     icon: "🌙", color: "#818cf8" },
] as const

export default function JournalForm({ currentDay = 1 }: { currentDay?: number }) {
  const [values, setValues] = useState<JournalEntry>({
    energie: 5, humeur: 5, hydratation: 5, sommeil: 5, note: "",
  })
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const supabase = createClient()

  const handleSlider = (key: keyof Omit<JournalEntry, "note">, val: number) => {
    setValues(v => ({ ...v, [key]: val }))
    if (status === "saved") setStatus("idle")
  }

  const handleSave = async () => {
    setStatus("saving")
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { error } = await supabase.from("journal_entries").upsert({
        user_id:     user.id,
        day:         currentDay,
        energie:     values.energie,
        humeur:      values.humeur,
        hydratation: values.hydratation,
        sommeil:     values.sommeil,
        note:        values.note || null,
      }, { onConflict: "user_id,day" })

      if (error) { setStatus("error"); return }
    }
    setStatus("saved")
    setTimeout(() => setStatus("idle"), 3000)
  }

  return (
    <div className="card p-5 fade-up">
      <h3 className="font-semibold mb-5 text-sm uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
        Journal du jour — Jour {currentDay}
      </h3>

      <div className="space-y-5 mb-5">
        {SLIDERS.map(({ key, label, icon, color }) => (
          <div key={key}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm flex gap-2 items-center" style={{ color: "var(--text-secondary)" }}>
                <span>{icon}</span> {label}
              </span>
              <span className="font-bold text-sm" style={{ color }}>{values[key]}/10</span>
            </div>
            <input
              type="range" min={1} max={10} step={1}
              value={values[key]}
              onChange={e => handleSlider(key, Number(e.target.value))}
              className="slider-track"
              style={{ accentColor: color }}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>Faible</span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>Excellent</span>
            </div>
          </div>
        ))}
      </div>

      <textarea
        rows={3}
        placeholder="Note libre : comment vous sentez-vous aujourd'hui ?"
        value={values.note}
        onChange={e => { setValues(v => ({ ...v, note: e.target.value })); if (status === "saved") setStatus("idle") }}
        className="w-full rounded-xl p-3 text-sm resize-none outline-none"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          color: "var(--text-primary)",
          marginBottom: "16px",
        }}
      />

      <button
        onClick={handleSave}
        disabled={status === "saving"}
        className="btn-primary w-full text-sm"
        style={{ opacity: status === "saving" ? 0.7 : 1 }}>
        {status === "saving" ? "Enregistrement..." : status === "saved" ? "✓ Journal enregistré" : status === "error" ? "❌ Erreur — réessayez" : "Enregistrer le journal"}
      </button>
    </div>
  )
}
