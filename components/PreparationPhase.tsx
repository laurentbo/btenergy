"use client"
import { useState } from "react"
import { preparationPhase } from "@/data/program"

type PrepDay = (typeof preparationPhase.days)[number]

function daysUntilDate(targetDateStr: string): number {
  const target = new Date(targetDateStr)
  const today = new Date()
  target.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  return Math.floor((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

type Props = {
  programStartDate: string
}

export default function PreparationPhase({ programStartDate }: Props) {
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set())

  const daysLeft = daysUntilDate(programStartDate)

  // offset: -3 → daysLeft===3, -2 → daysLeft===2, etc.
  const currentStep = preparationPhase.days.find(d => d.offset === -daysLeft)
  if (!currentStep || daysLeft < 0 || daysLeft > 3) return null

  const toggleCategory = (name: string) => {
    setOpenCategories(prev => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  const hasShoppingList = "shoppingList" in currentStep && currentStep.shoppingList
  const hasWarning = "warning" in currentStep && currentStep.warning

  return (
    <div
      className="fade-up mb-5"
      style={{
        background: "rgba(4,10,22,0.82)",
        border: "1px solid rgba(220,224,61,0.35)",
        borderRadius: "26px",
        padding: "24px",
        backdropFilter: "blur(28px)",
      }}
    >
      {/* Badge + compte à rebours */}
      <div className="flex items-center justify-between mb-5">
        <div
          className="rounded-lg px-3 py-1 text-xs font-bold tracking-widest uppercase"
          style={{
            background: "rgba(220,224,61,0.12)",
            color: "#dce03d",
            border: "1px solid rgba(220,224,61,0.25)",
            letterSpacing: "0.1em",
          }}
        >
          PRÉPARATION
        </div>
        <div
          className="rounded-xl px-3 py-1.5 text-xs font-bold"
          style={{ background: "rgba(220,224,61,0.08)", color: "#dce03d", border: "1px solid rgba(220,224,61,0.2)" }}
        >
          J1 dans {daysLeft} jour{daysLeft > 1 ? "s" : ""}
        </div>
      </div>

      {/* Titre de l'étape */}
      <div className="mb-1">
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "#9fd76d" }}
        >
          {currentStep.label}
        </span>
      </div>
      <h2
        className="font-black mb-1 leading-tight"
        style={{ color: "var(--text-primary)", fontSize: "22px" }}
      >
        {currentStep.title}
      </h2>
      <p
        className="text-sm mb-5"
        style={{ color: "var(--text-secondary)", lineHeight: "1.65" }}
      >
        {currentStep.objective}
      </p>

      {/* Actions du jour */}
      <div className="mb-5">
        <p
          className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          À faire aujourd'hui
        </p>
        <div className="space-y-2">
          {currentStep.actions.map((action, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  background: "rgba(159,215,109,0.15)",
                  border: "1px solid rgba(159,215,109,0.3)",
                  fontSize: "10px",
                  color: "#9fd76d",
                  fontWeight: 700,
                }}
              >
                {i + 1}
              </div>
              <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                {action}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Avertissement (J-1) */}
      {hasWarning && (
        <div
          className="rounded-xl p-4 mb-5 flex gap-3"
          style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.25)" }}
        >
          <span className="flex-shrink-0" style={{ fontSize: "16px" }}>⚠️</span>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.75)", lineHeight: "1.65" }}>
            {(currentStep as { warning: string }).warning}
          </p>
        </div>
      )}

      {/* Liste de courses (J-3 uniquement) */}
      {hasShoppingList && (
        <div className="mb-5">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-1"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Liste de courses
          </p>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
            {(currentStep as typeof preparationPhase.days[0]).shoppingList!.note}
          </p>
          <div className="space-y-2">
            {(currentStep as typeof preparationPhase.days[0]).shoppingList!.categories.map(cat => {
              const isOpen = openCategories.has(cat.name)
              return (
                <div
                  key={cat.name}
                  className="rounded-2xl overflow-hidden"
                  style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(4,10,22,0.5)" }}
                >
                  <button
                    onClick={() => toggleCategory(cat.name)}
                    className="w-full flex items-center justify-between px-4 py-3 transition-all"
                    style={{ background: isOpen ? "rgba(255,255,255,0.04)" : "transparent" }}
                  >
                    <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                      {cat.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-semibold"
                        style={{ background: "rgba(159,215,109,0.1)", color: "#9fd76d" }}
                      >
                        {cat.items.length}
                      </span>
                      <span
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "12px",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s",
                          display: "inline-block",
                        }}
                      >
                        ▾
                      </span>
                    </div>
                  </button>
                  {isOpen && (
                    <div
                      className="px-4 pb-3 space-y-1.5"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      {cat.items.map((item, j) => (
                        <div key={j} className="flex items-center gap-2 pt-1.5">
                          <div
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: "#9fd76d", opacity: 0.7 }}
                          />
                          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Note du coach */}
      <div
        className="rounded-xl p-4 flex gap-3"
        style={{ background: "rgba(220,224,61,0.06)", border: "1px solid rgba(220,224,61,0.2)" }}
      >
        <span className="flex-shrink-0" style={{ fontSize: "16px" }}>💬</span>
        <div>
          <p className="text-xs font-bold mb-1" style={{ color: "#dce03d" }}>Ton coach</p>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.75)", lineHeight: "1.7", fontStyle: "italic" }}>
            &ldquo;{currentStep.coachNote}&rdquo;
          </p>
        </div>
      </div>
    </div>
  )
}
