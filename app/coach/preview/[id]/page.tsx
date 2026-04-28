"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { PROGRAM, WEEK_THEMES, type Meal } from "@/data/program"
import MealCard from "@/components/MealCard"
import RitualCard from "@/components/RitualCard"
import Timeline21 from "@/components/Timeline21"
import PrincipesSection from "@/components/PrincipesSection"

type Tab = "programme" | "journal" | "progression" | "principes"

type Override = {
  day: number
  coach_note: string | null
  tip_override: string | null
  intention_override: string | null
  meal_overrides: Record<string, string[]> | null
}

type JournalEntry = {
  id: string
  created_at: string
  energie: number
  humeur: number
  hydratation: number
  sommeil: number
  note: string | null
}

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>("programme")
  const [collab, setCollab] = useState<any>(null)
  const [overrides, setOverrides] = useState<Override[]>([])
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDay, setCurrentDay] = useState(1)

  useEffect(() => {
    fetch(`/api/collab/${id}`)
      .then(r => r.json())
      .then(data => {
        if (!data) { router.push("/coach"); return }
        setCollab(data.collab)
        setOverrides(data.overrides)
        setEntries(data.entries)
        setCurrentDay(Math.max(1, data.collab.current_day || 1))
        setLoading(false)
      })
  }, [id]) // eslint-disable-line

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <div className="w-6 h-6 rounded-full border-2 animate-spin"
          style={{ borderColor: "var(--green)", borderTopColor: "transparent" }} />
      </div>
    )
  }

  const day = PROGRAM[currentDay - 1]
  const weekInfo = WEEK_THEMES[day.week]
  const override = overrides.find(o => o.day === currentDay) ?? null
  const completedDays = entries.map(e => {
    const d = new Date(e.created_at)
    return d.getDate() // approximation — à améliorer avec un champ day
  }).filter((v, i, a) => a.indexOf(v) === i)

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>

      {/* Bannière coach */}
      <div className="px-4 py-2 text-center text-xs font-semibold"
        style={{ background: "rgba(76,201,240,0.12)", borderBottom: "1px solid rgba(76,201,240,0.25)", color: "var(--green)" }}>
        👁 Aperçu coach — espace de {collab?.prenom}
        <button onClick={() => router.push("/coach")}
          className="ml-4 px-2 py-0.5 rounded text-xs"
          style={{ background: "rgba(76,201,240,0.15)", border: "1px solid rgba(76,201,240,0.3)" }}>
          ← Retour
        </button>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-3"
        style={{ background: "rgba(7,13,15,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black"
              style={{ background: "linear-gradient(135deg, var(--green-dim), var(--blue-dim))", color: "#070d0f" }}>B</div>
            <span className="font-black tracking-wider text-sm gradient-text">BTENERGY</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="tag" style={{ borderColor: weekInfo.color + "40", color: weekInfo.color }}>S{day.week}</div>
            <div className="tag">J{currentDay}/21</div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-28 pt-5">

        {/* Sélecteur de jour */}
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setCurrentDay(d => Math.max(1, d - 1))}
            className="tag cursor-pointer">‹</button>
          <span className="flex-1 text-center text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Jour {currentDay} — {day.theme}
          </span>
          <button onClick={() => setCurrentDay(d => Math.min(21, d + 1))}
            className="tag cursor-pointer">›</button>
        </div>

        {/* Hero */}
        <div className="card glow-green p-5 mb-4 fade-up"
          style={{ background: "linear-gradient(135deg, #0f1e22 0%, #0a191e 100%)", borderColor: weekInfo.color + "30" }}>
          <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: weekInfo.color, opacity: 0.8 }}>
            {weekInfo.title}
          </p>
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
            Jour {day.day} · {day.theme}
          </p>
          <h1 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
            Bonjour, {collab?.prenom} 👋
          </h1>
          <p className="text-sm italic" style={{ color: weekInfo.color }}>
            &ldquo;{override?.intention_override || day.intention}&rdquo;
          </p>
          <div className="progress-bar mt-4">
            <div className="progress-fill" style={{ width: `${(currentDay / 21) * 100}%` }} />
          </div>
          <div className="flex gap-2 mt-3">
            <div className="flex-1 p-3 rounded-xl flex items-center gap-2"
              style={{ background: "rgba(76,201,240,0.06)", border: "1px solid rgba(76,201,240,0.12)" }}>
              <span>💧</span>
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{day.hydration}</span>
            </div>
          </div>
        </div>

        {/* Tip */}
        <div className="rounded-xl p-3.5 mb-4 flex items-start gap-3 fade-up"
          style={{ background: "rgba(56,196,232,0.05)", border: "1px solid rgba(56,196,232,0.15)" }}>
          <span className="text-base flex-shrink-0">✨</span>
          <p className="text-xs" style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}>
            {override?.tip_override || day.tip}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 p-1 rounded-xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          {([
            { key: "programme",   label: "Programme" },
            { key: "journal",     label: "Journal" },
            { key: "progression", label: "Progression" },
          ] as const).map(({ key, label }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: activeTab === key ? "linear-gradient(135deg, var(--green-dim), var(--blue-dim))" : "transparent",
                color: activeTab === key ? "#070d0f" : "var(--text-muted)",
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* Programme */}
        {activeTab === "programme" && (
          <div className="space-y-4">
            {override?.coach_note && (
              <div className="rounded-xl p-4 fade-up flex gap-3"
                style={{ background: "rgba(76,201,240,0.07)", border: "1px solid rgba(76,201,240,0.25)" }}>
                <span className="text-lg flex-shrink-0">💬</span>
                <div>
                  <p className="text-xs font-bold mb-1" style={{ color: "var(--green)" }}>Message de votre coach</p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}>{override.coach_note}</p>
                </div>
              </div>
            )}
            <div className="space-y-3">
              {day.meals.map((meal, i) => {
                const overrideMeals = override?.meal_overrides?.[meal.moment]
                if (overrideMeals && overrideMeals.length > 0) {
                  const customMeal: Meal = { ...meal, items: overrideMeals }
                  return <MealCard key={i} meal={customMeal} isCustomized />
                }
                return <MealCard key={i} meal={meal} />
              })}
            </div>
            <RitualCard matin={day.ritual.matin} soir={day.ritual.soir} />
          </div>
        )}

        {/* Journal (lecture seule) */}
        {activeTab === "journal" && (
          <div className="space-y-3">
            {entries.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="text-lg mb-2">📓</p>
                <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Aucune entrée</p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{collab?.prenom} n&apos;a pas encore rempli de journal.</p>
              </div>
            ) : entries.map(e => (
              <div key={e.id} className="card p-4">
                <p className="text-xs mb-3 font-semibold" style={{ color: "var(--text-muted)" }}>
                  {new Date(e.created_at).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                </p>
                <div className="grid grid-cols-4 gap-2 text-center mb-3">
                  {[
                    { l: "Énergie", v: e.energie },
                    { l: "Humeur",  v: e.humeur },
                    { l: "Hydrat.", v: e.hydratation },
                    { l: "Sommeil", v: e.sommeil },
                  ].map(({ l, v }) => (
                    <div key={l}>
                      <div className="font-black text-sm gradient-text">{v}/10</div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>{l}</div>
                    </div>
                  ))}
                </div>
                {e.note && (
                  <p className="text-xs italic pt-2" style={{ color: "var(--text-secondary)", borderTop: "1px solid var(--border)" }}>
                    &ldquo;{e.note}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Progression */}
        {activeTab === "progression" && (
          <div className="space-y-4">
            <Timeline21 totalDays={21} currentDay={collab?.current_day || 1} completedDays={[]} />
            <div className="space-y-3">
              {([1, 2, 3] as const).map(w => {
                const wInfo = WEEK_THEMES[w]
                const wDays = PROGRAM.filter(d => d.week === w)
                const done = wDays.filter(d => d.day <= (collab?.current_day || 0)).length
                return (
                  <div key={w} className="card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: wInfo.color }}>Semaine {w}</span>
                        <p className="font-bold text-sm mt-0.5" style={{ color: "var(--text-primary)" }}>{wInfo.title}</p>
                      </div>
                      <span className="tag">{done}/7</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${(done / 7) * 100}%`, background: `linear-gradient(90deg, ${wInfo.color}, ${wInfo.color}88)` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Principes */}
        {activeTab === "principes" && <PrincipesSection />}

      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 px-4"
        style={{ background: "rgba(7,13,15,0.96)", backdropFilter: "blur(16px)", borderTop: "1px solid var(--border)" }}>
        <div className="max-w-2xl mx-auto flex items-center justify-around py-2.5">
          {([
            { icon: "🏠", label: "Programme", tab: "programme" },
            { icon: "📓", label: "Journal",   tab: "journal" },
            { icon: "📈", label: "Progrès",   tab: "progression" },
            { icon: "💡", label: "Principes", tab: "principes" },
          ] as const).map(({ icon, label, tab }) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="flex flex-col items-center gap-0.5 px-2"
              style={{ color: activeTab === tab ? "var(--green)" : "var(--text-muted)" }}>
              <span className="text-lg leading-none">{icon}</span>
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
