"use client"
import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { PROGRAM, WEEK_THEMES, calcIMC, imcLabel, calcCurrentDay, calcRawDay, type UserProfile, type Meal } from "@/data/program"
import MealCard from "@/components/MealCard"
import RitualCard from "@/components/RitualCard"
import JournalForm from "@/components/JournalForm"
import Timeline21 from "@/components/Timeline21"
import ProfilForm from "@/components/ProfilForm"
import PrincipesSection from "@/components/PrincipesSection"
import WeightTracker from "@/components/WeightTracker"
import ShoppingList from "@/components/ShoppingList"
import VitalityScore from "@/components/VitalityScore"
import EnergyCheckin from "@/components/EnergyCheckin"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/auth-context"
import WelcomeScreen from "@/components/WelcomeScreen"
import PreparationPhase from "@/components/PreparationPhase"

// ─── Labels des moments ────────────────────────────────────────────────────────
const MEAL_META: Record<string, { icon: string; label: string; horaire: string }> = {
  "matin":        { icon: "🌅", label: "Petit-déjeuner", horaire: "7h – 9h" },
  "midi":         { icon: "🌞", label: "Déjeuner",       horaire: "12h – 14h" },
  "après-midi":   { icon: "🌤",  label: "Collation",      horaire: "15h – 17h" },
  "soir":         { icon: "🌙", label: "Dîner",           horaire: "18h – 20h" },
}

type Override = {
  coach_note: string | null
  tip_override: string | null
  intention_override: string | null
  meal_overrides: Record<string, string[]> | null
  ritual_matin_override: string | null
  ritual_soir_override: string | null
}

