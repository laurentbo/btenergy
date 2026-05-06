"use client"
import { useState } from "react"
import type { UserProfile } from "@/data/program"

type Props = { onSave: (p: UserProfile) => void; initial?: UserProfile | null }

const INPUT_STYLE = {
  background: "var(--bg-secondary)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  color: "var(--text-primary)",
  padding: "10px 14px",
  fontSize: "14px",
  outline: "none",
  width: "100%",
  transition: "border-color 0.2s",
}

export default function ProfilForm({ onSave, initial }: Props) {
  const [form, setForm] = useState<Partial<UserProfile>>(initial ?? {})

  const set = (k: keyof UserProfile, v: string | number) => {
    setForm(f => ({ ...f, [k]: v }))
  }

  const isValid = !!form.prenom

  return (
    <div className="fade-up space-y-5">
      {/* Prénom */}
      <div>
        <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Prénom</label>
        <input
          type="text"
          placeholder="Ton prénom"
          value={form.prenom ?? ""}
          onChange={e => set("prenom", e.target.value)}
          style={INPUT_STYLE}
        />
      </div>

      {/* Date de démarrage */}
      <div>
        <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
          Date de démarrage du programme
        </label>
        <input
          type="date"
          value={form.start_date ?? new Date().toISOString().split("T")[0]}
          min={new Date(Date.now() - 21 * 86400000).toISOString().split("T")[0]}
          max={new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]}
          onChange={e => set("start_date", e.target.value)}
          style={{ ...INPUT_STYLE, colorScheme: "dark" as const }}
        />
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          Jour 1 de ton programme de 21 jours
        </p>
      </div>

      <button
        disabled={!isValid}
        onClick={() => isValid && onSave({ prenom: form.prenom!, age: form.age ?? 0, start_date: form.start_date ?? new Date().toISOString().split("T")[0] })}
        className="btn-primary w-full text-sm"
        style={{ opacity: isValid ? 1 : 0.4, cursor: isValid ? "pointer" : "not-allowed" }}
      >
        Enregistrer →
      </button>
    </div>
  )
}
