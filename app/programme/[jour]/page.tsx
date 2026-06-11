"use client"
import { useState, useEffect, useMemo, useRef } from "react"
import { use } from "react"
import { useRouter } from "next/navigation"
import { VERISSIMO_PROGRAM, type VerissimoJour } from "@/data/verissimo"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

// Semaine meta (labels pour l'affichage)
const SEMAINES: Record<number, { label: string; phase: string }> = {
  1: { label: "Semaine 1", phase: "Détox & Purification" },
  2: { label: "Semaine 2", phase: "Énergie & Vitalité" },
  3: { label: "Semaine 3", phase: "Ancrage & Performance" },
}

// Photos generiques par slot (design "Édito tonique")
const MEAL_PHOTO: Record<string, string> = {
  petit_dej: "/repas/petit-dej.png",
  dejeuner:  "/repas/dejeuner.jpg",
  diner:     "/repas/diner.jpg",
}

// Design tokens (miroir globals.css)
const C = {
  bg:      "#EFE6CF",
  surface: "#FBF6EA",
  lift:    "#EAE0C7",
  line:    "#E2D4B5",
  ink:     "#1E1B14",
  soft:    "#857A61",
  mute:    "rgba(30,27,20,0.45)",
  leaf:    "#4E7A3C",
  terra:   "#E8622A",
  amber:   "#F2B431",
}

// ── Icônes ────────────────────────────────────────────────────────────────────
function Ic({ name, col = C.ink, sw = 1.7, s = 22 }: { name: string; col?: string; sw?: number; s?: number }) {
  const p = { width: s, height: s, viewBox: "0 0 24 24", fill: "none" as const, stroke: col, strokeWidth: sw, strokeLinecap: "round" as const, strokeLinejoin: "round" as const }
  switch (name) {
    case "jour":     return <svg {...p}><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/></svg>
    case "courses":  return <svg {...p}><path d="M5 8h14l-1.2 10.5a1.5 1.5 0 0 1-1.5 1.3H7.7a1.5 1.5 0 0 1-1.5-1.3z"/><path d="M8.5 8a3.5 3.5 0 0 1 7 0"/></svg>
    case "recettes": return <svg {...p}><path d="M4 13a8 8 0 0 0 16 0z"/><path d="M12 5c-1.6 0-2.6 1-2.6 2.6M12 5c1.6 0 2.6 1 2.6 2.6"/></svg>
    case "methode":  return <svg {...p}><path d="M5 5.5A1.5 1.5 0 0 1 6.5 4H18v16H6.5A1.5 1.5 0 0 0 5 21z"/><path d="M18 4v16"/></svg>
    case "coach":    return <svg {...p}><path d="M5 6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5v7A1.5 1.5 0 0 1 17.5 15H10l-4 3.5V15H6.5A1.5 1.5 0 0 1 5 13.5z"/></svg>
    case "chevron":  return <svg {...p}><path d="M6 9l6 6 6-6"/></svg>
    case "spark":    return <svg {...p}><path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z"/></svg>
    default: return null
  }
}

// ── Progress circle ───────────────────────────────────────────────────────────
function ProgressCircle({ jour }: { jour: number }) {
  const pct = Math.round((jour / 21) * 100)
  const r = 18, circ = 2 * Math.PI * r
  const fill = (jour / 21) * circ
  return (
    <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
      <svg width={48} height={48} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={24} cy={24} r={r} fill="none" stroke={C.line} strokeWidth={3} />
        <circle cx={24} cy={24} r={r} fill="none" stroke={C.leaf} strokeWidth={3}
          strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" style={{ transition: "stroke-dasharray .4s" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--label)", fontWeight: 700, fontSize: 11, color: C.ink, lineHeight: 1 }}>{pct}%</span>
      </div>
    </div>
  )
}

