"use client"
import { useState } from "react"
import type { UserProfile } from "@/data/program"

type Props = { onSave: (p: UserProfile) => void; initial?: UserProfile | null }

const INPUT: React.CSSProperties = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  color: "#0f172a",
  padding: "10px 14px",
  fontSize: "14px",
  outline: "none",
  width: "100%",
}

const LABEL: React.CSSProperties = {
  display: "block",
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.08em",
  color: "#94a3b8",
  marginBottom: "6px",
  textTransform: "uppercase" as const,
}

export default function ProfilForm({ onSave, initial }: Props) {
  const [form, setForm] = useState<Partial<UserProfile>>(initial ?? {})

  const set = (k: keyof UserProfile, v: string | number) =>
    setForm(f => ({ ...f, [k]: v }))

  const isValid = !!form.prenom

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Prénom */}
      <div>
        <label style={LABEL}>Prénom</label>
        <input
          type="text"
          placeholder="Ton prénom"
          value={form.prenom ?? ""}
          onChange={e => set("prenom", e.target.value)}
          style={INPUT}
        />
      </div>

      {/* Genre */}
      <div>
        <label style={LABEL}>Genre</label>
        <div style={{ display: "flex", gap: "8px" }}>
          {(["homme", "femme", "autre"] as const).map(g => (
            <button
              key={g}
              onClick={() => set("genre", g)}
              style={{
                flex: 1,
                padding: "9px 4px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                border: form.genre === g ? "2px solid #16a34a" : "1px solid #e2e8f0",
                background: form.genre === g ? "#f0fdf4" : "#f8fafc",
                color: form.genre === g ? "#16a34a" : "#64748b",
              }}
            >
              {g === "homme" ? "Homme" : g === "femme" ? "Femme" : "Autre"}
            </button>
          ))}
        </div>
      </div>

      {/* Taille + Poids côte à côte */}
      <div style={{ display: "flex", gap: "12px" }}>
        <div style={{ flex: 1 }}>
          <label style={LABEL}>Taille (cm)</label>
          <input
            type="number"
            placeholder="ex : 170"
            min={100} max={230}
            value={form.taille || ""}
            onChange={e => set("taille", parseInt(e.target.value) || 0)}
            style={INPUT}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={LABEL}>Poids (kg)</label>
          <input
            type="number"
            placeholder="ex : 70"
            min={30} max={300}
            step={0.1}
            value={form.poids || ""}
            onChange={e => set("poids", parseFloat(e.target.value) || 0)}
            style={INPUT}
          />
        </div>
      </div>

      {/* Âge */}
      <div>
        <label style={LABEL}>Âge</label>
        <input
          type="number"
          placeholder="ex : 35"
          min={10} max={100}
          value={form.age || ""}
          onChange={e => set("age", parseInt(e.target.value) || 0)}
          style={INPUT}
        />
      </div>

      <button
        disabled={!isValid}
        onClick={() => isValid && onSave({
          prenom: form.prenom!,
          age: form.age,
          genre: form.genre,
          taille: form.taille,
          poids: form.poids,
          start_date: form.start_date ?? new Date().toISOString().split("T")[0],
        })}

        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "12px",
          fontWeight: 700,
          fontSize: "14px",
          background: isValid ? "#16a34a" : "#e2e8f0",
          color: isValid ? "#fff" : "#94a3b8",
          border: "none",
          cursor: isValid ? "pointer" : "not-allowed",
          transition: "background 0.15s",
        }}
      >
        Enregistrer →
      </button>
    </div>
  )
}
