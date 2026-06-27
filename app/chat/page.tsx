"use client"
import { useState, useEffect, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { calcCurrentDay } from "@/data/program"
import { C, rgba, Ic, BottomTabs } from "@/components/bte-ui"

type Message = {
  id: string
  author: "coachee" | "coach"
  body: string | null
  created_at: string
}

type DateSep = { type: "date"; label: string; key: string }
type FeedItem = Message | DateSep

function nowHM() {
  const d = new Date()
  return d.getHours() + ":" + String(d.getMinutes()).padStart(2, "0")
}

function dayLabel(iso: string): string {
  const d = new Date(iso)
  const today     = new Date(); today.setHours(0,0,0,0)
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1)
  d.setHours(0,0,0,0)
  if (d.getTime() === today.getTime()) return "Aujourd'hui"
  if (d.getTime() === yesterday.getTime()) return "Hier"
  return new Date(iso).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
}

function buildFeed(messages: Message[]): FeedItem[] {
  const result: FeedItem[] = []
  let lastKey = ""
  for (const m of messages) {
    const key = new Date(m.created_at).toDateString()
    if (key !== lastKey) {
      result.push({ type: "date", label: dayLabel(m.created_at), key })
      lastKey = key
    }
    result.push(m)
  }
  return result
}

// ── Composants ────────────────────────────────────────────────────────────────
function DateSepRow({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0 4px" }}>
      <div style={{ flex: 1, height: 1, background: C.line }} />
      <span style={{ fontFamily: "var(--label)", fontSize: 10.5, fontWeight: 700, color: C.soft, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: C.line }} />
    </div>
  )
}

