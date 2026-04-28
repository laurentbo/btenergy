"use client"
import { useState } from "react"
import type { Meal } from "@/data/program"
import { getEquivalence } from "@/data/equivalences"

const MOMENT_CONFIG: Record<Meal["moment"], { label: string; icon: string; accent: string; time: string }> = {
  matin:        { label: "Petit-déjeuner", icon: "🌅", accent: "#f59e0b", time: "7h – 9h"     },
  midi:         { label: "Déjeuner",       icon: "☀️", accent: "#4cc9f0", time: "12h – 13h30" },
  "après-midi": { label: "Collation",      icon: "🍃", accent: "#4cc9f0", time: "15h – 16h"   },
  soir:         { label: "Dîner",          icon: "🌙", accent: "#a78bfa", time: "19h – 20h"   },
}

function IngredientItem({ item, accent }: { item: string; accent: string }) {
  const [open, setOpen] = useState(false)
  const eq = getEquivalence(item)

  return (
    <li className="flex flex-col gap-1.5">
      <div className="flex items-start gap-3">
        <span style={{ color: accent, marginTop: "7px", flexShrink: 0, fontSize: "6px" }}>●</span>
        <span style={{ color: "rgba(240,246,255,0.85)", fontSize: "14px", lineHeight: "1.6", flex: 1, fontWeight: 450 }}>
          {item}
        </span>
        {eq && (
          <button
            onClick={() => setOpen(o => !o)}
            className="flex-shrink-0 rounded-lg transition-all"
            style={{
              background: open ? `${accent}22` : `${accent}0e`,
              color: accent,
              border: `1px solid ${accent}30`,
              fontSize: "11px",
              padding: "3px 9px",
              fontWeight: 600,
            }}>
            ↔
          </button>
        )}
      </div>
      {open && eq && (
        <div className="ml-5 rounded-xl px-4 py-3"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="font-bold mb-2" style={{ color: accent, fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {eq.group} · Équivalences
          </p>
          <div className="flex flex-wrap gap-2 mb-2.5">
            {eq.alts.map(alt => (
              <span key={alt} className="rounded-lg px-2.5 py-1"
                style={{ background: `${accent}12`, border: `1px solid ${accent}25`, color: "rgba(240,246,255,0.7)", fontSize: "12px" }}>
                {alt}
              </span>
            ))}
          </div>
          {eq.note && (
            <p className="italic" style={{ color: "rgba(240,246,255,0.4)", fontSize: "12px", lineHeight: "1.6" }}>
              💡 {eq.note}
            </p>
          )}
        </div>
      )}
    </li>
  )
}

type MealCardProps = {
  meal: Meal
  isCustomized?: boolean
  mealLog?: string[]         // ce qui a été réellement mangé
  onSaveLog?: (items: string[]) => Promise<void>
  isPast?: boolean           // jour passé — édition autorisée
}

export default function MealCard({ meal, isCustomized, mealLog, onSaveLog, isPast }: MealCardProps) {
  const cfg = MOMENT_CONFIG[meal.moment]
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<string>("")
  const [saving, setSaving] = useState(false)

  const hasLog = mealLog && mealLog.length > 0
  const displayItems = editing ? meal.items : (hasLog ? mealLog! : meal.items)

  function openEdit() {
    setDraft((hasLog ? mealLog! : meal.items).join("\n"))
    setEditing(true)
  }

  async function handleSave() {
    if (!onSaveLog) return
    setSaving(true)
    const items = draft.split("\n").map(s => s.trim()).filter(Boolean)
    await onSaveLog(items)
    setSaving(false)
    setEditing(false)
  }

  return (
    <div className="fade-up rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.055)",
        border: "1px solid rgba(255,255,255,0.09)",
        borderLeft: `3px solid ${cfg.accent}`,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset, 0 8px 32px rgba(0,0,0,0.2)",
      }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3.5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${cfg.accent}14`, border: `1px solid ${cfg.accent}28`, fontSize: "20px" }}>
            {cfg.icon}
          </div>
          <div>
            <span className="font-bold block" style={{ color: "#f0f6ff", fontSize: "15px", lineHeight: "1.3" }}>
              {cfg.label}
            </span>
            <span style={{ color: "rgba(240,246,255,0.4)", fontSize: "12px" }}>{cfg.time}</span>
          </div>
          {isCustomized && (
            <span className="rounded-full font-semibold"
              style={{ background: "rgba(76,201,240,0.12)", color: "#4cc9f0", border: "1px solid rgba(76,201,240,0.25)", fontSize: "10px", padding: "3px 9px" }}>
              ✦ Coach
            </span>
          )}
          {hasLog && !editing && (
            <span className="rounded-full font-semibold"
              style={{ background: "rgba(167,139,250,0.12)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.25)", fontSize: "10px", padding: "3px 9px" }}>
              ✎ Modif
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onSaveLog && !editing && (
            <button onClick={openEdit}
              className="rounded-lg transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "rgba(240,246,255,0.45)",
                border: "1px solid rgba(255,255,255,0.1)",
                fontSize: "11px",
                padding: "4px 10px",
                fontWeight: 600,
              }}>
              ✏️ Modif perso
            </button>
          )}
          {!editing && (
            <div className="rounded-lg font-semibold"
              style={{ background: `${cfg.accent}12`, color: cfg.accent, fontSize: "11px", padding: "4px 10px", border: `1px solid ${cfg.accent}22` }}>
              {displayItems.length} aliments
            </div>
          )}
        </div>
      </div>

      {/* Mode édition */}
      {editing ? (
        <div className="px-5 py-4 space-y-3">
          <p className="text-xs font-semibold" style={{ color: "rgba(240,246,255,0.4)" }}>
            Un aliment par ligne — modifiez ce que vous avez réellement mangé
          </p>
          <textarea
            rows={Math.max(4, draft.split("\n").length + 1)}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.14)",
              color: "#f0f6ff",
              lineHeight: "1.8",
            }}
          />
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving}
              className="btn-primary text-xs flex-1"
              style={{ padding: "10px 16px", opacity: saving ? 0.6 : 1 }}>
              {saving ? "Enregistrement…" : "✓ Enregistrer"}
            </button>
            <button onClick={() => setEditing(false)}
              className="rounded-xl text-xs px-4"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(240,246,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Items */}
          <div className="px-5 py-4">
            {hasLog && (
              <p className="text-xs font-semibold mb-3" style={{ color: "#a78bfa" }}>
                ✎ Repas modifié
              </p>
            )}
            <ul className="space-y-3">
              {displayItems.map((item, i) => (
                <IngredientItem key={i} item={item} accent={cfg.accent} />
              ))}
            </ul>
          </div>

          {/* Conseil */}
          {meal.conseil && (
            <div className="mx-5 mb-4 rounded-xl px-4 py-3 flex items-start gap-3"
              style={{ background: `${cfg.accent}07`, border: `1px solid ${cfg.accent}15` }}>
              <span style={{ fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>💡</span>
              <p className="italic" style={{ color: "rgba(240,246,255,0.5)", lineHeight: "1.7", fontSize: "13px" }}>
                {meal.conseil}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