// ── Sélecteur de jours ────────────────────────────────────────────────────────
function DayPicker({ current, total = 21 }: { current: number; total?: number }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Centre le jour actif au chargement
  useEffect(() => {
    const el = scrollRef.current?.querySelector(`[data-day="${current}"]`) as HTMLElement | null
    el?.scrollIntoView({ inline: "center", behavior: "instant" })
  }, [current])

  const semaine = (d: number) => Math.ceil(d / 7)
  const semColor = (d: number): string => {
    const s = semaine(d)
    return s === 1 ? C.leaf : s === 2 ? C.amber : "#C2552A"
  }

  return (
    <div>
      <div ref={scrollRef} style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 6, scrollbarWidth: "none" }}>
        {Array.from({ length: total }, (_, i) => {
          const d = i + 1
          const active = d === current
          const past = d < current
          const col = semColor(d)
          return (
            <Link key={d} href={`/programme/${d}`} data-day={d} style={{
              textDecoration: "none", flexShrink: 0,
              width: 34, height: 34, borderRadius: 999,
              background: active ? col : past ? `rgba(${col === C.leaf ? "78,122,60" : col === C.amber ? "242,180,49" : "194,85,42"},0.14)` : "transparent",
              border: `1.5px solid ${active ? col : past ? "transparent" : C.line}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--label)", fontWeight: 700, fontSize: 12,
              color: active ? "#fff" : past ? col : C.soft,
              transition: "all .15s",
            }}>
              {d}
            </Link>
          )
        })}
      </div>

      {/* Barre de progression */}
      <div style={{ marginTop: 8, height: 3, background: C.line, borderRadius: 2 }}>
        <div style={{
          height: "100%", borderRadius: 2,
          background: `linear-gradient(90deg, ${C.leaf}, ${C.amber}, #C2552A)`,
          width: `${Math.min(100, (current / total) * 100)}%`,
          transition: "width .4s",
        }} />
      </div>
    </div>
  )
}

// ── Carte repas ───────────────────────────────────────────────────────────────
function MealCard({ slot, label, content, photo, index }: {
  slot: string; label: string; content: string; photo: string; index: number
}) {
  const [open, setOpen] = useState(false)

  const badgeColors = [
    { bg: C.terra, fg: "#fff" },
    { bg: C.amber, fg: C.ink },
    { bg: C.leaf,  fg: "#fff" },
  ]
  const badge = badgeColors[index % 3]

  return (
    <div style={{ borderRadius: 16, overflow: "hidden", border: `1.5px solid ${C.line}`, background: C.surface }}>
      {/* Image header */}
      <button onClick={() => setOpen(o => !o)} style={{
        all: "unset", display: "block", width: "100%", cursor: "pointer", position: "relative",
      }}>
        <img src={photo} alt={label} style={{
          width: "100%", height: open ? 180 : 90, objectFit: "cover", display: "block",
          transition: "height .25s ease",
        }} />
        {/* Slot badge */}
        <span style={{
          position: "absolute", top: 10, left: 10,
          fontFamily: "var(--label)", fontWeight: 700, fontSize: 10,
          letterSpacing: "0.1em", textTransform: "uppercase",
          background: badge.bg, color: badge.fg,
          padding: "4px 10px", borderRadius: 999,
        }}>{slot}</span>
        {/* Chevron */}
        <span style={{
          position: "absolute", bottom: 10, right: 10,
          width: 28, height: 28, borderRadius: 999,
          background: "rgba(30,27,20,.55)", display: "flex", alignItems: "center", justifyContent: "center",
          transform: open ? "rotate(180deg)" : "none", transition: "transform .2s",
        }}>
          <Ic name="chevron" col="#fff" sw={2.2} s={16} />
        </span>
      </button>

      {/* Content */}
      <div style={{ padding: open ? "13px 16px 16px" : "11px 16px 13px" }}>
        <div style={{
          fontFamily: "var(--heading)", fontWeight: 600, fontSize: 17,
          color: C.ink, lineHeight: 1.15,
        }}>{label}</div>

        {open && (
          <div style={{ marginTop: 8, fontSize: 13.5, color: C.soft, lineHeight: 1.55 }}>
            {content}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Bottom tab bar ────────────────────────────────────────────────────────────
function BottomTabs({ activeJour }: { activeJour: number }) {
  const tabs = [
    { id: "jour",     label: "Jour",     href: `/programme/${activeJour}` },
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
          color: t.id === "jour" ? C.terra : C.soft,
        }}>
          <Ic name={t.id} col={t.id === "jour" ? C.terra : C.soft}
            sw={t.id === "jour" ? 2.1 : 1.7} s={23} />
          <span style={{
            fontFamily: "var(--label)", fontSize: 10,
            fontWeight: t.id === "jour" ? 700 : 500,
          }}>{t.label}</span>
        </Link>
      ))}
    </div>
  )
}

// ── Page principale ───────────────────────────────────────────────────────────
export default function ProgrammeJour({ params }: { params: Promise<{ jour: string }> }) {
  const { jour: jourParam } = use(params)
  const jourActuel = Math.min(21, Math.max(1, parseInt(jourParam, 10) || 1))

  const [prenom, setPrenom] = useState("")
  const supabase = useMemo(() => createClient(), [])
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.replace("/login"); return }
      const { data } = await supabase.from("profiles").select("prenom").eq("id", user.id).maybeSingle()
      setPrenom(data?.prenom ?? "")
    })
  }, []) // eslint-disable-line

  const jour = VERISSIMO_PROGRAM[jourActuel - 1] as VerissimoJour
  const sem = Math.ceil(jourActuel / 7)
  const semMeta = SEMAINES[sem]

  if (!jour) return <div style={{ background: C.bg, minHeight: "100dvh" }} />

  return (
    <div style={{ background: C.bg, minHeight: "100dvh", display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ flex: 1, overflow: "auto", padding: "26px 22px 24px" }}>

        {/* ── Row 1 : badge + progress circle + avatar ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{
            fontFamily: "var(--label)", fontWeight: 700, fontSize: 12,
            color: C.surface, background: C.ink,
            padding: "5px 13px", borderRadius: 999,
          }}>
            JOUR {String(jourActuel).padStart(2, "0")}<span style={{ color: C.amber }}> / 21</span>
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ProgressCircle jour={jourActuel} />
            <Link href="/profil" aria-label="Mon profil" style={{
              flexShrink: 0, width: 34, height: 34, borderRadius: 999,
              background: C.terra, color: "#fff",
              fontFamily: "var(--heading)", fontWeight: 700, fontSize: 15,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              textDecoration: "none",
            }}>
              {prenom ? prenom[0].toUpperCase() : "?"}
            </Link>
          </div>
        </div>

        {/* ── Titre ── */}
        <div style={{
          fontFamily: "var(--heading)", fontWeight: 600,
          fontSize: 38, lineHeight: 1.0, letterSpacing: "-0.02em",
          color: C.ink, marginBottom: 6,
        }}>
          Bonjour{prenom ? <> <span style={{ color: C.terra }}>{prenom}</span></> : ""}
        </div>
        <div style={{
          fontFamily: "var(--heading)", fontStyle: "italic",
          fontSize: 15, color: C.leaf, lineHeight: 1.4, marginBottom: 22,
        }}>
          {jour.titre}
        </div>

        {/* ── Sélecteur de jours ── */}
        <DayPicker current={jourActuel} />

        {/* ── Phase ── */}
        <div style={{
          marginTop: 18, marginBottom: 14,
          fontFamily: "var(--label)", fontWeight: 700, fontSize: 10.5,
          letterSpacing: "0.18em", textTransform: "uppercase" as const,
          color: C.leaf,
        }}>
          {semMeta.label} · {semMeta.phase}
        </div>

        {/* ── Carte du jour ── */}
        <div style={{
          background: "rgba(78,122,60,0.08)", border: `1.5px solid rgba(78,122,60,0.2)`,
          borderRadius: 14, padding: "13px 15px 14px", marginBottom: 24,
          display: "flex", alignItems: "flex-start", gap: 12,
        }}>
          <span style={{ flexShrink: 0, marginTop: 1 }}>
            <Ic name="spark" col={C.leaf} sw={1.9} s={20} />
          </span>
          <div>
            <div style={{
              fontFamily: "var(--label)", fontWeight: 700, fontSize: 10.5,
              letterSpacing: "0.14em", textTransform: "uppercase" as const,
              color: C.leaf, marginBottom: 5,
            }}>
              {jourActuel === 1 ? "C'est parti" : `Jour ${jourActuel}`}
            </div>
            <div style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.45 }}>
              {jour.conseil}
            </div>
          </div>
        </div>

        {/* ── Repas du jour ── */}
        <div style={{
          fontFamily: "var(--label)", fontWeight: 700, fontSize: 10.5,
          letterSpacing: "0.18em", textTransform: "uppercase" as const,
          color: C.soft, marginBottom: 12,
        }}>
          Tes repas du jour
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <MealCard
            slot="Petit-déjeuner" index={0}
            label={jour.petit_dej}
            content={`Manger lentement, sans écran. Ce repas donne le ton de la journée.`}
            photo={MEAL_PHOTO.petit_dej}
          />
          <MealCard
            slot="Déjeuner" index={1}
            label={jour.dejeuner}
            content={jour.commentaire ?? `Prendre le temps de mâcher. Coudées — tu peux t'arrêter avant d'être rassasié.`}
            photo={MEAL_PHOTO.dejeuner}
          />
          <MealCard
            slot="Dîner" index={2}
            label={jour.diner}
            content={jour.umami ? `${jour.umami}` : `Repas léger, en conscience. Arrête-toi dès que tu te sens rassasié.`}
            photo={MEAL_PHOTO.diner}
          />
        </div>

        {/* ── Ce que tu peux ressentir ── */}
        {jour.ressenti && (
          <div style={{
            marginTop: 20,
            background: "rgba(232,98,42,0.07)", border: `1.5px solid rgba(232,98,42,0.18)`,
            borderRadius: 14, padding: "13px 15px",
          }}>
            <div style={{
              fontFamily: "var(--label)", fontWeight: 700, fontSize: 10,
              letterSpacing: "0.16em", textTransform: "uppercase" as const,
              color: C.terra, marginBottom: 6,
            }}>
              Ce que tu peux ressentir
            </div>
            <div style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.5, fontStyle: "italic" }}>
              {jour.ressenti}
            </div>
          </div>
        )}

        <div style={{ height: 24 }} />
      </div>

      <BottomTabs activeJour={jourActuel} />
    </div>
  )
}
