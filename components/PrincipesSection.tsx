"use client"
import { useState } from "react"
import { VERISSIMO_PRINCIPES } from "@/lib/principles"

export default function PrincipesSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (i: number) => setOpenIndex(prev => (prev === i ? null : i))

  return (
    <div className="fade-up space-y-4">
      <div className="rounded-xl p-4" style={{ background: "rgba(76,201,240,0.05)", border: "1px solid rgba(76,201,240,0.15)" }}>
        <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}>
          Ces 7 principes sont le socle du programme Backtoenergy. Ils ne sont pas des règles — ce sont des lois biologiques au service de votre énergie.
        </p>
      </div>

      {VERISSIMO_PRINCIPES.map((p, i) => {
        const isOpen = openIndex === i
        return (
          <div key={i} className="card fade-up overflow-hidden" style={{ animationDelay: `${i * 0.06}s` }}>

            {/* En-tête cliquable */}
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center gap-4 p-4 transition-all text-left"
              style={{ background: isOpen ? "rgba(255,255,255,0.03)" : "transparent" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: `${p.color}15`, border: `1px solid ${p.color}30` }}>
                {p.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm mb-0.5" style={{ color: "var(--text-primary)" }}>
                  {p.title}
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {p.shortDesc}
                </p>
              </div>
              <span style={{
                color: "var(--text-muted)",
                fontSize: "12px",
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
                display: "inline-block",
                flexShrink: 0,
              }}>▾</span>
            </button>

            {/* Contenu dépliable */}
            {isOpen && (
              <div style={{ borderTop: `1px solid ${p.color}20` }} className="px-4 pb-4 pt-3 space-y-4">

                {/* Description complète */}
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {p.fullDesc}
                </p>

                {/* Règles */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: p.color }}>
                    Règles pratiques
                  </p>
                  <div className="space-y-2">
                    {p.rules.map((rule, j) => (
                      <div key={j} className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: `${p.color}18`, border: `1px solid ${p.color}30` }}>
                          <span style={{ color: p.color, fontSize: "10px", fontWeight: "700" }}>{j + 1}</span>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{rule}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Impact */}
                <div className="rounded-lg px-3 py-2.5"
                  style={{ background: `${p.color}0a`, border: `1px solid ${p.color}18` }}>
                  <p className="text-xs font-bold mb-1" style={{ color: p.color }}>Impact</p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{p.impact}</p>
                </div>

                {/* Données spécifiques */}
                {p.data && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
                      {p.data.label}
                    </p>

                    {p.data.rows && (
                      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                        {p.data.rows.map((row, k) => (
                          <div key={k} className="flex items-start gap-3 px-3 py-2.5"
                            style={{ borderBottom: k < p.data!.rows!.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", background: k % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                            <span className="text-xs font-semibold flex-shrink-0" style={{ color: "var(--text-primary)", minWidth: "120px" }}>
                              {row.col1}
                            </span>
                            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{row.col2}</span>
                            {row.col3 && (
                              <span className="text-xs ml-auto flex-shrink-0" style={{ color: "var(--text-muted)" }}>{row.col3}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {p.data.list && (
                      <div className="space-y-1.5">
                        {p.data.list.map((item, k) => (
                          <div key={k} className="flex items-center gap-2.5">
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ background: p.color }} />
                            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
