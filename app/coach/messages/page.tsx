"use client"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"

type Message = {
  id: string
  coachee_id: string
  author: "coachee" | "coach"
  body: string | null
  read_by_coach: boolean
  read_by_user: boolean
  created_at: string
}

type Participant = {
  id: string
  prenom: string
  email: string
  current_day: number
}

type Thread = {
  participant: Participant
  lastMessage: Message | null
  unreadCount: number
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  if (isToday) return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
}

function formatDateLabel(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (d.toDateString() === now.toDateString())
    return `Aujourd'hui · ${d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric" })}`
  if (d.toDateString() === yesterday.toDateString()) return "Hier"
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
}

export default function CoachMessagesPage() {
  const supabase = useMemo(() => createClient(), [])

  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Participant | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [threadLoading, setThreadLoading] = useState(false)
  const [draft, setDraft] = useState("")
  const [sending, setSending] = useState(false)
  const [coachId, setCoachId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Charge la liste des participants + leur dernier message
  const loadThreads = useCallback(async () => {
    setLoading(true)
    const [{ data: participants }, { data: allMessages }] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, prenom, email, current_day")
        .eq("role", "collaborateur")
        .order("prenom"),
      supabase
        .from("journal_messages")
        .select("id, coachee_id, author, body, read_by_coach, read_by_user, created_at")
        .order("created_at", { ascending: false }),
    ])

    const msgs = (allMessages ?? []) as Message[]
    const parts = (participants ?? []) as Participant[]

    const built: Thread[] = parts.map((p) => {
      const pMsgs = msgs.filter((m) => m.coachee_id === p.id)
      const lastMessage = pMsgs[0] ?? null
      const unreadCount = pMsgs.filter((m) => m.author === "coachee" && !m.read_by_coach).length
      return { participant: p, lastMessage, unreadCount }
    })

    // Trier : non-lus d'abord, puis par activité récente
    built.sort((a, b) => {
      if (b.unreadCount !== a.unreadCount) return b.unreadCount - a.unreadCount
      const aTime = a.lastMessage?.created_at ?? ""
      const bTime = b.lastMessage?.created_at ?? ""
      return bTime.localeCompare(aTime)
    })

    setThreads(built)
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetch("/api/me").then(r => r.json()).then(me => setCoachId(me.id))
    loadThreads()
  }, [loadThreads])

  // Charge le fil d'un participant
  const openThread = useCallback(async (p: Participant) => {
    setSelected(p)
    setThreadLoading(true)
    setMessages([])

    const { data } = await supabase
      .from("journal_messages")
      .select("id, coachee_id, author, body, read_by_coach, read_by_user, created_at")
      .eq("coachee_id", p.id)
      .order("created_at", { ascending: true })

    const loaded = (data ?? []) as Message[]
    setMessages(loaded)
    setThreadLoading(false)

    // Marquer les messages coachee comme lus
    const unreadIds = loaded
      .filter(m => m.author === "coachee" && !m.read_by_coach)
      .map(m => m.id)
    if (unreadIds.length > 0) {
      await supabase
        .from("journal_messages")
        .update({ read_by_coach: true })
        .in("id", unreadIds)
      // Mettre à jour le badge localement
      setThreads(prev => prev.map(t =>
        t.participant.id === p.id ? { ...t, unreadCount: 0 } : t
      ))
    }
  }, [supabase])

  // Scroll auto en bas
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  const handleSend = async () => {
    if (!draft.trim() || !selected || !coachId || sending) return
    setSending(true)
    const body = draft.trim()
    setDraft("")

    const { data: inserted } = await supabase
      .from("journal_messages")
      .insert({
        coachee_id: selected.id,
        author: "coach",
        body,
        is_question: false,
        read_by_coach: true,
        read_by_user: false,
      })
      .select()
      .maybeSingle()

    if (inserted) {
      setMessages(prev => [...prev, inserted as Message])
      setThreads(prev => prev.map(t =>
        t.participant.id === selected.id
          ? { ...t, lastMessage: inserted as Message }
          : t
      ))
    }
    setSending(false)
  }

  // Grouper par date
  const grouped: Array<{ type: "sep"; label: string } | { type: "msg"; msg: Message }> = []
  let lastDate = ""
  for (const msg of messages) {
    const dk = new Date(msg.created_at).toDateString()
    if (dk !== lastDate) {
      grouped.push({ type: "sep", label: formatDateLabel(msg.created_at) })
      lastDate = dk
    }
    grouped.push({ type: "msg", msg })
  }

  return (
    <div style={{
      height: "100vh", display: "flex", flexDirection: "column",
      background: "var(--bg)", color: "var(--text)", fontFamily: "var(--sans)",
    }}>
      {/* Header */}
      <header style={{
        flexShrink: 0, padding: "14px 20px",
        borderBottom: "1px solid var(--line)",
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <a href="/coach" style={{
          fontSize: 12, fontWeight: 600, color: "var(--text-mute)",
          textDecoration: "none", padding: "6px 12px", borderRadius: 10,
          background: "rgba(255,255,255,0.06)",
        }}>← Coach</a>
        <h1 style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", margin: 0 }}>
          Messages
        </h1>
      </header>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Liste des fils */}
        <div style={{
          width: 280, flexShrink: 0, borderRight: "1px solid var(--line)",
          overflowY: "auto", display: "flex", flexDirection: "column",
        }}>
          {loading ? (
            <div style={{ padding: 24, color: "var(--text-mute)", fontSize: 13 }}>Chargement…</div>
          ) : threads.length === 0 ? (
            <div style={{ padding: 24, color: "var(--text-mute)", fontSize: 13 }}>Aucun participant.</div>
          ) : threads.map(({ participant: p, lastMessage, unreadCount }) => {
            const isSelected = selected?.id === p.id
            return (
              <button
                key={p.id}
                onClick={() => openThread(p)}
                style={{
                  width: "100%", textAlign: "left",
                  border: 0, borderBottom: "1px solid var(--line)",
                  padding: "14px 16px", cursor: "pointer",
                  background: isSelected ? "rgba(255,255,255,0.06)" : "transparent",
                  transition: "background 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text)" }}>
                    {p.prenom}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {unreadCount > 0 && (
                      <span style={{
                        background: "var(--brand)", color: "#fff",
                        fontSize: 10, fontWeight: 700,
                        borderRadius: 999, padding: "1px 6px", minWidth: 16, textAlign: "center",
                      }}>{unreadCount}</span>
                    )}
                    {lastMessage && (
                      <span style={{ fontSize: 10.5, color: "var(--text-faint)" }}>
                        {formatTime(lastMessage.created_at)}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{
                  fontSize: 12, color: "var(--text-mute)",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {lastMessage
                    ? `${lastMessage.author === "coach" ? "Toi : " : ""}${lastMessage.body ?? ""}`
                    : <em>Aucun message</em>
                  }
                </div>
                <div style={{ fontSize: 10.5, color: "var(--text-faint)", marginTop: 3 }}>
                  Jour {p.current_day} / 21
                </div>
              </button>
            )
          })}
        </div>

        {/* Thread */}
        {selected ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Thread header */}
            <div style={{
              flexShrink: 0, padding: "12px 20px",
              borderBottom: "1px solid var(--line)",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 999,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 600, color: "var(--text)",
              }}>
                {selected.prenom.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{selected.prenom}</div>
                <div style={{ fontSize: 11, color: "var(--text-mute)" }}>{selected.email} · Jour {selected.current_day}/21</div>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} style={{
              flex: 1, overflowY: "auto",
              padding: "20px 20px 12px",
              display: "flex", flexDirection: "column", gap: 12,
            }}>
              {threadLoading && (
                <div style={{ color: "var(--text-mute)", fontSize: 13 }}>Chargement…</div>
              )}
              {!threadLoading && grouped.map((item, i) => {
                if (item.type === "sep") {
                  return (
                    <div key={`sep-${i}`} style={{ display: "flex", alignItems: "center", gap: 10, margin: "8px 0" }}>
                      <div style={{ flex: 1, height: 1, background: "var(--line-soft)" }} />
                      <span style={{ fontSize: 10.5, color: "var(--text-mute)", fontStyle: "italic" }}>{item.label}</span>
                      <div style={{ flex: 1, height: 1, background: "var(--line-soft)" }} />
                    </div>
                  )
                }
                const { msg } = item
                const isCoach = msg.author === "coach"
                return (
                  <div key={msg.id} style={{
                    display: "flex",
                    flexDirection: isCoach ? "row-reverse" : "row",
                    alignItems: "flex-end", gap: 8,
                  }}>
                    <div style={{
                      maxWidth: "72%", display: "flex", flexDirection: "column",
                      gap: 4, alignItems: isCoach ? "flex-end" : "flex-start",
                    }}>
                      <div style={{
                        padding: "10px 14px",
                        background: isCoach ? "var(--brand)" : "rgba(255,255,255,0.07)",
                        border: isCoach ? "none" : "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 16,
                        borderBottomRightRadius: isCoach ? 4 : 16,
                        borderBottomLeftRadius: isCoach ? 16 : 4,
                        color: isCoach ? "#fff" : "var(--text)",
                        fontSize: 13.5, lineHeight: 1.55,
                      }}>
                        {msg.body}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--text-faint)", padding: "0 4px" }}>
                        {formatTime(msg.created_at)}
                        {isCoach && !msg.read_by_user && (
                          <span style={{ marginLeft: 6, color: "var(--text-faint)" }}>· non lu</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Composer */}
            <div style={{
              flexShrink: 0, padding: "12px 20px 16px",
              borderTop: "1px solid var(--line)",
              display: "flex", gap: 10, alignItems: "flex-end",
            }}>
              <div style={{
                flex: 1, background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 20, padding: "10px 16px",
              }}>
                <textarea
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                  placeholder={`Répondre à ${selected.prenom}…`}
                  rows={2}
                  style={{
                    width: "100%", background: "transparent", border: 0, outline: "none",
                    color: "var(--text)", fontFamily: "var(--sans)", fontSize: 14,
                    resize: "none", lineHeight: 1.5,
                  }}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!draft.trim() || sending}
                style={{
                  width: 40, height: 40, borderRadius: 999, flexShrink: 0,
                  background: draft.trim() ? "var(--brand)" : "rgba(255,255,255,0.07)",
                  border: "none", cursor: draft.trim() ? "pointer" : "default",
                  color: "#fff", fontSize: 16,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: sending ? 0.6 : 1, transition: "all 0.15s",
                }}
              >↑</button>
            </div>
          </div>
        ) : (
          <div style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--text-mute)", fontSize: 13, fontStyle: "italic",
          }}>
            Sélectionne un participant pour voir son fil.
          </div>
        )}
      </div>
    </div>
  )
}