type Tab = "programme" | "journal" | "progression" | "courses" | "principes" | "profil"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("programme")
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [showProfileSetup, setShowProfileSetup] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  // NOUVEAU — onboarding J1 (affiché une seule fois le premier jour)
  const [showJ1Onboarding, setShowJ1Onboarding] = useState(false)
  const [override, setOverride] = useState<Override | null>(null)
  const [checking, setChecking] = useState(true)
  const [currentDay, setCurrentDay] = useState(1)
  const [viewDay, setViewDay] = useState(1)
  const [mealLogs, setMealLogs] = useState<Record<string, string[]>>({})
  // NOUVEAU — état accordéon : "matin" ouvert par défaut
  const [openMoments, setOpenMoments] = useState<Set<string>>(new Set(["matin"]))
  // NOUVEAU — tracker d'hydratation partagé hero ↔ journal
  const [hydrationLiters, setHydrationLiters] = useState<number>(0)
  const [vitalityScore, setVitalityScore] = useState<number>(0)
  const [vitalityTrend, setVitalityTrend] = useState<number>(0)
  const [programStartDate, setProgramStartDate] = useState<string | null>(null)

  const supabase = useMemo(() => createClient(), [])
  const { signOut } = useAuth()

  // Déconnexion — accessible uniquement depuis l'onglet Profil désormais
  const handleSignOut = async () => {
    await signOut()
    window.location.href = "/login"
  }

  const prenom = profile?.prenom
    ? profile.prenom.charAt(0).toUpperCase() + profile.prenom.slice(1).toLowerCase()
    : null

  // Toggle accordéon
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
      if (res.status === 401) { window.location.href = "/login"; return }

      const { role } = await res.json()
      if (role === "coach" || role === "admin") {
        window.location.href = "/coach"; return
      }

      const { data: { user } } = await supabase.auth.getUser()
      let computedDay = 1
      if (user) {
        const { data: dbProfile } = await supabase
          .from("profiles")
          .select("prenom, genre, age, taille, poids, program_start, welcome_seen_at")
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
              genre: (dbProfile.genre as "homme" | "femme") ?? "homme",
              age: dbProfile.age ?? 0,
              taille: dbProfile.taille ?? 0,
              poids: dbProfile.poids ?? 0,
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

        // Vitality score depuis les deux dernières entrées journal
        const { data: recentEntries } = await supabase
          .from("journal_entries")
          .select("energie,humeur,hydratation,sommeil")
          .eq("user_id", user.id)
          .order("day", { ascending: false })
          .limit(2)
        if (recentEntries?.length) {
          const latest = recentEntries[0]
          const avg = (latest.energie + latest.humeur + latest.hydratation + latest.sommeil) / 4
          setVitalityScore(Math.round(avg * 10))
          if (recentEntries.length >= 2) {
            const prev = recentEntries[1]
            const prevAvg = (prev.energie + prev.humeur + prev.hydratation + prev.sommeil) / 4
            setVitalityTrend(avg > prevAvg ? 1 : avg < prevAvg ? -1 : 0)
          }
        }
      } else {
        const saved = localStorage.getItem("btenergy_profile")
        const localProfile: UserProfile | null = saved ? JSON.parse(saved) : null
        if (localProfile) {
          setProfile(localProfile)
          computedDay = calcCurrentDay(localProfile.start_date)
          setCurrentDay(computedDay)
        } else {
          setShowProfileSetup(true)
        }
      }

      // NOUVEAU — Onboarding J1 : affiché seulement si c'est le jour 1 et jamais vu
      if (computedDay === 1 && !localStorage.getItem("btenergy_onboarding_done")) {
        setShowJ1Onboarding(true)
      }

      // Email du jour — dédoublonnage client-side avant même l'appel API
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

      // NOUVEAU — Restaure l'hydratation du jour depuis localStorage
      const savedHydration = localStorage.getItem(`btenergy_hydration_day_${computedDay}`)
      if (savedHydration) setHydrationLiters(parseFloat(savedHydration))

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
        genre: p.genre,
        age: p.age,
        taille: p.taille,
        poids: p.poids,
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

  // NOUVEAU — Sauvegarde hydratation dans localStorage + state
  const handleHydrationChange = (liters: number) => {
    setHydrationLiters(liters)
    localStorage.setItem(`btenergy_hydration_day_${currentDay}`, liters.toString())
  }

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

  const imc = profile ? calcIMC(profile.poids, profile.taille) : null
  const imcInfo = imc ? imcLabel(imc) : null

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

  // ─── WELCOME SCREEN PREMIÈRE CONNEXION ──────────────────────────────────────
  if (showWelcome) {
    return <WelcomeScreen prenom={profile?.prenom ?? null} onDone={() => setShowWelcome(false)} />
  }

  // ─── ONBOARDING PROFIL ────────────────────────────────────────────────────────
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

  // ─── ONBOARDING JOUR 1 ────────────────────────────────────────────────────────
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
              Votre programme de 21 jours commence aujourd'hui. Voici les 3 règles d'or pour bien démarrer :
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

  // ─── APP PRINCIPALE ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #0b1e38 0%, #07111e 55%, #050e1a 100%)" }}>

      {/* Header — MODIFIÉ : bouton Déco retiré (disponible dans l'onglet Profil) */}
      <header className="sticky top-0 z-50 px-5 py-3.5"
        style={{ background: "rgba(5,14,26,0.82)", backdropFilter: "blur(28px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black"
              style={{ background: "linear-gradient(135deg, var(--green-dim), var(--blue-dim))", color: "#050e1a" }}>
              B
            </div>
            <span className="font-black text-sm gradient-text">Backtoenergy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="tag" style={{ borderColor: `${weekInfo.color}40`, color: weekInfo.color }}>
              S{day.week} · J{currentDay}
            </div>
            {/* Bouton profil — mène à l'onglet Profil où se trouve la déconnexion */}
            <button
              onClick={() => setActiveTab("profil")}
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.75)" }}>
              Moi ↗
            </button>
            {/* Bouton Déco RETIRÉ du header — se connecte depuis Profil uniquement */}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-28 pt-6">

        {/* Hero du jour */}
        <div className="fade-up mb-5"
          style={{
            background: "rgba(4,10,22,0.72)",
            border: `1px solid ${weekInfo.color}30`,
            borderRadius: "26px",
            padding: "24px",
            backdropFilter: "blur(28px)",
            boxShadow: `0 1px 0 rgba(255,255,255,0.06) inset, 0 16px 48px rgba(0,0,0,0.4), 0 0 60px ${weekInfo.color}08`,
          }}>

          <div className="flex items-center gap-2 mb-4">
            <div className="rounded-lg px-3 py-1 text-xs font-bold tracking-widest uppercase"
              style={{ background: `${weekInfo.color}14`, color: weekInfo.color, border: `1px solid ${weekInfo.color}22`, letterSpacing: "0.1em" }}>
              Semaine {day.week} · {weekInfo.title.split(" & ")[0]}
            </div>
          </div>
          <p className="font-bold mb-3" style={{ color: "var(--text-primary)", fontSize: "15px" }}>
            {day.theme}
          </p>

          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex-1">
              <h1 className="font-black mb-2 leading-tight" style={{ color: "var(--text-primary)", fontSize: "26px" }}>
                Bonjour, {prenom ?? "vous"} 👋
              </h1>
              <p className="italic leading-relaxed" style={{ color: weekInfo.color, opacity: 0.85, fontSize: "14px" }}>
                &ldquo;{day.coachWord}&rdquo;
              </p>
            </div>
            <div className="flex-shrink-0 flex flex-col items-center justify-center rounded-2xl"
              style={{ background: `${weekInfo.color}0e`, border: `1px solid ${weekInfo.color}20`, width: "68px", height: "68px" }}>
              <div className="font-black gradient-text leading-none" style={{ fontSize: "32px" }}>{currentDay}</div>
              <div className="font-semibold" style={{ color: "var(--text-muted)", fontSize: "11px" }}>/ 21</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>Progression du programme</span>
              <span className="font-bold" style={{ color: weekInfo.color, fontSize: "12px" }}>{Math.round((currentDay / 21) * 100)}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(currentDay / 21) * 100}%`, background: `linear-gradient(90deg, ${weekInfo.color}, var(--blue))` }} />
            </div>
          </div>

          {/* MODIFIÉ — Hydratation avec tracker cliquable synchronisé avec le Journal */}
          <div className="rounded-xl px-4 py-3"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span style={{ fontSize: "15px" }}>💧</span>
                <span style={{ color: "rgba(255,255,255,0.62)", fontSize: "13px" }}>{day.hydration}</span>
              </div>
              <span className="font-bold text-sm" style={{ color: "var(--blue)" }}>
                {hydrationLiters.toFixed(1)}L
              </span>
            </div>
            {/* Boutons rapides +0.25L */}
            <div className="flex gap-2">
              {[0.25, 0.5, 1].map(v => (
                <button
                  key={v}
                  onClick={() => handleHydrationChange(Math.min(3, hydrationLiters + v))}
                  className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: "rgba(76,201,240,0.1)",
                    border: "1px solid rgba(76,201,240,0.2)",
                    color: "var(--blue)",
                  }}>
                  +{v}L
                </button>
              ))}
              <button
                onClick={() => handleHydrationChange(0)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "var(--text-muted)",
                }}>
                ↺
              </button>
            </div>
          </div>
        </div>

        {/* Rituel du matin */}
        <div className="card fade-up mb-3 px-5 py-4 flex items-start gap-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(159,215,109,0.1)", border: "1px solid rgba(159,215,109,0.22)", fontSize: "16px" }}>🌅</div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#9fd76d" }}>Rituel du matin</p>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.75", fontSize: "14px" }}>{day.morningRitual}</p>
          </div>
        </div>

        {/* Tip du jour */}
        <div className="card fade-up mb-5 px-5 py-4 flex items-start gap-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(76,201,240,0.1)", border: "1px solid rgba(76,201,240,0.18)", fontSize: "16px" }}>✨</div>
          <p style={{ color: "var(--text-secondary)", lineHeight: "1.75", fontSize: "14px" }}>{day.tip}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1.5 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {([
            { key: "programme",   label: "Repas" },
            { key: "journal",     label: "Journal" },
            { key: "courses",     label: "Courses" },
            { key: "progression", label: "Progrès" },
            { key: "principes",   label: "💡" },
          ] as const).map(({ key, label }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className="flex-1 py-2.5 rounded-xl font-semibold transition-all"
              style={{
                background: activeTab === key ? "rgba(255,255,255,0.1)" : "transparent",
                color: activeTab === key ? "#ffffff" : "rgba(255,255,255,0.4)",
                boxShadow: activeTab === key ? "0 1px 0 rgba(255,255,255,0.08) inset" : "none",
                fontSize: "13px",
                letterSpacing: "0.01em",
                borderBottom: activeTab === key ? `2px solid var(--blue)` : "2px solid transparent",
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* ── Programme ── */}
        {activeTab === "programme" && (
          <div className="space-y-4">

            {/* Phase de préparation — visible quand le programme démarre dans 1-3 jours */}
            {programStartDate && (() => {
              const target = new Date(programStartDate)
              const today = new Date()
              target.setHours(0, 0, 0, 0)
              today.setHours(0, 0, 0, 0)
              const daysLeft = Math.floor((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
              return daysLeft >= 1 && daysLeft <= 3
                ? <PreparationPhase programStartDate={programStartDate} />
                : null
            })()}

            {/* Navigation jours */}
            <div className="flex items-center justify-between rounded-2xl px-4 py-3"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <button
                onClick={() => setViewDay(d => Math.max(1, d - 1))}
                disabled={viewDay === 1}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all font-bold"
                style={{
                  background: viewDay === 1 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.1)",
                  color: viewDay === 1 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.8)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  fontSize: "16px",
                }}>←</button>

              <div className="text-center">
                <div className="font-black" style={{ color: "var(--text-primary)", fontSize: "15px" }}>
                  Jour {viewDay}
                  {viewDay === currentDay && (
                    <span className="ml-2 rounded-full px-2 py-0.5 text-xs font-bold"
                      style={{ background: "rgba(125,232,255,0.15)", color: "var(--blue)", fontSize: "10px" }}>
                      Aujourd'hui
                    </span>
                  )}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {viewDay < currentDay ? "🕐 Passé" : viewDay > currentDay ? "📅 À venir" : viewWeekInfo.title}
                </div>
              </div>

              <button
                onClick={() => setViewDay(d => Math.min(21, d + 1))}
                disabled={viewDay === 21}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all font-bold"
                style={{
                  background: viewDay === 21 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.1)",
                  color: viewDay === 21 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.8)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  fontSize: "16px",
                }}>→</button>
            </div>

            {/* Note coach */}
            {override?.coach_note && (
              <div className="rounded-xl p-4 fade-up flex gap-3"
                style={{ background: "rgba(76,201,240,0.07)", border: "1px solid rgba(76,201,240,0.25)" }}>
                <span className="text-lg flex-shrink-0">💬</span>
                <div>
                  <p className="text-xs font-bold mb-1" style={{ color: "var(--blue)" }}>Message de votre coach</p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}>
                    {override.coach_note}
                  </p>
                </div>
              </div>
            )}

            {/* Score de vitalité + Check-in énergie */}
            <VitalityScore score={vitalityScore} trend={vitalityTrend} />
            <EnergyCheckin currentDay={viewDay} onCheckin={v => setVitalityTrend(v >= 4 ? 1 : v <= 2 ? -1 : 0)} />

            {/* MODIFIÉ — Repas en accordéon */}
            <div className="space-y-2">
              {viewDayData.meals.map((meal, i) => {
                const overrideMeals = override?.meal_overrides?.[meal.moment]
                const baseMeal = overrideMeals?.length ? { ...meal, items: overrideMeals } : meal
                const meta = MEAL_META[meal.moment] ?? { icon: "🍴", label: meal.moment, horaire: "" }
                const isOpen = openMoments.has(meal.moment)

                return (
                  <div key={i} className="rounded-2xl overflow-hidden transition-all"
                    style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(4,10,22,0.6)" }}>

                    {/* En-tête accordéon */}
                    <button
                      onClick={() => toggleMoment(meal.moment)}
                      className="w-full flex items-center justify-between px-4 py-3.5 transition-all"
                      style={{ background: isOpen ? "rgba(255,255,255,0.05)" : "transparent" }}>
                      <div className="flex items-center gap-3">
                        <span style={{ fontSize: "18px" }}>{meta.icon}</span>
                        <div className="text-left">
                          <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{meta.label}</p>
                          <p className="text-xs" style={{ color: "var(--text-muted)" }}>{meta.horaire}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full px-2 py-0.5 text-xs font-semibold"
                          style={{ background: "rgba(255,255,255,0.07)", color: "var(--text-muted)" }}>
                          {baseMeal.items.length} aliments
                        </span>
                        <span style={{
                          color: "var(--text-muted)",
                          fontSize: "12px",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s",
                          display: "inline-block",
                        }}>▾</span>
                      </div>
                    </button>

                    {/* Contenu accordéon */}
                    {isOpen && (
                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        <MealCard
                          meal={baseMeal}
                          isCustomized={!!overrideMeals?.length}
                          mealLog={mealLogs[meal.moment]}
                          onSaveLog={items => saveMealLog(meal.moment, items)}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <RitualCard
              matin={override?.ritual_matin_override ?? viewDayData.ritual.matin}
              soir={override?.ritual_soir_override ?? viewDayData.ritual.soir}
            />
          </div>
        )}

        {/* ── Journal ── */}
        {activeTab === "journal" && (
          <JournalForm
            currentDay={currentDay}
            hydrationLiters={hydrationLiters}
            onHydrationChange={handleHydrationChange}
          />
        )}

        {/* ── Progression ── */}
        {activeTab === "progression" && (
          <div className="space-y-4">
            <WeightTracker initialWeight={profile?.poids} />
            <Timeline21 totalDays={21} currentDay={currentDay} completedDays={completedDays} />

            <div className="space-y-3">
              {([1, 2, 3] as const).map(w => {
                const wInfo = WEEK_THEMES[w]
                const wDays = PROGRAM.filter(d => d.week === w)
                const done  = wDays.filter(d => completedDays.includes(d.day)).length
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

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Jours actifs", value: completedDays.length.toString(), icon: "🔥" },
                { label: "Semaine en cours", value: `S${day.week}`, icon: "📅" },
                { label: "Série actuelle", value: `${completedDays.length}j`, icon: "🎯" },
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

        {/* ── Courses ── */}
        {activeTab === "courses" && (
          <div className="space-y-4">
            <ShoppingList currentDay={currentDay} horizon={7} />
          </div>
        )}

        {/* ── Principes ── */}
        {activeTab === "principes" && <PrincipesSection />}

        {/* ── Profil ── */}
        {activeTab === "profil" && (
          <div className="space-y-4">
            <div className="card p-5">
              <h2 className="font-bold text-base mb-4" style={{ color: "var(--text-primary)" }}>Mon Profil</h2>
              <ProfilForm onSave={handleSaveProfile} initial={profile} />
            </div>
            {/* Déconnexion — ici uniquement, plus dans le header */}
            <div className="card p-5">
              <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                Se déconnecter ferme votre session sur cet appareil. Vos données sont sauvegardées.
              </p>
              <button
                onClick={handleSignOut}
                className="w-full py-2 rounded-lg font-semibold text-sm"
                style={{ background: "rgba(220,53,69,0.15)", color: "#ff6b7a", border: "1px solid rgba(220,53,69,0.3)" }}>
                Se déconnecter
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50"
        style={{ background: "rgba(5,12,22,0.94)", backdropFilter: "blur(28px)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-2xl mx-auto flex items-center justify-around px-2 py-1">
          {([
            { icon: "🍽️", label: "Repas",     tab: "programme" },
            { icon: "📓", label: "Journal",   tab: "journal" },
            { icon: "🛒", label: "Courses",   tab: "courses" },
            { icon: "📈", label: "Progrès",   tab: "progression" },
            { icon: "💡", label: "Principes", tab: "principes" },
          ] as const).map(({ icon, label, tab }) => {
            const isActive = activeTab === tab
            return (
              <button key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex flex-col items-center gap-0.5 py-2 flex-1 transition-all"
                style={{ color: isActive ? "var(--blue)" : "var(--text-muted)" }}>
                <span className="text-xl leading-none"
                  style={{ filter: isActive ? "drop-shadow(0 0 6px rgba(76,201,240,0.6))" : "none" }}>
                  {icon}
                </span>
                <span className="text-xs font-semibold" style={{ fontSize: "10px" }}>{label}</span>
                {isActive && (
                  <div className="w-4 h-0.5 rounded-full mt-0.5"
                    style={{ background: "var(--blue)" }} />
                )}
              </button>
            )
          })}
          <Link href="/programme"
            className="flex flex-col items-center gap-0.5 py-2 flex-1 transition-all"
            style={{ color: "var(--text-muted)" }}>
            <span className="text-xl leading-none">🌿</span>
            <span className="text-xs font-semibold" style={{ fontSize: "10px" }}>Cure</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
