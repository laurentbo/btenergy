"use client"
import { useState, useEffect, useMemo } from "react"
import { PROGRAM } from "@/data/program"
import { SHOPPING_CATEGORIES, categorizeIngredient, simplifyIngredient, dedupeKey } from "@/data/equivalences"

type Props = {
  currentDay: number
  horizon?: number
}

function dedupeIngredients(items: string[]): string[] {
  const seen = new Set<string>()
  return items.filter(item => {
    const key = dedupeKey(item)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// Retourne le label simplifié d'un ingrédient
function label(raw: string): string {
  return simplifyIngredient(raw)
}

function getNextDaysIngredients(currentDay: number, horizon: number) {
  const days: typeof PROGRAM = []
  for (let d = currentDay; d <= Math.min(21, currentDay + horizon - 1); d++) {
    const prog = PROGRAM[d - 1]
    if (prog) days.push(prog)
  }
  const all: { item: string; day: number }[] = []
  for (const prog of days) {
    for (const meal of prog.meals) {
      for (const item of meal.items) {
        all.push({ item, day: prog.day })
      }
    }
  }
  return { all, days }
}

export default function ShoppingList({ currentDay, horizon = 7 }: Props) {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const storageKey = `btenergy_shopping_${currentDay}`

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) setChecked(new Set(JSON.parse(saved)))
    } catch { /* ignore */ }
  }, [storageKey])

  const saveChecked = (next: Set<string>) => {
    setChecked(next)
    localStorage.setItem(storageKey, JSON.stringify([...next]))
  }

  const toggle = (item: string) => {
    const next = new Set(checked)
    if (next.has(item)) next.delete(item)
    else next.add(item)
    saveChecked(next)
  }

  const clearChecked = () => saveChecked(new Set())

  const { all, days } = useMemo(() => getNextDaysIngredients(currentDay, horizon), [currentDay, horizon])
  const actualHorizon = days.length

  const byCategory = useMemo(() => {
    // D'abord dédupe global par clé normalisée
    const seen = new Set<string>()
    const deduped: string[] = []
    for (const { item } of all) {
      const key = dedupeKey(item)
      if (!seen.has(key)) { seen.add(key); deduped.push(item) }
    }
    // Puis groupe par catégorie
    const map: Record<string, string[]> = {}
    for (const item of deduped) {
      const cat = categorizeIngredient(item)
      if (!map[cat]) map[cat] = []
      map[cat].push(item)
    }
    return map
  }, [all])

  const sortedCategories = useMemo(() => {
    const known = Object.keys(SHOPPING_CATEGORIES)
    const cats = Object.keys(byCategory)
    return [...known.filter(c => cats.includes(c)), ...cats.filter(c => !known.includes(c))]
  }, [byCategory])

  const allItems = Object.values(byCategory).flat()
  const totalItems = allItems.length
  const checkedCount = allItems.filter(i => checked.has(i)).length
  const pct = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="rounded-2xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border-accent)" }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>🛒 Courses · {actualHorizon} jours</h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              J{currentDay} → J{Math.min(21, currentDay + actualHorizon - 1)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {checkedCount > 0 && (
              <button onClick={clearChecked} className="text-xs px-2.5 py-1 rounded-lg"
                style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
                Reset
              </button>
            )}
            <div className="text-right">
              <div className="text-xl font-black gradient-text leading-none">{pct}%</div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>{checkedCount}/{totalItems}</div>
            </div>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Catégories */}
      {sortedCategories.map(cat => {
        const items = byCategory[cat]
        const catCfg = SHOPPING_CATEGORIES[cat]
        const icon = catCfg?.icon ?? "🛍️"
        const color = catCfg?.color ?? "var(--blue)"
        const catChecked = items.filter(i => checked.has(i)).length
        const allDone = catChecked === items.length

        return (
          <div key={cat} className="rounded-2xl overflow-hidden"
            style={{
              background: allDone ? "rgba(76,201,240,0.04)" : "var(--bg-card)",
              border: `1px solid ${allDone ? "rgba(76,201,240,0.2)" : "var(--border)"}`,
            }}>
            {/* Titre catégorie */}
            <div className="flex items-center justify-between px-4 py-2.5"
              style={{ borderBottom: `1px solid var(--border)` }}>
              <div className="flex items-center gap-2">
                <span>{icon}</span>
                <span className="font-semibold text-xs uppercase tracking-wider"
                  style={{ color: allDone ? "var(--text-muted)" : color }}>
                  {cat}
                </span>
              </div>
              <span className="text-xs font-bold"
                style={{ color: catChecked > 0 ? color : "var(--text-muted)" }}>
                {catChecked}/{items.length}
              </span>
            </div>

            {/* Chips compacts */}
            <div className="px-3 py-3 flex flex-wrap gap-2">
              {items.map(item => {
                const isChecked = checked.has(item)
                return (
                  <button key={item} onClick={() => toggle(item)}
                    className="flex items-center gap-1.5 text-xs rounded-xl px-3 py-1.5 transition-all"
                    style={{
                      background: isChecked ? "rgba(76,201,240,0.12)" : "var(--bg-secondary)",
                      border: `1px solid ${isChecked ? "rgba(76,201,240,0.35)" : "var(--border-accent)"}`,
                      color: isChecked ? "var(--green)" : "var(--text-secondary)",
                      textDecoration: isChecked ? "line-through" : "none",
                      opacity: isChecked ? 0.6 : 1,
                    }}>
                    {isChecked && <span style={{ fontSize: "10px", fontWeight: 900 }}>✓</span>}
                    {label(item)}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
