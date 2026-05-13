"use client"
import type { VerissimoJour } from "@/data/verissimo"

type Props = { jour: VerissimoJour }

const MEALS = [
  { key: "petit_dej",       icon: "🌅", label: "Petit-déjeuner",       color: "#f59e0b",              snack: false },
  { key: "collation_matin", icon: "🍎", label: "Collation matin",      color: "rgba(255,255,255,0.3)", snack: true  },
  { key: "dejeuner",        icon: "☀️", label: "Déjeuner",             color: "var(--green)",          snack: false },
  { key: "collation_aprem", icon: "🍊", label: "Collation après-midi", color: "rgba(255,255,255,0.3)", snack: true  },
  { key: "diner",           icon: "🌙", label: "Dîner",                color: "var(--accent-cyan)",    snack: false },
] as const

export default function MealsBlock({ jour }: Props) {
  const isVolaille = jour.type === "s3_volaille"

  return (
    <div className="space-y-3">

      {/* Rituel du matin */}
      <div className="rounded-2xl p-3 flex items-center gap-2.5"
        style={{ background: "rgba(159,215,109,0.07)", border: "1px solid rgba(159,215,109,0.18)" }}>
        <span style={{ fontSize: "15px" }}>💧</span>
        <p className="text-xs font-medium" style={{ color: "rgba(159,215,109,0.85)" }}>
          Rituel du matin · eau tiède + ½ citron · étirements 5-10 min
        </p>
      </div>

      {/* Repas */}
      {MEALS.map(({ key, icon, label, color, snack }) => {
        const content = jour[key] as string
        return (
          <div key={key} className="rounded-2xl p-4"
            style={{
              background: snack ? "rgba(255,255,255,0.03)" : "rgba(4,10,22,0.6)",
              border: `1px solid ${snack ? "rgba(255,255,255,0.07)" : color + "28"}`,
              borderLeft: `3px solid ${color}`,
            }}>
            <div className="flex items-center gap-2 mb-1.5">
              <span style={{ fontSize: "16px" }}>{icon}</span>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>
                {label}{snack ? " · si faim" : ""}
              </span>
            </div>
            <p className="text-sm leading-relaxed"
              style={{ color: snack ? "rgba(255,255,255,0.5)" : "var(--text-secondary)" }}>
              {content}
            </p>
          </div>
        )
      })}

      {/* Astuce umami */}
      <div className="rounded-2xl p-4"
        style={{ background: "rgba(191,125,44,0.07)", border: "1px solid rgba(191,125,44,0.22)", borderLeft: "3px solid #BF7D2C" }}>
        <div className="flex items-center gap-2 mb-1.5">
          <span style={{ fontSize: "16px" }}>✨</span>
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#BF7D2C" }}>Astuce umami</span>
        </div>
        <p className="text-sm italic leading-relaxed" style={{ color: "rgba(191,125,44,0.9)" }}>
          {jour.umami}
        </p>
      </div>

      {/* Commentaires */}
      {jour.commentaire && jour.commentaire !== "—" && (
        <div className="rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderLeft: "3px solid rgba(129,140,248,0.5)" }}>
          <div className="flex items-center gap-2 mb-1.5">
            <span style={{ fontSize: "16px" }}>💬</span>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#818cf8" }}>Commentaires & alternatives</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
            {jour.commentaire}
          </p>
        </div>
      )}

      {/* Badge volaille */}
      {isVolaille && (
        <div className="rounded-xl px-3 py-2 flex items-center gap-2"
          style={{ background: "rgba(191,125,44,0.1)", border: "1px solid rgba(191,125,44,0.25)" }}>
          <span style={{ fontSize: "13px" }}>🐓</span>
          <p className="text-xs font-semibold" style={{ color: "#BF7D2C" }}>
            Volaille bio au dîner · semaine 3 uniquement
          </p>
        </div>
      )}
    </div>
  )
}
