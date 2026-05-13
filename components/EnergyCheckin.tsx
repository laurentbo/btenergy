"use client"
import { useState, useEffect, useRef } from "react"

const EMOJIS = [
  { value: 1, emoji: "😴", label: "Épuisé·e" },
  { value: 2, emoji: "😐", label: "Fatigué·e" },
  { value: 3, emoji: "🙂", label: "Correct" },
  { value: 4, emoji: "⚡", label: "Bien" },
  { value: 5, emoji: "🔥", label: "Au top" },
]

interface Props {
  currentDay: number
  onCheckin: (value: number) => void
}

export default function EnergyCheckin({ currentDay, onCheckin }: Props) {
  const key     = `btenergy_checkin_day_${currentDay}`
  const noteKey = `btenergy_checkin_note_${currentDay}`

  const [selected, setSelected] = useState<number | null>(null)
  const [note, setNote]         = useState("")
  const [saved, setSaved]       = useState(false)
  const [recording, setRecording] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem(key)
    const storedNote = localStorage.getItem(noteKey)
    if (stored) { setSelected(Number(stored)); setSaved(true) }
    if (storedNote) setNote(storedNote)
  }, [key, noteKey])

  const startVoice = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { alert("Transcription vocale non disponible sur ce navigateur."); return }

    if (recording) {
      recognitionRef.current?.stop()
      setRecording(false)
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = new SR() as any
    r.lang = "fr-FR"
    r.continuous = false
    r.interimResults = false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r.onresult = (e: any) => {
      const t = e.results[0][0].transcript
      setNote(prev => prev ? prev + " " + t : t)
    }
    r.onend = () => setRecording(false)
    r.onerror = () => setRecording(false)
    recognitionRef.current = r
    r.start()
    setRecording(true)
  }

  const handleValidate = () => {
    if (selected === null) return
    localStorage.setItem(key, String(selected))
    if (note.trim()) localStorage.setItem(noteKey, note.trim())
    setSaved(true)
    onCheckin(selected)
  }

  return (
    <div style={{ background: "#fff", borderRadius: "16px", padding: "16px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
      <p style={{ fontSize: "10px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>
        💬 Comment je me sens aujourd&apos;hui
      </p>

      {/* Emojis */}
      <div style={{ display: "flex", gap: "6px", justifyContent: "space-between", marginBottom: "12px" }}>
        {EMOJIS.map(({ value, emoji, label }) => (
          <button key={value} onClick={() => !saved && setSelected(value)}
            style={{
              flex: 1, padding: "10px 2px", borderRadius: "12px",
              cursor: saved ? "default" : "pointer",
              border: selected === value ? "2px solid #16a34a" : "1px solid #e2e8f0",
              background: selected === value ? "#f0fdf4" : "#f8fafc",
              transition: "all 0.15s",
              display: "flex", flexDirection: "column", alignItems: "center", gap: "3px",
            }}>
            <span style={{ fontSize: "22px" }}>{emoji}</span>
            <span style={{ fontSize: "9px", color: selected === value ? "#16a34a" : "#94a3b8", fontWeight: 700 }}>{label}</span>
          </button>
        ))}
      </div>

      {/* Zone note + micro */}
      {!saved && (
        <div style={{ position: "relative", marginBottom: "10px" }}>
          <textarea
            rows={2}
            placeholder="Ajoute une note (optionnel)…"
            value={note}
            onChange={e => setNote(e.target.value)}
            style={{
              width: "100%", borderRadius: "10px", border: "1px solid #e2e8f0",
              padding: "9px 44px 9px 12px", fontSize: "13px", color: "#334155",
              background: "#f8fafc", resize: "none", outline: "none",
              fontFamily: "inherit", lineHeight: 1.5,
            }}
          />
          <button
            onClick={startVoice}
            title={recording ? "Arrêter" : "Dicter une note"}
            style={{
              position: "absolute", right: 8, top: 8,
              width: 28, height: 28, borderRadius: "50%",
              background: recording ? "#fef2f2" : "#f0fdf4",
              border: recording ? "1.5px solid #fca5a5" : "1.5px solid #bbf7d0",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.15s",
            }}>
            {recording
              ? <span style={{ width: 10, height: 10, borderRadius: 2, background: "#ef4444", display: "block" }} />
              : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>
                </svg>
            }
          </button>
        </div>
      )}

      {saved && note && (
        <p style={{ fontSize: "12px", color: "#64748b", fontStyle: "italic", marginBottom: "8px", lineHeight: 1.5 }}>
          &ldquo;{note}&rdquo;
        </p>
      )}

      {!saved && selected !== null && (
        <button onClick={handleValidate}
          style={{ width: "100%", padding: "11px", borderRadius: "12px", fontWeight: 700, fontSize: "14px", background: "#16a34a", color: "#fff", border: "none", cursor: "pointer" }}>
          Enregistrer mon ressenti
        </button>
      )}

      {saved && (
        <p style={{ fontSize: "12px", color: "#16a34a", textAlign: "center", fontWeight: 600 }}>
          ✓ Ressenti enregistré
        </p>
      )}
    </div>
  )
}
