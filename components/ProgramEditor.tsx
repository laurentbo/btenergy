"use client"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { PROGRAM } from "@/data/program"

type Override = {
  day: number
  coach_note: string
  tip_override: string
  intention_override: string
  meal_overrides: Record<string, string[]>
}

type Props = {
  collaborateurId: string
  collaborateurPrenom: string
  coachId: string
  onClose: () => void
}

const MOMENTS = ["matin", "midi", "après-midi", "soir"] as const

export default function ProgramEditor({ collaborateurId, collaborateurPrenom, coachId, onClose }: Props) {
  const [selectedDay, setSelectedDay] = useState(1)
  const [overrides, setOverrides]     = useState<Record<number, Override>>({})
  const [saving, setSaving]           = useState(false)
  const [saved, setSaved]             = useState(false)
  const supabase = createClient()

  const day = PROGRAM[selectedDay - 1]

  useEffect(() => {
    async function loadOverrides() {
      const { data } = await supabase
        .from("program_overrides")
        .select("*")
        .eq("collaborateur_id", collaborateurId)
      if (data) {
        const map: Record<number, Override> = {}
        data.forEach((o: Override) => { map[o.day] = o })
        setOverrides(map)
      }
    }
    loadOverrides()
  }, [collaborateurId]) // eslint-disable-line

  const current = overrides[selectedDay] ?? {
    day: selectedDay,
    coach_note: "",
    tip_override: "",
    intention_override: "",
    meal_overrides: {},
  }

  const update = (key: keyof Override, val: string | Record<string, string[]>) => {
    setOverrides(o => ({
      ...o,
      [selectedDay]: { ...current, [key]: val }
    }))
    setSaved(false)
  }

  const updateMeal = (moment: string, val: string) => {
    const items = val.split("\n").map(s => s.trim()).filter(Boolean)
    update("meal_overrides", { ...current.meal_overrides, [moment]: items })
  }

  const handleSave = async () => {
    setSaving(true)
    const payload = {
      coach_id:           coachId,
      collaborateur_id:   collaborateurId,
      day:                selectedDay,
      coach_note:         current.coach_note || null,
      tip_override:       current.tip_override || null,
      intention_override: current.intention_override || null,
      meal_overrides:     Object.keys(current.meal_overrides).length ? current.meal_overrides : null,
      updated_at:         new Date().toISOString(),
    }
    await supabase.from("program_overrides").upsert(payload, { onConflict: "collaborateur_id,day" })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const hasOverride = (d: number) => !!overrides[d] && (
    overrides[d].coach_note || overrides[d].tip_override ||
    overrides[d].intention_override || Object.keys(overrides[d].meal_overrides ?? {}).length > 0
  )

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "var(--bg-primary)" }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)" }}>
        <div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Personnalisation programme</p>
          <h2 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{collaborateurPrenom}</h2>
        </div>
        <button onClick={onClose} className="tag cursor-pointer">✕ Fermer</button>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar — sélecteur jours */}
        <div className="flex-shrink-0 overflow-y-auto py-3 px-2"
          style={{ width: "70px", background: "var(--bg-secondary)", borderRight: "1px solid var(--border)" }}>
          {Array.from({ length: 21 }, (_, i) => i + 1).map(d => (
            <button key={d} onClick={() => setSelectedDay(d)}
              className="w-full mb-1.5 rounded-xl py-2 text-xs font-bold flex flex-col items-center gap-0.5 transition-all"
              style={{
                background: selectedDay === d ? "linear-gradient(135deg, var(--green-dim), var(--blue-dim))" : "transparent",
                color: selectedDay === d ? "#070d0f" : hasOverride(d) ? "var(--green)" : "var(--text-muted)",
                border: hasOverride(d) && selectedDay !== d ? "1px solid rgba(76,201,240,0.3)" : "1px solid transparent",
              }}>
              {d}
              {hasOverride(d) && <span style={{ fontSize: "6px" }}>●</span>}
            </button>
          ))}
        </div>

        {/* Éditeur */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* Titre du jour */}
          <div className="rounded-xl p-3" style={{ background: "rgba(76,201,240,0.06)", border: "1px solid rgba(76,201,240,0.15)" }}>
            <p className="text-xs font-bold gradient-text">Jour {selectedDay} — {day.theme}</p>
            <p className="text-xs mt-0.5 italic" style={{ color: "var(--text-muted)" }}>"{day.intention}"</p>
          </div>

          {/* Note du coach */}
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
              💬 Note personnalisée coach
            </label>
            <textarea rows={3} value={current.coach_note}
              onChange={e => update("coach_note", e.target.value)}
              placeholder={`Message personnel pour ${collaborateurPrenom} ce jour-là...`}
              className="w-full rounded-xl p-3 text-sm resize-none outline-none"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
            />
          </div>

          {/* Intention override */}
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
              ✨ Intention du jour <span style={{ color: "var(--text-muted)", textTransform: "none", letterSpacing: 0 }}>(remplace : "{day.intention}")</span>
            </label>
            <input type="text" value={current.intention_override}
              onChange={e => update("intention_override", e.target.value)}
              placeholder="Laisser vide = intention par défaut"
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
            />
          </div>

          {/* Tip override */}
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
              💡 Conseil du jour <span style={{ color: "var(--text-muted)", textTransform: "none", letterSpacing: 0 }}>(remplace le conseil par défaut)</span>
            </label>
            <input type="text" value={current.tip_override}
              onChange={e => update("tip_override", e.target.value)}
              placeholder="Laisser vide = conseil par défaut"
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
            />
          </div>

          {/* Repas overrides */}
          <div>
            <label className="block text-xs uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
              🍽 Repas personnalisés
            </label>
            <div className="space-y-3">
              {day.meals.map(meal => {
                const icons: Record<string, string> = { matin: "🌅", midi: "☀️", "après-midi": "🍃", soir: "🌙" }
                const defaultItems = meal.items.join("\n")
                const overrideVal  = current.meal_overrides?.[meal.moment]?.join("\n") ?? ""
                return (
                  <div key={meal.moment} className="card p-3">
                    <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
                      {icons[meal.moment]} {meal.moment.charAt(0).toUpperCase() + meal.moment.slice(1)}
                    </p>
                    <p className="text-xs mb-2 italic" style={{ color: "var(--text-muted)" }}>
                      Par défaut : {meal.items.join(", ")}
                    </p>
                    <textarea rows={3}
                      value={overrideVal}
                      onChange={e => updateMeal(meal.moment, e.target.value)}
                      placeholder={`Laisser vide = repas par défaut\nUn aliment par ligne :\n${defaultItems}`}
                      className="w-full rounded-xl p-2.5 text-xs resize-none outline-none"
                      style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Save */}
          <button onClick={handleSave} disabled={saving}
            className="btn-primary w-full text-sm mb-4"
            style={{ opacity: saving ? 0.7 : 1 }}>
            {saving ? "Enregistrement..." : saved ? "✓ Sauvegardé pour " + collaborateurPrenom : "Sauvegarder le jour " + selectedDay}
          </button>
        </div>
      </div>
    </div>
  )
}
