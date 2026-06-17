"use client"
import Link from "next/link"

// ── Couleurs (Édito tonique) ──────────────────────────────────────────────────
export const C = {
  chassis:  "#1C160C",
  bg:       "#EFE6CF",
  surface:  "#FBF6EA",
  line:     "#E2D4B5",
  ink:      "#1E1B14",
  soft:     "#857A61",
  leaf:     "#4E7A3C",
  terra:    "#E8622A",
  amber:    "#F2B431",
  amberInk: "#A9742A",
  terraInk: "#C2552A",
  week:     ["#4E7A3C", "#E2A21E", "#C2552A"] as const,
}

export function rgba(hex: string, a: number): string {
  const h = hex.replace("#", "")
  return `rgba(${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)},${a})`
}

export function weekAccent(day: number): string {
  if (day <= 7)  return C.week[0]
  if (day <= 14) return C.week[1]
  return C.week[2]
}

// ── Icônes ────────────────────────────────────────────────────────────────────
type IcProps = { name: string; col?: string; sw?: number; s?: number }

export function Ic({ name, col = C.ink, sw = 1.7, s = 22 }: IcProps) {
  const p = {
    width: s, height: s, viewBox: "0 0 24 24", fill: "none",
    stroke: col, strokeWidth: sw,
    strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
  }
  switch (name) {
    case "jour":     return <svg {...p}><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/></svg>
    case "courses":  return <svg {...p}><path d="M5 8h14l-1.2 10.5a1.5 1.5 0 0 1-1.5 1.3H7.7a1.5 1.5 0 0 1-1.5-1.3z"/><path d="M8.5 8a3.5 3.5 0 0 1 7 0"/></svg>
    case "recettes": return <svg {...p}><path d="M4 13a8 8 0 0 0 16 0z"/><path d="M12 5c-1.6 0-2.6 1-2.6 2.6M12 5c1.6 0 2.6 1 2.6 2.6"/></svg>
    case "methode":  return <svg {...p}><path d="M5 5.5A1.5 1.5 0 0 1 6.5 4H18v16H6.5A1.5 1.5 0 0 0 5 21z"/><path d="M18 4v16"/></svg>
    case "coach":    return <svg {...p}><path d="M5 6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5v7A1.5 1.5 0 0 1 17.5 15H10l-4 3.5V15H6.5A1.5 1.5 0 0 1 5 13.5z"/></svg>
    case "leaf":     return <svg {...p}><path d="M5 18c0-7 5-12 14-12 0 9-5 14-12 14-1 0-2-.5-2-2z"/><path d="M9 16c2-3 4-5 7-6"/></svg>
    case "fish":     return <svg {...p}><path d="M3 12c3-4 8-5 13-3 2 .8 3.5 2 5 3-1.5 1-3 2.2-5 3-5 2-10 1-13-3z"/><path d="M18 10.5v.2"/><path d="M3 12c-.5-1.5-.5-3 0-4.5M3 12c-.5 1.5-.5 3 0 4.5"/></svg>
    case "box":      return <svg {...p}><path d="M4 8l8-4 8 4-8 4z"/><path d="M4 8v8l8 4 8-4V8"/><path d="M12 12v8"/></svg>
    case "bottle":   return <svg {...p}><path d="M10 3h4M10.5 3v3.5c0 .8-.4 1.4-1 2-.9.8-1.5 1.8-1.5 3V19a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V11.5c0-1.2-.6-2.2-1.5-3-.6-.6-1-1.2-1-2V3"/></svg>
    case "sprout":   return <svg {...p}><path d="M12 20v-7M12 13c0-3-2-5-5-5 0 3 2 5 5 5zM12 11c0-2.5 2-4.5 5-4.5 0 2.5-2 4.5-5 4.5z"/></svg>
    case "search":   return <svg {...p}><circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/></svg>
    case "clock":    return <svg {...p}><circle cx="12" cy="12" r="8"/><path d="M12 8v4l2.5 2"/></svg>
    case "swap":     return <svg {...p}><path d="M7 7h11l-3-3M17 17H6l3 3"/></svg>
    case "back":     return <svg {...p}><path d="M15 5l-7 7 7 7"/></svg>
    case "info":     return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.6v.2"/></svg>
    case "close":    return <svg {...p}><path d="M6 6l12 12M18 6L6 18"/></svg>
    case "spark":    return <svg {...p}><path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z"/></svg>
    case "shield":   return <svg {...p}><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>
    case "drop":     return <svg {...p}><path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z"/></svg>
    case "link2":    return <svg {...p}><path d="M9 12h6"/><path d="M9.5 8H8a4 4 0 0 0 0 8h1.5M14.5 8H16a4 4 0 0 1 0 8h-1.5"/></svg>
    case "moon":     return <svg {...p}><path d="M20 14.5A8 8 0 0 1 9.5 4 7 7 0 1 0 20 14.5z"/></svg>
    case "book":     return <svg {...p}><path d="M5 5.5A1.5 1.5 0 0 1 6.5 4H18v16H6.5A1.5 1.5 0 0 0 5 21z"/><path d="M18 4v16"/></svg>
    case "plus":     return <svg {...p}><path d="M12 6v12M6 12h12"/></svg>
    case "minus":    return <svg {...p}><path d="M6 12h12"/></svg>
    case "arrow":    return <svg {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    case "pause":    return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M10 9v6M14 9v6"/></svg>
    case "send":     return <svg {...p}><path d="M5 12l14-7-5 16-3.5-6.5z"/><path d="M10.5 14.5L19 5"/></svg>
    case "mail":     return <svg {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
    case "lock":     return <svg {...p}><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
    case "check":    return <svg {...p}><path d="M5 12.5l4.5 4.5L19 7"/></svg>
    case "chevron":  return <svg {...p}><path d="M6 9l6 6 6-6"/></svg>
    case "user":     return <svg {...p}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
    default: return null
  }
}

// ── Wordmark ──────────────────────────────────────────────────────────────────
export function Wordmark({ s = 20 }: { s?: number }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
      <span style={{
        width: s + 10, height: s + 10, borderRadius: 999,
        background: C.leaf, display: "inline-flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <Ic name="leaf" col="#fff" sw={1.8} s={Math.round(s * 0.65)} />
      </span>
      <span style={{
        fontFamily: "var(--heading)", fontWeight: 600, fontSize: s,
        color: C.ink, letterSpacing: "-0.01em",
      }}>backtoenergy</span>
    </div>
  )
}

// ── Barre de navigation basse ─────────────────────────────────────────────────
export type TabId = "jour" | "courses" | "recettes" | "methode" | "coach"

export function BottomTabs({ active, currentDay = 1 }: { active: TabId; currentDay?: number }) {
  const tabs: { id: TabId; label: string; href: string }[] = [
    { id: "jour",     label: "Jour",     href: "/jour" },
    { id: "courses",  label: "Courses",  href: "/courses" },
    { id: "recettes", label: "Recettes", href: "/recettes" },
    { id: "methode",  label: "Méthode",  href: "/methode" },
    { id: "coach",    label: "Coach",    href: "/chat" },
  ]
  return (
    <div style={{
      position: "sticky", bottom: 0, zIndex: 10,
      background: C.bg, borderTop: `1px solid ${C.line}`,
      padding: "9px 8px 16px", display: "flex",
    }}>
      {tabs.map(t => (
        <Link key={t.id} href={t.href} style={{
          flex: "1 1 0", textDecoration: "none",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          color: t.id === active ? C.terra : C.soft,
        }}>
          <Ic name={t.id} col={t.id === active ? C.terra : C.soft}
              sw={t.id === active ? 2.1 : 1.7} s={23} />
          <span style={{
            fontFamily: "var(--label)", fontSize: 10,
            fontWeight: t.id === active ? 700 : 500,
          }}>{t.label}</span>
        </Link>
      ))}
    </div>
  )
}
