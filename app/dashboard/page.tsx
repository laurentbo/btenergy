"use client"
import { useState, useEffect, useMemo } from "react"
import { PROGRAM, WEEK_THEMES, calcCurrentDay, calcRawDay, getConseilDuJour, type UserProfile, type Meal } from "@/data/program"
import MealCard from "@/components/MealCard"
import JournalForm from "@/components/JournalForm"
import Timeline21 from "@/components/Timeline21"
import ProfilForm from "@/components/ProfilForm"
import PrincipesSection from "@/components/PrincipesSection"
import WeightTracker from "@/components/WeightTracker"
import ShoppingList from "@/components/ShoppingList"
import EnergyCheckin from "@/components/EnergyCheckin"
import QuestionFooter from "@/components/QuestionFooter"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/auth-context"
import WelcomeScreen from "@/components/WelcomeScreen"
import PreparationPhase from "@/components/PreparationPhase"
import { useDayMenu } from "@/lib/hooks/useDayMenu"
import type { MealFieldName } from "@/lib/supabase/types"

const MEAL_META: Record<string, { icon: string; label: string; horaire: string }> = {
  "matin":        { icon: "🌅", label: "Petit-déjeuner", horaire: "7h – 9h" },
  "midi":         { icon: "🌞", label: "Déjeuner",       horaire: "12h – 14h" },
  "après-midi":   { icon: "🌤",  label: "Collation",      horaire: "15h – 17h" },
  "soir":         { icon: "🌙", label: "Dîner",           horaire: "18h – 20h" },
}

const DB_MEAL_META: Record<MealFieldName, { icon: string; label: string; horaire: string } | null> = {
  petit_dejeuner:       { icon: "🌅", label: "Petit-déjeuner",     horaire: "7h – 9h"   },
  collation_matin:      { icon: "🍎", label: "Collation matin",     horaire: "10h – 11h" },
  dejeuner:             { icon: "🌞", label: "Déjeuner",            horaire: "12h – 14h" },
  collation_apres_midi: { icon: "🌤", label: "Collation après-midi", horaire: "15h – 17h" },
  diner:                { icon: "🌙", label: "Dîner",               horaire: "18h – 20h" },
  astuce_umami:         null,
}

const DB_MEAL_BORDER: Record<MealFieldName, string> = {
  petit_dejeuner:       "#f59e0b",
  collation_matin:      "#fb923c",
  dejeuner:             "#22c55e",
  collation_apres_midi: "#fb923c",
  diner:                "#818cf8",
  astuce_umami:         "#94a3b8",
}

function parseDbMeal(value: string | null): string[] {
  if (!value) return []
  return value.split("\n").map(s => s.trim()).filter(Boolean)
}

type Override = {
  coach_note: string | null
  tip_override: string | null
  intention_override: string | null
  meal_overrides: Record<string, string[]> | null
  ritual_matin_override: string | null
  ritual_soir_override: string | null
}

