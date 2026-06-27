"use client"
import { type BteMeal } from "@/data/bte-days"

// ── Design tokens (identiques à /jour) ───────────────────────────────────────
export const C = {
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
export const SER  = "'Baloo 2', sans-serif"
export const GRO  = "'Space Grotesk', sans-serif"
export const BODY = "'Hanken Grotesk', sans-serif"

export function rgba(hex: string, a: number) {
  const h = hex.replace("#", "")
  return `rgba(${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)},${a})`
}

// ── Icônes ────────────────────────────────────────────────────────────────────
export function Ic({ name, col = C.ink, sw = 1.7, s = 22 }: { name: string; col?: string; sw?: number; s?: number }) {
  const p = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: col, strokeWidth: sw, strokeLinecap: "round" as const, strokeLinejoin: "round" as const }
  switch (name) {
    case "chevron": return <svg {...p}><path d="M6 9l6 6 6-6"/></svg>
    case "close":   return <svg {...p}><path d="M6 6l12 12M18 6L6 18"/></svg>
    case "leaf":    return <svg {...p}><path d="M5 18c0-7 5-12 14-12 0 9-5 14-12 14-1 0-2-.5-2-2z"/><path d="M9 16c2-3 4-5 7-6"/></svg>
    case "swap":    return <svg {...p}><path d="M7 7h11l-3-3M17 17H6l3 3"/></svg>
    case "info":    return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.6v.2"/></svg>
    case "pot":     return <svg {...p}><path d="M4 10h16M5.5 10a6.5 6.5 0 0 0 13 0M3 10h18M9 4c0 1.4-1 1.6-1 3M13 4c0 1.4-1 1.6-1 3"/></svg>
    case "spark":   return <svg {...p}><path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z"/></svg>
    default: return null
  }
}

// ── Sheet ─────────────────────────────────────────────────────────────────────
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

// ── CookSheet ─────────────────────────────────────────────────────────────────
export function CookSheet({ meal, onClose }: { meal: BteMeal | null; onClose: () => void }) {
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

// ── WhySheet ──────────────────────────────────────────────────────────────────
export function WhySheet({ meal, onClose }: { meal: BteMeal | null; onClose: () => void }) {
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

// ── MealCard ──────────────────────────────────────────────────────────────────
export function MealCard({ m, open, onToggle, onWhy, onCook }: {
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
