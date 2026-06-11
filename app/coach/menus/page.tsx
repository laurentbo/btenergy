"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  fetchAllMealPlans, updateMealPlanField,
  fetchUserOverrides, upsertUserOverride, deleteUserOverride,
  fetchFoodPreferences, addFoodPreference, deleteFoodPreference,
} from "@/lib/menus"
import type { MealPlan, MealFieldName, FoodPreference } from "@/lib/supabase/types"

type Tab = "plan" | "adaptations" | "photos"
type WeekFilter = "tous" | "1" | "2" | "3"
type ColabProfile = { id: string; prenom: string; email: string }

const MEAL_FIELDS: { key: MealFieldName; label: string; icon: string }[] = [
  { key: "petit_dejeuner", label: "Petit-déj",    icon: "🌅" },
  { key: "dejeuner",       label: "Déjeuner",     icon: "☀️" },
  { key: "diner",          label: "Dîner",        icon: "🌙" },
  { key: "snack_note",     label: "Encas (note)", icon: "🌿" },
  { key: "astuce_umami",   label: "Astuce umami", icon: "✨" },
]

const PREF_TYPE_LABEL: Record<string, string> = {
  dislike: "N'aime pas",
  allergy: "Allergie",
  intolerance: "Intolérance",
}

const PREF_TYPE_COLOR: Record<string, string> = {
  dislike: "rgba(255,255,255,0.3)",
  allergy: "#ff6b6b",
  intolerance: "#fbbf24",
}

// ── Inline editable cell ──────────────────────────────────────────────────────
function EditableCell({
  value, onSave,
}: { value: string | null; onSave: (v: string) => Promise<void> }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value ?? "")
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    try { await onSave(draft); setEditing(false) } finally { setSaving(false) }
  }
  const cancel = () => { setDraft(value ?? ""); setEditing(false) }

  if (!editing) return (
    <div
      onClick={() => setEditing(true)}
      className="cursor-pointer rounded px-2 py-1 text-xs leading-relaxed hover:bg-white/10 transition-colors min-h-[28px]"
      style={{ color: "var(--text-secondary)" }}
    >
      {value || <span style={{ color: "rgba(255,255,255,0.2)", fontStyle: "italic" }}>—</span>}
    </div>
  )

  return (
    <div className="flex flex-col gap-1.5">
      <textarea
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={3}
        className="w-full rounded-lg px-2 py-1.5 text-xs resize-none outline-none"
        style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff" }}
      />
      <div className="flex gap-1.5">
        <button onClick={save} disabled={saving}
          className="flex-1 rounded-lg py-1 text-xs font-semibold"
          style={{ background: "var(--green)", color: "#060e12", opacity: saving ? 0.7 : 1 }}>
          {saving ? "…" : "Sauvegarder"}
        </button>
        <button onClick={cancel}
          className="rounded-lg px-3 py-1 text-xs font-semibold"
          style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}>
          ✕
        </button>
      </div>
    </div>
  )
}

