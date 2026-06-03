"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/auth-context"
import {
  PROGRAM_NEW,
  PRINCIPLES_V2,
  PRINCIPLE_GROUPS,
  CHAPTER_FOR_DAY,
  calcCurrentDay,
} from "@/data/program"

// ─── Types ────────────────────────────────────────────────────────────────────

type JournalMessage = {
  id: string
  coachee_id: string
  author: "coachee" | "coach"
  body: string | null
  photo_url: string | null
  is_question: boolean
  read_by_coach: boolean
  read_by_user: boolean
  created_at: string
}

type WeightLog = {
  id: string
  coachee_id: string
  day_number: number
  kg: number
  created_at: string
}

type Profile = {
  id: string
  prenom: string | null
  program_start: string | null
  poids: number | null
  coach_id: string | null
}

type CoachNote = {
  coach_note: string | null
}

type Tab = "today" | "journal" | "meals" | "journey" | "principles"

type DailyCheckin = {
  id?: string
  user_id?: string
  day: number
  energie: number | null
  humeur: number | null
  sommeil: number | null
  created_at?: string
}

const TABS: { id: Tab; label: string }[] = [
  { id: "today",      label: "Aujourd'hui" },
  { id: "journal",    label: "Coach" },
  { id: "meals",      label: "Repas" },
  { id: "journey",    label: "Parcours" },
  { id: "principles", label: "Principes" },
]

const COACH = { name: "Laurent", initial: "L" }

const WELCOME_MESSAGE = (prenom: string) =>
  `Bonjour ${prenom}, je serai présent tout au long de ces 21 jours, tu peux me poser à tout moment des questions et aussi tes ressentis ou difficultés. Laurent`

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cap(s: string | null | undefined): string {
  if (!s) return ""
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

function todayLong(): string {
  return new Date().toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long",
  })
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
}

function formatDateLabel(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const isToday     = d.toDateString() === now.toDateString()
  const isYesterday = d.toDateString() === yesterday.toDateString()
  if (isToday)     return `Aujourd'hui · ${d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric" })}`
  if (isYesterday) return "Hier"
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
}

// ─── UI primitives ────────────────────────────────────────────────────────────

function Eyebrow({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{
      fontSize: 10.5, fontWeight: 500,
      letterSpacing: "0.16em", textTransform: "uppercase" as const,
      color: color ?? "var(--text-mute)",
    }}>{children}</div>
  )
}

