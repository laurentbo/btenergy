"use client"
import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { PROGRAM } from "@/data/programme"
import { createClient } from "@/lib/supabase/client"
import MealsBlock from "./components/MealsBlock"
import LearnTab from "./components/LearnTab"

type PTab = "accueil" | "journee" | "programme" | "suivi"

const PHASE_COLORS: Record<string, string> = {
  cure_s1: "var(--green)",
  cure_s2: "var(--accent-cyan)",
  off: "var(--accent-lime)",
  reprise: "#BF7D2C",
}

const SEMAINE_LABELS: Record<number, string> = {
  1: "Semaine 1 · Détox",
  2: "Semaine 2 · Vitalité",
  3: "Semaine 3 · Ancrage",
}

export default function ProgrammePage() {
  const [activeTab, setActiveTab] = useState<PTab>("accueil")
  const [currentDay, setCurrentDay] = useState(1)
  const [prenom, setPrenom] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Suivi state — mapped to existing journal_entries columns
  const [energie, setEnergie] = useState(5)
  const [sommeil, setSommeil] = useState(5)
  const [humeur, setHumeur] = useState(5)
  const [fringales, setFringales] = useState(5)
  const [note, setNote] = useState("")
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    async function init() {
      const res = await fetch("/api/me")
      if (res.status === 401) { window.location.href = "/login"; return }

      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("prenom, current_day")
          .eq("id", user.id)
          .maybeSingle()

        if (profile) {
          setPrenom(profile.prenom ?? null)
          setCurrentDay(profile.current_day ?? 1)
        }

        // Load today's journal entry
        const { data: entry } = await supabase
          .from("journal_entries")
          .select("energie, humeur, sommeil, note")
          .eq("user_id", user.id)
          .eq("day", profile?.current_day ?? 1)
          .maybeSingle()

        if (entry) {
          setEnergie(entry.energie ?? 5)
          setHumeur(entry.humeur ?? 5)
          setSommeil(entry.sommeil ?? 5)
          setNote(entry.note ?? "")
        }
      } else {
        const saved = localStorage.getItem("btenergy_cure_day")
        if (saved) setCurrentDay(Math.min(21, Math.max(1, parseInt(saved))))
      }
      setLoading(false)
    }
    init()
  }, []) // eslint-disable-line

  const changeDay = async (newDay: number) => {
    if (newDay < 1 || newDay > 21) return
    setCurrentDay(newDay)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from("profiles").update({ current_day: newDay }).eq("id", user.id)
    } else {
      localStorage.setItem("btenergy_cure_day", newDay.toString())
    }
  }

  const saveJournal = async () => {
    setSaveStatus("saving")
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaveStatus("error"); return }

    const payload = { energie, humeur, sommeil, note: note || null }

    const { data: existing } = await supabase
      .from("journal_entries")
      .select("id")
      .eq("user_id", user.id)
      .eq("day", currentDay)
      .maybeSingle()

    let error
    if (existing) {
      ;({ error } = await supabase.from("journal_entries").update(payload).eq("id", existing.id))
    } else {
      ;({ error } = await supabase.from("journal_entries").insert({
        user_id: user.id, day: currentDay,
        hydratation: 5,
        ...payload,
      }))
    }

    if (error) { setSaveStatus("error"); return }
    setSaveStatus("saved")
    setTimeout(() => setSaveStatus("idle"), 3000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f1117" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black"
            style={{ background: "linear-gradient(135deg, var(--green-dim), var(--blue-dim))", color: "#070d0f" }}>B</div>
          <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "var(--blue)", borderTopColor: "transparent" }} />
        </div>
      </div>
    )
  }

  const jour = PROGRAM[Math.min(currentDay - 1, PROGRAM.length - 1)]
  const phaseColor = PHASE_COLORS[jour.type] ?? "var(--green)"
  const semLabel = SEMAINE_LABELS[jour.s] ?? `Semaine ${jour.s}`
  const progress = Math.round((currentDay / 21) * 100)

  return (
    <div className="min-h-screen pb-8" style={{ background: "#0f1117" }}>

      {/* Header */}
      <header className="sticky top-0 z-50 px-5 py-3.5"
        style={{ background: "rgba(15,17,23,0.9)", backdropFilter: "blur(28px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Link href="/" className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black"
              style={{ background: "linear-gradient(135deg, var(--green-dim), var(--blue-dim))", color: "#050e1a" }}>
              B
            </Link>
            <span className="font-black text-sm gradient-text">Cure 21 jours</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="tag" style={{ borderColor: `${phaseColor}40`, color: phaseColor }}>
              S{jour.s} · J{currentDay}
            </div>
            <Link href="/"
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.75)" }}>
              ← Accueil
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6">

        {/* Day navigator */}
        <div className="flex items-center justify-between rounded-2xl px-4 py-3 mb-5"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <button
            onClick={() => changeDay(currentDay - 1)}
            disabled={currentDay === 1}
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold"
            style={{
              background: currentDay === 1 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.1)",
              color: currentDay === 1 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.8)",
              border: "1px solid rgba(255,255,255,0.08)",
              fontSize: "16px",
            }}>←</button>

          <div className="text-center">
            <div className="font-black" style={{ color: "var(--text-primary)", fontSize: "15px" }}>
              Jour {currentDay} — {jour.titre}
            </div>
            <div className="text-xs mt-0.5" style={{ color: phaseColor }}>{semLabel}</div>
          </div>

          <button
            onClick={() => changeDay(currentDay + 1)}
            disabled={currentDay === 21}
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold"
            style={{
              background: currentDay === 21 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.1)",
              color: currentDay === 21 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.8)",
              border: "1px solid rgba(255,255,255,0.08)",
              fontSize: "16px",
            }}>→</button>
        </div>

        {/* Progress bar */}
        <div className="mb-5">
          <div className="flex justify-between mb-1.5">
            <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>Progression</span>
            <span className="font-bold" style={{ color: phaseColor, fontSize: "12px" }}>{progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${phaseColor}, var(--blue))` }} />
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 mb-6 p-1.5 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {([
            { key: "accueil",    label: "Accueil" },
            { key: "journee",    label: "Journée" },
            { key: "programme",  label: "Programme" },
            { key: "suivi",      label: "Suivi" },
          ] as const).map(({ key, label }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className="flex-1 py-2.5 rounded-xl font-semibold transition-all"
              style={{
                background: activeTab === key ? "rgba(255,255,255,0.1)" : "transparent",
                color: activeTab === key ? "#ffffff" : "rgba(255,255,255,0.4)",
                boxShadow: activeTab === key ? "0 1px 0 rgba(255,255,255,0.08) inset" : "none",
                fontSize: "13px",
                borderBottom: activeTab === key ? `2px solid ${phaseColor}` : "2px solid transparent",
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* ── Accueil ── */}
        {activeTab === "accueil" && (
          <div className="fade-up space-y-4">

            {/* Hero card */}
            <div className="rounded-2xl p-6"
              style={{
                background: "rgba(4,10,22,0.72)",
                border: `1px solid ${phaseColor}30`,
                backdropFilter: "blur(28px)",
                boxShadow: `0 16px 48px rgba(0,0,0,0.4), 0 0 60px ${phaseColor}08`,
              }}>
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex-1">
                  <div className="rounded-lg px-3 py-1 inline-block text-xs font-bold tracking-widest uppercase mb-3"
                    style={{ background: `${phaseColor}14`, color: phaseColor, border: `1px solid ${phaseColor}22` }}>
                    {semLabel} · {jour.phase}
                  </div>
                  <h1 className="font-black leading-tight mb-1" style={{ color: "var(--text-primary)", fontSize: "24px" }}>
                    {prenom ? `${prenom.charAt(0).toUpperCase()}${prenom.slice(1).toLowerCase()}` : "Bonjour"} 👋
                  </h1>
                  <p className="font-semibold" style={{ color: phaseColor, fontSize: "15px" }}>{jour.titre}</p>
                </div>
                <div className="flex-shrink-0 flex flex-col items-center justify-center rounded-2xl"
                  style={{ background: `${phaseColor}0e`, border: `1px solid ${phaseColor}20`, width: "68px", height: "68px" }}>
                  <div className="font-black gradient-text leading-none" style={{ fontSize: "32px" }}>{currentDay}</div>
                  <div className="font-semibold" style={{ color: "var(--text-muted)", fontSize: "11px" }}>/ 21</div>
                </div>
              </div>

              {/* 21-day grid */}
              <div className="grid grid-cols-7 gap-1">
                {PROGRAM.map((d) => {
                  const isDone = d.jour < currentDay
                  const isToday = d.jour === currentDay
                  const dc = PHASE_COLORS[d.type] ?? phaseColor
                  return (
                    <button
                      key={d.jour}
                      onClick={() => changeDay(d.jour)}
                      className="aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all"
                      style={{
                        background: isToday ? dc : isDone ? `${dc}20` : "rgba(255,255,255,0.05)",
                        color: isToday ? "#0f1117" : isDone ? dc : "rgba(255,255,255,0.3)",
                        border: isToday ? `1px solid ${dc}` : isDone ? `1px solid ${dc}30` : "1px solid rgba(255,255,255,0.07)",
                        fontSize: "11px",
                      }}>
                      {d.jour}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Objectif */}
            <div className="card rounded-2xl p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${phaseColor}15`, border: `1px solid ${phaseColor}25`, fontSize: "16px" }}>🎯</div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: phaseColor }}>Objectif du jour</p>
                <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: "1.75" }}>{jour.objectif}</p>
              </div>
            </div>

            {/* Conseil */}
            <div className="card rounded-2xl p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(38,197,206,0.1)", border: "1px solid rgba(38,197,206,0.18)", fontSize: "16px" }}>💬</div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--accent-cyan)" }}>Conseil du coach</p>
                <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: "1.75" }}>{jour.conseil}</p>
              </div>
            </div>

            {/* Ressenti */}
            <div className="card rounded-2xl p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(129,140,248,0.1)", border: "1px solid rgba(129,140,248,0.18)", fontSize: "16px" }}>🌊</div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#818cf8" }}>Ressenti attendu</p>
                <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: "1.75" }}>{jour.ressenti}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Journée ── */}
        {activeTab === "journee" && (
          <div className="fade-up">
            <div className="rounded-2xl p-3 mb-4 flex items-center gap-2"
              style={{ background: `${phaseColor}10`, border: `1px solid ${phaseColor}22` }}>
              <span style={{ fontSize: "14px" }}>📋</span>
              <p className="text-xs font-semibold" style={{ color: phaseColor }}>
                {jour.type === "cure_s1" ? "Cure semaine 1 · Détox & Purification" :
                 jour.type === "cure_s2" ? "Cure semaine 2 · Énergie & Vitalité" :
                 jour.type === "off" ? "Journée libre — reste dans l'esprit de la cure" :
                 "Phase de reprise — réintroduction progressive"}
              </p>
            </div>
            <MealsBlock jour={jour} />
          </div>
        )}

        {/* ── Programme ── */}
        {activeTab === "programme" && (
          <div className="fade-up">
            <LearnTab />
          </div>
        )}

        {/* ── Suivi ── */}
        {activeTab === "suivi" && (
          <div className="fade-up">
            <div className="card rounded-2xl p-5">
              <h3 className="font-semibold mb-5 text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
                Suivi du jour — Jour {currentDay}
              </h3>

              <div className="space-y-5 mb-5">
                {([
                  { key: "energie", label: "Énergie", icon: "⚡", color: "var(--green)", val: energie, set: setEnergie },
                  { key: "sommeil", label: "Sommeil", icon: "🌙", color: "#818cf8", val: sommeil, set: setSommeil },
                  { key: "humeur",  label: "Humeur",  icon: "😊", color: "var(--accent-cyan)", val: humeur, set: setHumeur },
                  { key: "fringales", label: "Fringales (faibles = bien)", icon: "🍬", color: "#BF7D2C", val: fringales, set: setFringales },
                ] as const).map(({ key, label, icon, color, val, set }) => (
                  <div key={key}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm flex gap-2 items-center font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>
                        <span>{icon}</span> {label}
                      </span>
                      <span className="font-bold text-sm" style={{ color }}>{val}/10</span>
                    </div>
                    <input
                      type="range" min={1} max={10} step={1}
                      value={val}
                      onChange={e => { set(Number(e.target.value)); if (saveStatus === "saved") setSaveStatus("idle") }}
                      className="slider-track"
                      style={{ accentColor: color }}
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Faible</span>
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Excellent</span>
                    </div>
                  </div>
                ))}
              </div>

              <textarea
                rows={3}
                placeholder="Note libre : comment tu te sens aujourd'hui ?"
                value={note}
                onChange={e => { setNote(e.target.value); if (saveStatus === "saved") setSaveStatus("idle") }}
                className="w-full rounded-xl p-3 text-sm resize-none outline-none"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#ffffff",
                  marginBottom: "16px",
                }}
              />

              <button
                onClick={saveJournal}
                disabled={saveStatus === "saving"}
                className="btn-primary w-full text-sm"
                style={{ opacity: saveStatus === "saving" ? 0.7 : 1 }}>
                {saveStatus === "saving" ? "Enregistrement..." : saveStatus === "saved" ? "✓ Suivi enregistré" : "Enregistrer le suivi"}
              </button>
              {saveStatus === "error" && (
                <p className="text-xs mt-2 text-center" style={{ color: "#ff8080" }}>
                  ❌ Erreur d'enregistrement — réessayez
                </p>
              )}
            </div>

            {/* Phase info card */}
            <div className="card rounded-2xl p-4 mt-4">
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>Phase actuelle</p>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ background: phaseColor }} />
                <div>
                  <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{jour.phase}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {jour.type === "cure_s1" ? "Jus + dîner léger · détox active" :
                     jour.type === "cure_s2" ? "Jus + légumineuses · vitalité" :
                     jour.type === "off" ? "Alimentation alcaline libre" :
                     "Réintroduction progressive"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