function Bubble({ m }: { m: Message }) {
  const me = m.author === "coachee"
  const time = new Date(m.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  return (
    <div style={{ display: "flex", justifyContent: me ? "flex-end" : "flex-start", gap: 9 }}>
      {!me && (
        <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 999, background: C.leaf, color: "#fff", fontFamily: "var(--heading)", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", alignSelf: "flex-end" }}>L</div>
      )}
      <div style={{ maxWidth: "76%", display: "flex", flexDirection: "column", alignItems: me ? "flex-end" : "flex-start", gap: 3 }}>
        <div style={{
          background: me ? C.leaf : C.surface,
          color: me ? "#fff" : C.ink,
          border: me ? "none" : `1.5px solid ${C.line}`,
          borderRadius: me ? "18px 18px 6px 18px" : "18px 18px 18px 6px",
          padding: "11px 14px", fontSize: 14.5, lineHeight: 1.45,
          boxShadow: me ? `0 10px 20px -14px ${rgba(C.leaf, 0.8)}` : `0 8px 16px -14px ${rgba(C.chassis, 0.5)}`,
        }}>{m.body}</div>
        <span style={{ fontFamily: "var(--label)", fontSize: 10.5, color: C.soft, fontWeight: 500, padding: "0 4px" }}>{time}</span>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ChatPage() {
  const router    = useRouter()
  const supabase  = createClient()
  const threadRef = useRef<HTMLDivElement>(null)

  const [userId, setUserId]         = useState<string | null>(null)
  const [currentDay, setCurrentDay] = useState(1)
  const [messages, setMessages]     = useState<Message[]>([])
  const [draft, setDraft]           = useState("")
  const [ready, setReady]           = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.replace("/login"); return }
      setUserId(user.id)

      const [{ data: profile }, { data: msgs }] = await Promise.all([
        supabase.from("profiles").select("program_start").eq("id", user.id).maybeSingle(),
        supabase.from("journal_messages")
          .select("id, author, body, created_at")
          .eq("coachee_id", user.id)
          .order("created_at", { ascending: true }),
      ])

      if (profile?.program_start) setCurrentDay(calcCurrentDay(profile.program_start))
      if (msgs) setMessages(msgs as Message[])

      // Marquer les messages coach comme lus
      await supabase.from("journal_messages")
        .update({ read_by_user: true })
        .eq("coachee_id", user.id)
        .eq("author", "coach")
        .eq("read_by_user", false)

      setReady(true)
    })
  }, []) // eslint-disable-line

  useEffect(() => {
    const el = threadRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages.length])

  async function send() {
    const txt = draft.trim()
    if (!txt || !userId) return
    setDraft("")
    const optimistic: Message = { id: crypto.randomUUID(), author: "coachee", body: txt, created_at: new Date().toISOString() }
    setMessages(m => [...m, optimistic])
    await fetch("/api/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: txt }),
    })
  }

  const feed = useMemo(() => buildFeed(messages), [messages])
  const lastIsMe = messages.length > 0 && messages[messages.length - 1].author === "coachee"

  if (!ready) return <div style={{ minHeight: "100svh", background: C.bg }} />

  return (
    <div style={{ height: "100svh", background: C.chassis, display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 440, height: "100svh", background: C.bg, display: "flex", flexDirection: "column" }}>

        {/* En-tête coach */}
        <div style={{ flexShrink: 0, background: C.bg, borderBottom: `1.5px solid ${C.line}`, padding: "14px 18px", display: "flex", alignItems: "center", gap: 13 }}>
          <div style={{ flexShrink: 0, width: 46, height: 46, borderRadius: 999, background: C.leaf, color: "#fff", fontFamily: "var(--heading)", fontWeight: 700, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>L</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--heading)", fontWeight: 700, fontSize: 20, color: C.ink, letterSpacing: "-0.01em", lineHeight: 1.05 }}>Laurent</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 2, fontFamily: "var(--label)", fontSize: 11.5, color: C.soft, fontWeight: 500 }}>
              <Ic name="clock" col={C.leaf} sw={1.9} s={13} />
              Écris-moi, je te réponds rapidement
            </div>
          </div>
        </div>

        {/* Fil */}
        <div ref={threadRef} style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: rgba(C.leaf, 0.1), border: `1.5px solid ${rgba(C.leaf, 0.3)}`, borderRadius: 14, padding: "11px 14px", fontSize: 12.5, color: C.leaf, fontWeight: 600, lineHeight: 1.45, textAlign: "center" }}>
            Ici c'est moi, Laurent — pas un robot. Écris-moi comme à un ami.
          </div>

          {feed.length === 0 && (
            <div style={{ textAlign: "center", padding: "32px 20px", color: C.soft }}>
              <div style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 16, color: C.ink, marginBottom: 4 }}>Pas encore de message</div>
              <div style={{ fontSize: 13.5 }}>Lance-toi — Laurent répond rapidement.</div>
            </div>
          )}

          {feed.map((item, i) =>
            "type" in item
              ? <DateSepRow key={item.key + i} label={item.label} />
              : <Bubble key={item.id} m={item} />
          )}

          {lastIsMe && (
            <div style={{ textAlign: "center", fontFamily: "var(--label)", fontSize: 11, color: C.soft, fontWeight: 500, padding: "2px 0 6px" }}>
              Envoyé · je te réponds rapidement
            </div>
          )}
        </div>

        {/* Saisie */}
        <div style={{ flexShrink: 0, background: C.bg, borderTop: `1.5px solid ${C.line}`, padding: "10px 14px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() } }}
              rows={1}
              placeholder="Écris-moi…"
              style={{ flex: 1, resize: "none", border: `1.5px solid ${C.line}`, background: C.surface, borderRadius: 22, padding: "12px 16px", fontFamily: "var(--sans)", fontSize: 15, color: C.ink, outline: "none", lineHeight: 1.4, maxHeight: 120 }}
            />
            <button onClick={send} disabled={!draft.trim()} aria-label="Envoyer" style={{
              flexShrink: 0, width: 46, height: 46, borderRadius: 999,
              border: draft.trim() ? "none" : `1.5px solid ${C.line}`,
              background: draft.trim() ? C.leaf : C.surface,
              color: draft.trim() ? "#fff" : C.soft,
              cursor: draft.trim() ? "pointer" : "default",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              transition: "all .15s",
            }}>
              <Ic name="send" col={draft.trim() ? "#fff" : C.soft} sw={1.9} s={22} />
            </button>
          </div>
        </div>

        <BottomTabs active="coach" currentDay={currentDay} />
      </div>
    </div>
  )
}