function Avatar({ who, size = 26 }: { who: "coach" | "me"; size?: number }) {
  const isCoach = who === "coach"
  return (
    <div style={{
      width: size, height: size, borderRadius: 999, flexShrink: 0,
      background: isCoach ? "rgba(168,187,165,0.14)" : "rgba(236,228,210,0.08)",
      border: `1px solid ${isCoach ? "rgba(168,187,165,0.25)" : "rgba(236,228,210,0.12)"}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: isCoach ? "var(--coach)" : "var(--text-dim)",
      fontFamily: "var(--serif)", fontStyle: "italic",
      fontSize: size * 0.5, fontWeight: 400,
    }}>
      {isCoach ? COACH.initial : ""}
    </div>
  )
}

// ─── Mobile header ────────────────────────────────────────────────────────────

function AppHeader({ currentDay, prenom, onSignOut }: {
  currentDay: number
  prenom: string
  onSignOut: () => void
}) {
  const initial = prenom ? prenom.charAt(0).toUpperCase() : "?"
  return (
    <div className="mobile-header" style={{
      padding: "env(safe-area-inset-top, 44px) 22px 14px",
      paddingTop: "max(44px, env(safe-area-inset-top, 44px))",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      borderBottom: "1px solid var(--line-soft)", flexShrink: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar who="coach" size={28} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", lineHeight: 1.1 }}>{COACH.name}</div>
          <div style={{ fontSize: 11, color: "var(--text-mute)", marginTop: 2 }}>ta coach</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          fontFamily: "var(--serif)", fontStyle: "italic",
          fontSize: 13, color: "var(--text-mute)",
        }}>jour {currentDay}</div>
        <button
          onClick={onSignOut}
          title="Se déconnecter"
          style={{
            width: 28, height: 28, borderRadius: 999, flexShrink: 0,
            background: "rgba(236,228,210,0.08)",
            border: "1px solid rgba(236,228,210,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--text-dim)",
            fontFamily: "var(--serif)", fontStyle: "italic",
            fontSize: 13, fontWeight: 400,
            cursor: "pointer",
          }}
        >{initial}</button>
      </div>
    </div>
  )
}

// ─── Tab bar ──────────────────────────────────────────────────────────────────

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <div className="mobile-tabbar" style={{
      flexShrink: 0,
      padding: "10px 8px env(safe-area-inset-bottom, 12px)",
      borderTop: "1px solid var(--line-soft)",
      background: "color-mix(in oklab, var(--bg) 92%, transparent)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
    }}>
      <div style={{ display: "flex" }}>
        {TABS.map(t => {
          const on = active === t.id
          return (
            <button key={t.id} onClick={() => onChange(t.id)} style={{
              flex: 1, background: "transparent", border: 0, cursor: "pointer",
              padding: "10px 2px",
              fontFamily: "var(--sans)",
              fontSize: 11.5, fontWeight: on ? 500 : 400,
              color: on ? "var(--text)" : "var(--text-mute)",
              position: "relative",
              transition: "color .25s ease",
            }}>
              {t.label}
              <span style={{
                position: "absolute", left: "50%", transform: "translateX(-50%)",
                bottom: 0, width: on ? 16 : 0, height: 1,
                background: "var(--brand)", opacity: on ? 0.85 : 0,
                transition: "width .3s ease, opacity .3s ease",
                display: "block",
              }} />
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Side nav (desktop) ───────────────────────────────────────────────────────

function SideNav({ active, onChange, currentDay, prenom, onSignOut }: {
  active: Tab; onChange: (t: Tab) => void; currentDay: number
  prenom: string; onSignOut: () => void
}) {
  const logoUrl = process.env.NEXT_PUBLIC_LOGO_DARK_URL ?? ""
  return (
    <aside className="desktop-nav">
      {logoUrl
        ? <img src={logoUrl} alt="Back to Energy" className="dnav-logo" />
        : <div style={{ fontSize: 16, fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--text)", marginBottom: 28, paddingLeft: 8 }}>Back to Energy</div>
      }
      <div className="dnav-coach">
        <Avatar who="coach" size={36} />
        <div>
          <div className="dnav-coach-name">{COACH.name}</div>
          <div className="dnav-coach-role">ta coach</div>
        </div>
      </div>
      <hr className="dnav-rule" />
      <nav>
        <ul className="dnav-list">
          {TABS.map(t => (
            <li key={t.id}>
              <button
                className={"dnav-item" + (active === t.id ? " active" : "")}
                onClick={() => onChange(t.id)}
              >{t.label}</button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="dnav-spacer" />
      <div className="dnav-day">
        <div className="dnav-day-label">jour {currentDay}</div>
        <div className="dnav-day-meta">{todayLong()}</div>
      </div>
      <hr className="dnav-rule" />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0 2px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 999, flexShrink: 0,
            background: "rgba(236,228,210,0.08)",
            border: "1px solid rgba(236,228,210,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--text-dim)",
            fontFamily: "var(--serif)", fontStyle: "italic",
            fontSize: 12,
          }}>
            {prenom ? prenom.charAt(0).toUpperCase() : "?"}
          </div>
          <div style={{ fontSize: 12.5, color: "var(--text-dim)" }}>{cap(prenom)}</div>
        </div>
        <button
          onClick={onSignOut}
          style={{
            background: "transparent", border: 0, cursor: "pointer",
            fontSize: 11.5, color: "var(--text-faint)", fontFamily: "var(--sans)",
            padding: "4px 0",
          }}
        >Se déconnecter</button>
      </div>
    </aside>
  )
}

// ─── Screen 1 : Aujourd'hui ───────────────────────────────────────────────────

function TodayScreen({
  prenom,
  currentDay,
  coachNote,
  checkin,
  onOpenJournal,
  onOpenCheckin,
}: {
  prenom: string
  currentDay: number
  coachNote: string | null
  checkin: DailyCheckin | null
  onOpenJournal: () => void
  onOpenCheckin: () => void
}) {
  const prog = PROGRAM_NEW[currentDay - 1] ?? PROGRAM_NEW[0]

  return (
    <div className="scroll" style={{ flex: 1, overflowY: "auto", padding: "26px 22px 30px" }}>
      <Eyebrow>{todayLong()}</Eyebrow>
      <h1 style={{
        margin: "10px 0 0", fontFamily: "var(--serif)",
        fontWeight: 400, fontSize: 36, lineHeight: 1.05,
        letterSpacing: "-0.02em", color: "var(--text)",
      }}>
        Bonjour <em style={{ fontStyle: "italic", color: "var(--brand)" }}>{cap(prenom)}</em>.
      </h1>

      {coachNote && (
        <>
          <p style={{ margin: "12px 0 0", fontSize: 14.5, lineHeight: 1.55, color: "var(--text-dim)", maxWidth: "32ch" }}>
            {COACH.name} t'a laissé un mot ce matin.
          </p>
          <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--line)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <Avatar who="coach" size={26} />
              <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
                {COACH.name}
                <span style={{ color: "var(--text-faint)", margin: "0 6px" }}>·</span>
                <span style={{ color: "var(--text-mute)" }}>ce matin</span>
              </div>
            </div>
            <p style={{
              margin: 0,
              fontFamily: "var(--serif)", fontStyle: "italic",
              fontSize: 19, lineHeight: 1.45, color: "var(--text)",
              letterSpacing: "0.005em",
            }}>« {coachNote} »</p>
          </div>
        </>
      )}

      <div style={{ marginTop: coachNote ? 32 : 28 }}>
        <Eyebrow>aujourd'hui · les repas</Eyebrow>
        <div style={{ marginTop: 14 }}>
          {prog.meals.map((m, i) => (
            <div key={i} style={{
              display: "flex", gap: 16, alignItems: "baseline",
              padding: "13px 0",
              borderBottom: i < prog.meals.length - 1 ? "1px solid var(--line-soft)" : "none",
            }}>
              <div style={{
                fontFamily: "var(--serif)", fontStyle: "italic",
                fontSize: 13, color: "var(--text-mute)",
                width: 32, flexShrink: 0,
              }}>{m.time}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, color: "var(--text)", marginBottom: 3 }}>{m.label}</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.5 }}>{m.items}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CheckInCard checkin={checkin} onOpen={onOpenCheckin} />

      <button onClick={onOpenJournal} style={{
        marginTop: 14, width: "100%",
        background: "transparent",
        border: "1px solid var(--line)",
        borderRadius: 999,
        padding: "13px 20px",
        textAlign: "left",
        cursor: "pointer",
        display: "flex", alignItems: "center", gap: 12,
        fontFamily: "var(--sans)",
        color: "var(--text-dim)", fontSize: 13.5,
      }}>
        <PenIcon />
        <span style={{ flex: 1 }}>Comment tu te sens, là ?</span>
        <span style={{ color: "var(--text-faint)", fontSize: 16 }}>→</span>
      </button>
    </div>
  )
}

// ─── Screen 2 : Journal ───────────────────────────────────────────────────────

function JournalScreen({
  messages,
  prefill,
  onPrefillConsumed,
  onSend,
}: {
  messages: JournalMessage[]
  prefill: string
  onPrefillConsumed: () => void
  onSend: (body: string) => Promise<void>
}) {
  const [draft, setDraft] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  useEffect(() => {
    if (prefill) {
      setDraft(prefill)
      inputRef.current?.focus()
      onPrefillConsumed()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefill])

  const handleSend = async () => {
    const body = draft.trim()
    if (!body || sending) return
    setSending(true)
    setDraft("")
    await onSend(body)
    setSending(false)
  }

  const grouped: Array<{ type: "separator"; label: string } | { type: "msg"; msg: JournalMessage }> = []
  let lastDate = ""
  for (const msg of messages) {
    const dateKey = new Date(msg.created_at).toDateString()
    if (dateKey !== lastDate) {
      grouped.push({ type: "separator", label: formatDateLabel(msg.created_at) })
      lastDate = dateKey
    }
    grouped.push({ type: "msg", msg })
  }

  return (
    <>
      <div ref={scrollRef} className="scroll" style={{
        flex: 1, overflowY: "auto",
        padding: "22px 18px 14px",
        display: "flex", flexDirection: "column", gap: 14,
      }}>
        {/* En-tête coach */}
        <div style={{ marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 999, flexShrink: 0,
              background: "var(--brand-soft)",
              border: "1.5px solid var(--line)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--heading)", fontSize: 18, fontWeight: 700,
              color: "var(--forest)",
            }}>L</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", fontFamily: "var(--heading)" }}>
                Laurent
              </div>
              <div style={{ fontSize: 12, color: "var(--text-mute)", marginTop: 2 }}>
                Ton coach · répond dans la journée
              </div>
            </div>
          </div>

          {/* Bandeau d'intro fixe */}
          <div style={{
            padding: "12px 14px",
            background: "var(--bg-lift)",
            border: "1px solid var(--line)",
            borderRadius: 12,
            fontSize: 13, lineHeight: 1.6,
            color: "var(--text-dim)",
            fontStyle: "italic",
          }}>
            Je t'accompagne tout au long de ton parcours. Une question, une interrogation ? Dis-moi. Je suis à ton écoute.
          </div>
        </div>

        {grouped.map((item, i) => {
          if (item.type === "separator") {
            return (
              <div key={`sep-${i}`} style={{
                display: "flex", alignItems: "center", gap: 12,
                margin: "12px 0 4px",
              }}>
                <div style={{ flex: 1, height: 1, background: "var(--line-soft)" }} />
                <div style={{
                  fontSize: 11, color: "var(--text-mute)", fontStyle: "italic",
                }}>{item.label}</div>
                <div style={{ flex: 1, height: 1, background: "var(--line-soft)" }} />
              </div>
            )
          }
          return <JournalBubble key={item.msg.id} msg={item.msg} />
        })}
      </div>

      <div className="journal-composer" style={{
        flexShrink: 0,
        padding: "10px 14px 12px",
        borderTop: "1px solid var(--line-soft)",
        display: "flex", alignItems: "flex-end", gap: 8,
      }}>
        <div style={{
          flex: 1,
          background: "var(--bg-lift)",
          border: "1px solid var(--line)",
          borderRadius: 22,
          padding: "10px 14px",
          display: "flex", alignItems: "center",
        }}>
          <input
            ref={inputRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder="Écris à Laurent…"
            style={{
              flex: 1, background: "transparent", border: 0, outline: "none",
              color: "var(--text)", fontFamily: "var(--sans)", fontSize: 14,
            }}
          />
        </div>
        <IconBtn
          disabled={!draft.trim() || sending}
          onClick={handleSend}
          accent
          aria-label="Envoyer"
        >
          <ArrowUpIcon />
        </IconBtn>
      </div>
    </>
  )
}

function JournalBubble({ msg }: { msg: JournalMessage }) {
  const isCoach = msg.author === "coach"
  const isMe    = msg.author === "coachee"
  return (
    <div style={{
      display: "flex", gap: 10,
      flexDirection: isMe ? "row-reverse" : "row",
      alignItems: "flex-end",
    }}>
      {isCoach && (
        <div style={{
          width: 26, height: 26, borderRadius: 999, flexShrink: 0,
          background: "var(--brand-soft)",
          border: "1px solid var(--line)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--heading)", fontSize: 11, fontWeight: 700,
          color: "var(--forest)",
        }}>L</div>
      )}
      <div style={{
        maxWidth: "78%", display: "flex", flexDirection: "column", gap: 5,
        alignItems: isMe ? "flex-end" : "flex-start",
      }}>
        {msg.body && (
          <div style={{
            padding: "10px 14px",
            background: isCoach ? "var(--bg-lift)" : "var(--brand-soft)",
            border: isCoach ? "1px solid var(--line)" : "1px solid rgba(62,142,79,0.2)",
            borderRadius: 18,
            borderBottomLeftRadius: isCoach ? 6 : 18,
            borderBottomRightRadius: isMe ? 6 : 18,
            color: isCoach ? "var(--forest)" : "var(--text)",
            fontFamily: isCoach ? "var(--heading)" : "var(--sans)",
            fontStyle: isCoach ? "italic" : "normal",
            fontSize: isCoach ? 15 : 13.5,
            lineHeight: 1.6,
          }}>
            {msg.body}
          </div>
        )}
        <div style={{ fontSize: 10.5, color: "var(--text-faint)", padding: "0 6px" }}>
          {formatTime(msg.created_at)}
        </div>
      </div>
    </div>
  )
}

// ─── Screen 3 : Repas ─────────────────────────────────────────────────────────

function MealsScreen({ currentDay }: { currentDay: number }) {
  const [viewDay, setViewDay] = useState(currentDay)
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  const prog    = PROGRAM_NEW[viewDay - 1] ?? PROGRAM_NEW[0]
  const chapter = CHAPTER_FOR_DAY(viewDay)
  const isToday = viewDay === currentDay

  const go = (delta: number) => {
    const next = Math.max(1, Math.min(21, viewDay + delta))
    setViewDay(next)
    setOpenIdx(null)
  }

  return (
    <div className="scroll" style={{ flex: 1, overflowY: "auto", padding: "26px 22px 28px" }}>
      <Eyebrow>repas · {chapter.sub.toLowerCase()}</Eyebrow>
      <h2 style={{
        margin: "10px 0 0", fontFamily: "var(--serif)",
        fontWeight: 400, fontSize: 32, lineHeight: 1.1,
        letterSpacing: "-0.015em", color: "var(--text)",
      }}>
        Ce qui est <em style={{ fontStyle: "italic", color: "var(--brand)" }}>prévu</em>.
      </h2>
      <p style={{ margin: "10px 0 0", fontSize: 13.5, color: "var(--text-dim)", lineHeight: 1.55 }}>
        Laurent a composé tes repas selon le moment du parcours. Tu peux adapter selon ce que tu trouves.
      </p>

      {/* Day navigator */}
      <div style={{
        marginTop: 22,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 12, padding: "10px 12px",
        background: "var(--bg-lift)", border: "1px solid var(--line)", borderRadius: 14,
      }}>
        <NavBtn disabled={viewDay <= 1} onClick={() => go(-1)} aria-label="Jour précédent">
          <ChevronLeft />
        </NavBtn>
        <div style={{ textAlign: "center", flex: 1 }}>
          <div style={{
            fontFamily: "var(--serif)", fontStyle: "italic",
            fontSize: 17, color: isToday ? "var(--brand)" : "var(--text)", lineHeight: 1.15,
          }}>
            {isToday ? "Aujourd'hui · " : ""}jour {viewDay}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-mute)", marginTop: 3 }}>{chapter.sub}</div>
        </div>
        <NavBtn disabled={viewDay >= 21} onClick={() => go(1)} aria-label="Jour suivant">
          <ChevronRight />
        </NavBtn>
      </div>

      {/* Meals accordion */}
      <div style={{ marginTop: 20 }}>
        {prog.meals.map((m, i) => {
          const open = openIdx === i
          return (
            <div key={i} style={{
              borderTop: "1px solid var(--line)",
              borderBottom: i === prog.meals.length - 1 ? "1px solid var(--line)" : "none",
            }}>
              <button onClick={() => setOpenIdx(open ? null : i)} style={{
                width: "100%", background: "transparent", border: 0, cursor: "pointer",
                padding: "16px 2px",
                display: "flex", alignItems: "baseline", gap: 16,
                textAlign: "left",
              }}>
                <span style={{
                  fontFamily: "var(--serif)", fontStyle: "italic",
                  fontSize: 14, color: "var(--text-mute)", width: 36, flexShrink: 0,
                }}>{m.time}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, color: "var(--text)", marginBottom: 4 }}>{m.label}</div>
                  <div style={{
                    fontSize: 12.5, color: "var(--text-dim)", lineHeight: 1.5,
                    display: "-webkit-box", WebkitLineClamp: open ? "unset" : "2",
                    WebkitBoxOrient: "vertical" as const, overflow: "hidden",
                  }}>{m.items}</div>
                </div>
                <span style={{
                  color: "var(--text-faint)", fontSize: 11,
                  transform: open ? "rotate(180deg)" : "rotate(0)",
                  transition: "transform .25s ease",
                }}>▾</span>
              </button>
              {open && (
                <div style={{ padding: "0 2px 18px 54px", display: "flex", flexDirection: "column", gap: 10 }}>
                  {m.alts && m.alts.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {m.alts.map((alt, ai) => (
                        <p key={ai} style={{
                          margin: 0, fontSize: 12.5,
                          fontFamily: "var(--serif)", fontStyle: "italic",
                          color: "var(--coach)", lineHeight: 1.55,
                        }}>{alt}</p>
                      ))}
                    </div>
                  )}
                  {m.note && (
                    <div style={{
                      background: "var(--bg-lift)", border: "1px solid var(--line)",
                      borderRadius: 10, padding: "10px 12px",
                    }}>
                      <p style={{ margin: 0, fontSize: 12, color: "var(--text-dim)", lineHeight: 1.55 }}>{m.note}</p>
                    </div>
                  )}
                  {isToday && (
                    <button style={{
                      background: "transparent", border: 0, cursor: "pointer",
                      padding: "4px 0", textAlign: "left",
                      color: "var(--brand)", fontSize: 12.5,
                      fontFamily: "var(--serif)", fontStyle: "italic",
                    }}>
                      Noter ce que j'ai mangé →
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Shopping list card */}
      <div style={{ marginTop: 26, padding: "16px 18px", border: "1px solid var(--line)", borderRadius: 16 }}>
        <Eyebrow>liste de courses · semaine</Eyebrow>
        <p style={{ margin: "8px 0 12px", fontSize: 13, color: "var(--text-dim)", lineHeight: 1.55 }}>
          Tu peux la consulter ou l'envoyer à toi-même.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <PillBtn>Voir la liste</PillBtn>
          <PillBtn>M'envoyer</PillBtn>
        </div>
      </div>
    </div>
  )
}

// ─── Screen 4 : Parcours ──────────────────────────────────────────────────────

const JOURNEY_CHAPTERS = [
  { name: "Détox",   span: 7, hint: "On allège, on laisse le corps souffler.",       start: 1  },
  { name: "Énergie", span: 7, hint: "Le corps retrouve son rythme, on remet du jeu.", start: 8  },
  { name: "Ancrage", span: 7, hint: "On installe ce qui restera après.",              start: 15 },
]

function dayDate(programStart: string | null, dayNumber: number): string {
  if (!programStart) return `j${dayNumber}`
  const d = new Date(programStart)
  d.setDate(d.getDate() + dayNumber - 1)
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
}

function JourneyScreen({
  currentDay,
  programStart,
  weights,
  recentMessages,
  onLogWeight,
}: {
  currentDay: number
  programStart: string | null
  weights: WeightLog[]
  recentMessages: JournalMessage[]
  onLogWeight: () => void
}) {
  const first   = weights[0]
  const last    = weights[weights.length - 1]
  const hasWeight = weights.length > 0

  const deltaNum = hasWeight ? last.kg - first.kg : 0
  const deltaStr = (deltaNum < 0 ? "−" : "+") + Math.abs(deltaNum).toFixed(1).replace(".", ",")
  const isLoss   = deltaNum < 0

  const maxKg = hasWeight ? Math.max(...weights.map(w => w.kg)) : 0
  const minKg = hasWeight ? Math.min(...weights.map(w => w.kg)) : 0
  const range = Math.max(0.5, maxKg - minKg)

  return (
    <div className="scroll" style={{ flex: 1, overflowY: "auto", padding: "26px 22px 28px" }}>
      <Eyebrow>parcours · {currentDay} {currentDay > 1 ? "jours" : "jour"} derrière toi</Eyebrow>
      <h2 style={{
        margin: "10px 0 0", fontFamily: "var(--serif)",
        fontWeight: 400, fontSize: 32, lineHeight: 1.1,
        letterSpacing: "-0.015em", color: "var(--text)",
      }}>
        Tu en es <em style={{ fontStyle: "italic", color: "var(--brand)" }}>là</em>.
      </h2>
      <p style={{ margin: "10px 0 0", fontSize: 13.5, color: "var(--text-dim)", lineHeight: 1.55, maxWidth: "32ch" }}>
        Pas de score, pas de pourcentage. Juste les jours qui passent et ce qui s'est dit en chemin.
      </p>

      {/* Timeline */}
      <div style={{ marginTop: 30 }}>
        {JOURNEY_CHAPTERS.map((ch, ci) => (
          <div key={ci} style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
              <div>
                <div style={{
                  fontFamily: "var(--serif)", fontStyle: "italic",
                  fontSize: 18, color: "var(--text)", letterSpacing: "-0.005em",
                }}>{ch.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-mute)", marginTop: 4 }}>{ch.hint}</div>
              </div>
              <div style={{ fontSize: 11, color: "var(--text-faint)" }}>
                {ch.start}–{ch.start + ch.span - 1}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {Array.from({ length: ch.span }).map((_, di) => {
                const day     = ch.start + di
                const past    = day < currentDay
                const current = day === currentDay
                const future  = day > currentDay
                return (
                  <div key={di} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{
                      width: current ? 14 : 8, height: current ? 14 : 8,
                      borderRadius: 999,
                      background: current ? "var(--brand)" : past ? "rgba(168,187,165,0.45)" : "transparent",
                      border: future ? "1px solid var(--line)" : "none",
                      boxShadow: current ? "0 0 0 5px var(--brand-soft)" : "none",
                      transition: "all .3s ease",
                    }} />
                    <div style={{
                      fontSize: 8.5,
                      color: current ? "var(--brand)" : "var(--text-faint)",
                      whiteSpace: "nowrap" as const,
                    }}>{dayDate(programStart, day)}</div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Poids */}
      <div style={{ marginTop: 8, paddingTop: 22, borderTop: "1px solid var(--line)" }}>
        <Eyebrow>ton poids</Eyebrow>
        {hasWeight ? (
          <>
            <div style={{ marginTop: 14, display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{
                  fontFamily: "var(--serif)", fontSize: 36, fontWeight: 400,
                  letterSpacing: "-0.015em", lineHeight: 1, color: "var(--text)",
                }}>{last.kg.toFixed(1).replace(".", ",")}</span>
                <span style={{ fontSize: 13, color: "var(--text-mute)" }}>kg</span>
              </div>
              <div style={{
                fontFamily: "var(--serif)", fontStyle: "italic",
                fontSize: 13, color: isLoss ? "var(--coach)" : "var(--text-mute)",
              }}>
                {deltaStr} kg depuis le départ
              </div>
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 14, alignItems: "flex-end", height: 38 }}>
              {weights.map((w, i) => {
                const fromTop = (maxKg - w.kg) / range
                const barH = 6 + (1 - fromTop) * 28
                const isLast = i === weights.length - 1
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                    <div style={{
                      width: "100%", height: barH,
                      background: isLast ? "var(--brand)" : "rgba(168,187,165,0.28)",
                      borderRadius: 2,
                    }} />
                    <div style={{ fontSize: 8.5, color: isLast ? "var(--brand)" : "var(--text-faint)" }}>
                      {dayDate(programStart, w.day_number)}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <p style={{ marginTop: 10, fontSize: 13, color: "var(--text-mute)" }}>
            Pas encore de pesée enregistrée.
          </p>
        )}
        <button onClick={onLogWeight} style={{
          marginTop: 14, background: "transparent", border: 0, cursor: "pointer",
          padding: 0, textAlign: "left", color: "var(--brand)",
          fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13,
        }}>
          Noter mon poids ce matin →
        </button>
      </div>

      {/* Ce qui s'est dit */}
      {recentMessages.length > 0 && (
        <div style={{ marginTop: 16, paddingTop: 22, borderTop: "1px solid var(--line)" }}>
          <Eyebrow>ce qui s'est dit jusqu'ici</Eyebrow>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 18 }}>
            {recentMessages.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{
                  fontFamily: "var(--serif)", fontStyle: "italic",
                  fontSize: 12, color: "var(--text-mute)", width: 36, flexShrink: 0,
                  paddingTop: 2,
                }}>
                  j {calcDayFromDate(m.created_at)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: m.author === "coach" ? 14 : 13,
                    color: m.author === "coach" ? "var(--coach)" : "var(--text-dim)",
                    fontFamily: m.author === "coach" ? "var(--serif)" : "var(--sans)",
                    fontStyle: m.author === "coach" ? "italic" : "normal",
                    lineHeight: 1.55,
                  }}>{m.body}</div>
                  <div style={{ fontSize: 10.5, color: "var(--text-faint)", marginTop: 4 }}>
                    {m.author === "coach" ? COACH.name : "Toi"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function calcDayFromDate(iso: string): number {
  // Approximation côté client — pour affichage uniquement
  const d = new Date(iso)
  const now = new Date()
  const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(1, diff + 1)
}

// ─── Screen 5 : Principes ─────────────────────────────────────────────────────

function PrinciplesScreen({ onAskCoach }: { onAskCoach: () => void }) {
  return (
    <div className="scroll" style={{ flex: 1, overflowY: "auto", padding: "26px 22px 28px" }}>
      <Eyebrow>principes · les repères de la méthode</Eyebrow>
      <h2 style={{
        margin: "10px 0 0", fontFamily: "var(--serif)",
        fontWeight: 400, fontSize: 32, lineHeight: 1.1,
        letterSpacing: "-0.015em", color: "var(--text)",
      }}>
        Ce qui <em style={{ fontStyle: "italic", color: "var(--brand)" }}>guide</em> le programme.
      </h2>
      <p style={{ margin: "10px 0 0", fontSize: 13.5, color: "var(--text-dim)", lineHeight: 1.6, maxWidth: "34ch" }}>
        Pas des règles, plutôt des points d'appui. Tu les suis dans le sens qui te va, Laurent adapte avec toi.
      </p>

      {/* Carte Verissimo */}
      <div style={{
        marginTop: 28, padding: "22px 22px 24px",
        background: "var(--bg-lift)", border: "1px solid var(--line)", borderRadius: 16,
      }}>
        <Eyebrow>la méthode</Eyebrow>
        <div style={{
          marginTop: 8, fontFamily: "var(--serif)",
          fontStyle: "italic", fontSize: 24, color: "var(--text)", letterSpacing: "-0.005em",
        }}>Verissimo</div>
        <p style={{ margin: "10px 0 0", fontSize: 13.5, color: "var(--text-dim)", lineHeight: 1.65 }}>
          Pensée par le naturopathe Jean-Pierre Verissimo, c'est une manière de manger qui respecte le rythme de la digestion — pas un régime, pas une cure. Les points qui suivent en sont les repères, vérifiés sur plusieurs décennies d'accompagnement.
        </p>
      </div>

      {/* 3 groupes */}
      <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 32 }}>
        {PRINCIPLE_GROUPS.map((group, gi) => (
          <section key={group.name} style={{
            paddingTop: gi > 0 ? 28 : 0,
            borderTop: gi > 0 ? "1px solid var(--line-soft)" : "none",
          }}>
            <div style={{ marginBottom: 18 }}>
              <Eyebrow>{group.name}</Eyebrow>
              <div style={{
                fontFamily: "var(--serif)", fontStyle: "italic",
                fontSize: 14.5, color: "var(--text-dim)", marginTop: 6,
              }}>{group.hint}</div>
            </div>
            <div>
              {group.principleIds.map((id, idx) => {
                const p = PRINCIPLES_V2.find(x => x.n === id)
                if (!p) return null
                return (
                  <div key={p.n} style={{
                    display: "flex", gap: 18, alignItems: "flex-start",
                    padding: "18px 0",
                    borderBottom: idx < group.principleIds.length - 1 ? "1px solid var(--line-soft)" : "none",
                  }}>
                    <div style={{
                      fontFamily: "var(--serif)", fontStyle: "italic",
                      fontSize: 22, color: "var(--text-faint)",
                      width: 28, flexShrink: 0, lineHeight: 1, paddingTop: 4,
                    }}>{p.n}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 14.5, fontWeight: 500, marginBottom: 6,
                        color: "rgb(210,236,212)",
                      }}>{p.title}</div>
                      <p style={{ margin: 0, fontSize: 13, color: "var(--text-dim)", lineHeight: 1.65 }}>{p.body}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Poser une question */}
      <div style={{
        marginTop: 28, padding: "22px 20px",
        background: "var(--accent-soft)", border: "1px solid rgba(168,187,165,0.22)",
        borderRadius: 16,
      }}>
        <p style={{
          margin: 0, fontFamily: "var(--serif)", fontStyle: "italic",
          fontSize: 16, lineHeight: 1.5, color: "var(--coach)",
        }}>
          « Une question là-dessus ? Écris-moi, je te réponds dans la journée. »
        </p>
        <p style={{ margin: "8px 0 16px", fontSize: 12, color: "var(--text-mute)" }}>— Laurent</p>
        <button onClick={onAskCoach} style={{
          background: "transparent",
          border: "1px solid rgba(62,142,79,0.35)",
          borderRadius: 999, padding: "10px 18px",
          color: "var(--brand)", fontSize: 13, fontFamily: "var(--sans)",
          cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8,
        }}>
          Écrire à Laurent <span style={{ fontSize: 14 }}>→</span>
        </button>
      </div>
    </div>
  )
}

// ─── Check-in modal ───────────────────────────────────────────────────────────

// 3 états par dimension — stockés comme 1 / 3 / 5 dans journal_entries
const CHECKIN_OPTIONS: Record<string, { val: number; label: string }[]> = {
  energie: [
    { val: 1, label: "À plat"   },
    { val: 3, label: "Correct"  },
    { val: 5, label: "Au top"   },
  ],
  humeur: [
    { val: 1, label: "Difficile" },
    { val: 3, label: "Ça va"     },
    { val: 5, label: "Légère"    },
  ],
  sommeil: [
    { val: 1, label: "Agité"   },
    { val: 3, label: "Correct" },
    { val: 5, label: "Profond" },
  ],
}

function checkinLabel(key: string, val: number | null): string {
  if (!val) return "—"
  return CHECKIN_OPTIONS[key]?.find(o => o.val === val)?.label ?? "—"
}

function TriRow({
  label, value, onChange,
}: { label: string; value: number | null; onChange: (v: number) => void }) {
  const opts = CHECKIN_OPTIONS[label] ?? []
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{
        fontSize: 10.5, fontWeight: 500, letterSpacing: "0.14em",
        textTransform: "uppercase" as const, color: "var(--text-mute)", marginBottom: 8,
      }}>{label}</div>
      <div style={{ display: "flex", gap: 8 }}>
        {opts.map(o => {
          const active = value === o.val
          return (
            <button key={o.val} onClick={() => onChange(o.val)} style={{
              flex: 1, height: 44, borderRadius: 12, cursor: "pointer",
              background: active ? "var(--brand-soft)" : "var(--bg-lift)",
              border: `1px solid ${active ? "rgba(92,181,81,0.45)" : "var(--line)"}`,
              color: active ? "var(--brand)" : "var(--text-dim)",
              fontFamily: "var(--sans)", fontSize: 13, fontWeight: active ? 500 : 400,
              transition: "all .15s ease",
            }}>{o.label}</button>
          )
        })}
      </div>
    </div>
  )
}

function CheckInModal({
  currentDay,
  lastWeight,
  existing,
  onSave,
  onClose,
}: {
  currentDay: number
  lastWeight: number | null
  existing: DailyCheckin | null
  onSave: (w: number | null, c: Omit<DailyCheckin, "day">) => Promise<void>
  onClose: () => void
}) {
  const [kg, setKg]         = useState(lastWeight?.toFixed(1) ?? "")
  const [energie, setEnergie] = useState<number | null>(existing?.energie ?? null)
  const [humeur, setHumeur]   = useState<number | null>(existing?.humeur ?? null)
  const [sommeil, setSommeil] = useState<number | null>(existing?.sommeil ?? null)
  const [saving, setSaving]   = useState(false)

  const handleSave = async () => {
    setSaving(true)
    const w = kg.trim() ? parseFloat(kg.replace(",", ".")) : null
    await onSave(w && !isNaN(w) ? w : null, { energie, humeur, sommeil })
    setSaving(false)
    onClose()
  }

  const anyFilled = kg.trim() || energie || humeur || sommeil

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      background: "rgba(21,19,14,0.7)", backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: 480,
        background: "var(--bg-surface)",
        border: "1px solid var(--line)",
        borderBottom: "none",
        borderRadius: "20px 20px 0 0",
        padding: "28px 24px max(env(safe-area-inset-bottom, 16px), 24px)",
      }}>
        {/* Handle */}
        <div style={{ width: 36, height: 3, borderRadius: 2, background: "var(--line)", margin: "0 auto 24px" }} />

        <Eyebrow>{todayLong()}</Eyebrow>
        <h3 style={{
          margin: "8px 0 24px", fontFamily: "var(--serif)",
          fontWeight: 400, fontSize: 26, lineHeight: 1.1,
          letterSpacing: "-0.015em", color: "var(--text)",
        }}>
          Comment tu te <em style={{ fontStyle: "italic", color: "var(--brand)" }}>ressens</em> ?
        </h3>

        {/* Poids */}
        <div style={{ marginBottom: 26 }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "var(--text-mute)", marginBottom: 10 }}>
            poids
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="number"
              inputMode="decimal"
              placeholder="—"
              value={kg}
              onChange={e => setKg(e.target.value)}
              style={{
                width: 100, height: 44, borderRadius: 10,
                background: "var(--bg-lift)", border: "1px solid var(--line)",
                color: "var(--text)", fontFamily: "var(--sans)", fontSize: 20,
                textAlign: "center", outline: "none",
                appearance: "textfield",
              }}
            />
            <span style={{ fontSize: 13, color: "var(--text-mute)" }}>kg</span>
            {lastWeight && (
              <span style={{ fontSize: 12, color: "var(--text-faint)", marginLeft: 4 }}>
                hier · {lastWeight.toFixed(1).replace(".", ",")} kg
              </span>
            )}
          </div>
        </div>

        <TriRow label="energie" value={energie} onChange={setEnergie} />
        <TriRow label="humeur"  value={humeur}  onChange={setHumeur}  />
        <TriRow label="sommeil" value={sommeil} onChange={setSommeil} />

        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button onClick={onClose} style={{
            flex: 1, height: 46, borderRadius: 999,
            background: "transparent", border: "1px solid var(--line)",
            color: "var(--text-dim)", fontSize: 14, fontFamily: "var(--sans)",
            cursor: "pointer",
          }}>Annuler</button>
          <button onClick={handleSave} disabled={!anyFilled || saving} style={{
            flex: 2, height: 46, borderRadius: 999,
            background: anyFilled ? "var(--brand)" : "var(--bg-lift)",
            border: "none",
            color: anyFilled ? "#fff" : "var(--text-faint)",
            fontSize: 14, fontFamily: "var(--sans)", fontWeight: 500,
            cursor: anyFilled ? "pointer" : "default",
            transition: "background .2s ease",
          }}>{saving ? "Enregistrement…" : "Enregistrer"}</button>
        </div>
      </div>
    </div>
  )
}

// ─── CheckIn summary card (Today screen) ─────────────────────────────────────

function CheckInCard({
  checkin,
  onOpen,
}: { checkin: DailyCheckin | null; onOpen: () => void }) {
  const done = checkin && (checkin.energie || checkin.humeur || checkin.sommeil)
  return (
    <div
      onClick={onOpen}
      style={{
        marginTop: 20, padding: "16px 18px",
        background: "var(--bg-lift)", border: "1px solid var(--line)", borderRadius: 14,
        cursor: "pointer", transition: "border-color .2s ease",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
      }}
    >
      <div>
        <Eyebrow>{done ? "check-in enregistré" : "check-in du matin"}</Eyebrow>
        {done ? (
          <div style={{ marginTop: 8, display: "flex", gap: 16, flexWrap: "wrap" as const }}>
            {[
              { k: "Énergie", key: "energie", v: checkin.energie },
              { k: "Humeur",  key: "humeur",  v: checkin.humeur  },
              { k: "Sommeil", key: "sommeil", v: checkin.sommeil  },
            ].filter(x => x.v).map(x => (
              <div key={x.k}>
                <div style={{ fontSize: 9.5, color: "var(--text-faint)", letterSpacing: "0.12em", textTransform: "uppercase" as const }}>{x.k}</div>
                <div style={{ fontSize: 14, fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--text)", marginTop: 3 }}>
                  {checkinLabel(x.key, x.v)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--text-mute)" }}>
            Poids · énergie · humeur · sommeil
          </p>
        )}
      </div>
      <span style={{ color: "var(--text-faint)", fontSize: 16, flexShrink: 0 }}>→</span>
    </div>
  )
}

// ─── Icon components ──────────────────────────────────────────────────────────

function PenIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M3 21l4-1 11-11-3-3L4 17l-1 4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}
function PhotoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="17" cy="8.5" r="0.7" fill="currentColor" />
    </svg>
  )
}
function ArrowUpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function ChevronLeft() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function ChevronRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconBtn({ children, accent, disabled, onClick, "aria-label": ariaLabel }: {
  children: React.ReactNode; accent?: boolean; disabled?: boolean
  onClick?: () => void; "aria-label"?: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      style={{
        width: 38, height: 38, borderRadius: 999,
        background: accent ? "var(--accent-soft)" : "transparent",
        border: `1px solid ${accent ? "rgba(168,187,165,0.3)" : "var(--line)"}`,
        color: accent ? "var(--accent)" : "var(--text-dim)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "all .2s ease", flexShrink: 0,
      }}
    >{children}</button>
  )
}

function NavBtn({ children, disabled, onClick, "aria-label": ariaLabel }: {
  children: React.ReactNode; disabled?: boolean; onClick: () => void; "aria-label"?: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      style={{
        width: 32, height: 32, borderRadius: 999,
        background: "transparent", border: "1px solid var(--line)",
        color: disabled ? "var(--text-faint)" : "var(--text-dim)",
        cursor: disabled ? "default" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}
    >{children}</button>
  )
}

function PillBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{
      background: "transparent", border: "1px solid var(--line)",
      borderRadius: 999, padding: "8px 14px",
      color: "var(--text-dim)", fontSize: 12.5, fontFamily: "var(--sans)",
      cursor: "pointer",
    }}>{children}</button>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const supabase = createClient()

  const [tab, setTab]             = useState<Tab>("today")
  const [profile, setProfile]     = useState<Profile | null>(null)
  const [coachNote, setCoachNote] = useState<string | null>(null)
  const [messages, setMessages]   = useState<JournalMessage[]>([])
  const [weights, setWeights]     = useState<WeightLog[]>([])
  const [journalPrefill, setJournalPrefill] = useState("")
  const [loading, setLoading]     = useState(true)
  const [showCheckin, setShowCheckin] = useState(false)
  const [todayCheckin, setTodayCheckin] = useState<DailyCheckin | null>(null)

  const currentDay = profile?.program_start
    ? calcCurrentDay(profile.program_start)
    : 1

  // ── Data fetching ─────────────────────────────────────────────────────────

  const fetchAll = useCallback(async () => {
    if (!user) return
    setLoading(true)

    const [profileRes, messagesRes, weightsRes] = await Promise.all([
      supabase.from("profiles")
        .select("id, prenom, program_start, poids, coach_id")
        .eq("id", user.id)
        .maybeSingle(),
      supabase.from("journal_messages")
        .select("*")
        .eq("coachee_id", user.id)
        .order("created_at", { ascending: true }),
      supabase.from("weight_logs")
        .select("*")
        .eq("coachee_id", user.id)
        .order("day_number", { ascending: true }),
    ])

    // Today's check-in (journal_entries for current day)
    if (profileRes.data?.program_start) {
      const day = calcCurrentDay(profileRes.data.program_start)
      const checkinRes = await supabase.from("journal_entries")
        .select("id, user_id, day, energie, humeur, sommeil, created_at")
        .eq("user_id", user.id)
        .eq("day", day)
        .maybeSingle()
      setTodayCheckin(checkinRes.data as DailyCheckin | null)
    }

    if (profileRes.data) {
      setProfile(profileRes.data as Profile)
      const day = calcCurrentDay(profileRes.data.program_start)

      // Coach morning note for today
      const noteRes = await supabase.from("program_overrides")
        .select("coach_note")
        .eq("collaborateur_id", user.id)
        .eq("day", day)
        .maybeSingle()
      setCoachNote((noteRes.data as CoachNote | null)?.coach_note ?? null)
    }

    const loadedMessages = (messagesRes.data ?? []) as JournalMessage[]

    // Message d'accueil : inséré une seule fois si le fil est vide
    if (loadedMessages.length === 0 && profileRes.data?.prenom) {
      const welcomeBody = WELCOME_MESSAGE(profileRes.data.prenom)
      const { data: inserted } = await supabase.from("journal_messages").insert({
        coachee_id: user.id,
        author: "coach",
        body: welcomeBody,
        is_question: false,
        read_by_coach: true,
        read_by_user: false,
      }).select().maybeSingle()
      if (inserted) loadedMessages.push(inserted as JournalMessage)
    }

    setMessages(loadedMessages)
    if (weightsRes.data)  setWeights(weightsRes.data as WeightLog[])

    setLoading(false)
  }, [user, supabase])

  useEffect(() => { fetchAll() }, [fetchAll])

  // Garde-fou : rediriger si la session expire pendant la navigation
  useEffect(() => {
    if (!loading && !user) window.location.replace("/")
  }, [loading, user])

  // ── Realtime journal ──────────────────────────────────────────────────────

  useEffect(() => {
    if (!user) return
    const channel = supabase
      .channel("journal_messages")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "journal_messages",
        filter: `coachee_id=eq.${user.id}`,
      }, payload => {
        setMessages(prev => [...prev, payload.new as JournalMessage])
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [user, supabase])

  // ── Send journal message ──────────────────────────────────────────────────

  const handleSend = async (body: string) => {
    if (!user || !profile) return
    await supabase.from("journal_messages").insert({
      coachee_id: user.id,
      author: "coachee",
      body,
      is_question: false,
      read_by_coach: false,
      read_by_user: true,
    })
  }

  // Marquer les messages coach comme lus quand l'onglet Coach s'ouvre
  const markCoachMessagesRead = useCallback(async () => {
    if (!user) return
    await supabase
      .from("journal_messages")
      .update({ read_by_user: true })
      .eq("coachee_id", user.id)
      .eq("author", "coach")
      .eq("read_by_user", false)
  }, [user, supabase])

  // ── Trigger chapter emails on first visit per day ─────────────────────────

  useEffect(() => {
    if (!user || !profile?.program_start) return
    const day = calcCurrentDay(profile.program_start)
    const key = `btenergy_chapter_email_${day}`
    if (localStorage.getItem(key)) return
    fetch("/api/send-step-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ day }),
    })
      .then(r => r.json())
      .then(d => { if (d.ok) localStorage.setItem(key, "1") })
      .catch(() => {})
  }, [user, profile])

  // ── Navigation helpers ────────────────────────────────────────────────────

  // ── Save daily check-in ───────────────────────────────────────────────────

  const handleSaveCheckin = async (
    w: number | null,
    checkin: Omit<DailyCheckin, "day">,
  ) => {
    if (!user) return
    const day = currentDay

    if (w !== null) {
      await supabase.from("weight_logs").upsert(
        { coachee_id: user.id, day_number: day, kg: w },
        { onConflict: "coachee_id,day_number" },
      )
      setWeights(prev => {
        const next = prev.filter(x => x.day_number !== day)
        return [...next, { id: "", coachee_id: user.id, day_number: day, kg: w, created_at: new Date().toISOString() }]
          .sort((a, b) => a.day_number - b.day_number)
      })
    }

    if (checkin.energie || checkin.humeur || checkin.sommeil) {
      const { data } = await supabase.from("journal_entries").upsert(
        { user_id: user.id, day, energie: checkin.energie, humeur: checkin.humeur, sommeil: checkin.sommeil },
        { onConflict: "user_id,day" },
      ).select().maybeSingle()
      if (data) setTodayCheckin(data as DailyCheckin)
    }
  }

  const goToJournal = (prefill?: string) => {
    if (prefill) setJournalPrefill(prefill)
    setTab("journal")
    markCoachMessagesRead()
  }

  const clearPrefill = () => setJournalPrefill("")

  if (loading) {
    return (
      <div style={{
        height: "100dvh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--bg)", color: "var(--text-mute)", fontFamily: "var(--sans)", fontSize: 13,
      }}>
        Chargement…
      </div>
    )
  }

  const prenom = profile?.prenom ?? ""
  const recentJourneyMessages = messages.slice(-5)

  return (
    <div className="app-root web">
      <SideNav active={tab} onChange={setTab} currentDay={currentDay} prenom={prenom} onSignOut={signOut} />

      <AppHeader currentDay={currentDay} prenom={prenom} onSignOut={signOut} />

      <div className="app-main" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {tab === "today" && (
          <TodayScreen
            prenom={prenom}
            currentDay={currentDay}
            coachNote={coachNote}
            checkin={todayCheckin}
            onOpenJournal={() => goToJournal()}
            onOpenCheckin={() => setShowCheckin(true)}
          />
        )}
        {tab === "journal" && (
          <JournalScreen
            messages={messages}
            prefill={journalPrefill}
            onPrefillConsumed={clearPrefill}
            onSend={handleSend}
          />
        )}
        {/* Marquer lu à l'ouverture du tab journal via TabBar */}
        {tab === "meals" && (
          <MealsScreen currentDay={currentDay} />
        )}
        {tab === "journey" && (
          <JourneyScreen
            currentDay={currentDay}
            programStart={profile?.program_start ?? null}
            weights={weights}
            recentMessages={recentJourneyMessages}
            onLogWeight={() => setShowCheckin(true)}
          />
        )}
        {tab === "principles" && (
          <PrinciplesScreen
            onAskCoach={() => goToJournal("J'ai une question à propos de… ")}
          />
        )}
      </div>

      <TabBar active={tab} onChange={(t) => { setTab(t); if (t === "journal") markCoachMessagesRead() }} />

      {showCheckin && (
        <CheckInModal
          currentDay={currentDay}
          lastWeight={weights.length ? weights[weights.length - 1].kg : (profile?.poids ?? null)}
          existing={todayCheckin}
          onSave={handleSaveCheckin}
          onClose={() => setShowCheckin(false)}
        />
      )}
    </div>
  )
}
