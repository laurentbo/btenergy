"use client"
import { useState, useEffect } from "react"
import { PROGRAM, WEEK_THEMES, calcIMC, imcLabel, type UserProfile, type Meal } from "@/data/program"
import MealCard from "@/components/MealCard"
import RitualCard from "@/components/RitualCard"
import JournalForm from "@/components/JournalForm"
import Timeline21 from "@/components/Timeline21"
import ProfilForm from "@/components/ProfilForm"
import PrincipesSection from "@/components/PrincipesSection"
import { createClient } from "@/lib/supabase/client"

const CURRENT_DAY = 1
const COMPLETED_DAYS = [1]

type Override = {
  coach_note: string | null
  tip_override: string | null
  intention_override: string | null
  meal_overrides: Record<string, string[]> | null
}

type Tab = "programme" | "journal" | "progression" | "principes" | "profil"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("programme")
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [showProfileSetup, setShowProfileSetup] = useState(false)
  const [override, setOverride] = useState<Override | null>(null)
  const supabase = createClient()

  const day = PROGRAM[CURRENT_DAY - 1]
  const weekInfo = WEEK_THEMES[day.week]

  useEffect(() => {
    const saved = localStorage.getItem("btenergy_profile")
    if (saved) setProfile(JSON.parse(saved))
    else setShowProfileSetup(true)

    // Charge les personnalisations du coach pour ce jour
    async function loadOverride() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from("program_overrides")
        .select("*")
        .eq("collaborateur_id", user.id)
        .eq("day", CURRENT_DAY)
        .single()
      if (data) setOverride(data as Override)
    }
    loadOverride()
  }, []) // eslint-disable-line

  const handleSaveProfile = (p: UserProfile) => {
    setProfile(p)
    localStorage.setItem("btenergy_profile", JSON.stringify(p))
    setShowProfileSetup(false)
    setActiveTab("programme")
  }

  const imc = profile ? calcIMC(profile.poids, profile.taille) : null
  const imcInfo = imc ? imcLabel(imc) : null

  // ─── ONBOARDING ──────────────────────────────────────────────────────────────
  if (showProfileSetup) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-primary)" }}>
        <div className="flex-1 max-w-lg mx-auto w-full px-4 py-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-4"
              style={{ background: "linear-gradient(135deg, var(--green-dim), var(--blue-dim))", color: "#070d0f" }}>
              B
            </div>
            <h1 className="text-2xl font-black gradient-text mb-1">BTENERGY</h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Programme 21 Jours · Détox & Énergie</p>
          </div>

          <div className="card p-5 mb-4">
            <h2 className="font-bold text-base mb-1" style={{ color: "var(--text-primary)" }}>Bienvenue 👋</h2>
            <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>
              Renseignez votre profil pour personnaliser votre programme — les champs optionnels permettent d&apos;adapter les portions et conseils.
            </p>
            <ProfilForm onSave={handleSaveProfile} initial={profile} />
          </div>

          <button
            onClick={() => { setShowProfileSetup(false); setProfile({ prenom: "Collaborateur", genre: "homme", age: 35, taille: 170, poids: 70 }) }}
            className="w-full text-center text-xs py-2"
            style={{ color: "var(--text-muted)" }}>
            Passer cette étape →
          </button>
        </div>
      </div>
    )
  }

  // ─── APP PRINCIPALE ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>

      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-3"
        style={{ background: "rgba(7,13,15,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black"
              style={{ background: "linear-gradient(135deg, var(--green-dim), var(--blue-dim))", color: "#070d0f" }}>
              B
            </div>
            <span className="font-black tracking-wider text-sm gradient-text">BTENERGY</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="tag" style={{ borderColor: weekInfo.color + "40", color: weekInfo.color }}>
              Semaine {day.week}
            </div>
            <div className="tag">J{CURRENT_DAY}/21</div>
            <button
              onClick={() => setActiveTab("profil")}
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
              {profile?.prenom?.charAt(0).toUpperCase() ?? "?"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-28 pt-5">

        {/* Hero du jour */}
        <div className="card glow-green p-5 mb-4 fade-up"
          style={{ background: "linear-gradient(135deg, #0f1e22 0%, #0a191e 100%)", borderColor: weekInfo.color + "30" }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: weekInfo.color, opacity: 0.8 }}>
                {weekInfo.title}
              </p>
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
                Jour {day.day} · {day.theme}
              </p>
              <h1 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                Bonjour, {profile?.prenom ?? "vous"} 👋
              </h1>
              <p className="text-sm italic" style={{ color: weekInfo.color }}>
                &ldquo;{day.intention}&rdquo;
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-3xl font-black gradient-text">{CURRENT_DAY}</div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>/ 21</div>
            </div>
          </div>

          <div className="progress-bar mt-4">
            <div className="progress-fill" style={{ width: `${(CURRENT_DAY / 21) * 100}%` }} />
          </div>

          <div className="flex gap-2 mt-3">
            <div className="flex-1 p-3 rounded-xl flex items-center gap-2"
              style={{ background: "rgba(45,228,164,0.06)", border: "1px solid rgba(45,228,164,0.12)" }}>
              <span>💧</span>
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{day.hydration}</span>
            </div>
            {profile && (
              <div className="p-3 rounded-xl flex items-center gap-1.5"
                style={{ background: "rgba(56,196,232,0.06)", border: "1px solid rgba(56,196,232,0.12)" }}>
                <span className="text-xs font-bold" style={{ color: "var(--blue)" }}>
                  {profile.genre === "femme" ? "♀" : "♂"}
                </span>
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  {profile.age} ans · {profile.poids}kg
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Tip du jour */}
        <div className="rounded-xl p-3.5 mb-4 flex items-start gap-3 fade-up"
          style={{ background: "rgba(56,196,232,0.05)", border: "1px solid rgba(56,196,232,0.15)" }}>
          <span className="text-base flex-shrink-0">✨</span>
          <p className="text-xs" style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}>{day.tip}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 p-1 rounded-xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          {([
            { key: "programme", label: "Programme" },
            { key: "journal",   label: "Journal" },
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

        {/* ── Programme ── */}
        {activeTab === "programme" && (
          <div className="space-y-4">
            {/* Note personnalisée du coach */}
            {override?.coach_note && (
              <div className="rounded-xl p-4 fade-up flex gap-3"
                style={{ background: "rgba(45,228,164,0.07)", border: "1px solid rgba(45,228,164,0.25)" }}>
                <span className="text-lg flex-shrink-0">💬</span>
                <div>
                  <p className="text-xs font-bold mb-1" style={{ color: "var(--green)" }}>Message de votre coach</p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}>
                    {override.coach_note}
                  </p>
                </div>
              </div>
            )}

            {/* Adaptation profil */}
            {profile && (
              <div className="rounded-xl p-3 flex items-center gap-3 fade-up"
                style={{ background: "rgba(129,140,248,0.06)", border: "1px solid rgba(129,140,248,0.15)" }}>
                <span>🎯</span>
                <p className="text-xs" style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                  Programme adapté pour <strong style={{ color: "var(--text-primary)" }}>{profile.prenom}</strong> — {profile.genre}, {profile.age} ans, {profile.poids} kg.
                  {imc && <> IMC <strong style={{ color: imcInfo?.color }}>{imc}</strong> ({imcInfo?.label}).</>}
                </p>
              </div>
            )}

            {/* Repas — override ou défaut */}
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

        {/* ── Journal ── */}
        {activeTab === "journal" && <JournalForm />}

        {/* ── Progression ── */}
        {activeTab === "progression" && (
          <div className="space-y-4">
            <Timeline21 totalDays={21} currentDay={CURRENT_DAY} completedDays={COMPLETED_DAYS} />

            {/* Résumé semaines */}
            <div className="space-y-3">
              {([1, 2, 3] as const).map(w => {
                const wInfo = WEEK_THEMES[w]
                const wDays = PROGRAM.filter(d => d.week === w)
                const done  = wDays.filter(d => COMPLETED_DAYS.includes(d.day)).length
                return (
                  <div key={w} className="card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: wInfo.color }}>
                          Semaine {w}
                        </span>
                        <p className="font-bold text-sm mt-0.5" style={{ color: "var(--text-primary)" }}>{wInfo.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{wInfo.desc}</p>
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

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Jours actifs", value: COMPLETED_DAYS.length.toString(), icon: "🔥" },
                { label: "Semaine en cours", value: `S${day.week}`, icon: "📅" },
                { label: "Série actuelle", value: `${COMPLETED_DAYS.length}j`, icon: "🎯" },
              ].map(({ label, value, icon }) => (
                <div key={label} className="card p-3 text-center">
                  <div className="text-lg mb-1">{icon}</div>
                  <div className="text-lg font-black gradient-text">{value}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Profil ── */}
        {activeTab === "profil" && (
          <div className="space-y-4">
            <div className="card p-5">
              <h2 className="font-bold text-base mb-4" style={{ color: "var(--text-primary)" }}>Mon Profil</h2>
              <ProfilForm onSave={handleSaveProfile} initial={profile} />
            </div>
          </div>
        )}

        {/* ── Principes ── */}
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
            { icon: "👤", label: "Profil",    tab: "profil" },
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
