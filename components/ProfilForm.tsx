"use client"
import { useState } from "react"
import type { UserProfile } from "@/data/program"

type Props = { onSave: (p: UserProfile) => void; initial?: UserProfile | null }

export default function ProfilForm({ onSave, initial }: Props) {
  const [form, setForm] = useState<Partial<UserProfile>>(initial ?? {})
  const set = (k: keyof UserProfile, v: string | number) => setForm(f => ({ ...f, [k]: v }))
  const isValid = !!form.prenom

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Prénom */}
      <div>
        <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "8px" }}>
          👋 Comment tu t&apos;appelles ?
        </p>
        <input
          type="text"
          placeholder="Ton prénom"
          value={form.prenom ?? ""}
          onChange={e => set("prenom", e.target.value)}
          style={{
            width: "100%", padding: "12px 14px", borderRadius: "12px",
            border: "1.5px solid #e2e8f0", fontSize: "15px", color: "#0f172a",
            background: "#f8fafc", outline: "none", boxSizing: "border-box",
          }}
        />
      </div>

      {/* Genre */}
      <div>
        <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "8px" }}>
          🙋 Tu es…
        </p>
        <div style={{ display: "flex", gap: "8px" }}>
          {(["homme", "femme", "autre"] as const).map(g => (
            <button key={g} onClick={() => set("genre", g)} style={{
              flex: 1, padding: "10px 4px", borderRadius: "12px",
              fontSize: "13px", fontWeight: 600, cursor: "pointer",
              border: form.genre === g ? "2px solid #16a34a" : "1.5px solid #e2e8f0",
              background: form.genre === g ? "#f0fdf4" : "#fff",
              color: form.genre === g ? "#16a34a" : "#64748b",
              transition: "all 0.15s",
            }}>
              {g === "homme" ? "Un homme" : g === "femme" ? "Une femme" : "Autre"}
            </button>
          ))}
        </div>
      </div>

      {/* Taille + Poids */}
      <div>
        <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "8px" }}>
          📏 Taille &amp; poids — pour suivre ta progression
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ flex: 1 }}>
            <input
              type="number" placeholder="Taille (cm)" min={100} max={230}
              value={form.taille || ""}
              onChange={e => set("taille", parseInt(e.target.value) || 0)}
              style={{
                width: "100%", padding: "11px 14px", borderRadius: "12px",
                border: "1.5px solid #e2e8f0", fontSize: "14px", color: "#0f172a",
                background: "#f8fafc", outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <input
              type="number" placeholder="Poids (kg)" min={30} max={300} step={0.1}
              value={form.poids || ""}
              onChange={e => set("poids", parseFloat(e.target.value) || 0)}
              style={{
                width: "100%", padding: "11px 14px", borderRadius: "12px",
                border: "1.5px solid #e2e8f0", fontSize: "14px", color: "#0f172a",
                background: "#f8fafc", outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
        </div>
      </div>

      {/* Âge */}
      <div>
        <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "8px" }}>
          🎂 Ton âge
        </p>
        <input
          type="number" placeholder="ex : 35" min={10} max={100}
          value={form.age || ""}
          onChange={e => set("age", parseInt(e.target.value) || 0)}
          style={{
            width: "100%", padding: "11px 14px", borderRadius: "12px",
            border: "1.5px solid #e2e8f0", fontSize: "14px", color: "#0f172a",
            background: "#f8fafc", outline: "none", boxSizing: "border-box",
          }}
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
          width: "100%", padding: "14px", borderRadius: "14px",
          fontWeight: 700, fontSize: "15px",
          background: isValid ? "#16a34a" : "#e2e8f0",
          color: isValid ? "#fff" : "#94a3b8",
          border: "none", cursor: isValid ? "pointer" : "not-allowed",
          transition: "background 0.15s",
        }}
      >
        {isValid ? `C'est parti ${form.prenom} 🌿` : "Enregistre tes repères →"}
      </button>

    </div>
  )
}
