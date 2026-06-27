"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { BTE_DAYS, type BteMeal } from "@/data/bte-days"
import { createClient } from "@/lib/supabase/client"
import { calcCurrentDay, hasProgramStarted } from "@/data/program"

// ── Couleurs ──────────────────────────────────────────────────────────────────
const C = {
  chassis:  "#1C160C",
  bg:       "#EFE6CF",
  paper2:   "#FBF6EA",
  ink:      "#1E1B14",
  soft:     "#857A61",
  line:     "#E2D4B5",
  green:    "#4E7A3C",
  accent:   "#E8622A",
  pop:      "#F2B431",
}
const WK = ["#4E7A3C", "#E2A21E", "#C2552A"]
const SER = "'Baloo 2', sans-serif"
const GRO = "'Space Grotesk', sans-serif"
const BODY = "'Hanken Grotesk', sans-serif"

function rgba(hex: string, a: number) {
  const h = hex.replace("#", "")
  return `rgba(${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)},${a})`
}
const weekIdx = (n: number) => n <= 7 ? 0 : n <= 14 ? 1 : 2
const weekAccent = (n: number) => WK[weekIdx(n)]

const TOTAL = 21
const WEEKS_INFO = [
  { label: "Semaine 1 · Détox & Purification", sub: "On réveille la machine en douceur.", accent: WK[0] },
  { label: "Semaine 2 · Énergie & Vitalité",   sub: "L'énergie revient, le sommeil s'allège.", accent: WK[1] },
  { label: "Semaine 3 · Ancrage & Performance", sub: "Les bons réflexes deviennent les tiens.", accent: WK[2] },
]

const PASSAGES = [
  { range: [1,2],   title: "La mise en route",       body: "Le corps lève le pied : digestion plus légère, et peut-être un petit coup de fatigue. Le café reste autorisé." },
  { range: [3,4],   title: "Le nettoyage",            body: "Tu peux te sentir un peu « vaseux » une journée, le transit qui bouge. C'est le corps qui élimine — c'est passager.", tip: "Bois beaucoup : ça aide à tout évacuer.", exit: true },
  { range: [5,7],   title: "Les montagnes russes",    body: "Humeur en dents de scie, un coup de mou possible. C'est ce qui précède l'éclaircie de la semaine 2." },
  { range: [8,10],  title: "Le sommeil bouge",        body: "Réveils plus tôt, nuits plus légères mais plus réparatrices. C'est l'organisme qui tourne mieux." },
  { range: [15,21], title: "La tentation sociale",    body: "L'envie de « revenir à avant » peut pointer. Rappelle-toi ton pourquoi — c'est là que se joue ton autonomie." },
]
const passageFor = (n: number) => PASSAGES.find(p => n >= p.range[0] && n <= p.range[1]) || null

const SNACK_NOTE = "Un petit creux ? Une poignée d'amandes ou un fruit seul, à distance des repas."
const MOODS = [
  { key: "low", label: "Vaseux" },
  { key: "meh", label: "Ça va" },
  { key: "ok",  label: "Léger" },
  { key: "top", label: "Plein d'énergie" },
]

