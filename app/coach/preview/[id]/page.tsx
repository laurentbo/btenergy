"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  PRINCIPLES_V2,
  PRINCIPLE_GROUPS,
  CHAPTER_FOR_DAY,
  calcCurrentDay,
} from "@/data/program"
import { BTE_DAYS, type BteMeal } from "@/data/bte-days"
import { MealCard, WhySheet, CookSheet, C as BC, SER as BSER, GRO as BGRO } from "@/components/BteMealCard"

type Tab = "today" | "journal" | "meals" | "journey" | "principles"

const TABS: { id: Tab; label: string }[] = [
  { id: "today",      label: "Aujourd'hui" },
  { id: "journal",    label: "Coach" },
  { id: "meals",      label: "Repas" },
  { id: "journey",    label: "Parcours" },
  { id: "principles", label: "Principes" },
]

type Message = {
  id: string
  author: "coachee" | "coach"
  body: string | null
  created_at: string
}

type WeightLog = {
  id: string
  day_number: number
  kg: number
  created_at: string
}

type CheckIn = {
  id: string
  day: number
  energie: number | null
  humeur: number | null
  sommeil: number | null
  created_at: string
}

type Override = {
  day: number
  coach_note: string | null
}

function Eyebrow({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{
      fontSize: 10.5, fontWeight: 500,
      letterSpacing: "0.16em", textTransform: "uppercase" as const,
      color: color ?? "var(--text-mute)",
    }}>{children}</div>
  )
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
}

function formatDateLabel(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  if (isToday) return `Aujourd'hui · ${d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric" })}`
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
}

function dayDate(programStart: string | null, dayNumber: number): string {
  if (!programStart) return `j${dayNumber}`
  const d = new Date(programStart)
  d.setDate(d.getDate() + dayNumber - 1)
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
}

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

// ─── Tab content ──────────────────────────────────────────────────────────────

