"use client"
import { PRINCIPES } from "@/data/program"

export default function PrincipesSection() {
  return (
    <div className="fade-up space-y-4">
      <div className="rounded-xl p-4" style={{ background: "rgba(45,228,164,0.05)", border: "1px solid rgba(45,228,164,0.15)" }}>
        <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}>
          Ces 7 principes sont le socle du programme BTENERGY. Ils ne sont pas des règles — ce sont des lois biologiques au service de votre énergie.
        </p>
      </div>

      {PRINCIPES.map((p, i) => (
        <div key={i} className="card p-4 fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: `${p.color}15`, border: `1px solid ${p.color}30` }}>
              {p.icon}
            </div>
            <div>
              <h4 className="font-bold text-sm mb-1" style={{ color: "var(--text-primary)" }}>
                {p.title}
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {p.body}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
