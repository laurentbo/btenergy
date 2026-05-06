"use client"
import { useState, useEffect, useMemo } from "react"
import { use } from "react"
import { PROGRAM, WEEK_THEMES } from "@/data/program"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function ProgrammeJour({ params }: { params: Promise<{ jour: string }> }) {
  const { jour: jourParam } = use(params)
  const jourActuel = Math.min(21, Math.max(1, parseInt(jourParam, 10) || 1))

  const [activite, setActivite] = useState("")
  const [rituelFait, setRituelFait] = useState(false)
  const [saved, setSaved] = useState(false)
  const [session, setSession] = useState<{ user: { id: string } } | null>(null)

  const supabase = useMemo(() => createClient(), [])
  const dayData = PROGRAM[jourActuel - 1]
  const weekInfo = WEEK_THEMES[dayData.week]

  useEffect(() => {
    async function load() {
      const { data: { session: s } } = await supabase.auth.getSession()
      if (!s) { window.location.href = "/"; return }
      setSession(s)

      const { data } = await supabase
        .from("journal")
        .select("activite, rituel_fait")
        .eq("user_id", s.user.id)
        .eq("jour", jourActuel)
        .maybeSingle()

      if (data) {
        setActivite(data.activite ?? "")
        setRituelFait(data.rituel_fait ?? false)
      }
    }
    load()
  }, [jourActuel]) // eslint-disable-line

  const sauvegarderRituel = async () => {
    if (!session) return
    await supabase.from("journal").upsert({
      user_id: session.user.id,
      jour: jourActuel,
      activite,
      rituel_fait: rituelFait,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,jour" })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #0b1e38 0%, #07111e 55%, #050e1a 100%)" }}>

      {/* Header */}
      <header className="sticky top-0 z-50 px-5 py-3.5"
        style={{ background: "rgba(5,14,26,0.82)", backdropFilter: "blur(28px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-sm font-semibold"
            style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>
            ← Retour
          </Link>
          <span className="font-black text-sm gradient-text">Jour {jourActuel}</span>
          <div className="rounded-lg px-3 py-1 text-xs font-bold"
            style={{ background: `${weekInfo.color}14`, color: weekInfo.color }}>
            S{dayData.week}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6 pb-16 space-y-5">

        {/* Thème du jour */}
        <div className="card p-5 fade-up"
          style={{ border: `1px solid ${weekInfo.color}30` }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: weekInfo.color }}>
            {weekInfo.title}
          </p>
          <h1 className="font-black text-lg mb-2" style={{ color: "var(--text-primary)" }}>
            {dayData.theme}
          </h1>
          <p className="italic text-sm" style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
            &ldquo;{dayData.coachWord}&rdquo;
          </p>
        </div>

        {/* Messages fatigue J1-J3 */}
        {jourActuel <= 3 && (
          <div style={{ borderLeft: "4px solid #E76F51", padding: "14px 18px", background: "rgba(231,111,81,0.07)", borderRadius: "0 12px 12px 0" }}>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
              {jourActuel === 1 && "Dès cet après-midi, une légère fatigue est possible – c'est le nettoyage. C'est une bonne nouvelle."}
              {jourActuel === 2 && "La fatigue peut persister aujourd'hui. Bois beaucoup d'eau. Le corps travaille."}
              {jourActuel === 3 && "La fatigue commence à s'estomper ? Observe ton énergie ce soir."}
            </p>
          </div>
        )}

        {/* RITUEL QUOTIDIEN – 30 MIN ACTIVITÉ */}
        <section className="card p-5 fade-up">
          <h2 className="font-bold text-base mb-1" style={{ color: "var(--text-primary)" }}>🏃 Rituel du jour</h2>
          <p className="text-sm font-bold mb-4" style={{ color: weekInfo.color }}>30 minutes d&apos;activité physique</p>

          <input
            type="text"
            placeholder="Ex : marche, vélo, renforcement, yoga…"
            value={activite}
            onChange={e => setActivite(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none mb-4"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "var(--text-primary)",
            }}
          />

          <label className="flex items-center gap-3 cursor-pointer mb-5 rounded-xl px-4 py-3"
            style={{
              background: rituelFait ? "rgba(42,157,143,0.1)" : "rgba(255,255,255,0.04)",
              border: `1.5px solid ${rituelFait ? "#2A9D8F" : "rgba(255,255,255,0.1)"}`,
              transition: "all 0.15s",
            }}>
            <input
              type="checkbox"
              checked={rituelFait}
              onChange={e => setRituelFait(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: "#2A9D8F" }}
            />
            <span className="font-semibold text-sm" style={{ color: rituelFait ? "#2A9D8F" : "var(--text-secondary)" }}>
              ✅ Je l&apos;ai fait
            </span>
          </label>

          <button
            onClick={sauvegarderRituel}
            className="btn-primary w-full text-sm"
            style={{ opacity: saved ? 0.7 : 1 }}>
            {saved ? "✓ Sauvegardé !" : "Sauvegarder →"}
          </button>
        </section>

        {/* Repas du jour */}
        <section className="card p-5 fade-up">
          <h2 className="font-bold text-base mb-4" style={{ color: "var(--text-primary)" }}>🍽️ Repas du jour</h2>
          <div className="space-y-3">
            {dayData.meals.map((meal, i) => (
              <div key={i} className="rounded-xl p-4"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: weekInfo.color }}>
                  {meal.moment}
                </p>
                <ul className="space-y-1">
                  {meal.items.map((item, j) => (
                    <li key={j} className="text-sm flex items-start gap-2" style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
                      <span style={{ color: weekInfo.color, flexShrink: 0 }}>·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Tip + Conseil */}
        <section className="card px-5 py-4 flex items-start gap-4 fade-up">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(76,201,240,0.1)", border: "1px solid rgba(76,201,240,0.18)", fontSize: "16px" }}>✨</div>
          <p style={{ color: "var(--text-secondary)", lineHeight: "1.75", fontSize: "14px" }}>{dayData.tip}</p>
        </section>

      </main>
    </div>
  )
}