function TodayTab({ prenom, currentDay, coachNote, checkin }: {
  prenom: string; currentDay: number; coachNote: string | null; checkin: CheckIn | null
}) {
  const meals = BTE_DAYS[currentDay - 1]?.meals ?? BTE_DAYS[0].meals
  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
  const [openId, setOpenId] = useState<string | null>(null)
  const [why, setWhy]       = useState<BteMeal | null>(null)
  const [cook, setCook]     = useState<BteMeal | null>(null)

  return (
    <>
    <div style={{ padding: "26px 22px 30px", background: BC.bg, minHeight: "100%" }}>
      <Eyebrow>{today}</Eyebrow>
      <h1 style={{
        margin: "10px 0 0", fontFamily: BSER,
        fontWeight: 600, fontSize: 30, lineHeight: 1.05,
        letterSpacing: "-0.01em", color: BC.ink,
      }}>
        Bonjour <em style={{ fontStyle: "italic", color: BC.green }}>{prenom}</em>.
      </h1>

      {coachNote && (
        <div style={{ marginTop: 20, padding: "14px 15px", background: `rgba(78,122,60,0.08)`, border: `1.5px solid rgba(78,122,60,0.25)`, borderRadius: 16 }}>
          <p style={{ margin: 0, fontFamily: BSER, fontStyle: "italic", fontSize: 17, lineHeight: 1.45, color: BC.ink }}>
            « {coachNote} »
          </p>
          <p style={{ margin: "6px 0 0", fontSize: 11, color: BC.soft }}>Note coach du jour</p>
        </div>
      )}

      <div style={{ marginTop: coachNote ? 24 : 20 }}>
        <div style={{ fontFamily: BGRO, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: BC.soft, marginBottom: 10 }}>
          Tes repas du jour
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {meals.map(m =>
            <MealCard key={m.key} m={m} open={openId === m.key}
              onToggle={() => setOpenId(cur => cur === m.key ? null : m.key)}
              onWhy={setWhy} onCook={setCook} />
          )}
        </div>
      </div>

      {checkin && (checkin.energie || checkin.humeur || checkin.sommeil) && (
        <div style={{ marginTop: 16, padding: "14px 15px", background: BC.paper2, border: `1.5px solid ${BC.line}`, borderRadius: 14 }}>
          <div style={{ fontFamily: BGRO, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: BC.soft, marginBottom: 10 }}>Check-in du matin</div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" as const }}>
            {[
              { k: "Énergie", key: "energie", v: checkin.energie },
              { k: "Humeur",  key: "humeur",  v: checkin.humeur  },
              { k: "Sommeil", key: "sommeil", v: checkin.sommeil },
            ].filter(x => x.v).map(x => (
              <div key={x.k}>
                <div style={{ fontSize: 9.5, color: BC.soft, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>{x.k}</div>
                <div style={{ fontSize: 14, fontFamily: BSER, fontStyle: "italic", color: BC.ink, marginTop: 3 }}>
                  {checkinLabel(x.key, x.v)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    <WhySheet  meal={why}  onClose={() => setWhy(null)} />
    <CookSheet meal={cook} onClose={() => setCook(null)} />
    </>
  )
}

function JournalTab({ messages }: { messages: Message[] }) {
  const grouped: Array<{ type: "separator"; label: string } | { type: "msg"; msg: Message }> = []
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
    <div style={{ padding: "22px 18px 14px", display: "flex", flexDirection: "column", gap: 14 }}>
      {messages.length === 0 && (
        <p style={{ fontSize: 13, color: "var(--text-mute)", textAlign: "center", padding: "40px 0" }}>
          Aucun message échangé pour l'instant.
        </p>
      )}
      {grouped.map((item, i) => {
        if (item.type === "separator") {
          return (
            <div key={`sep-${i}`} style={{ display: "flex", alignItems: "center", gap: 12, margin: "12px 0 4px" }}>
              <div style={{ flex: 1, height: 1, background: "var(--line-soft)" }} />
              <div style={{ fontSize: 11, color: "var(--text-mute)", fontStyle: "italic" }}>{item.label}</div>
              <div style={{ flex: 1, height: 1, background: "var(--line-soft)" }} />
            </div>
          )
        }
        const msg = item.msg
        const isCoach = msg.author === "coach"
        const isMe = msg.author === "coachee"
        return (
          <div key={msg.id} style={{
            display: "flex", gap: 10,
            flexDirection: isMe ? "row-reverse" : "row",
            alignItems: "flex-end",
          }}>
            {isCoach && (
              <div style={{
                width: 26, height: 26, borderRadius: 999, flexShrink: 0,
                background: "var(--brand-soft)", border: "1px solid var(--line)",
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
                }}>{msg.body}</div>
              )}
              <div style={{ fontSize: 10.5, color: "var(--text-faint)", padding: "0 6px" }}>
                {formatTime(msg.created_at)}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function MealsTab({ currentDay }: { currentDay: number }) {
  const [viewDay, setViewDay] = useState(currentDay)
  const [openId, setOpenId]   = useState<string | null>(null)
  const [why, setWhy]         = useState<BteMeal | null>(null)
  const [cook, setCook]       = useState<BteMeal | null>(null)

  const meals   = BTE_DAYS[viewDay - 1]?.meals ?? BTE_DAYS[0].meals
  const chapter = CHAPTER_FOR_DAY(viewDay)
  const isToday = viewDay === currentDay

  const go = (delta: number) => {
    setViewDay(d => Math.max(1, Math.min(21, d + delta)))
    setOpenId(null)
  }

  return (
    <>
    <div style={{ padding: "26px 22px 28px", background: BC.bg, minHeight: "100%" }}>
      <div style={{ fontFamily: BGRO, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: BC.soft, marginBottom: 4 }}>
        repas · {chapter.sub.toLowerCase()}
      </div>
      <h2 style={{ margin: "8px 0 20px", fontFamily: BSER, fontWeight: 600, fontSize: 28, lineHeight: 1.1, letterSpacing: "-0.015em", color: BC.ink }}>
        Ce qui est <em style={{ fontStyle: "italic", color: BC.green }}>prévu</em>.
      </h2>

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 12, padding: "10px 12px",
        background: BC.paper2, border: `1.5px solid ${BC.line}`, borderRadius: 14, marginBottom: 20,
      }}>
        <button onClick={() => go(-1)} disabled={viewDay <= 1} style={{
          width: 32, height: 32, borderRadius: 999,
          background: "transparent", border: `1.5px solid ${BC.line}`,
          color: viewDay <= 1 ? BC.line : BC.soft,
          cursor: viewDay <= 1 ? "default" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}><ChevronLeft /></button>
        <div style={{ textAlign: "center", flex: 1 }}>
          <div style={{ fontFamily: BSER, fontStyle: "italic", fontSize: 17, color: isToday ? BC.green : BC.ink, lineHeight: 1.15 }}>
            {isToday ? "Aujourd'hui · " : ""}jour {viewDay}
          </div>
          <div style={{ fontSize: 11, color: BC.soft, marginTop: 3 }}>{chapter.sub}</div>
        </div>
        <button onClick={() => go(1)} disabled={viewDay >= 21} style={{
          width: 32, height: 32, borderRadius: 999,
          background: "transparent", border: `1.5px solid ${BC.line}`,
          color: viewDay >= 21 ? BC.line : BC.soft,
          cursor: viewDay >= 21 ? "default" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}><ChevronRight /></button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {meals.map(m =>
          <MealCard key={m.key} m={m} open={openId === m.key}
            onToggle={() => setOpenId(cur => cur === m.key ? null : m.key)}
            onWhy={setWhy} onCook={setCook} />
        )}
      </div>
    </div>
    <WhySheet  meal={why}  onClose={() => setWhy(null)} />
    <CookSheet meal={cook} onClose={() => setCook(null)} />
    </>
  )
}

function JourneyTab({ currentDay, programStart, weights, messages }: {
  currentDay: number
  programStart: string | null
  weights: WeightLog[]
  messages: Message[]
}) {
  const CHAPTERS = [
    { name: "Détox",   span: 7, hint: "On allège, on laisse le corps souffler.",       start: 1  },
    { name: "Énergie", span: 7, hint: "Le corps retrouve son rythme, on remet du jeu.", start: 8  },
    { name: "Ancrage", span: 7, hint: "On installe ce qui restera après.",              start: 15 },
  ]

  const first = weights[0]
  const last  = weights[weights.length - 1]
  const hasWeight = weights.length > 0
  const deltaNum = hasWeight ? last.kg - first.kg : 0
  const deltaStr = (deltaNum < 0 ? "−" : "+") + Math.abs(deltaNum).toFixed(1).replace(".", ",")
  const isLoss = deltaNum < 0
  const maxKg = hasWeight ? Math.max(...weights.map(w => w.kg)) : 0
  const minKg = hasWeight ? Math.min(...weights.map(w => w.kg)) : 0
  const range = Math.max(0.5, maxKg - minKg)

  return (
    <div style={{ padding: "26px 22px 28px" }}>
      <Eyebrow>parcours · {currentDay} {currentDay > 1 ? "jours" : "jour"} derrière toi</Eyebrow>
      <h2 style={{
        margin: "10px 0 0", fontFamily: "var(--serif)",
        fontWeight: 400, fontSize: 28, lineHeight: 1.1,
        letterSpacing: "-0.015em", color: "var(--text)",
      }}>
        Tu en es <em style={{ fontStyle: "italic", color: "var(--brand)" }}>là</em>.
      </h2>

      <div style={{ marginTop: 30 }}>
        {CHAPTERS.map((ch, ci) => (
          <div key={ci} style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
              <div>
                <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 18, color: "var(--text)" }}>{ch.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-mute)", marginTop: 4 }}>{ch.hint}</div>
              </div>
              <div style={{ fontSize: 11, color: "var(--text-faint)" }}>{ch.start}–{ch.start + ch.span - 1}</div>
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

      <div style={{ paddingTop: 22, borderTop: "1px solid var(--line)" }}>
        <Eyebrow>poids</Eyebrow>
        {hasWeight ? (
          <>
            <div style={{ marginTop: 14, display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 400, color: "var(--text)" }}>
                  {last.kg.toFixed(1).replace(".", ",")}
                </span>
                <span style={{ fontSize: 13, color: "var(--text-mute)" }}>kg</span>
              </div>
              <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13, color: isLoss ? "var(--coach)" : "var(--text-mute)" }}>
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
          <p style={{ marginTop: 10, fontSize: 13, color: "var(--text-mute)" }}>Pas encore de pesée enregistrée.</p>
        )}
      </div>

      {messages.length > 0 && (
        <div style={{ marginTop: 16, paddingTop: 22, borderTop: "1px solid var(--line)" }}>
          <Eyebrow>ce qui s'est dit jusqu'ici</Eyebrow>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 18 }}>
            {messages.slice(-8).map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{
                  fontFamily: "var(--serif)", fontStyle: "italic",
                  fontSize: 12, color: "var(--text-mute)", width: 36, flexShrink: 0, paddingTop: 2,
                }}>
                  {new Date(m.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
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
                    {m.author === "coach" ? "Coach" : "Participant"}
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

function PrinciplesTab() {
  return (
    <div style={{ padding: "26px 22px 28px" }}>
      <Eyebrow>principes · les repères de la méthode</Eyebrow>
      <h2 style={{
        margin: "10px 0 0", fontFamily: "var(--serif)",
        fontWeight: 400, fontSize: 28, lineHeight: 1.1,
        letterSpacing: "-0.015em", color: "var(--text)",
      }}>
        Ce qui <em style={{ fontStyle: "italic", color: "var(--brand)" }}>guide</em> le programme.
      </h2>

      <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 32 }}>
        {PRINCIPLE_GROUPS.map((group, gi) => (
          <section key={group.name} style={{
            paddingTop: gi > 0 ? 28 : 0,
            borderTop: gi > 0 ? "1px solid var(--line-soft)" : "none",
          }}>
            <div style={{ marginBottom: 18 }}>
              <Eyebrow>{group.name}</Eyebrow>
              <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14.5, color: "var(--text-dim)", marginTop: 6 }}>
                {group.hint}
              </div>
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
                      <div style={{ fontSize: 14.5, fontWeight: 500, marginBottom: 6, color: "rgb(210,236,212)" }}>{p.title}</div>
                      <p style={{ margin: 0, fontSize: 13, color: "var(--text-dim)", lineHeight: 1.65 }}>{p.body}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function CoachPreviewPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("today")
  const [collab, setCollab] = useState<any>(null)
  const [overrides, setOverrides] = useState<Override[]>([])
  const [entries, setEntries] = useState<CheckIn[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [weights, setWeights] = useState<WeightLog[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDay, setCurrentDay] = useState(1)

  useEffect(() => {
    fetch(`/api/collab/${id}`)
      .then(r => r.json())
      .then(data => {
        if (!data) { router.push("/coach"); return }
        setCollab(data.collab)
        setOverrides(data.overrides ?? [])
        setEntries(data.entries ?? [])
        setMessages(data.messages ?? [])
        setWeights(data.weights ?? [])
        setCurrentDay(calcCurrentDay(data.collab.program_start))
        setLoading(false)
      })
  }, [id]) // eslint-disable-line

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

  const prenom = collab?.prenom ?? ""
  const todayOverride = overrides.find(o => o.day === currentDay) ?? null
  const todayCheckin = entries.find(e => e.day === currentDay) ?? null

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100dvh",
      background: "var(--bg)", fontFamily: "var(--sans)",
    }}>

      {/* Bannière coach */}
      <div style={{
        padding: "8px 16px",
        background: "rgba(62,142,79,0.08)",
        borderBottom: "1px solid rgba(62,142,79,0.18)",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 12, color: "var(--forest)", fontWeight: 500 }}>
          👁 Vue coach — espace de {prenom} · jour {currentDay}/21
        </span>
        <button onClick={() => router.push("/coach")} style={{
          background: "transparent", border: "1px solid rgba(62,142,79,0.3)",
          borderRadius: 999, padding: "4px 12px",
          fontSize: 11.5, color: "var(--brand)", fontFamily: "var(--sans)", cursor: "pointer",
        }}>
          ← Retour
        </button>
      </div>

      {/* Contenu scrollable */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "today" && (
          <TodayTab
            prenom={prenom}
            currentDay={currentDay}
            coachNote={todayOverride?.coach_note ?? null}
            checkin={todayCheckin}
          />
        )}
        {tab === "journal" && <JournalTab messages={messages} />}
        {tab === "meals" && <MealsTab currentDay={currentDay} />}
        {tab === "journey" && (
          <JourneyTab
            currentDay={currentDay}
            programStart={collab?.program_start ?? null}
            weights={weights}
            messages={messages}
          />
        )}
        {tab === "principles" && <PrinciplesTab />}
      </div>

      {/* Tab bar */}
      <div style={{
        flexShrink: 0,
        padding: "10px 8px env(safe-area-inset-bottom, 12px)",
        borderTop: "1px solid var(--line-soft)",
        background: "color-mix(in oklab, var(--bg) 92%, transparent)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}>
        <div style={{ display: "flex" }}>
          {TABS.map(t => {
            const on = tab === t.id
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
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
    </div>
  )
}
