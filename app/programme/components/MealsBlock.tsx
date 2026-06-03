"use client"
import type { VerissimoJour } from "@/data/verissimo"

type Props = { jour: VerissimoJour }

const MEALS = [
  { key: "petit_dej", icon: "🌅", label: "Petit-déjeuner", color: "#C8964C" },
  { key: "dejeuner",  icon: "☀️", label: "Déjeuner",       color: "var(--brand)" },
  { key: "diner",     icon: "🌙", label: "Dîner",          color: "var(--forest)" },
] as const

export default function MealsBlock({ jour }: Props) {
  const isVolaille = jour.type === "s3_volaille"

  return (
    <div className="space-y-3">

      {/* Rituel du matin */}
      <div className="rounded-2xl p-3 flex items-center gap-2.5"
        style={{ background: "var(--brand-soft)", border: "1px solid var(--line)" }}>
        <span style={{ fontSize: "15px" }}>💧</span>
        <p className="text-xs font-medium" style={{ color: "var(--forest)" }}>
          Rituel du matin · eau tiède + ½ citron · étirements 5-10 min
        </p>
      </div>

      {/* 3 repas principaux */}
      {MEALS.map(({ key, icon, label, color }) => {
        const content = jour[key] as string
        return (
          <div key={key} className="rounded-2xl p-4"
            style={{
              background: "var(--bg-surface)",
              border: `1px solid var(--line)`,
              borderLeft: `3px solid ${color}`,
            }}>
            <div className="flex items-center gap-2 mb-1.5">
              <span style={{ fontSize: "16px" }}>{icon}</span>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>
                {label}
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>
              {content}
            </p>
          </div>
        )
      })}

      {/* Encas optionnel — note générique ou override par jour */}
      <div className="rounded-2xl p-3 flex items-start gap-2.5"
        style={{ background: "var(--bg-lift)", border: "1px solid var(--line-soft)" }}>
        <span style={{ fontSize: "14px" }}>🌿</span>
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-mute)" }}>
          <span className="font-semibold" style={{ color: "var(--text-dim)" }}>Si petite faim · </span>
          {jour.snack_note ?? "un fruit de saison (pomme, poire, kiwi…) ou quelques oléagineux"}
        </p>
      </div>

      {/* Astuce umami */}
      <div className="rounded-2xl p-4"
        style={{ background: "var(--warm-soft)", border: "1px solid rgba(200,150,76,0.25)", borderLeft: "3px solid var(--warm)" }}>
        <div className="flex items-center gap-2 mb-1.5">
          <span style={{ fontSize: "16px" }}>✨</span>
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--warm)" }}>Astuce umami</span>
        </div>
        <p className="text-sm italic leading-relaxed" style={{ color: "var(--warm)" }}>
          {jour.umami}
        </p>
      </div>

      {/* Commentaires */}
      {jour.commentaire && jour.commentaire !== "—" && (
        <div className="rounded-2xl p-4"
          style={{ background: "var(--bg-lift)", border: "1px solid var(--line)", borderLeft: "3px solid var(--accent-soft)" }}>
          <div className="flex items-center gap-2 mb-1.5">
            <span style={{ fontSize: "16px" }}>💬</span>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-mute)" }}>Alternatives</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
            {jour.commentaire}
          </p>
        </div>
      )}

      {/* Badge volaille */}
      {isVolaille && (
        <div className="rounded-xl px-3 py-2 flex items-center gap-2"
          style={{ background: "var(--warm-soft)", border: "1px solid rgba(200,150,76,0.25)" }}>
          <span style={{ fontSize: "13px" }}>🐓</span>
          <p className="text-xs font-semibold" style={{ color: "var(--warm)" }}>
            Volaille bio au dîner · semaine 3 uniquement
          </p>
        </div>
      )}
    </div>
  )
}
