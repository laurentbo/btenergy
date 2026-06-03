"use client"
import { useState, useEffect, useMemo } from "react"
import { use } from "react"
import { VERISSIMO_PROGRAM, type VerissimoJour } from "@/data/verissimo"
import { createClient } from "@/lib/supabase/client"
import MoodPicker from "@/components/MoodPicker"
import Link from "next/link"

// Jours sans menu imposé
const FREE_DAYS = new Set([6, 7, 13, 14, 20])

const PHASE_META: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: "S1 · Détox",   color: "#C8964C", bg: "rgba(200,150,76,0.10)" },
  2: { label: "S2 · Énergie", color: "#3E8E4F", bg: "rgba(62,142,79,0.10)"  },
  3: { label: "S3 · Ancrage", color: "#235236", bg: "rgba(35,82,54,0.10)"   },
}

// Anneau de progression SVG
function ProgressRing({ jour }: { jour: number }) {
  const r = 18
  const circ = 2 * Math.PI * r
  const progress = (jour / 21) * circ
  return (
    <svg width="44" height="44" viewBox="0 0 44 44">
      <circle cx="22" cy="22" r={r} fill="none" stroke="var(--line)" strokeWidth="2.5" />
      <circle
        cx="22" cy="22" r={r} fill="none"
        stroke="var(--brand)" strokeWidth="2.5"
        strokeDasharray={`${progress} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 22 22)"
        style={{ transition: "stroke-dasharray 0.4s ease" }}
      />
      <text x="22" y="27" textAnchor="middle"
        style={{ fontSize: "11px", fontWeight: 700, fill: "var(--forest)", fontFamily: "var(--sans)" }}>
        {jour}
      </text>
    </svg>
  )
}

// Accordéon repas
type MealRowProps = { icon: string; label: string; content: string; color: string }

function MealRow({ icon, label, content, color }: MealRowProps) {
  const [open, setOpen] = useState(false)
  const [fait, setFait] = useState(false)

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ border: `1px solid var(--line)`, background: "var(--bg-surface)" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
        style={{ borderLeft: `3px solid ${color}` }}
      >
        <span style={{ fontSize: "18px", flexShrink: 0 }}>{icon}</span>
        <span className="flex-1 text-sm font-semibold" style={{ color: "var(--text)" }}>{label}</span>
        {fait && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-lg"
            style={{ background: "rgba(62,142,79,0.12)", color: "#3E8E4F" }}>
            fait
          </span>
        )}
        <span className="text-xs" style={{ color: "var(--text-mute)", transform: open ? "rotate(180deg)" : "none", display: "inline-block", transition: "transform 0.2s" }}>▾</span>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 space-y-3" style={{ borderLeft: `3px solid ${color}` }}>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>{content}</p>
          <button
            onClick={() => setFait((f) => !f)}
            className="flex items-center gap-2 text-xs font-semibold rounded-xl px-3 py-2 transition-all"
            style={{
              background: fait ? "rgba(62,142,79,0.10)" : "var(--bg-lift)",
              border: fait ? "1px solid rgba(62,142,79,0.3)" : "1px solid var(--line)",
              color: fait ? "#3E8E4F" : "var(--text-mute)",
            }}
          >
            <span style={{ fontSize: "14px" }}>{fait ? "✓" : "○"}</span>
            {fait ? "J'ai fait ce repas" : "Marquer comme fait"}
          </button>
        </div>
      )}
    </div>
  )
}

export default function ProgrammeJour({ params }: { params: Promise<{ jour: string }> }) {
  const { jour: jourParam } = use(params)
  const jourActuel = Math.min(21, Math.max(1, parseInt(jourParam, 10) || 1))

  const [activite, setActivite] = useState("")
  const [rituelFait, setRituelFait] = useState(false)
  const [moodScore, setMoodScore] = useState<number | null>(null)
  const [saved, setSaved] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  const supabase = useMemo(() => createClient(), [])
  const jour = VERISSIMO_PROGRAM[jourActuel - 1] as VerissimoJour
  const phase = PHASE_META[jour.s]
  const isFreeDay = FREE_DAYS.has(jourActuel)
  const isCelebration = jourActuel === 21

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { window.location.href = "/"; return }
      setUserId(session.user.id)

      const { data } = await supabase
        .from("journal")
        .select("activite, rituel_fait, mood_score")
        .eq("user_id", session.user.id)
        .eq("jour", jourActuel)
        .maybeSingle()

      if (data) {
        setActivite(data.activite ?? "")
        setRituelFait(data.rituel_fait ?? false)
        setMoodScore(data.mood_score ?? null)
      }
    }
    load()
  }, [jourActuel]) // eslint-disable-line

  const upsertJournal = async (patch: Record<string, unknown>) => {
    if (!userId) return
    await supabase.from("journal").upsert(
      { user_id: userId, jour: jourActuel, ...patch, updated_at: new Date().toISOString() },
      { onConflict: "user_id,jour" }
    )
  }

  const sauvegarderRituel = async () => {
    await upsertJournal({ activite, rituel_fait: rituelFait })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const saveMood = async (score: number) => {
    await upsertJournal({ mood_score: score })
  }

  // ── Écran J21 célébration ────────────────────────────────────────────────
  if (isCelebration) {
    return (
      <div className="min-h-screen" style={{ background: "var(--bg)" }}>
        <header className="sticky top-0 z-50 px-5 py-3.5"
          style={{ background: "var(--bg)", borderBottom: "1px solid var(--line)", backdropFilter: "blur(20px)" }}>
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <Link href="/dashboard" className="text-sm font-semibold" style={{ color: "var(--text-mute)", textDecoration: "none" }}>← Retour</Link>
            <span className="font-bold text-sm" style={{ color: "var(--forest)", fontFamily: "var(--heading)" }}>Jour 21</span>
            <ProgressRing jour={21} />
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 pt-10 pb-16 space-y-6 text-center">
          <div className="text-5xl">🌿</div>
          <h1 style={{ fontFamily: "var(--heading)", fontSize: "26px", color: "var(--forest)", fontWeight: 800, lineHeight: 1.2 }}>
            21 jours accomplis.
          </h1>
          <p className="text-base leading-relaxed" style={{ color: "var(--text-dim)" }}>
            Tu as tenu ce pari sur toi-même. Ton corps a changé — de l'intérieur. Ce n'est pas la fin d'un régime, c'est le début d'une nouvelle façon de te nourrir.
          </p>

          <div className="rounded-2xl p-5 text-left space-y-3"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--line)" }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-mute)" }}>Dîner de clôture</p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>{jour.diner}</p>
            {jour.umami && (
              <p className="text-xs italic" style={{ color: "var(--warm)" }}>✨ {jour.umami}</p>
            )}
          </div>

          <div className="rounded-2xl p-4"
            style={{ background: "var(--brand-soft)", border: "1px solid rgba(62,142,79,0.2)" }}>
            <p className="text-sm leading-relaxed" style={{ color: "var(--forest)" }}>
              {jour.conseil}
            </p>
          </div>

          {/* Mood final */}
          <div className="rounded-2xl p-5" style={{ background: "var(--bg-surface)", border: "1px solid var(--line)" }}>
            <MoodPicker initialScore={moodScore} onSelect={saveMood} />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>

      {/* Header */}
      <header className="sticky top-0 z-50 px-5 py-3.5"
        style={{ background: "var(--bg)", borderBottom: "1px solid var(--line)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-sm font-semibold"
            style={{ color: "var(--text-mute)", textDecoration: "none" }}>
            ← Retour
          </Link>
          <span className="font-bold text-sm" style={{ color: "var(--forest)", fontFamily: "var(--heading)" }}>
            Jour {jourActuel} / 21
          </span>
          <ProgressRing jour={jourActuel} />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-5 pb-20 space-y-4">

        {/* En-tête du jour */}
        <div className="rounded-2xl p-5 space-y-3"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--line)" }}>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg"
              style={{ background: phase.bg, color: phase.color }}>
              {phase.label}
            </span>
            {isFreeDay && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                style={{ background: "var(--bg-lift)", color: "var(--text-mute)" }}>
                Jour libre
              </span>
            )}
          </div>
          <h1 style={{ fontFamily: "var(--heading)", fontSize: "22px", fontWeight: 800, color: "var(--forest)", lineHeight: 1.2 }}>
            {jour.titre}
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
            {jour.conseil}
          </p>
        </div>

        {/* Ce que tu peux ressentir */}
        {jour.ressenti && (
          <div className="rounded-2xl px-4 py-3.5 flex items-start gap-3"
            style={{ background: "var(--warm-soft)", border: "1px solid rgba(200,150,76,0.20)" }}>
            <span style={{ fontSize: "16px", flexShrink: 0, marginTop: "1px" }}>🌡</span>
            <p className="text-sm leading-relaxed italic" style={{ color: "var(--warm)" }}>
              {jour.ressenti}
            </p>
          </div>
        )}

        {/* Jours libres : pas de menu imposé */}
        {isFreeDay ? (
          <div className="rounded-2xl p-5 text-center space-y-2"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--line)" }}>
            <p style={{ fontSize: "28px" }}>🌿</p>
            <p className="text-sm font-semibold" style={{ color: "var(--forest)" }}>
              Aujourd'hui, pas de menu imposé.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-mute)" }}>
              Écoute ton corps. Mange léger, mange ce qui te fait du bien. Tu connais les principes — fais-toi confiance.
            </p>
          </div>
        ) : (
          <>
            {/* 3 repas en accordéon */}
            <div className="space-y-2">
              <MealRow icon="🌅" label="Petit-déjeuner" content={jour.petit_dej} color="#C8964C" />
              <MealRow icon="☀️" label="Déjeuner" content={jour.dejeuner} color="var(--brand)" />
              <MealRow icon="🌙" label="Dîner" content={jour.diner} color="var(--forest)" />
            </div>

            {/* Encas optionnel */}
            <div className="rounded-xl px-4 py-3 flex items-start gap-2.5"
              style={{ background: "var(--bg-lift)", border: "1px solid var(--line-soft)" }}>
              <span style={{ fontSize: "13px", marginTop: "1px" }}>🌿</span>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-mute)" }}>
                <span className="font-semibold" style={{ color: "var(--text-dim)" }}>Si petite faim · </span>
                {jour.snack_note ?? "un fruit de saison (pomme, poire, kiwi…) ou quelques oléagineux"}
              </p>
            </div>

            {/* Astuce umami */}
            {jour.umami && (
              <div className="rounded-2xl p-4 flex items-start gap-3"
                style={{ background: "var(--warm-soft)", border: "1px solid rgba(200,150,76,0.22)", borderLeft: "3px solid var(--warm)" }}>
                <span style={{ fontSize: "16px", flexShrink: 0 }}>✨</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--warm)" }}>Astuce umami</p>
                  <p className="text-sm italic leading-relaxed" style={{ color: "var(--warm)" }}>{jour.umami}</p>
                </div>
              </div>
            )}

            {/* Commentaire / alternatives */}
            {jour.commentaire && (
              <div className="rounded-xl px-4 py-3 flex items-start gap-2.5"
                style={{ background: "var(--bg-lift)", border: "1px solid var(--line-soft)" }}>
                <span style={{ fontSize: "13px", marginTop: "1px" }}>💬</span>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-mute)" }}>{jour.commentaire}</p>
              </div>
            )}
          </>
        )}

        {/* Rituel du jour */}
        <div className="rounded-2xl p-5 space-y-4"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--line)" }}>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: "var(--text-mute)" }}>Rituel du jour</p>
            <p className="text-sm font-semibold" style={{ color: "var(--forest)" }}>30 minutes d'activité physique</p>
          </div>

          <input
            type="text"
            placeholder="Ex : marche, vélo, renforcement, yoga…"
            value={activite}
            onChange={(e) => setActivite(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none"
            style={{
              background: "var(--bg-lift)",
              border: "1px solid var(--line)",
              color: "var(--text)",
            }}
          />

          <label className="flex items-center gap-3 cursor-pointer rounded-xl px-4 py-3 transition-all"
            style={{
              background: rituelFait ? "rgba(62,142,79,0.08)" : "var(--bg-lift)",
              border: rituelFait ? "1.5px solid rgba(62,142,79,0.35)" : "1.5px solid var(--line)",
            }}>
            <input
              type="checkbox"
              checked={rituelFait}
              onChange={(e) => setRituelFait(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: "#3E8E4F" }}
            />
            <span className="font-semibold text-sm"
              style={{ color: rituelFait ? "#3E8E4F" : "var(--text-mute)" }}>
              {rituelFait ? "✓ Je l'ai fait" : "Je l'ai fait"}
            </span>
          </label>

          <button
            onClick={sauvegarderRituel}
            className="w-full rounded-xl py-3 font-bold text-sm transition-opacity"
            style={{
              background: "var(--brand)",
              color: "#fff",
              opacity: saved ? 0.7 : 1,
            }}>
            {saved ? "✓ Sauvegardé" : "Sauvegarder →"}
          </button>
        </div>

        {/* MoodPicker */}
        <div className="rounded-2xl p-5"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--line)" }}>
          <MoodPicker initialScore={moodScore} onSelect={saveMood} />
        </div>

      </main>
    </div>
  )
}
