"use client"
import { useState } from "react"
import { verissimoPrinciples } from "@/lib/principles"

export default function PrincipesSection() {
  const [openId, setOpenId] = useState<number | null>(null)

  return (
    <div className="fade-up space-y-4">
      <div className="rounded-xl p-4" style={{ background: "rgba(76,201,240,0.05)", border: "1px solid rgba(76,201,240,0.15)" }}>
        <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}>
          Ces 7 principes sont le socle de la méthode Verissimo. Ils ne sont pas des règles — ce sont des lois biologiques au service de votre énergie.
        </p>
      </div>

      {verissimoPrinciples.map(p => {
        const isOpen = openId === p.id
        return (
          <div
            key={p.id}
            className="rounded-2xl overflow-hidden transition-all"
            style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(4,10,22,0.6)" }}
          >
            {/* En-tête */}
            <button
              onClick={() => setOpenId(isOpen ? null : p.id)}
              className="w-full flex items-center justify-between px-4 py-4 transition-all"
              style={{ background: isOpen ? "rgba(255,255,255,0.04)" : "transparent" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: "rgba(76,201,240,0.1)", border: "1px solid rgba(76,201,240,0.2)" }}
                >
                  {p.icon}
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                    {p.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                    {p.shortDesc}
                  </p>
                </div>
              </div>
              <span
                style={{
                  color: "var(--text-muted)",
                  fontSize: "12px",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                  display: "inline-block",
                  flexShrink: 0,
                  marginLeft: "8px",
                }}
              >
                ▾
              </span>
            </button>

            {/* Contenu dépliable */}
            {isOpen && (
              <div className="px-4 pb-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-sm mt-4 mb-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {p.fullDesc}
                </p>

                {/* Règle(s) */}
                {"rules" in p && Array.isArray(p.rules) ? (
                  <div className="mb-4">
                    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>
                      Règles
                    </p>
                    <div className="space-y-1.5">
                      {p.rules.map((r, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2" style={{ background: "var(--blue)" }} />
                          <p className="text-xs" style={{ color: "var(--text-secondary)", lineHeight: "1.65" }}>{r}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : "rule" in p ? (
                  <div
                    className="rounded-xl px-4 py-3 mb-4"
                    style={{ background: "rgba(76,201,240,0.06)", border: "1px solid rgba(76,201,240,0.15)" }}
                  >
                    <p className="text-xs font-semibold" style={{ color: "var(--blue)", lineHeight: "1.65" }}>
                      {(p as { rule: string }).rule}
                    </p>
                  </div>
                ) : null}

                {/* Temps de digestion (principe 3) */}
                {"digestionTimes" in p && p.digestionTimes && (
                  <div className="mb-4">
                    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>
                      Temps de transit stomacal
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {p.digestionTimes.map(dt => (
                        <div
                          key={dt.food}
                          className="flex items-center justify-between rounded-lg px-3 py-2"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                        >
                          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{dt.food}</span>
                          <span className="text-xs font-bold" style={{ color: "var(--blue)" }}>{dt.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Aliments acides/alcalins (principe 4) */}
                {"acidicFoods" in p && p.acidicFoods && p.alkalineFoods && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#f87171" }}>
                        Acidifiants
                      </p>
                      <div className="space-y-1">
                        {p.acidicFoods.map(f => (
                          <div key={f} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#f87171", opacity: 0.7 }} />
                            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#9fd76d" }}>
                        Alcalinisants
                      </p>
                      <div className="space-y-1">
                        {(p as { alkalineFoods: string[] }).alkalineFoods.map(f => (
                          <div key={f} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#9fd76d", opacity: 0.7 }} />
                            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Impact */}
                <div
                  className="rounded-xl px-4 py-3 flex items-start gap-2"
                  style={{ background: "rgba(159,215,109,0.07)", border: "1px solid rgba(159,215,109,0.2)" }}
                >
                  <span style={{ fontSize: "14px", flexShrink: 0 }}>✨</span>
                  <p className="text-xs font-semibold" style={{ color: "#9fd76d", lineHeight: "1.65" }}>
                    {p.impact}
                  </p>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