// ── Override modal ────────────────────────────────────────────────────────────
function OverrideModal({
  userId, jour, field, baseValue, currentValue, currentReason, coachId, isOpen,
  onClose, onSaved,
}: {
  userId: string; jour: number; field: MealFieldName
  baseValue: string | null; currentValue: string | null; currentReason: string | null
  coachId: string; isOpen: boolean
  onClose: () => void; onSaved: () => void
}) {
  const [draft, setDraft] = useState(currentValue ?? baseValue ?? "")
  const [reason, setReason] = useState(currentReason ?? "")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isOpen) { setDraft(currentValue ?? baseValue ?? ""); setReason(currentReason ?? "") }
  }, [isOpen, currentValue, baseValue, currentReason])

  if (!isOpen) return null

  const fieldMeta = MEAL_FIELDS.find((f) => f.key === field)

  const save = async () => {
    setSaving(true)
    try {
      await upsertUserOverride(userId, jour, field, draft || null, reason || null, coachId)
      onSaved()
      onClose()
    } finally { setSaving(false) }
  }

  const remove = async () => {
    setSaving(true)
    try {
      await deleteUserOverride(userId, jour, field)
      onSaved()
      onClose()
    } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-md rounded-2xl p-6 space-y-4"
        style={{ background: "#0f1117", border: "1px solid rgba(255,255,255,0.12)" }}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm" style={{ color: "#fff" }}>
            {fieldMeta?.icon} Adaptation — Jour {jour} · {fieldMeta?.label}
          </h3>
          <button onClick={onClose} style={{ color: "rgba(255,255,255,0.4)", fontSize: "18px" }}>✕</button>
        </div>

        {baseValue && (
          <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.05)" }}>
            <p className="text-xs mb-1 font-semibold" style={{ color: "rgba(255,255,255,0.3)" }}>Plan de base</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>{baseValue}</p>
          </div>
        )}

        <div>
          <label className="text-xs font-semibold mb-1.5 block" style={{ color: "rgba(255,255,255,0.5)" }}>
            Adaptation personnalisée
          </label>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            className="w-full rounded-xl px-3 py-2.5 text-sm resize-none outline-none"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}
          />
        </div>

        <div>
          <label className="text-xs font-semibold mb-1.5 block" style={{ color: "rgba(255,255,255,0.5)" }}>
            Raison de l'adaptation
          </label>
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="ex : pas d'ail, allergie fenouil…"
            className="w-full rounded-xl px-3 py-2 text-sm outline-none"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}
          />
        </div>

        <div className="flex gap-2 pt-1">
          <button onClick={save} disabled={saving}
            className="flex-1 rounded-xl py-2.5 font-bold text-sm"
            style={{ background: "var(--green)", color: "#060e12", opacity: saving ? 0.7 : 1 }}>
            {saving ? "…" : "Sauvegarder"}
          </button>
          {currentValue !== null && (
            <button onClick={remove} disabled={saving}
              className="rounded-xl px-4 py-2.5 font-bold text-sm"
              style={{ background: "rgba(255,100,100,0.15)", border: "1px solid rgba(255,100,100,0.3)", color: "#ff8080" }}>
              Supprimer
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Photos des repas ─────────────────────────────────────────────────────────
const PHOTO_SLOTS = [
  { slot: "petit-dej", label: "Petit-déjeuner", icon: "🌅" },
  { slot: "dejeuner",  label: "Déjeuner",       icon: "☀️" },
  { slot: "diner",     label: "Dîner",           icon: "🌙" },
] as const

function PhotosTab({ onToast }: { onToast: (msg: string) => void }) {
  const [urls, setUrls] = useState<Record<string, string | null>>({})
  const [uploading, setUploading] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/admin/repas-photo")
      .then((r) => r.json())
      .then(setUrls)
  }, [])

  async function handleUpload(slot: string, file: File) {
    setUploading(slot)
    try {
      const fd = new FormData()
      fd.append("slot", slot)
      fd.append("file", file)
      const res = await fetch("/api/admin/repas-photo", { method: "POST", body: fd })
      const data = await res.json()
      if (data.url) {
        setUrls((prev) => ({ ...prev, [slot]: data.url + "?t=" + Date.now() }))
        onToast("Photo mise à jour ✓")
      } else {
        onToast("Erreur : " + (data.error ?? "inconnue"))
      }
    } finally {
      setUploading(null)
    }
  }

  return (
    <div className="max-w-2xl">
      <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>
        Ces photos s&apos;affichent sur l&apos;écran programme de chaque participant. Formats acceptés : JPG, PNG, WEBP · 5 Mo max.
      </p>
      <div className="flex flex-col gap-5">
        {PHOTO_SLOTS.map(({ slot, label, icon }) => {
          const url = urls[slot]
          const busy = uploading === slot
          return (
            <div key={slot} className="rounded-2xl p-5 flex gap-5 items-center"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {/* Preview */}
              <div className="shrink-0 w-28 h-20 rounded-xl overflow-hidden flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.06)" }}>
                {url
                  ? <img src={url} alt={label} className="w-full h-full object-cover" />
                  : <span style={{ fontSize: 28 }}>{icon}</span>
                }
              </div>
              {/* Info + upload */}
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm mb-1" style={{ color: "#fff" }}>{icon} {label}</div>
                <div className="text-xs mb-3 truncate" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {url ? url.split("/").pop()?.split("?")[0] : "Aucune photo"}
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer rounded-xl px-4 py-2 text-xs font-bold"
                  style={{
                    background: busy ? "rgba(255,255,255,0.05)" : "var(--green)",
                    color: busy ? "rgba(255,255,255,0.4)" : "#060e12",
                    pointerEvents: busy ? "none" : "auto",
                  }}>
                  {busy ? "Envoi…" : url ? "Remplacer" : "Choisir une photo"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    disabled={busy}
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) handleUpload(slot, f)
                      e.target.value = ""
                    }}
                  />
                </label>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CoachMenusPage() {
  const [tab, setTab] = useState<Tab>("plan")
  const [plans, setPlans] = useState<MealPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [weekFilter, setWeekFilter] = useState<WeekFilter>("tous")
  const [toast, setToast] = useState<string | null>(null)
  const [coachId, setCoachId] = useState<string | null>(null)

  // Adaptations tab
  const [collabs, setCollabs] = useState<ColabProfile[]>([])
  const [selectedCollab, setSelectedCollab] = useState<string | null>(null)
  const [overrides, setOverrides] = useState<Record<string, string | null>>({})
  const [overrideReasons, setOverrideReasons] = useState<Record<string, string | null>>({})
  const [prefs, setPrefs] = useState<FoodPreference[]>([])
  const [modal, setModal] = useState<{ jour: number; field: MealFieldName } | null>(null)
  const [newIngredient, setNewIngredient] = useState("")
  const [newPrefType, setNewPrefType] = useState<FoodPreference["type"]>("dislike")
  const [addingPref, setAddingPref] = useState(false)

  const supabase = useMemo(() => createClient(), [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const loadPlans = useCallback(async () => {
    setLoading(true)
    try { setPlans(await fetchAllMealPlans()) } finally { setLoading(false) }
  }, [])

  useEffect(() => {
    fetch("/api/me").then((r) => r.json()).then((me) => setCoachId(me.id))
    loadPlans()
  }, [loadPlans])

  useEffect(() => {
    if (tab !== "adaptations") return
    supabase.from("profiles")
      .select("id, prenom, email")
      .eq("role", "collaborateur")
      .order("prenom")
      .then(({ data }) => setCollabs((data ?? []) as ColabProfile[]))
  }, [tab, supabase])

  const loadCollab = useCallback(async (userId: string) => {
    const [ov, pf] = await Promise.all([
      fetchUserOverrides(userId),
      fetchFoodPreferences(userId),
    ])
    const oMap: Record<string, string | null> = {}
    const rMap: Record<string, string | null> = {}
    for (const o of ov) {
      oMap[`${o.jour}__${o.field_name}`] = o.override_value
      rMap[`${o.jour}__${o.field_name}`] = o.reason
    }
    setOverrides(oMap)
    setOverrideReasons(rMap)
    setPrefs(pf)
  }, [])

  useEffect(() => {
    if (selectedCollab) loadCollab(selectedCollab)
  }, [selectedCollab, loadCollab])

  const filteredPlans = weekFilter === "tous"
    ? plans
    : plans.filter((p) => p.semaine === Number(weekFilter))

  const getBase = (jour: number, field: MealFieldName) =>
    plans.find((p) => p.jour === jour)?.[field] ?? null

  const handleSaveBase = async (jour: number, field: MealFieldName | "nom_jour", value: string) => {
    if (!coachId) return
    await updateMealPlanField(jour, field, value, coachId)
    setPlans((prev) => prev.map((p) => p.jour === jour ? { ...p, [field]: value } : p))
    showToast(`Jour ${jour} · ${field} mis à jour ✓`)
  }

  const handleAddPref = async () => {
    if (!selectedCollab || !newIngredient.trim()) return
    setAddingPref(true)
    try {
      await addFoodPreference(selectedCollab, newIngredient, newPrefType)
      setNewIngredient("")
      await loadCollab(selectedCollab)
    } finally { setAddingPref(false) }
  }

  const handleDeletePref = async (ingredient: string) => {
    if (!selectedCollab) return
    await deleteFoodPreference(selectedCollab, ingredient)
    await loadCollab(selectedCollab)
  }

  const selectedCollabName = collabs.find((c) => c.id === selectedCollab)?.prenom ?? "—"

  const modalBase = modal ? getBase(modal.jour, modal.field) : null
  const modalCurrent = modal ? (overrides[`${modal.jour}__${modal.field}`] ?? null) : null
  const modalReason = modal ? (overrideReasons[`${modal.jour}__${modal.field}`] ?? null) : null

  const WEEK_COLORS: Record<number, string> = { 1: "var(--green)", 2: "var(--accent-cyan)", 3: "var(--accent-lime)" }

  return (
    <div className="min-h-screen pb-12" style={{ background: "#0f1117" }}>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 rounded-xl px-4 py-3 font-semibold text-sm"
          style={{ background: "var(--green)", color: "#060e12", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 px-5 py-3.5"
        style={{ background: "rgba(15,17,23,0.9)", backdropFilter: "blur(28px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/coach" className="text-xs font-semibold px-3 py-1.5 rounded-xl"
              style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)" }}>← Coach</a>
            <h1 className="font-black gradient-text text-sm">Gestion des menus 21 jours</h1>
          </div>
          <button onClick={loadPlans}
            className="text-xs px-3 py-1.5 rounded-xl font-semibold"
            style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)" }}>
            ↻ Recharger
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-6">

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1.5 rounded-2xl w-fit"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {(["plan", "adaptations", "photos"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className="px-5 py-2.5 rounded-xl font-semibold transition-all text-sm"
              style={{
                background: tab === t ? "rgba(255,255,255,0.1)" : "transparent",
                color: tab === t ? "#fff" : "rgba(255,255,255,0.4)",
                borderBottom: tab === t ? "2px solid var(--green)" : "2px solid transparent",
              }}>
              {t === "plan" ? "Plan global" : t === "adaptations" ? "Adaptations utilisateurs" : "📸 Photos"}
            </button>
          ))}
        </div>

        {/* ── Plan global ── */}
        {tab === "plan" && (
          <div>
            {/* Week filter */}
            <div className="flex gap-2 mb-5">
              {(["tous", "1", "2", "3"] as WeekFilter[]).map((f) => (
                <button key={f} onClick={() => setWeekFilter(f)}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold"
                  style={{
                    background: weekFilter === f ? "var(--green)" : "rgba(255,255,255,0.07)",
                    color: weekFilter === f ? "#060e12" : "rgba(255,255,255,0.6)",
                  }}>
                  {f === "tous" ? "Tous" : `Semaine ${f}`}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--green)", borderTopColor: "transparent" }} />
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPlans.map((plan) => {
                  const wc = WEEK_COLORS[plan.semaine] ?? "var(--green)"
                  return (
                    <div key={plan.jour} className="rounded-2xl overflow-hidden"
                      style={{
                        background: plan.is_weekend ? "rgba(255,255,255,0.02)" : "rgba(4,10,22,0.7)",
                        border: `1px solid ${plan.is_weekend ? "rgba(255,255,255,0.07)" : wc + "22"}`,
                      }}>
                      {/* Row header */}
                      <div className="flex items-center gap-3 px-4 py-3"
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
                          style={{ background: `${wc}18`, color: wc }}>
                          {plan.jour}
                        </div>
                        <div className="flex-1 min-w-0">
                          <EditableCell
                            value={plan.nom_jour}
                            onSave={(v) => handleSaveBase(plan.jour, "nom_jour", v)}
                          />
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {plan.is_weekend && (
                            <span className="text-xs px-2 py-0.5 rounded-lg font-semibold italic"
                              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)" }}>
                              Week-end libre
                            </span>
                          )}
                          <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>S{plan.semaine}</span>
                        </div>
                      </div>

                      {/* Meal fields grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-px"
                        style={{ background: "rgba(255,255,255,0.04)" }}>
                        {MEAL_FIELDS.map(({ key, label, icon }) => (
                          <div key={key} className="px-3 py-2.5"
                            style={{ background: plan.is_weekend ? "rgba(255,255,255,0.02)" : "#0a1020" }}>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <span style={{ fontSize: "12px" }}>{icon}</span>
                              <span className="text-xs font-bold uppercase tracking-wider"
                                style={{ color: "rgba(255,255,255,0.25)", fontStyle: plan.is_weekend ? "italic" : "normal" }}>
                                {label}
                              </span>
                            </div>
                            <EditableCell
                              value={plan[key]}
                              onSave={(v) => handleSaveBase(plan.jour, key, v)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Adaptations utilisateurs ── */}
        {tab === "adaptations" && (
          <div className="space-y-5">

            {/* Collab selector */}
            <div className="card rounded-2xl p-4">
              <label className="text-xs font-bold uppercase tracking-widest mb-2 block"
                style={{ color: "rgba(255,255,255,0.35)" }}>
                Sélectionner un collaborateur
              </label>
              <select
                value={selectedCollab ?? ""}
                onChange={(e) => setSelectedCollab(e.target.value || null)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }}>
                <option value="">— Choisir —</option>
                {collabs.map((c) => (
                  <option key={c.id} value={c.id}>{c.prenom} ({c.email})</option>
                ))}
              </select>
            </div>

            {selectedCollab && (
              <>
                {/* Food preferences */}
                <div className="card rounded-2xl p-4 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: "rgba(255,255,255,0.35)" }}>
                    Exclusions globales — {selectedCollabName}
                  </h3>

                  {prefs.length === 0 && (
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Aucune exclusion enregistrée</p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {prefs.map((p) => (
                      <div key={p.id} className="flex items-center gap-1.5 rounded-xl px-3 py-1.5"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <span className="text-xs font-semibold" style={{ color: "#fff" }}>{p.ingredient}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded-lg font-bold"
                          style={{ background: `${PREF_TYPE_COLOR[p.type]}18`, color: PREF_TYPE_COLOR[p.type] }}>
                          {PREF_TYPE_LABEL[p.type]}
                        </span>
                        <button onClick={() => handleDeletePref(p.ingredient)}
                          className="text-xs ml-1" style={{ color: "rgba(255,100,100,0.7)" }}>✕</button>
                      </div>
                    ))}
                  </div>

                  {/* Add new */}
                  <div className="flex gap-2 mt-2">
                    <input
                      value={newIngredient}
                      onChange={(e) => setNewIngredient(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddPref()}
                      placeholder="Ingrédient (ex : ail, fenouil…)"
                      className="flex-1 rounded-xl px-3 py-2 text-sm outline-none"
                      style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }}
                    />
                    <select
                      value={newPrefType}
                      onChange={(e) => setNewPrefType(e.target.value as FoodPreference["type"])}
                      className="rounded-xl px-2 py-2 text-sm outline-none"
                      style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }}>
                      <option value="dislike">N'aime pas</option>
                      <option value="allergy">Allergie</option>
                      <option value="intolerance">Intolérance</option>
                    </select>
                    <button onClick={handleAddPref} disabled={addingPref || !newIngredient.trim()}
                      className="rounded-xl px-4 py-2 font-bold text-sm"
                      style={{ background: "var(--green)", color: "#060e12", opacity: !newIngredient.trim() ? 0.4 : 1 }}>
                      +
                    </button>
                  </div>
                </div>

                {/* 21 days grid */}
                <div className="space-y-3">
                  {plans.map((plan) => {
                    const wc = WEEK_COLORS[plan.semaine] ?? "var(--green)"
                    const hasOverride = MEAL_FIELDS.some(({ key }) => overrides[`${plan.jour}__${key}`] !== undefined)

                    return (
                      <div key={plan.jour} className="rounded-2xl overflow-hidden"
                        style={{
                          background: plan.is_weekend ? "rgba(255,255,255,0.02)" : "rgba(4,10,22,0.7)",
                          border: `1px solid ${hasOverride ? "rgba(255,210,0,0.25)" : plan.is_weekend ? "rgba(255,255,255,0.07)" : wc + "22"}`,
                        }}>

                        <div className="flex items-center gap-3 px-4 py-2.5"
                          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                          <div className="w-7 h-7 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
                            style={{ background: `${wc}18`, color: wc }}>
                            {plan.jour}
                          </div>
                          <span className="text-sm font-bold" style={{ color: "#fff" }}>{plan.nom_jour}</span>
                          {hasOverride && (
                            <span className="text-xs px-2 py-0.5 rounded-lg font-bold"
                              style={{ background: "rgba(255,210,0,0.12)", color: "#ffd700" }}>
                              adapté
                            </span>
                          )}
                          {plan.is_weekend && (
                            <span className="text-xs italic" style={{ color: "rgba(255,255,255,0.3)" }}>Week-end libre</span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-px"
                          style={{ background: "rgba(255,255,255,0.04)" }}>
                          {MEAL_FIELDS.map(({ key, label, icon }) => {
                            const mapKey = `${plan.jour}__${key}`
                            const hasOv = mapKey in overrides
                            const display = hasOv ? overrides[mapKey] : plan[key]
                            return (
                              <div key={key}
                                className="px-3 py-2.5 relative group cursor-pointer hover:brightness-110 transition-all"
                                style={{
                                  background: hasOv ? "rgba(255,210,0,0.07)" : plan.is_weekend ? "rgba(255,255,255,0.02)" : "#0a1020",
                                  borderLeft: hasOv ? "2px solid rgba(255,210,0,0.4)" : "2px solid transparent",
                                }}>
                                <div className="flex items-center gap-1.5 mb-1">
                                  <span style={{ fontSize: "11px" }}>{icon}</span>
                                  <span className="text-xs font-bold uppercase tracking-wider"
                                    style={{ color: hasOv ? "#ffd700" : "rgba(255,255,255,0.25)" }}>
                                    {label}
                                  </span>
                                  <button
                                    onClick={() => setModal({ jour: plan.jour, field: key })}
                                    className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-xs rounded-lg px-1.5 py-0.5"
                                    style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" }}>
                                    ✎
                                  </button>
                                </div>
                                <p className="text-xs leading-relaxed"
                                  style={{ color: hasOv ? "rgba(255,220,80,0.9)" : "rgba(255,255,255,0.5)" }}>
                                  {display || <span style={{ color: "rgba(255,255,255,0.2)", fontStyle: "italic" }}>—</span>}
                                </p>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}
        {/* ── Photos des repas ── */}
        {tab === "photos" && (
          <PhotosTab onToast={showToast} />
        )}

      </main>

      {/* Override modal */}
      {modal && selectedCollab && coachId && (
        <OverrideModal
          userId={selectedCollab}
          jour={modal.jour}
          field={modal.field}
          baseValue={modalBase}
          currentValue={modalCurrent}
          currentReason={modalReason}
          coachId={coachId}
          isOpen={!!modal}
          onClose={() => setModal(null)}
          onSaved={() => loadCollab(selectedCollab)}
        />
      )}
    </div>
  )
}