// ── Icônes ────────────────────────────────────────────────────────────────────
function Ic({ name, col = C.ink, sw = 1.7, s = 22 }: { name: string; col?: string; sw?: number; s?: number }) {
  const p = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: col, strokeWidth: sw, strokeLinecap: "round" as const, strokeLinejoin: "round" as const }
  switch (name) {
    case "jour":    return <svg {...p}><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/></svg>
    case "courses": return <svg {...p}><path d="M5 8h14l-1.2 10.5a1.5 1.5 0 0 1-1.5 1.3H7.7a1.5 1.5 0 0 1-1.5-1.3z"/><path d="M8.5 8a3.5 3.5 0 0 1 7 0"/></svg>
    case "recettes":return <svg {...p}><path d="M4 13a8 8 0 0 0 16 0z"/><path d="M12 5c-1.6 0-2.6 1-2.6 2.6M12 5c1.6 0 2.6 1 2.6 2.6"/></svg>
    case "methode": return <svg {...p}><path d="M5 5.5A1.5 1.5 0 0 1 6.5 4H18v16H6.5A1.5 1.5 0 0 0 5 21z"/><path d="M18 4v16"/></svg>
    case "coach":   return <svg {...p}><path d="M5 6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5v7A1.5 1.5 0 0 1 17.5 15H10l-4 3.5V15H6.5A1.5 1.5 0 0 1 5 13.5z"/></svg>
    case "chevron": return <svg {...p}><path d="M6 9l6 6 6-6"/></svg>
    case "check":   return <svg {...p}><path d="M5 12.5l4.5 4.5L19 7"/></svg>
    case "leaf":    return <svg {...p}><path d="M5 18c0-7 5-12 14-12 0 9-5 14-12 14-1 0-2-.5-2-2z"/><path d="M9 16c2-3 4-5 7-6"/></svg>
    case "wave":    return <svg {...p}><path d="M3 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/></svg>
    case "swap":    return <svg {...p}><path d="M7 7h11l-3-3M17 17H6l3 3"/></svg>
    case "info":    return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.6v.2"/></svg>
    case "basket":  return <svg {...p}><path d="M5 9h14l-1.3 9a1.6 1.6 0 0 1-1.6 1.4H7.9A1.6 1.6 0 0 1 6.3 18zM9 9l3-5 3 5"/></svg>
    case "pot":     return <svg {...p}><path d="M4 10h16M5.5 10a6.5 6.5 0 0 0 13 0M3 10h18M9 4c0 1.4-1 1.6-1 3M13 4c0 1.4-1 1.6-1 3"/></svg>
    case "close":   return <svg {...p}><path d="M6 6l12 12M18 6L6 18"/></svg>
    case "spark":   return <svg {...p}><path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z"/></svg>
    case "arrow":   return <svg {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    default: return null
  }
}

// ── Face (humeur) ─────────────────────────────────────────────────────────────
function Face({ kind, col, s = 30 }: { kind: string; col: string; s?: number }) {
  const p = { width: s, height: s, viewBox: "0 0 32 32", fill: "none", stroke: col, strokeWidth: 1.9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const }
  const eyes: Record<string, React.ReactNode> = {
    low: <g><path d="M10 13.5q1.6 -1.4 3.2 0"/><path d="M18.8 13.5q1.6 -1.4 3.2 0"/></g>,
    meh: <g><circle cx="11.6" cy="13" r="0.4" fill={col}/><circle cx="20.4" cy="13" r="0.4" fill={col}/></g>,
    ok:  <g><circle cx="11.6" cy="13" r="0.4" fill={col}/><circle cx="20.4" cy="13" r="0.4" fill={col}/></g>,
    top: <g><path d="M10 13q1.6 -1.6 3.2 0"/><path d="M18.8 13q1.6 -1.6 3.2 0"/></g>,
  }
  const mouth: Record<string, React.ReactNode> = {
    low: <path d="M11.5 21.5q4.5 -2.4 9 0"/>,
    meh: <path d="M11.5 20.5h9"/>,
    ok:  <path d="M11.5 20q4.5 2 9 0"/>,
    top: <path d="M11 19.5q5 4 10 0"/>,
  }
  return <svg {...p}><circle cx="16" cy="16" r="12.5"/>{eyes[kind]}{mouth[kind]}</svg>
}

// ── Sheet (bottom-sheet) ──────────────────────────────────────────────────────
function Sheet({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 55, background: rgba(C.ink, 0.55), display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 440, maxHeight: "88vh", overflowY: "auto", background: C.bg, borderRadius: "26px 26px 0 0", padding: "10px 20px 26px", border: `1.5px solid ${C.line}`, borderBottom: "none" }}>
        <div style={{ width: 42, height: 5, borderRadius: 999, background: C.line, margin: "0 auto 16px" }} />
        {children}
      </div>
    </div>
  )
}

