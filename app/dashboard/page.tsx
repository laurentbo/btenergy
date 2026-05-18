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

const TABS: { id: Tab; label: string }[] = [
  { id: "today",      label: "Aujourd'hui" },
  { id: "journal",    label: "Journal" },
  { id: "meals",      label: "Repas" },
  { id: "journey",    label: "Parcours" },
  { id: "principles", label: "Principes" },
]

const COACH = { name: "Camille", initial: "C" }

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

function AppHeader({ currentDay }: { currentDay: number }) {
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
      <div style={{
        fontFamily: "var(--serif)", fontStyle: "italic",
        fontSize: 13, color: "var(--text-mute)",
      }}>jour {currentDay}</div>
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

function SideNav({ active, onChange, currentDay }: {
  active: Tab; onChange: (t: Tab) => void; currentDay: number
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
    </aside>
  )
}

// ─── Screen 1 : Aujourd'hui ───────────────────────────────────────────────────

function TodayScreen({
  prenom,
  currentDay,
  coachNote,
  onOpenJournal,
}: {
  prenom: string
  currentDay: number
  coachNote: string | null
  onOpenJournal: () => void
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

      <button onClick={onOpenJournal} style={{
        marginTop: 28, width: "100%",
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
  onSend: (body: string, isQuestion: boolean) => Promise<void>
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
    await onSend(body, body.toLowerCase().startsWith("j'ai une question"))
    setSending(false)
  }

  // Group messages by date for day separators
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
        <div style={{ marginBottom: 6 }}>
          <Eyebrow>journal partagé</Eyebrow>
          <div style={{
            fontFamily: "var(--serif)",
            fontSize: 26, lineHeight: 1.15, marginTop: 8,
            color: "var(--text)", letterSpacing: "-0.01em",
          }}>
            Toi et <em style={{ color: "var(--coach)", fontStyle: "italic" }}>{COACH.name}</em>.
          </div>
          <div style={{ fontSize: 12, color: "var(--text-mute)", marginTop: 6 }}>
            Ce qui est noté ici reste entre vous deux.
          </div>
        </div>

        {messages.length === 0 && (
          <div style={{ textAlign: "center", paddingTop: 48, color: "var(--text-faint)", fontSize: 13 }}>
            Commence à écrire — {COACH.name} te répond dans la journée.
          </div>
        )}

        {grouped.map((item, i) => {
          if (item.type === "separator") {
            return (
              <div key={`sep-${i}`} style={{
                display: "flex", alignItems: "center", gap: 12,
                margin: "12px 0 4px",
              }}>
                <div style={{ flex: 1, height: 1, background: "var(--line-soft)" }} />
                <div style={{
                  fontFamily: "var(--serif)", fontStyle: "italic",
                  fontSize: 12, color: "var(--text-mute)",
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
        <IconBtn aria-label="Ajouter une photo">
          <PhotoIcon />
        </IconBtn>
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
            placeholder="un mot, une photo, rien…"
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
      {isCoach && <Avatar who="coach" size={26} />}
      <div style={{
        maxWidth: "78%", display: "flex", flexDirection: "column", gap: 5,
        alignItems: isMe ? "flex-end" : "flex-start",
      }}>
        {msg.body && (
          <div style={{
            padding: "10px 14px",
            background: isCoach ? "transparent" : "var(--bg-elev)",
            border: isCoach ? "1px solid rgba(168,187,165,0.18)" : "1px solid var(--line)",
            borderRadius: 18,
            borderBottomLeftRadius: isCoach ? 6 : 18,
            borderBottomRightRadius: isMe ? 6 : 18,
            color: isCoach ? "var(--coach)" : "var(--text)",
            fontFamily: isCoach ? "var(--serif)" : "var(--sans)",
            fontStyle: isCoach ? "italic" : "normal",
            fontSize: isCoach ? 15.5 : 13.5,
            lineHeight: 1.55,
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
        Camille a composé tes repas selon le moment du parcours. Tu peux adapter selon ce que tu trouves.
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

function JourneyScreen({
  currentDay,
  weights,
  recentMessages,
  onLogWeight,
}: {
  currentDay: number
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
                      fontSize: 9.5,
                      color: current ? "var(--brand)" : "var(--text-faint)",
                    }}>{day}</div>
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
                    <div style={{ fontSize: 9.5, color: isLast ? "var(--brand)" : "var(--text-faint)" }}>
                      j{w.day_number}
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
        Pas des règles, plutôt des points d'appui. Tu les suis dans le sens qui te va, Camille adapte avec toi.
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
          « Une question là-dessus ? Écris-moi dans le journal, j'y réponds dans la journée. »
        </p>
        <p style={{ margin: "8px 0 16px", fontSize: 12, color: "var(--text-mute)" }}>— Camille</p>
        <button onClick={onAskCoach} style={{
          background: "transparent",
          border: "1px solid rgba(92,181,81,0.35)",
          borderRadius: 999, padding: "10px 18px",
          color: "var(--brand)", fontSize: 13, fontFamily: "var(--sans)",
          cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8,
        }}>
          Poser une question <span style={{ fontSize: 14 }}>→</span>
        </button>
      </div>
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
  const { user } = useAuth()
  const supabase = createClient()

  const [tab, setTab]             = useState<Tab>("today")
  const [profile, setProfile]     = useState<Profile | null>(null)
  const [coachNote, setCoachNote] = useState<string | null>(null)
  const [messages, setMessages]   = useState<JournalMessage[]>([])
  const [weights, setWeights]     = useState<WeightLog[]>([])
  const [journalPrefill, setJournalPrefill] = useState("")
  const [loading, setLoading]     = useState(true)

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

    if (messagesRes.data) setMessages(messagesRes.data as JournalMessage[])
    if (weightsRes.data)  setWeights(weightsRes.data as WeightLog[])

    setLoading(false)
  }, [user, supabase])

  useEffect(() => { fetchAll() }, [fetchAll])

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

  const handleSend = async (body: string, isQuestion: boolean) => {
    if (!user || !profile) return
    await supabase.from("journal_messages").insert({
      coachee_id: user.id,
      author: "coachee",
      body,
      is_question: isQuestion,
    })
    // Realtime will add it; fallback: refetch
  }

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

  const goToJournal = (prefill?: string) => {
    if (prefill) setJournalPrefill(prefill)
    setTab("journal")
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
      <SideNav active={tab} onChange={setTab} currentDay={currentDay} />

      <AppHeader currentDay={currentDay} />

      <div className="app-main" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {tab === "today" && (
          <TodayScreen
            prenom={prenom}
            currentDay={currentDay}
            coachNote={coachNote}
            onOpenJournal={() => goToJournal()}
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
        {tab === "meals" && (
          <MealsScreen currentDay={currentDay} />
        )}
        {tab === "journey" && (
          <JourneyScreen
            currentDay={currentDay}
            weights={weights}
            recentMessages={recentJourneyMessages}
            onLogWeight={() => {/* v2 */}}
          />
        )}
        {tab === "principles" && (
          <PrinciplesScreen
            onAskCoach={() => goToJournal("J'ai une question à propos de… ")}
          />
        )}
      </div>

      <TabBar active={tab} onChange={setTab} />
    </div>
  )
}
