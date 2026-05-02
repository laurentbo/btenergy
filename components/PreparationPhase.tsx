"use client"
import { useState } from "react"
import { preparationPhase } from "@/data/program"

type Props = {
  daysUntilStart: number
}

export default function PreparationPhase({ daysUntilStart }: Props) {
  const [shoppingOpen, setShoppingOpen] = useState(false)
  const [openCategories, setOpenCategories] = useState<Set<number>>(new Set())

  const stepLabel = daysUntilStart === 3 ? "J-3" : daysUntilStart === 2 ? "J-2" : "J-1"
  const step = preparationPhase.steps.find(s => s.label === stepLabel)
  const isJMinus1 = daysUntilStart === 1
  const isJMinus3 = daysUntilStart === 3

  const toggleCategory = (i: number) => {
    setOpenCategories(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  return (
    <div className="space-y-4">

      {/* Compte à rebours */}
      <div className="rounded-2xl px-5 py-4 fade-up"
        style={{
          background: "linear-gradient(135deg, rgba(45,212,160,0.12), rgba(132,204,22,0.08))",
          border: "1px solid rgba(45,212,160,0.3)",
        }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#84cc16" }}>
              Phase de préparation
            </p>
            <p className="font-black text-lg leading-tight" style={{ color: "#ffffff" }}>
              Votre programme démarre dans
            </p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl"
            style={{
              background: "rgba(45,212,160,0.15)",
              border: "1px solid rgba(45,212,160,0.35)",
              width: "72px",
              height: "72px",
            }}>
            <span className="font-black leading-none" style={{ fontSize: "36px", color: "#2dd4a0" }}>
              {daysUntilStart}
            </span>
            <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>
              {daysUntilStart === 1 ? "jour" : "jours"}
            </span>
          </div>
        </div>

        {/* Indicateur d'étapes */}
        <div className="flex gap-2 mt-4">
          {(["J-3", "J-2", "J-1", "J0"] as const).map((l) => {
            const current = l === stepLabel
            const done = (l === "J-3" && daysUntilStart < 3) || (l === "J-2" && daysUntilStart < 2)
            return (
              <div key={l}
                className="flex-1 py-1.5 rounded-lg text-center text-xs font-bold transition-all"
                style={{
                  background: current
                    ? "rgba(45,212,160,0.25)"
                    : done
                    ? "rgba(132,204,22,0.15)"
                    : "rgba(255,255,255,0.05)",
                  border: current
                    ? "1px solid rgba(45,212,160,0.5)"
                    : done
                    ? "1px solid rgba(132,204,22,0.3)"
                    : "1px solid rgba(255,255,255,0.07)",
                  color: current ? "#2dd4a0" : done ? "#84cc16" : "rgba(255,255,255,0.3)",
                }}>
                {done ? "✓" : l}
              </div>
            )
          })}
        </div>
      </div>

      {/* Étape du jour */}
      {step && (
        <div className="card fade-up p-5" style={{ border: "1px solid rgba(45,212,160,0.2)" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm"
              style={{ background: "rgba(45,212,160,0.15)", border: "1px solid rgba(45,212,160,0.3)", color: "#2dd4a0" }}>
              {step.label}
            </div>
            <div>
              <p className="font-black text-sm" style={{ color: "var(--text-primary)" }}>{step.title}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Aujourd'hui à faire</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {step.tasks.map((task, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(45,212,160,0.15)", border: "1px solid rgba(45,212,160,0.3)" }}>
                  <span style={{ color: "#2dd4a0", fontSize: "10px", fontWeight: "700" }}>{i + 1}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{task}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Liste de courses (J-3 uniquement) */}
      {isJMinus3 && (
        <div className="card fade-up" style={{ border: "1px solid rgba(132,204,22,0.2)" }}>
          <button
            onClick={() => setShoppingOpen(v => !v)}
            className="w-full flex items-center justify-between px-5 py-4 transition-all">
            <div className="flex items-center gap-3">
              <span style={{ fontSize: "20px" }}>🛒</span>
              <div className="text-left">
                <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Liste de courses</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>6 catégories · à faire aujourd'hui</p>
              </div>
            </div>
            <span style={{
              color: "var(--text-muted)",
              fontSize: "12px",
              transform: shoppingOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
              display: "inline-block",
            }}>▾</span>
          </button>

          {shoppingOpen && (
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              {preparationPhase.shopping.map((cat, i) => (
                <div key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <button
                    onClick={() => toggleCategory(i)}
                    className="w-full flex items-center justify-between px-5 py-3 transition-all">
                    <div className="flex items-center gap-2.5">
                      <span style={{ fontSize: "16px" }}>{cat.icon}</span>
                      <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{cat.name}</span>
                      <span className="rounded-full px-1.5 py-0.5 text-xs"
                        style={{ background: "rgba(132,204,22,0.1)", color: "#84cc16", border: "1px solid rgba(132,204,22,0.2)" }}>
                        {cat.items.length}
                      </span>
                    </div>
                    <span style={{
                      color: "var(--text-muted)",
                      fontSize: "11px",
                      transform: openCategories.has(i) ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                      display: "inline-block",
                    }}>▾</span>
                  </button>
                  {openCategories.has(i) && (
                    <div className="px-5 pb-3 space-y-1.5" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                      {cat.items.map((item, j) => (
                        <div key={j} className="flex items-center gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: "rgba(132,204,22,0.6)" }} />
                          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Avertissement purge (J-1 uniquement) */}
      {isJMinus1 && (
        <div className="rounded-xl p-4 fade-up"
          style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.3)" }}>
          <div className="flex items-start gap-3">
            <span style={{ fontSize: "20px", flexShrink: 0 }}>⚠️</span>
            <div>
              <p className="font-bold text-sm mb-1.5" style={{ color: "#fbbf24" }}>Dîner de purge ce soir</p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {preparationPhase.purgeWarning}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Note coach */}
      <div className="rounded-xl p-4 fade-up flex gap-3"
        style={{ background: "rgba(45,212,160,0.06)", border: "1px solid rgba(45,212,160,0.18)" }}>
        <span className="text-lg flex-shrink-0">💬</span>
        <div>
          <p className="text-xs font-bold mb-1" style={{ color: "#2dd4a0" }}>Note de votre coach</p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {preparationPhase.coachNotes}
          </p>
        </div>
      </div>
    </div>
  )
}
