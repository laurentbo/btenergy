"use client"
import type { Meal } from "@/data/program"

const MOMENT_CONFIG: Record<Meal["moment"], { label: string; icon: string; colorClass: string; time: string }> = {
  matin:        { label: "Matin",       icon: "🌅", colorClass: "meal-matin", time: "7h – 9h" },
  midi:         { label: "Déjeuner",    icon: "☀️", colorClass: "meal-midi",  time: "12h – 13h30" },
  "après-midi": { label: "Collation",   icon: "🍃", colorClass: "meal-aprem", time: "15h – 16h" },
  soir:         { label: "Dîner",       icon: "🌙", colorClass: "meal-soir",  time: "19h – 20h" },
}

export default function MealCard({ meal, isCustomized }: { meal: Meal; isCustomized?: boolean }) {
  const cfg = MOMENT_CONFIG[meal.moment]
  return (
    <div className={`card ${cfg.colorClass} p-4 fade-up`} style={{ paddingLeft: "18px" }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{cfg.icon}</span>
          <span className="font-semibold" style={{ color: "var(--text-primary)", fontSize: "14px" }}>
            {cfg.label}
          </span>
          {isCustomized && (
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: "rgba(45,228,164,0.15)", color: "var(--green)", border: "1px solid rgba(45,228,164,0.3)" }}>
              ✦ Coach
            </span>
          )}
        </div>
        <span className="tag">{cfg.time}</span>
      </div>

      <ul className="space-y-1.5 mb-3">
        {meal.items.map((item, i) => (
          <li key={i} className="flex items-start gap-2" style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
            <span style={{ color: "var(--green)", marginTop: "2px", flexShrink: 0 }}>·</span>
            {item}
          </li>
        ))}
      </ul>

      {meal.conseil && (
        <p className="text-xs italic mt-2 pt-2" style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}>
          💡 {meal.conseil}
        </p>
      )}
    </div>
  )
}