type Tab = "programme" | "journal" | "progression" | "courses" | "principes" | "reperes"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("programme")
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [showProfileSetup, setShowProfileSetup] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showJ1Onboarding, setShowJ1Onboarding] = useState(false)
  const [override, setOverride] = useState<Override | null>(null)
  const [checking, setChecking] = useState(true)
  const [currentDay, setCurrentDay] = useState(1)
  const [viewDay, setViewDay] = useState(1)
  const [mealLogs, setMealLogs] = useState<Record<string, string[]>>({})
  const [openMoments, setOpenMoments] = useState<Set<string>>(new Set(["matin"]))
  const [programStartDate, setProgramStartDate] = useState<string | null>(null)
  const [exclusions, setExclusions] = useState<Record<string, boolean | string[]>>({})
  const [userId, setUserId] = useState<string | null>(null)

  const supabase = useMemo(() => createClient(), [])
  const { signOut } = useAuth()
  const { menu: dbMenu } = useDayMenu(userId, viewDay)

  const handleSignOut = async () => {
    await signOut()
    window.location.href = "/"
  }

  const prenom = profile?.prenom
    ? profile.prenom.charAt(0).toUpperCase() + profile.prenom.slice(1).toLowerCase()
    : null

  const toggleMoment = (moment: string) => {
    setOpenMoments(prev => {
      const next = new Set(prev)
      next.has(moment) ? next.delete(moment) : next.add(moment)
      return next
    })
  }

  useEffect(() => {
    async function init() {
      const res = await fetch("/api/me")
      if (res.status === 401) { window.location.href = "/"; return }

      const { role } = await res.json()
      if (role === "coach" || role === "admin") {
        window.location.href = "/coach"; return
      }

      const { data: { user } } = await supabase.auth.getUser()
      let computedDay = 1
      if (user) {
        setUserId(user.id)
        const { data: dbProfile } = await supabase
          .from("profiles")
          .select("prenom, age, genre, taille, poids, program_start, welcome_seen_at")
          .eq("id", user.id)
          .maybeSingle()

        const saved = localStorage.getItem("btenergy_profile")
        const localProfile: UserProfile | null = saved ? JSON.parse(saved) : null
        const startDate = dbProfile?.program_start ?? localProfile?.start_date
        if (startDate) setProgramStartDate(startDate)
        computedDay = calcCurrentDay(startDate)
        setCurrentDay(computedDay)
        setViewDay(computedDay)

        const supabaseProfile: UserProfile | null = dbProfile?.prenom
          ? {
              prenom: dbProfile.prenom,
              age: dbProfile.age ?? undefined,
              genre: dbProfile.genre ?? undefined,
              taille: dbProfile.taille ?? undefined,
              poids: dbProfile.poids ?? undefined,
              start_date: startDate ?? undefined,
            }
          : null

        const activeProfile = supabaseProfile ?? localProfile
        if (activeProfile) {
          const merged = { ...activeProfile, start_date: startDate ?? activeProfile.start_date }
          localStorage.setItem("btenergy_profile", JSON.stringify(merged))
          setProfile(merged)
          if (!dbProfile?.welcome_seen_at) {
            setShowWelcome(true)
          }
        } else {
          setShowProfileSetup(true)
        }

        // Charger les exclusions depuis coach_settings via l'API
        fetch("/api/admin/exclusions")
          .then(r => r.json())
          .then(d => { if (d.exclusions) setExclusions(d.exclusions) })
          .catch(() => {})
      } else {
        window.location.href = "/"; return
      }

      if (computedDay === 1 && !localStorage.getItem("btenergy_onboarding_done")) {
        setShowJ1Onboarding(true)
      }

      const rawDay = calcRawDay(
        (() => { try { return JSON.parse(localStorage.getItem("btenergy_profile") ?? "{}").start_date } catch { return undefined } })()
      )
      const emailDay = Math.min(22, rawDay)
      const emailSentKey = `btenergy_email_sent_${emailDay}`
      if (!localStorage.getItem(emailSentKey) && emailDay >= 1 && emailDay <= 22) {
        fetch("/api/send-step-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ day: emailDay }),
        })
          .then(r => r.json())
          .then(d => { if (d.ok) localStorage.setItem(emailSentKey, "1") })
          .catch(() => {})
      }


      setChecking(false)
    }
    init()
  }, []) // eslint-disable-line

  const handleSaveProfile = async (p: UserProfile) => {
    setProfile(p)
    localStorage.setItem("btenergy_profile", JSON.stringify(p))
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from("profiles").update({
        prenom: p.prenom,
        age: p.age ?? null,
        genre: p.genre ?? null,
        taille: p.taille ?? null,
        poids: p.poids ?? null,
        ...(p.start_date ? { program_start: p.start_date } : {}),
      }).eq("id", user.id)
      if (p.start_date) setCurrentDay(calcCurrentDay(p.start_date))
    }
    setShowProfileSetup(false)
    setActiveTab("programme")
  }

  useEffect(() => {
    if (checking) return
    async function loadViewDay() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: ov } = await supabase
        .from("program_overrides")
        .select("*")
        .eq("collaborateur_id", user.id)
        .eq("day", viewDay)
        .maybeSingle()
      setOverride(ov as Override ?? null)
      const { data: logs } = await supabase
        .from("meal_logs")
        .select("moment, items")
        .eq("user_id", user.id)
        .eq("day", viewDay)
      const logsMap: Record<string, string[]> = {}
      if (logs) logs.forEach((l: { moment: string; items: string[] }) => { logsMap[l.moment] = l.items })
      setMealLogs(logsMap)
    }
    loadViewDay()
  }, [viewDay, checking]) // eslint-disable-line

