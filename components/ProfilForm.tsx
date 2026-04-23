"use client"
import { useState } from "react"
import { calcIMC, calcBesoinsBase, imcLabel, portionMultiplier, type UserProfile } from "@/data/program"

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
  const [touched, setTouched] = useState(false)

  const set = (k: keyof UserProfile, v: string | number) => {
    setForm(f => ({ ...f, [k]: v }))
    setTouched(true)
  }

  const isValid = form.prenom && form.genre && form.age && form.taille && form.poids

  const imc    = form.poids && form.taille ? calcIMC(form.poids, form.taille) : null
  const imcInfo = imc ? imcLabel(imc) : null
  const kcal   = isValid ? calcBesoinsBase(form as UserProfile) : null
  const portM  = isValid ? portionMultiplier(form as UserProfile) : null

  return (
    <div className="fade-up space-y-5">
      {/* Prénom */}
      <div>
        <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Prénom</label>
        <input
          type="text"
          placeholder="Votre prénom"
          value={form.prenom ?? ""}
          onChange={e => set("prenom", e.target.value)}
          style={INPUT_STYLE}
        />
      </div>

      {/* Genre */}
      <div>
        <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Genre</label>
        <div className="grid grid-cols-2 gap-3">
          {(["homme", "femme"] as const).map(g => (
            <button
              key={g}
              onClick={() => set("genre", g)}
              className="py-3 rounded-xl font-semibold text-sm capitalize transition-all"
              style={{
                background: form.genre === g ? "linear-gradient(135deg, var(--green-dim), var(--blue-dim))" : "var(--bg-secondary)",
                border: `1px solid ${form.genre === g ? "transparent" : "var(--border)"}`,
                color: form.genre === g ? "#070d0f" : "var(--text-secondary)",
              }}>
              {g === "homme" ? "♂ Homme" : "♀ Femme"}
            </button>
          ))}
        </div>
      </div>

      {/* Âge / Taille / Poids */}
      <div className="grid grid-cols-3 gap-3">
        {([
          { key: "age",    label: "Âge",    unit: "ans", min: 18, max: 80  },
          { key: "taille", label: "Taille", unit: "cm",  min: 140, max: 220 },
          { key: "poids",  label: "Poids",  unit: "kg",  min: 40, max: 180  },
        ] as const).map(({ key, label, unit, min, max }) => (
          <div key={key}>
            <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
              {label}
            </label>
            <div className="relative">
              <input
                type="number" min={min} max={max}
                placeholder="—"
                value={form[key] ?? ""}
                onChange={e => set(key, Number(e.target.value))}
                style={{ ...INPUT_STYLE, paddingRight: "32px" }}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "var(--text-muted)" }}>
                {unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Résultats dynamiques */}
      {imc && (
        <div className="grid grid-cols-3 gap-3 pt-1">
          <div className="card p-3 text-center">
            <div className="text-lg font-black" style={{ color: imcInfo?.color }}>{imc}</div>
            <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>IMC</div>
            <div className="text-xs mt-0.5 font-medium" style={{ color: imcInfo?.color }}>{imcInfo?.label}</div>
          </div>
          {kcal && (
            <div className="card p-3 text-center">
              <div className="text-lg font-black gradient-text">{kcal}</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>kcal/jour</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>Métabolisme base</div>
            </div>
          )}
          {portM && (
            <div className="card p-3 text-center">
              <div className="text-lg font-black gradient-text">×{portM}</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Portions</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>Ajustement</div>
            </div>
          )}
        </div>
      )}

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
          style={{ ...INPUT_STYLE, colorScheme: "dark" }}
        />
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          Jour 1 de votre programme de 21 jours
        </p>
      </div>

      <button
        disabled={!isValid}
        onClick={() => isValid && onSave({ ...form, start_date: form.start_date ?? new Date().toISOString().split("T")[0] } as UserProfile)}
        className="btn-primary w-full text-sm"
        style={{ opacity: isValid ? 1 : 0.4, cursor: isValid ? "pointer" : "not-allowed" }}
      >
        Enregistrer mon profil →
      </button>
    </div>
  )
}