function CookSheet({ meal, onClose }: { meal: BteMeal | null; onClose: () => void }) {
  if (!meal) return null
  return (
    <Sheet onClose={onClose}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ width: 32, height: 32, borderRadius: 10, background: rgba(C.green, 0.16), color: C.green, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Ic name="pot" col={C.green} sw={1.8} s={19} /></span>
          <div style={{ fontFamily: SER, fontWeight: 700, fontSize: 19, color: C.ink }}>On cuisine</div>
        </div>
        <button onClick={onClose} style={{ cursor: "pointer", width: 34, height: 34, borderRadius: 999, border: "none", background: C.paper2, color: C.soft, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Ic name="close" col={C.soft} sw={2} s={18} /></button>
      </div>
      <div style={{ fontFamily: SER, fontWeight: 700, fontSize: 22, color: C.ink, lineHeight: 1.1, marginBottom: 16 }}>{meal.title}</div>
      <div style={{ fontFamily: GRO, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.soft, marginBottom: 9 }}>Ce qu'il te faut</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 20 }}>
        {meal.ingredients.map(([n, q]) =>
          <span key={n} style={{ fontSize: 12.5, color: C.ink, background: C.paper2, border: `1.5px solid ${C.line}`, borderRadius: 999, padding: "5px 11px", whiteSpace: "nowrap" as const }}>{n}<span style={{ color: C.soft, fontWeight: 700 }}>{" · " + q}</span></span>
        )}
      </div>
      <div style={{ fontFamily: GRO, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.soft, marginBottom: 9 }}>Les étapes</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
        {meal.steps.map((step, i) =>
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ flex: "0 0 auto", width: 26, height: 26, borderRadius: 999, background: C.green, color: "#fff", fontFamily: SER, fontWeight: 700, fontSize: 13, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
            <div style={{ fontSize: 14.5, lineHeight: 1.5, color: C.ink, paddingTop: 2 }}>{step}</div>
          </div>
        )}
      </div>
      <div style={{ marginTop: 18, fontSize: 12.5, color: C.soft, lineHeight: 1.5, borderTop: `1px solid ${C.line}`, paddingTop: 14 }}>Pas de minuteur, pas de pression — tu ajustes les quantités et l'assaisonnement à ton goût.</div>
    </Sheet>
  )
}

function WhySheet({ meal, onClose }: { meal: BteMeal | null; onClose: () => void }) {
  if (!meal) return null
  return (
    <Sheet onClose={onClose}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ width: 32, height: 32, borderRadius: 10, background: rgba(C.green, 0.16), color: C.green, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Ic name="spark" col={C.green} sw={1.8} s={19} /></span>
          <div style={{ fontFamily: SER, fontWeight: 700, fontSize: 19, color: C.ink }}>Pourquoi cette association ?</div>
        </div>
        <button onClick={onClose} style={{ cursor: "pointer", width: 34, height: 34, borderRadius: 999, border: "none", background: C.paper2, color: C.soft, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Ic name="close" col={C.soft} sw={2} s={18} /></button>
      </div>
      <div style={{ fontFamily: GRO, fontSize: 12, fontWeight: 700, color: C.green, marginBottom: 6 }}>{meal.title}</div>
      <div style={{ fontSize: 15.5, lineHeight: 1.55, color: C.ink }}>{meal.why}</div>
      <div style={{ marginTop: 16, fontSize: 12, color: C.soft, lineHeight: 1.5, borderTop: `1px solid ${C.line}`, paddingTop: 14 }}>La méthode tient en quelques gestes simples — on te les explique au fil des jours, jamais comme une liste d'interdits.</div>
    </Sheet>
  )
}

// ── Carte repas ───────────────────────────────────────────────────────────────
function MealCard({ m, open, onToggle, onWhy, onCook }: {
  m: BteMeal; open: boolean
  onToggle: () => void
  onWhy: (m: BteMeal) => void
  onCook: (m: BteMeal) => void
}) {
  return (
    <div style={{ background: C.paper2, border: `1.5px solid ${C.line}`, borderRadius: 18, overflow: "hidden" }}>
      {!open && (
        <button onClick={onToggle} style={{ width: "100%", cursor: "pointer", border: "none", background: "transparent", padding: 12, display: "flex", alignItems: "center", gap: 13, textAlign: "left" }}>
          <div style={{ flex: "0 0 auto", width: 60, height: 60, borderRadius: 14, overflow: "hidden", background: C.bg }}>
            <img src={m.photo} alt={m.title} style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", filter: "saturate(1.05) brightness(1.02)" }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: GRO, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: C.soft, marginBottom: 4 }}>{m.slot}</div>
            <div style={{ fontFamily: SER, fontWeight: 600, fontSize: 18, color: C.ink, lineHeight: 1.1, whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis" }}>{m.title}</div>
          </div>
          <span style={{ flex: "0 0 auto", color: C.soft }}><Ic name="chevron" col={C.soft} sw={2} s={22} /></span>
        </button>
      )}

      {open && (
        <div>
          <button onClick={onToggle} style={{ position: "relative", width: "100%", display: "block", border: "none", padding: 0, cursor: "pointer", background: C.bg }}>
            <img src={m.photo} alt={m.title} style={{ display: "block", width: "100%", height: 180, objectFit: "cover", filter: "saturate(1.05) brightness(1.02)" }} />
            <span style={{ position: "absolute", top: 12, right: 12, width: 34, height: 34, borderRadius: 999, background: rgba(C.ink, 0.5), backdropFilter: "blur(4px)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ transform: "rotate(180deg)", display: "inline-flex" }}><Ic name="chevron" col="#fff" sw={2.2} s={20} /></span>
            </span>
            <span style={{ position: "absolute", top: 12, left: 12, background: C.pop, color: C.ink, fontFamily: GRO, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, padding: "5px 10px", borderRadius: 999 }}>{m.slot}</span>
          </button>

          <div style={{ padding: "16px 16px 18px" }}>
            <div style={{ fontFamily: SER, fontWeight: 600, fontSize: 24, color: C.ink, lineHeight: 1.08, marginBottom: 15 }}>{m.title}</div>

            <div style={{ background: rgba(C.green, 0.1), border: `1.5px solid ${rgba(C.green, 0.3)}`, borderRadius: 16, padding: "14px 15px", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ width: 26, height: 26, borderRadius: 9, background: rgba(C.green, 0.18), display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Ic name="leaf" col={C.green} sw={1.9} s={16} /></span>
                <span style={{ fontFamily: SER, fontWeight: 600, fontSize: 15.5, color: C.ink }}>Ce que tu vas ressentir</span>
              </div>
              <div style={{ fontSize: 14.5, lineHeight: 1.5, color: C.ink }}>{m.sensation}</div>
            </div>

            <div style={{ fontFamily: GRO, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: C.soft, marginBottom: 9 }}>Ce qu'il te faut</div>
            <div style={{ border: `1.5px solid ${C.line}`, borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
              {m.ingredients.map(([name, qty], i) =>
                <div key={name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderTop: i ? `1px solid ${C.line}` : "none", background: C.bg }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: C.ink }}>
                    <span style={{ width: 6, height: 6, borderRadius: 999, background: C.green, flex: "0 0 auto" }} />{name}
                  </span>
                  <span style={{ fontFamily: GRO, fontSize: 12, fontWeight: 700, color: C.soft }}>{qty}</span>
                </div>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
              <span style={{ width: 26, height: 26, borderRadius: 9, background: rgba(C.accent, 0.14), display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Ic name="swap" col={C.accent} sw={1.9} s={16} /></span>
              <span style={{ fontFamily: SER, fontWeight: 600, fontSize: 15.5, color: C.ink }}>Pas envie ? Échange</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
              {m.swaps.map(s =>
                <div key={s} style={{ background: C.bg, border: `1.5px solid ${C.line}`, borderRadius: 12, padding: "10px 13px", fontSize: 13.5, color: C.ink, lineHeight: 1.35 }}>{s}</div>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => onCook(m)} style={{ flex: 1, cursor: "pointer", border: "none", background: C.accent, color: "#fff", fontFamily: GRO, fontWeight: 700, fontSize: 15, padding: "15px 18px", borderRadius: 999, boxShadow: `0 12px 24px -12px ${rgba(C.accent, 0.9)}` }}>Cuisiner ce plat</button>
              <button onClick={() => onWhy(m)} aria-label="Pourquoi cette association" style={{ flex: "0 0 auto", cursor: "pointer", width: 50, height: 50, borderRadius: 999, border: `1.5px solid ${C.line}`, background: C.bg, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Ic name="info" col={C.green} sw={1.9} s={23} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── MoodPicker ────────────────────────────────────────────────────────────────
function MoodPicker({ day }: { day: number }) {
  const lsKey = `bte-mood-j${day}`
  const [sel, setSel] = useState("")
  useEffect(() => { setSel(localStorage.getItem(lsKey) || "") }, [day, lsKey])
  const pick = (k: string) => { setSel(k); localStorage.setItem(lsKey, k) }
  return (
    <div style={{ background: C.paper2, border: `1.5px solid ${C.line}`, borderRadius: 18, padding: "16px 16px 14px" }}>
      <div style={{ fontFamily: SER, fontWeight: 600, fontSize: 17, color: C.ink, marginBottom: 2 }}>Et toi, là, maintenant ?</div>
      <div style={{ fontSize: 12.5, color: C.soft, marginBottom: 12 }}>En fin de journée — juste pour toi, rien à réussir.</div>
      <div style={{ display: "flex", gap: 8 }}>
        {MOODS.map(m => {
          const on = sel === m.key
          return (
            <button key={m.key} onClick={() => pick(m.key)} style={{ flex: "1 1 0", cursor: "pointer", border: `1.5px solid ${on ? C.green : C.line}`, background: on ? rgba(C.green, 0.12) : C.bg, borderRadius: 14, padding: "11px 4px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <Face kind={m.key} col={on ? C.green : C.soft} s={30} />
              <span style={{ fontSize: 10.5, fontWeight: on ? 700 : 600, color: on ? C.green : C.soft, fontFamily: BODY, textAlign: "center", lineHeight: 1.15 }}>{m.label}</span>
            </button>
          )
        })}
      </div>
      {sel && (
        <div style={{ marginTop: 12, paddingTop: 11, borderTop: `1px solid ${C.line}`, display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: C.soft }}>
          <span style={{ color: C.green, display: "inline-flex" }}><Ic name="check" col={C.green} sw={2.4} s={15} /></span>
          <span>Noté — je le reçois.</span>
        </div>
      )}
    </div>
  )
}

// ── Page principale ───────────────────────────────────────────────────────────
export default function JourPage() {
  const [day, setDayState] = useState(1)
  const [prenom, setPrenom] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const [why, setWhy] = useState<BteMeal | null>(null)
  const [cook, setCook] = useState<BteMeal | null>(null)

  useEffect(() => {
    async function initDay() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { window.location.replace("/bienvenue"); return }
        const { data: profile } = await supabase
          .from("profiles").select("prenom, start_date").eq("id", user.id).maybeSingle()
        if (!hasProgramStarted(profile?.start_date)) { window.location.replace("/bienvenue"); return }
        const p = profile?.prenom
        setPrenom(p ? p.charAt(0).toUpperCase() + p.slice(1).toLowerCase() : null)
        // dayIndex > 21 clampé à 21 — écran "programme terminé" à créer (TODO)
        setDayState(calcCurrentDay(profile?.start_date))
      } catch { window.location.replace("/bienvenue") }
    }
    void initDay()
  }, [])

  const setDay = (n: number) => {
    setDayState(n)
    setOpenId(null)
    window.scrollTo(0, 0)
  }

  const wk = WEEKS_INFO[weekIdx(day)]
  const acc = wk.accent
  const passage = passageFor(day)
  const meals = BTE_DAYS[day - 1]?.meals ?? []
  const showFresh = day % 7 === 4

  const NAV = [
    { label: "Jour",     icon: "jour",     href: "/jour",     active: true  },
    { label: "Courses",  icon: "courses",  href: "/courses",  active: false },
    { label: "Recettes", icon: "recettes", href: "/recettes", active: false },
    { label: "Méthode",  icon: "methode",  href: "/methode",  active: false },
    { label: "Coach",    icon: "coach",    href: "/chat",     active: false },
  ]

  return (
    <>
      <div style={{ minHeight: "100vh", background: C.chassis, display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 440, minHeight: "100vh", background: C.bg, position: "relative", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, padding: "22px 18px 96px" }}>

            {/* En-tête */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontFamily: GRO, fontWeight: 700, fontSize: 12, color: "#fff", background: acc, padding: "5px 12px", borderRadius: 999, whiteSpace: "nowrap" as const }}>
                  JOUR {day}<span style={{ opacity: 0.7 }}> / {TOTAL}</span>
                </span>
                <div style={{ fontFamily: SER, fontWeight: 600, fontSize: 30, color: C.ink, letterSpacing: "-0.01em", lineHeight: 1.0, marginTop: 12 }}>Bonjour{prenom ? ` ${prenom}` : ""}</div>
                <div style={{ fontFamily: SER, fontSize: 14.5, color: C.green, lineHeight: 1.35, marginTop: 5 }}>{wk.sub}</div>
              </div>
              <Link href="/profil" aria-label="Mon profil" style={{ flex: "0 0 auto", textDecoration: "none", width: 48, height: 48, borderRadius: 999, background: C.accent, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: GRO, fontWeight: 700, fontSize: 12, letterSpacing: "0.04em", textTransform: "uppercase" as const, lineHeight: 1, boxShadow: `0 2px 8px ${rgba(C.accent, 0.3)}` }}>
                Moi
              </Link>
            </div>

            {/* Sélecteur de jour */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 6, WebkitOverflowScrolling: "touch" as unknown as "auto" }}>
                {Array.from({ length: TOTAL }, (_, i) => i + 1).map(n => {
                  const on = n === day
                  const a = weekAccent(n)
                  return (
                    <button key={n} onClick={() => setDay(n)} style={{ flex: "0 0 auto", width: 38, height: 44, borderRadius: 12, cursor: "pointer", border: on ? "none" : `1.5px solid ${C.line}`, background: on ? a : C.paper2, color: on ? "#fff" : C.soft, fontFamily: SER, fontWeight: 700, fontSize: 16, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{n}</button>
                  )
                })}
              </div>
              <div style={{ fontFamily: GRO, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: acc, marginTop: 8 }}>{wk.label}</div>
            </div>

            {/* Note du jour */}
            {day === 1 ? (
              <div style={{ border: `1.5px solid ${rgba(C.green, 0.4)}`, background: rgba(C.green, 0.1), borderRadius: 16, padding: "14px 15px", marginBottom: 18, display: "flex", gap: 12 }}>
                <span style={{ flex: "0 0 auto", width: 38, height: 38, borderRadius: 11, background: rgba(C.green, 0.16), display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Ic name="spark" col={C.green} sw={1.9} s={21} /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: GRO, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: C.green, marginBottom: 9 }}>C'est parti</div>
                  <div style={{ fontSize: 14, lineHeight: 1.48, color: C.ink }}>Premier jour de ton programme — on commence tout en douceur, avec un bon petit-déjeuner plein de fruits.</div>
                </div>
              </div>
            ) : passage ? (
              <div style={{ border: `1.5px solid ${rgba(C.pop, 0.5)}`, background: rgba(C.pop, 0.14), borderRadius: 16, padding: "15px 16px", marginBottom: 18 }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <span style={{ flex: "0 0 auto", width: 38, height: 38, borderRadius: 11, background: rgba(C.pop, 0.22), display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Ic name="wave" col="#A9742A" sw={1.9} s={21} /></span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: GRO, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#A9742A", marginBottom: 9 }}>Ce qui peut arriver</div>
                    <div style={{ fontFamily: SER, fontWeight: 600, fontSize: 17, color: C.ink, lineHeight: 1.12, marginBottom: 4 }}>{passage.title}</div>
                    <div style={{ fontSize: 13.5, lineHeight: 1.48, color: C.ink }}>{passage.body}</div>
                    {(passage as typeof passage & { tip?: string }).tip && <div style={{ fontSize: 13.5, lineHeight: 1.45, color: "#A9742A", fontWeight: 700, marginTop: 7 }}>{(passage as typeof passage & { tip?: string }).tip}</div>}
                  </div>
                </div>
                {(passage as typeof passage & { exit?: boolean }).exit && (
                  <Link href="/chat" style={{ marginTop: 13, paddingTop: 12, borderTop: `1px solid ${rgba(C.pop, 0.4)}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, textDecoration: "none" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.green, lineHeight: 1.3 }}>Si ça persiste ou t'inquiète, parle-m'en</span>
                    <span style={{ flex: "0 0 auto", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 999, background: rgba(C.green, 0.16) }}><Ic name="coach" col={C.green} sw={1.9} s={17} /></span>
                  </Link>
                )}
              </div>
            ) : null}

            {/* Rappel courses fraîches (J4, J11, J18) */}
            {showFresh && (
              <Link href="/courses" style={{ width: "100%", textDecoration: "none", textAlign: "left", cursor: "pointer", border: `1.5px solid ${rgba(C.pop, 0.5)}`, background: rgba(C.pop, 0.14), borderRadius: 16, padding: "13px 14px", display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                <span style={{ flex: "0 0 auto", width: 40, height: 40, borderRadius: 12, background: rgba(C.pop, 0.22), display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Ic name="basket" col="#A9742A" sw={1.8} s={22} /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: SER, fontWeight: 600, fontSize: 15.5, color: C.ink, lineHeight: 1.15 }}>Pense à racheter tes légumes frais</div>
                  <div style={{ fontSize: 12.5, color: C.soft, marginTop: 2, lineHeight: 1.3 }}>De quoi tenir la deuxième moitié de semaine.</div>
                </div>
                <span style={{ flex: "0 0 auto", color: "#A9742A", fontFamily: GRO, fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 2 }}>
                  Ma liste<span style={{ transform: "rotate(-90deg)", display: "inline-flex" }}><Ic name="chevron" col="#A9742A" sw={2.2} s={16} /></span>
                </span>
              </Link>
            )}

            {/* Repas */}
            <div style={{ fontFamily: GRO, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: C.soft, marginBottom: 9 }}>Tes repas du jour</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {meals.map(m =>
                <MealCard key={m.key} m={m} open={openId === m.key}
                  onToggle={() => setOpenId(cur => cur === m.key ? null : m.key)}
                  onWhy={setWhy} onCook={setCook} />
              )}
            </div>

            {/* Note encas */}
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 11, background: C.paper2, border: `1.5px dashed ${C.line}`, borderRadius: 14, padding: "12px 14px" }}>
              <span style={{ flex: "0 0 auto", width: 32, height: 32, borderRadius: 10, background: rgba(C.green, 0.14), display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Ic name="leaf" col={C.green} sw={1.9} s={18} /></span>
              <div style={{ fontSize: 13, color: C.soft, lineHeight: 1.4 }}>{SNACK_NOTE}</div>
            </div>

            <div style={{ marginTop: 22 }}><MoodPicker day={day} /></div>
          </div>

          {/* Nav basse */}
          <div style={{ position: "sticky", bottom: 0, background: C.bg, borderTop: `1px solid ${C.line}`, padding: "9px 8px 16px", display: "flex", justifyContent: "space-between" }}>
            {NAV.map(({ label, icon, href, active }) => (
              <Link key={label} href={href} style={{ flex: "1 1 0", textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: active ? C.accent : C.soft }}>
                <Ic name={icon} col={active ? C.accent : C.soft} sw={active ? 2.1 : 1.7} s={23} />
                <span style={{ fontFamily: GRO, fontSize: 10, fontWeight: active ? 700 : 500 }}>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <WhySheet  meal={why}  onClose={() => setWhy(null)} />
      <CookSheet meal={cook} onClose={() => setCook(null)} />
    </>
  )
}