const saveMealLog = async (moment: string, items: string[]) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from("meal_logs").upsert(
      { user_id: user.id, day: viewDay, moment, items },
      { onConflict: "user_id,day,moment" }
    )
    setMealLogs(prev => ({ ...prev, [moment]: items }))
  }

  const day = PROGRAM[currentDay - 1]
  const weekInfo = WEEK_THEMES[day.week]
  const viewDayData = PROGRAM[viewDay - 1]
  const viewWeekInfo = WEEK_THEMES[viewDayData.week]
  const completedDays = Array.from({ length: currentDay - 1 }, (_, i) => i + 1)

  const activeExclusions = Object.entries(exclusions)
    .filter(([key, val]) => key !== "autres" && val === true)
    .map(([key]) => key.replace(/_/g, " "))

  // ─── CHARGEMENT ──────────────────────────────────────────────────────────────
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black"
            style={{ background: "linear-gradient(135deg, var(--green-dim), var(--blue-dim))", color: "#070d0f" }}>B</div>
          <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "var(--blue)", borderTopColor: "transparent" }} />
        </div>
      </div>
    )
  }

  if (showWelcome) {
    return <WelcomeScreen prenom={profile?.prenom ?? null} onDone={() => setShowWelcome(false)} />
  }

  if (showProfileSetup) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-primary)" }}>
        <div className="flex-1 max-w-lg mx-auto w-full px-4 py-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-4"
              style={{ background: "linear-gradient(135deg, var(--green-dim), var(--blue-dim))", color: "#070d0f" }}>
              B
            </div>
            <h1 className="text-2xl font-black gradient-text mb-1">Backtoenergy</h1>
          </div>
          <div className="card p-5 mb-4">
            <h2 className="font-bold text-base mb-1" style={{ color: "var(--text-primary)" }}>Bienvenue 👋</h2>
            <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>
              Renseigne ton prénom et la date de démarrage pour personnaliser ton programme.
            </p>
            <ProfilForm onSave={handleSaveProfile} initial={profile} />
          </div>
          <button
            onClick={() => { setShowProfileSetup(false); setProfile({ prenom: "Participant", age: 35, start_date: new Date().toISOString().split("T")[0] }) }}
            className="w-full text-center text-xs py-2"
            style={{ color: "var(--text-muted)" }}>
            Passer cette étape →
          </button>
        </div>
      </div>
    )
  }

  if (showJ1Onboarding) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ background: "linear-gradient(160deg, #0b1e38 0%, #07111e 55%, #050e1a 100%)" }}>
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black mx-auto mb-6"
            style={{ background: "linear-gradient(135deg, var(--green-dim), var(--blue-dim))", color: "#050e1a" }}>
            B
          </div>
          <h1 className="text-3xl font-black gradient-text mb-8">Backtoenergy</h1>

          <div className="card p-6 mb-6 text-left"
            style={{ border: "1px solid rgba(45,212,160,0.25)", background: "rgba(4,10,22,0.72)" }}>
            <p className="font-bold mb-3" style={{ color: "var(--text-primary)", fontSize: "16px" }}>
              Bienvenue {prenom ? `, ${prenom}` : ""} 🌿
            </p>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)", lineHeight: "1.75" }}>
              Ton programme de 21 jours commence aujourd&apos;hui. Les 3 règles d&apos;or :
            </p>
            {[
              { icon: "💧", text: "Eau citronnée à jeun chaque matin, 15 min avant de manger" },
              { icon: "🍽️", text: "Protéines uniquement avec des légumes — jamais avec des céréales" },
              { icon: "🌙", text: "Dîner avant 20h, jeûne nocturne de 12h minimum" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-start gap-3 mb-3">
                <span style={{ fontSize: "16px", flexShrink: 0 }}>{icon}</span>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>{text}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              localStorage.setItem("btenergy_onboarding_done", "1")
              setShowJ1Onboarding(false)
            }}
            className="w-full py-4 rounded-2xl font-black text-base transition-all"
            style={{
              background: "linear-gradient(135deg, #2dd4a0, #4cc9f0)",
              color: "#050e1a",
              letterSpacing: "0.04em",
            }}>
            Commencer le Jour 1 →
          </button>
        </div>
      </div>
    )
  }

  const WEEK_LIGHT: Record<number, { text: string; bg: string; border: string }> = {
    1: { text: "#15803d", bg: "#dcfce7", border: "#86efac" },
    2: { text: "#0369a1", bg: "#e0f2fe", border: "#7dd3fc" },
    3: { text: "#b45309", bg: "#fef3c7", border: "#fcd34d" },
  }
  const MEAL_BORDER: Record<string, string> = {
    "matin":      "#f59e0b",
    "midi":       "#22c55e",
    "après-midi": "#fb923c",
    "soir":       "#818cf8",
  }
  const wLight = WEEK_LIGHT[day.week] ?? WEEK_LIGHT[1]

  return (
    <div className="min-h-screen" style={{ background: "#f0f4f8" }}>

      {/* ── Header ── */}
      <header className="sticky top-0 z-50"
        style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid #e2e8f0", padding: "12px 20px" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button
            onClick={() => setActiveTab("programme")}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: "6px" }}>
            {activeTab === "reperes" && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5"/><path d="M12 5l-7 7 7 7"/>
              </svg>
            )}
            <span style={{ fontWeight: 900, fontSize: "12px", letterSpacing: "-0.01em" }}>
              <span style={{ color: "#16a34a" }}>Backt</span><span style={{ color: "#1e293b" }}>o</span><span style={{ color: "#16a34a" }}>energy</span>
            </span>
          </button>
          {prenom && (
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>Hello {prenom} 👋</span>
          )}
          <button
            onClick={() => setActiveTab("reperes")}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </div>
            <span style={{ fontSize: "9px", fontWeight: 700, color: "#16a34a", letterSpacing: "0.02em" }}>Mes repères</span>
          </button>
        </div>
      </header>

      <main style={{ maxWidth: "640px", margin: "0 auto", padding: "16px 16px 100px" }}>

      {activeTab === "reperes" ? (
        /* ══════════════════════════════════════════
           MES REPÈRES — vue complète
           ══════════════════════════════════════════ */
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {profile && (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "16px", padding: "16px" }}>
              <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.1em", color: "#16a34a", marginBottom: "12px" }}>MON PROFIL</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {[
                  { label: "Prénom", value: profile.prenom },
                  { label: "Genre", value: profile.genre ?? "—" },
                  { label: "Taille", value: profile.taille ? `${profile.taille} cm` : "—" },
                  { label: "Poids", value: profile.poids ? `${profile.poids} kg` : "—" },
                  { label: "Âge", value: profile.age ? `${profile.age} ans` : "—" },
                  { label: "Jour en cours", value: `J${currentDay} / 21` },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: "#fff", borderRadius: "10px", padding: "10px 12px" }}>
                    <p style={{ fontSize: "9px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", marginBottom: "2px" }}>{label.toUpperCase()}</p>
                    <p style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.1em", color: "#94a3b8", marginBottom: "14px" }}>MODIFIER MES INFORMATIONS</p>
            <ProfilForm onSave={handleSaveProfile} initial={profile} />
          </div>
          <div style={{ background: "#fff", borderRadius: "16px", padding: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "10px" }}>Se déconnecter ferme ta session. Tes données sont sauvegardées.</p>
            <button onClick={handleSignOut}
              style={{ width: "100%", padding: "10px", borderRadius: "10px", fontWeight: 600, fontSize: "13px", background: "#fff1f2", color: "#e11d48", border: "1px solid #fecdd3", cursor: "pointer" }}>
              Se déconnecter
            </button>
          </div>
        </div>
      ) : (
        /* ══════════════════════════════════════════
           VUE PRINCIPALE (tous les autres onglets)
           ══════════════════════════════════════════ */
        <>

        {/* ── Hero card ── */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", marginBottom: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>

          {/* Phase badge */}
          <div style={{
            display: "inline-flex", alignItems: "center",
            background: wLight.bg, color: wLight.text,
            border: `1px solid ${wLight.border}`,
            borderRadius: "20px", padding: "4px 12px",
            fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", marginBottom: "14px",
          }}>
            S{day.week} · {weekInfo.title.toUpperCase()}
          </div>

          {/* Quote + day counter */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "16px" }}>
            <p style={{ fontSize: "13px", fontStyle: "italic", color: wLight.text, lineHeight: 1.5 }}>
              &ldquo;{day.theme}&rdquo;
            </p>
            <div style={{
              flexShrink: 0, width: 64, height: 64, borderRadius: "16px",
              background: wLight.bg, border: `1px solid ${wLight.border}`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: "26px", fontWeight: 900, color: wLight.text, lineHeight: 1 }}>{currentDay}</span>
              <span style={{ fontSize: "10px", color: "#94a3b8", fontWeight: 600 }}>/ 21</span>
            </div>
          </div>

          {/* Progress */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "12px", color: "#64748b" }}>Progression</span>
              <span style={{ fontSize: "12px", fontWeight: 700, color: wLight.text }}>{Math.round((currentDay / 21) * 100)}%</span>
            </div>
            <div style={{ height: "6px", background: "#f1f5f9", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(currentDay / 21) * 100}%`, background: wLight.text, borderRadius: "3px", transition: "width 0.4s" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
              {["●J1", "●J7", "●J14", "●J21"].map(m => (
                <span key={m} style={{ fontSize: "10px", color: "#cbd5e1" }}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Mot du coach ── */}
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "16px", padding: "14px 16px", marginBottom: "12px" }}>
          <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.1em", color: "#16a34a", marginBottom: "5px" }}>MOT DU JOUR</p>
          <p style={{ fontSize: "13px", color: "#15803d", lineHeight: 1.65 }}>
            {override?.coach_note ?? day.coachWord}
          </p>
        </div>

        {/* ── Conseil du jour ── */}
        {(() => {
          const conseil = getConseilDuJour(currentDay)
          return (
            <div style={{ background: "#f5f3ff", border: "1px solid #ddd6fe", borderRadius: "16px", padding: "14px 16px", marginBottom: "12px", borderLeft: "3px solid #8b5cf6" }}>
              <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.1em", color: "#7c3aed", marginBottom: "5px" }}>
                {conseil.icon} CONSEIL DU JOUR
              </p>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#5b21b6", marginBottom: "3px" }}>{conseil.titre}</p>
              <p style={{ fontSize: "13px", color: "#4c1d95", lineHeight: 1.65, opacity: 0.85 }}>{conseil.texte}</p>
            </div>
          )
        })()}

        {/* ── Rituels du jour ── */}
        <div style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", marginBottom: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", borderLeft: "3px solid #22c55e" }}>
          <div style={{ padding: "14px 16px" }}>
            <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.1em", color: "#16a34a", marginBottom: "12px" }}>🌿 RITUELS DU JOUR</p>
            {[
              { icon: "🌅", label: "MATIN", text: day.morningRitual },
              { icon: "💧", label: "HYDRATATION", text: day.hydration },
              { icon: "🏃", label: "MOUVEMENT", text: "30 min d'activité douce : marche, vélo, yoga ou étirements" },
              { icon: "🌙", label: "SOIR", text: day.ritual?.soir ?? "Dîner avant 20h · commencer par les crudités" },
            ].map(({ icon, label, text }, i, arr) => (
              <div key={label} style={{ display: "flex", gap: "10px", paddingBottom: i < arr.length - 1 ? "10px" : 0, marginBottom: i < arr.length - 1 ? "10px" : 0, borderBottom: i < arr.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                <span style={{ fontSize: "18px", flexShrink: 0, lineHeight: 1.3 }}>{icon}</span>
                <div>
                  <p style={{ fontSize: "9px", fontWeight: 800, color: "#94a3b8", letterSpacing: "0.1em", marginBottom: "2px" }}>{label}</p>
                  <p style={{ fontSize: "13px", color: "#334155", lineHeight: 1.55 }}>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", marginBottom: "16px" }}>
          {([
            { key: "programme",   label: "Aliments" },
            { key: "journal",     label: "Journal" },
            { key: "progression", label: "Poids" },
            { key: "principes",   label: "Principes" },
          ] as const).map(({ key, label }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              style={{
                flex: 1, padding: "10px 4px", fontSize: "13px", fontWeight: 600,
                color: activeTab === key ? "#16a34a" : "#94a3b8",
                background: "none", border: "none", cursor: "pointer",
                borderBottom: activeTab === key ? "2px solid #16a34a" : "2px solid transparent",
                transition: "color 0.15s",
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* ── Aliments ── */}
        {activeTab === "programme" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

            {programStartDate && (() => {
              const target = new Date(programStartDate)
              const today = new Date()
              target.setHours(0, 0, 0, 0); today.setHours(0, 0, 0, 0)
              const daysLeft = Math.floor((target.getTime() - today.getTime()) / 86400000)
              return daysLeft >= 1 && daysLeft <= 3 ? <PreparationPhase programStartDate={programStartDate} /> : null
            })()}

            {/* Navigation jours */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", borderRadius: "14px", padding: "10px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <button onClick={() => setViewDay(d => Math.max(1, d - 1))} disabled={viewDay === 1}
                style={{ fontSize: "18px", color: viewDay === 1 ? "#cbd5e1" : "#0f172a", background: "none", border: "none", cursor: viewDay === 1 ? "default" : "pointer", width: 32, height: 32 }}>←</button>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 800, color: "#0f172a", fontSize: "14px" }}>
                  Jour {viewDay}
                  {viewDay === currentDay && (
                    <span style={{ marginLeft: "6px", background: wLight.bg, color: wLight.text, borderRadius: "20px", padding: "1px 8px", fontSize: "10px", fontWeight: 700 }}>
                      Aujourd&apos;hui
                    </span>
                  )}
                </div>
                <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                  {viewDay < currentDay ? "🕐 Passé" : viewDay > currentDay ? "📅 À venir" : viewWeekInfo.title}
                </div>
              </div>
              <button onClick={() => setViewDay(d => Math.min(21, d + 1))} disabled={viewDay === 21}
                style={{ fontSize: "18px", color: viewDay === 21 ? "#cbd5e1" : "#0f172a", background: "none", border: "none", cursor: viewDay === 21 ? "default" : "pointer", width: 32, height: 32 }}>→</button>
            </div>

            {/* Note coach override */}
            {override?.coach_note && (
              <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "14px", padding: "12px 14px", display: "flex", gap: "10px" }}>
                <span style={{ fontSize: "16px", flexShrink: 0 }}>💬</span>
                <div>
                  <p style={{ fontSize: "10px", fontWeight: 800, color: "#1d4ed8", letterSpacing: "0.08em", marginBottom: "3px" }}>MESSAGE DE TON COACH</p>
                  <p style={{ fontSize: "13px", color: "#1e40af", lineHeight: 1.6 }}>{override.coach_note}</p>
                </div>
              </div>
            )}

            {/* Meal cards — DB si disponible, sinon static */}
            {dbMenu && !dbMenu.is_weekend ? (
              <>
                {(["petit_dejeuner", "collation_matin", "dejeuner", "collation_apres_midi", "diner"] as MealFieldName[]).map((field) => {
                  const meta = DB_MEAL_META[field]
                  if (!meta) return null
                  const items = parseDbMeal(dbMenu[field as keyof typeof dbMenu] as string | null)
                  if (items.length === 0) return null
                  const isOpen = openMoments.has(field)
                  const borderColor = DB_MEAL_BORDER[field]
                  const isOverridden = dbMenu.overriddenFields.includes(field)

                  return (
                    <div key={field} style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", borderLeft: `3px solid ${borderColor}` }}>
                      <button onClick={() => toggleMoment(field)}
                        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: isOpen ? "#fafafa" : "#fff", border: "none", cursor: "pointer", textAlign: "left" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <span style={{ fontSize: "20px" }}>{meta.icon}</span>
                          <div>
                            <p style={{ fontWeight: 700, fontSize: "14px", color: "#0f172a", margin: 0 }}>
                              {meta.label}
                              {isOverridden && <span style={{ marginLeft: "6px", fontSize: "10px", background: "#fef3c7", color: "#92400e", borderRadius: "20px", padding: "1px 7px", fontWeight: 700 }}>adapté</span>}
                            </p>
                            <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>{meta.horaire}</p>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ background: "#f1f5f9", borderRadius: "20px", padding: "3px 10px", fontSize: "11px", fontWeight: 600, color: "#64748b" }}>
                            {items.length} aliment{items.length > 1 ? "s" : ""}
                          </span>
                          <span style={{ color: "#94a3b8", fontSize: "13px", transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", display: "inline-block" }}>▾</span>
                        </div>
                      </button>
                      {isOpen && (
                        <div style={{ padding: "0 16px 14px", borderTop: "1px solid #f8fafc" }}>
                          {items.map((item, k) => (
                            <div key={k} style={{ display: "flex", alignItems: "flex-start", gap: "8px", padding: "4px 0" }}>
                              <span style={{ color: borderColor, fontSize: "14px", marginTop: "1px", flexShrink: 0, lineHeight: 1 }}>·</span>
                              <span style={{ fontSize: "13px", color: "#334155", lineHeight: 1.55 }}>{item}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
                {dbMenu.astuce_umami && (
                  <div style={{ background: "#fefce8", border: "1px solid #fde68a", borderRadius: "14px", padding: "12px 14px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "16px", flexShrink: 0 }}>✨</span>
                    <div>
                      <p style={{ fontSize: "10px", fontWeight: 800, color: "#92400e", letterSpacing: "0.08em", marginBottom: "3px" }}>ASTUCE UMAMI</p>
                      <p style={{ fontSize: "13px", color: "#78350f", lineHeight: 1.6 }}>{dbMenu.astuce_umami}</p>
                    </div>
                  </div>
                )}
              </>
            ) : dbMenu?.is_weekend ? (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "16px", padding: "20px", textAlign: "center" }}>
                <p style={{ fontSize: "28px", marginBottom: "8px" }}>🌿</p>
                <p style={{ fontWeight: 700, fontSize: "15px", color: "#15803d", marginBottom: "6px" }}>Week-end libre</p>
                <p style={{ fontSize: "13px", color: "#4ade80", lineHeight: 1.6 }}>
                  Profite du week-end pour cuisiner librement en respectant les grands principes du programme.
                </p>
              </div>
            ) : (
              viewDayData.meals.map((meal: Meal, i: number) => {
                const overrideMeals = override?.meal_overrides?.[meal.moment]
                const baseMeal = overrideMeals?.length ? { ...meal, items: overrideMeals } : meal
                const meta = MEAL_META[meal.moment] ?? { icon: "🍴", label: meal.moment, horaire: "" }
                const isOpen = openMoments.has(meal.moment)
                const borderColor = MEAL_BORDER[meal.moment] ?? "#94a3b8"
                const isLastMeal = i === viewDayData.meals.length - 1

                return (
                  <div key={i} style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", borderLeft: `3px solid ${borderColor}` }}>
                    <button onClick={() => toggleMoment(meal.moment)}
                      style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: isOpen ? "#fafafa" : "#fff", border: "none", cursor: "pointer", textAlign: "left" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontSize: "20px" }}>{meta.icon}</span>
                        <div>
                          <p style={{ fontWeight: 700, fontSize: "14px", color: "#0f172a", margin: 0 }}>{meta.label}</p>
                          <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>{meta.horaire}</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ background: "#f1f5f9", borderRadius: "20px", padding: "3px 10px", fontSize: "11px", fontWeight: 600, color: "#64748b" }}>
                          {baseMeal.items.length} aliments
                        </span>
                        <span style={{ color: "#94a3b8", fontSize: "13px", transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", display: "inline-block" }}>▾</span>
                      </div>
                    </button>
                    {isOpen && (
                      <div style={{ padding: "0 16px 14px", borderTop: "1px solid #f8fafc" }}>
                        {baseMeal.items.map((item, k) => (
                          <div key={k} style={{ display: "flex", alignItems: "flex-start", gap: "8px", padding: "4px 0" }}>
                            <span style={{ color: borderColor, fontSize: "14px", marginTop: "1px", flexShrink: 0, lineHeight: 1 }}>·</span>
                            <span style={{ fontSize: "13px", color: "#334155", lineHeight: 1.55 }}>{item}</span>
                          </div>
                        ))}
                        {baseMeal.conseil && (
                          <p style={{ fontSize: "12px", color: "#16a34a", marginTop: "8px", fontStyle: "italic", paddingTop: "8px", borderTop: "1px solid #f0fdf4" }}>
                            💡 {baseMeal.conseil}
                          </p>
                        )}
                        {isLastMeal && day.tip && (
                          <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #fef3c7", display: "flex", gap: "8px", alignItems: "flex-start" }}>
                            <span style={{ fontSize: "14px", flexShrink: 0 }}>✨</span>
                            <p style={{ fontSize: "12px", color: "#92400e", lineHeight: 1.55, fontStyle: "italic" }}>{day.tip}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })
            )}

            {/* Comment je me sens */}
            <EnergyCheckin currentDay={viewDay} onCheckin={() => {}} />

          </div>
        )}

        {/* ── Journal ── */}
        {activeTab === "journal" && (
          <JournalForm currentDay={currentDay} />
        )}

        {/* ── Poids ── */}
        {activeTab === "progression" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <WeightTracker initialWeight={undefined} />
            <Timeline21 totalDays={21} currentDay={currentDay} completedDays={completedDays} />
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {([1, 2, 3] as const).map(w => {
                const wInfo = WEEK_THEMES[w]
                const wLight2 = WEEK_LIGHT[w] ?? WEEK_LIGHT[1]
                const wDays = PROGRAM.filter(d => d.week === w)
                const done = wDays.filter(d => completedDays.includes(d.day)).length
                return (
                  <div key={w} style={{ background: "#fff", borderRadius: "14px", padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div>
                        <span style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.08em", color: wLight2.text }}>SEMAINE {w}</span>
                        <p style={{ fontWeight: 700, fontSize: "13px", color: "#0f172a", margin: "2px 0 1px" }}>{wInfo.title}</p>
                        <p style={{ fontSize: "11px", color: "#94a3b8" }}>{wInfo.desc}</p>
                      </div>
                      <span style={{ background: wLight2.bg, color: wLight2.text, borderRadius: "20px", padding: "3px 10px", fontSize: "12px", fontWeight: 700 }}>{done}/7</span>
                    </div>
                    <div style={{ height: "5px", background: "#f1f5f9", borderRadius: "3px" }}>
                      <div style={{ height: "100%", width: `${(done / 7) * 100}%`, background: wLight2.text, borderRadius: "3px" }} />
                    </div>
                  </div>
                )
              })}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
              {[
                { label: "Jours actifs",     value: completedDays.length.toString(), icon: "🔥" },
                { label: "Semaine",          value: `S${day.week}`,                  icon: "📅" },
                { label: "Série actuelle",   value: `${completedDays.length}j`,      icon: "🎯" },
              ].map(({ label, value, icon }) => (
                <div key={label} style={{ background: "#fff", borderRadius: "14px", padding: "14px 8px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <div style={{ fontSize: "20px", marginBottom: "4px" }}>{icon}</div>
                  <div style={{ fontSize: "18px", fontWeight: 900, color: "#16a34a" }}>{value}</div>
                  <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "2px" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Principes ── */}
        {activeTab === "principes" && (
          <PrincipesSection />
        )}

        {/* Courses (accessible via state mais pas dans nav) */}
        {activeTab === "courses" && (
          <ShoppingList currentDay={currentDay} horizon={7} />
        )}

        </> /* fin vue principale */
      )} {/* fin ternaire reperes */}

      </main>

      {/* ── Bottom nav ── */}
      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, background: "rgba(255,255,255,0.96)", backdropFilter: "blur(20px)", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-around", padding: "8px 8px 6px" }}>
          {([
            { icon: "🍽️", label: "Aliments",  tab: "programme"   },
            { icon: "📓", label: "Journal",   tab: "journal"     },
            { icon: "⚖️", label: "Poids",     tab: "progression" },
            { icon: "💡", label: "Principes",  tab: "principes"   },
          ] as const).map(({ icon, label, tab }) => {
            const isActive = activeTab === tab
            return (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", padding: "6px 16px", background: "none", border: "none", cursor: "pointer", color: isActive ? "#16a34a" : "#94a3b8" }}>
                <span style={{ fontSize: "22px", lineHeight: 1 }}>{icon}</span>
                <span style={{ fontSize: "10px", fontWeight: 600 }}>{label}</span>
                {isActive && <div style={{ width: "18px", height: "2px", background: "#16a34a", borderRadius: "1px", marginTop: "1px" }} />}
              </button>
            )
          })}
        </div>
      </nav>

      {/* ── Footer questions + micro ── */}
      <QuestionFooter currentDay={currentDay} prenom={prenom} />

    </div>
  )
}
