"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { calcCurrentDay } from "@/data/program"
import { C, rgba, Ic, weekAccent } from "@/components/bte-ui"
import Link from "next/link"

const WEEK_LABELS = [
  "Semaine 1 · Détox & Purification",
  "Semaine 2 · Énergie & Vitalité",
  "Semaine 3 · Ancrage & Performance",
]
const weekIdx = (day: number) => day <= 7 ? 0 : day <= 14 ? 1 : 2

function PfProgress({ day }: { day: number }) {
  const total = 21
  const pct = Math.round(day / total * 100)
  const accent = weekAccent(day)
  const r = 26, circ = 2 * Math.PI * r
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, background: C.surface, border: `1.5px solid ${C.line}`, borderRadius: 18, padding: "18px 18px", marginBottom: 16 }}>
      <div style={{ flexShrink: 0, position: "relative", width: 64, height: 64 }}>
        <svg width="64" height="64" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={r} fill="none" stroke={C.line} strokeWidth="6" />
          <circle cx="32" cy="32" r={r} fill="none" stroke={accent} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${pct / 100 * circ} ${circ}`} transform="rotate(-90 32 32)" />
        </svg>
        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--heading)", fontWeight: 700, fontSize: 17, color: accent }}>J{day}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 19, letterSpacing: "-0.01em", color: C.ink, marginBottom: 3 }}>Ta progression</div>
        <div style={{ fontSize: 13.5, lineHeight: 1.5, color: C.soft }}>Jour {day} sur {total} — tu avances bien.</div>
        <div style={{ fontFamily: "var(--label)", fontWeight: 700, fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: accent, marginTop: 8 }}>{WEEK_LABELS[weekIdx(day)]}</div>
      </div>
    </div>
  )
}

type WeightEntry = {
  id: string
  value: number
  day_number: number | null
  logged_at: string
}

function fmtDate(isoDate: string): string {
  return new Date(isoDate + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long" })
}

export default function ProfilPage() {
  const router   = useRouter()
  const supabase = createClient()

  const [prenom, setPrenom]         = useState("")
  const [currentDay, setCurrentDay] = useState(1)
  const [userId, setUserId]         = useState<string | null>(null)
  const [ready, setReady]           = useState(false)

  // Note à moi-même (localStorage)
  const [selfNote, setSelfNote] = useState("")

  // Évolution du poids
  const [entries, setEntries]   = useState<WeightEntry[]>([])
  const [newKg, setNewKg]       = useState("")
  const [adding, setAdding]     = useState(false)

  const todayLabel = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long" })

  useEffect(() => {
    try { setSelfNote(localStorage.getItem("bte-profil-self-note") ?? "") } catch {}

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.replace("/login"); return }
      setUserId(user.id)

      const [{ data: profile }, weightRes] = await Promise.all([
        supabase.from("profiles").select("prenom, program_start").eq("id", user.id).maybeSingle(),
        fetch("/api/profil/poids"),
      ])

      if (profile) {
        setPrenom(profile.prenom ?? "")
        if (profile.program_start) setCurrentDay(calcCurrentDay(profile.program_start))
      }

      if (weightRes.ok) {
        const data = await weightRes.json()
        setEntries(Array.isArray(data) ? data : [])
      }

      setReady(true)
    })
  }, []) // eslint-disable-line

  const handleNoteChange = useCallback((val: string) => {
    setSelfNote(val)
    try { localStorage.setItem("bte-profil-self-note", val) } catch {}
  }, [])

  async function addWeight() {
    if (!newKg.trim() || adding) return
    setAdding(true)
    const res = await fetch("/api/profil/poids", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: parseFloat(newKg.replace(",", ".")) }),
    })
    if (res.ok) {
      const entry: WeightEntry = await res.json()
      setEntries(prev => [...prev, entry])
      setNewKg("")
    }
    setAdding(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.replace("/login")
  }

  if (!ready) return <div style={{ minHeight: "100svh", background: C.bg }} />

  const initial = prenom ? prenom[0].toUpperCase() : "?"

  return (
    <div style={{ minHeight: "100svh", background: C.chassis, display: "flex", justifyContent: "center", fontFamily: "var(--sans)" }}>
      <div style={{ width: "100%", maxWidth: 440, minHeight: "100svh", background: C.bg, color: C.ink, display: "flex", flexDirection: "column", padding: "20px 18px 36px" }}>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 26 }}>
          <button onClick={() => router.back()} aria-label="Retour" style={{ flexShrink: 0, width: 42, height: 42, borderRadius: 999, border: `2px solid ${C.ink}`, background: "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <span style={{ display: "inline-flex", transform: "rotate(180deg)" }}>
              <Ic name="arrow" col={C.ink} sw={2} s={19} />
            </span>
          </button>
          <span style={{ fontFamily: "var(--label)", fontWeight: 700, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: C.soft }}>Moi</span>
        </div>

        {/* Identité */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <span style={{ flexShrink: 0, width: 64, height: 64, borderRadius: 999, background: C.terra, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--heading)", fontWeight: 600, fontSize: 28 }}>{initial}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "var(--heading)", fontWeight: 700, fontSize: 27, letterSpacing: "-0.015em", lineHeight: 1.05, color: C.ink }}>{prenom}</div>
          </div>
        </div>

        {/* Ta progression */}
        <PfProgress day={currentDay} />

        {/* Note à moi-même */}
        <div style={{ background: rgba(C.leaf, 0.07), border: `1.5px solid ${rgba(C.leaf, 0.45)}`, borderRadius: 18, padding: "20px 18px 18px", marginBottom: 16 }}>
          <div style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 19, letterSpacing: "-0.01em", color: C.ink, marginBottom: 6 }}>Note à moi-même</div>
          <p style={{ margin: "0 0 14px", fontSize: 13.5, lineHeight: 1.55, color: C.soft }}>Si tu veux noter un truc, un objectif, ce que tu veux ;)</p>
          <textarea
            aria-label="Note à moi-même"
            rows={4}
            placeholder="Écris-la avec tes mots…"
            value={selfNote}
            onChange={e => handleNoteChange(e.target.value)}
            style={{ display: "block", width: "100%", boxSizing: "border-box", resize: "vertical", minHeight: 96, background: C.surface, border: `2px solid ${C.ink}`, borderRadius: 12, padding: "12px 14px", color: C.ink, fontFamily: "var(--sans)", fontSize: 14.5, lineHeight: 1.55, outline: "none" }}
          />
          {selfNote.trim() !== "" && (
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 10 }}>
              <Ic name="check" col={C.leaf} sw={2.2} s={15} />
              <span style={{ fontFamily: "var(--label)", fontSize: 11, fontWeight: 500, color: C.soft }}>Gardée ici, sur ton téléphone.</span>
            </div>
          )}
        </div>

        {/* Évolution du poids */}
        <div style={{ background: rgba(C.amber, 0.10), border: `1.5px solid ${rgba(C.amber, 0.55)}`, borderRadius: 18, padding: "20px 18px 18px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
            <span style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 19, letterSpacing: "-0.01em", color: C.ink }}>L'évolution de ton poids</span>
            <span style={{ fontFamily: "var(--label)", fontWeight: 700, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#A9742A", background: rgba(C.amber, 0.22), padding: "4px 10px", borderRadius: 999 }}>Si tu veux</span>
          </div>
          <p style={{ margin: "0 0 16px", fontSize: 13.5, lineHeight: 1.55, color: C.soft }}>Note-le quand ça te dit, c'est tout.</p>

          {entries.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", marginBottom: 16 }}>
              {entries.map((e, i) => (
                <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 2px", borderTop: i === 0 ? "none" : `1.5px solid ${C.line}` }}>
                  <span style={{ flexShrink: 0, width: 8, height: 8, borderRadius: 999, background: C.leaf, display: "inline-block" }} />
                  <span style={{ flex: 1, fontSize: 14, color: C.ink, fontWeight: 600 }}>
                    {e.day_number != null ? `Jour ${e.day_number}` : fmtDate(e.logged_at)}
                    {" "}<span style={{ color: C.soft, fontWeight: 400 }}>· {fmtDate(e.logged_at)}</span>
                  </span>
                  <span style={{ flexShrink: 0, fontFamily: "var(--label)", fontWeight: 700, fontSize: 14.5, color: C.ink }}>{String(e.value).replace(".", ",")} kg</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: C.surface, border: `2px solid ${C.ink}`, borderRadius: 12, padding: "11px 14px" }}>
              <input
                aria-label="Ton poids aujourd'hui"
                type="number"
                inputMode="decimal"
                min={30}
                max={250}
                step={0.5}
                placeholder={todayLabel + "…"}
                value={newKg}
                onChange={e => setNewKg(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") addWeight() }}
                style={{ flex: 1, width: "100%", minWidth: 0, border: "none", background: "transparent", outline: "none", color: C.ink, fontFamily: "var(--label)", fontSize: 15, fontWeight: 700 }}
              />
              <span style={{ flexShrink: 0, fontFamily: "var(--label)", fontSize: 12, fontWeight: 500, color: C.soft }}>kg</span>
            </div>
            <button
              onClick={addWeight}
              disabled={!newKg.trim() || adding}
              style={{ flexShrink: 0, cursor: newKg.trim() && !adding ? "pointer" : "default", border: "none", background: C.leaf, color: "#fff", fontFamily: "var(--label)", fontWeight: 700, fontSize: 13.5, letterSpacing: "0.02em", padding: "0 22px", borderRadius: 999, opacity: newKg.trim() && !adding ? 1 : 0.55, transition: "opacity 0.15s" }}
            >
              Noter
            </button>
          </div>
        </div>

        {/* Aide */}
        <div style={{ textAlign: "center", fontSize: 13, color: C.soft, marginBottom: 24 }}>
          Un souci avec ton compte ?{" "}
          <Link href="/chat" style={{ color: C.leaf, fontWeight: 600 }}>Écris à Laurent, il te répond.</Link>
        </div>

        <div style={{ flex: 1 }} />

        {/* Déconnexion */}
        <button onClick={handleSignOut} style={{ width: "100%", textAlign: "center", border: `1.5px solid ${rgba(C.ink, 0.35)}`, color: C.ink, background: "transparent", fontFamily: "var(--label)", fontWeight: 700, fontSize: 13.5, padding: "13px 18px", borderRadius: 999, cursor: "pointer" }}>
          Me déconnecter
        </button>
        <div style={{ marginTop: 14, textAlign: "center", fontFamily: "var(--label)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: C.soft }}>
          backtoenergy · programme 21 jours
        </div>
      </div>
    </div>
  )
}
