"use client"
import { useState, useRef, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface Props {
  currentDay: number
  prenom: string | null
}

interface Question {
  id?: string
  text: string
  day: number
  ts: number
  status?: string
  answer?: string | null
}

export default function QuestionFooter({ currentDay, prenom }: Props) {
  const [open, setOpen]           = useState(false)
  const [view, setView]           = useState<"input" | "history">("input")
  const [text, setText]           = useState("")
  const [recording, setRecording] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [history, setHistory]     = useState<Question[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const supabase = createClient()

  useEffect(() => {
    loadHistory()
  }, []) // eslint-disable-line

  const loadHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data, error } = await supabase
      .from("questions")
      .select("id, text, day, created_at, status, answer")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(30)
    if (!error && data) {
      setHistory(data.map(q => ({ id: q.id, text: q.text, day: q.day, ts: new Date(q.created_at).getTime(), status: q.status, answer: q.answer })))
    }
  }

  useEffect(() => {
    if (open && view === "history") loadHistory()
  }, [open, view]) // eslint-disable-line

  useEffect(() => {
    if (open && view === "input") setTimeout(() => inputRef.current?.focus(), 200)
  }, [open, view])

  const startVoice = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { alert("Transcription vocale non disponible sur ce navigateur."); return }
    if (recording) { recognitionRef.current?.stop(); setRecording(false); return }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = new SR() as any
    r.lang = "fr-FR"; r.continuous = false; r.interimResults = false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r.onresult = (e: any) => { const t = e.results[0][0].transcript; setText(p => p ? p + " " + t : t) }
    r.onend = () => setRecording(false)
    r.onerror = () => setRecording(false)
    recognitionRef.current = r; r.start(); setRecording(true)
  }

  const handleSubmit = async () => {
    if (!text.trim()) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Récupère le coach_id depuis le profil
    const { data: profile } = await supabase
      .from("profiles")
      .select("coach_id")
      .eq("id", user.id)
      .maybeSingle()

    const { error } = await supabase.from("questions").insert({
      user_id: user.id,
      coach_id: profile?.coach_id ?? null,
      day: currentDay,
      text: text.trim(),
      status: "pending",
    })

    if (!error) {
      setSubmitted(true)
      setTimeout(() => { setSubmitted(false); setText("") }, 2000)
    } else {
      console.error("[question] insert error:", error)
      alert(`Erreur : ${error.message}`)
    }
  }

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })

  const statusLabel = (s?: string) =>
    s === "answered" ? { text: "Répondu ✓", color: "#16a34a" } : { text: "En attente…", color: "#f59e0b" }

  return (
    <>
      {open && <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 55 }} />}

      {/* Drawer */}
      <div style={{
        position: "fixed", left: 0, right: 0, zIndex: 60,
        bottom: open ? 64 : "-100%",
        transition: "bottom 0.32s cubic-bezier(0.32,0.72,0,1)",
        background: "#fff",
        borderRadius: "20px 20px 0 0",
        boxShadow: "0 -6px 32px rgba(0,0,0,0.15)",
        maxHeight: "75vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}>
        <div style={{ padding: "12px 20px 0", flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, background: "#e2e8f0", borderRadius: 2, margin: "0 auto 14px" }} />
          <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
            {([
              { id: "input",   label: "❓ Question au coach" },
              { id: "history", label: `📋 Mes questions (${history.length})` },
            ] as const).map(({ id, label }) => (
              <button key={id} onClick={() => setView(id)}
                style={{
                  flex: 1, padding: "7px 8px", borderRadius: "10px", fontSize: "12px", fontWeight: 700,
                  border: view === id ? "2px solid #16a34a" : "1px solid #e2e8f0",
                  background: view === id ? "#f0fdf4" : "#f8fafc",
                  color: view === id ? "#16a34a" : "#64748b",
                  cursor: "pointer",
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 28px" }}>

          {/* ─── Saisie ─── */}
          {view === "input" && (
            submitted ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <p style={{ fontSize: "32px", marginBottom: "8px" }}>✅</p>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "#16a34a" }}>Question envoyée au coach !</p>
                <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>Tu recevras une réponse prochainement</p>
              </div>
            ) : (
              <>
                <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "12px", lineHeight: 1.5 }}>
                  Une question pour ton coach ?
                </p>
                <div style={{ position: "relative", marginBottom: "12px" }}>
                  <textarea
                    ref={inputRef}
                    rows={4}
                    placeholder="Ex : Est-ce que je peux remplacer les kiwis par des fraises ?"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    style={{
                      width: "100%", borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      padding: "12px 52px 12px 14px",
                      fontSize: "14px", color: "#334155",
                      background: "#f8fafc", resize: "none", outline: "none",
                      fontFamily: "inherit", lineHeight: 1.6,
                    }}
                  />
                  <button onClick={startVoice}
                    style={{
                      position: "absolute", right: 10, top: 10,
                      width: 36, height: 36, borderRadius: "50%",
                      background: recording ? "#fef2f2" : "#f0fdf4",
                      border: recording ? "2px solid #fca5a5" : "2px solid #bbf7d0",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer",
                    }}>
                    {recording
                      ? <span style={{ width: 12, height: 12, borderRadius: 3, background: "#ef4444", display: "block" }} />
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>
                        </svg>
                    }
                  </button>
                </div>
                {recording && <p style={{ fontSize: "12px", color: "#ef4444", fontWeight: 600, marginBottom: "10px", textAlign: "center" }}>🔴 Parle maintenant…</p>}
                <button onClick={handleSubmit} disabled={!text.trim()}
                  style={{
                    width: "100%", padding: "13px", borderRadius: "12px",
                    fontWeight: 700, fontSize: "14px",
                    background: text.trim() ? "#16a34a" : "#e2e8f0",
                    color: text.trim() ? "#fff" : "#94a3b8",
                    border: "none", cursor: text.trim() ? "pointer" : "not-allowed",
                  }}>
                  Envoyer au coach →
                </button>
              </>
            )
          )}

          {/* ─── Historique ─── */}
          {view === "history" && (
            history.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0", color: "#94a3b8" }}>
                <p style={{ fontSize: "28px", marginBottom: "8px" }}>💬</p>
                <p style={{ fontSize: "14px" }}>Aucune question pour l&apos;instant</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {history.map((q, i) => {
                  const sl = statusLabel(q.status)
                  return (
                    <div key={i} style={{ background: "#f8fafc", borderRadius: "12px", padding: "12px 14px", borderLeft: "3px solid #16a34a" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontSize: "10px", fontWeight: 700, color: "#16a34a" }}>Jour {q.day}</span>
                        <span style={{ fontSize: "10px", fontWeight: 700, color: sl.color }}>{sl.text}</span>
                      </div>
                      <p style={{ fontSize: "13px", color: "#334155", lineHeight: 1.55, marginBottom: q.answer ? "8px" : 0 }}>{q.text}</p>
                      {q.answer && (
                        <div style={{ background: "#f0fdf4", borderRadius: "8px", padding: "8px 10px", marginTop: "6px" }}>
                          <p style={{ fontSize: "10px", fontWeight: 700, color: "#16a34a", marginBottom: "3px" }}>RÉPONSE DU COACH</p>
                          <p style={{ fontSize: "12px", color: "#15803d", lineHeight: 1.5 }}>{q.answer}</p>
                        </div>
                      )}
                      <p style={{ fontSize: "10px", color: "#94a3b8", marginTop: "6px" }}>{formatDate(q.ts)}</p>
                    </div>
                  )
                })}
              </div>
            )
          )}
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: "fixed", right: 16, bottom: 78, zIndex: 54,
          height: 40, borderRadius: "20px",
          padding: "0 16px",
          background: open ? "#f1f5f9" : "#16a34a",
          border: open ? "1.5px solid #e2e8f0" : "none",
          boxShadow: open ? "none" : "0 4px 16px rgba(22,163,74,0.45)",
          display: "flex", alignItems: "center", gap: "8px",
          cursor: "pointer", transition: "all 0.2s",
          whiteSpace: "nowrap",
        }}>
        {open
          ? <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#64748b" }}>Fermer</span>
            </>
          : <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>
              </svg>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "white" }}>Une question à poser ?</span>
            </>
        }
      </button>
    </>
  )
}
