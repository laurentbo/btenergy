"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { calcCurrentDay } from "@/data/program"
import { C, rgba, Ic, BottomTabs } from "@/components/bte-ui"

// ── Données ───────────────────────────────────────────────────────────────────
const WEEKS = [
  { n: 1, range: "J1 – J7",   title: "Détox & purification",   desc: "Libérer le corps de sa charge toxique.",        accent: C.week[0], start: 1,  end: 7  },
  { n: 2, range: "J8 – J14",  title: "Énergie & vitalité",     desc: "L'énergie revient, le sommeil s'améliore.",     accent: C.week[1], start: 8,  end: 14 },
  { n: 3, range: "J15 – J21", title: "Ancrage & performance",  desc: "Ancrer les réflexes, devenir autonome.",       accent: C.week[2], start: 15, end: 21 },
]

const PILLARS = [
  { key: "jus",    icon: "drop",   title: "Les jus alcalins",        line: "Drainer, rééquilibrer le pH.",       more: "Pressés à cru, ils apportent minéraux et vitamines directement assimilables. Ils alcalinisent le terrain, drainent les déchets acides et reposent la digestion." },
  { key: "assoc",  icon: "link2",  title: "Les bonnes associations", line: "Manger sans fermenter.",             more: "Certains aliments digèrent mal ensemble : protéines et féculents fermentent et encrassent. En ne mariant que ce qui s'accorde, on digère vite et léger." },
  { key: "repos",  icon: "moon",   title: "Le repos digestif",       line: "Laisser le corps souffler.",         more: "Digérer mobilise 30 à 40 % de ton énergie. En allégeant les repas, tu rends cette énergie au corps — pour qu'il nettoie et se répare." },
  { key: "vivant", icon: "sprout", title: "Le vivant",               line: "Des aliments pleins d'enzymes.",     more: "Cru, l'aliment garde ses enzymes, celles que la cuisson détruit et qui font une partie du travail à ta place. Plus c'est vivant, plus ça nourrit vraiment." },
]

const ASIDE: [string, string][] = [
  ["Blé & gluten",           "inflammatoire"],
  ["Laitages de vache",      "acidifiants"],
  ["Protéine + féculent",    "fermentent ensemble"],
  ["Deux protéines / repas", "digestion longue"],
  ["Fruits en fin de repas", "toujours seuls"],
]

// ── Arc des semaines ──────────────────────────────────────────────────────────
function WeekArc({ currentDay }: { currentDay: number }) {
  return (
    <div style={{ position: "relative", paddingLeft: 6 }}>
      {WEEKS.map((w, i) => {
        const prog = currentDay >= w.start && currentDay <= w.end
          ? currentDay - w.start + 1
          : currentDay > w.end ? w.end - w.start + 1 : 0
        const state = currentDay >= w.start && currentDay <= w.end ? "current"
          : currentDay > w.end ? "done" : "soon"
        const last = i === WEEKS.length - 1
        return (
          <div key={w.n} style={{ display: "flex", gap: 15, position: "relative" }}>
            <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 38, height: 38, borderRadius: 999, background: state === "current" ? w.accent : C.surface, border: `2px solid ${state === "current" ? w.accent : rgba(w.accent, 0.55)}`, color: state === "current" ? "#fff" : w.accent, fontFamily: "var(--heading)", fontWeight: 700, fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>{w.n}</div>
              {!last && <div style={{ width: 2, flex: 1, background: C.line, marginTop: 2, marginBottom: 2 }} />}
            </div>
            <div style={{ flex: 1, paddingBottom: last ? 0 : 16 }}>
              <div style={{ background: state === "current" ? rgba(w.accent, 0.1) : C.surface, border: `1.5px solid ${state === "current" ? rgba(w.accent, 0.4) : C.line}`, borderRadius: 18, padding: "13px 15px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 3 }}>
                  <span style={{ fontFamily: "var(--label)", fontSize: 11, fontWeight: 700, color: C.soft, letterSpacing: "0.03em" }}>{w.range}</span>
                  {state === "current"
                    ? <span style={{ fontFamily: "var(--label)", fontSize: 10.5, fontWeight: 700, color: "#fff", background: w.accent, padding: "3px 9px", borderRadius: 999 }}>tu es ici · J{currentDay}</span>
                    : <span style={{ fontFamily: "var(--label)", fontSize: 10.5, fontWeight: 700, color: C.soft, background: C.bg, border: `1px solid ${C.line}`, padding: "3px 9px", borderRadius: 999 }}>{state === "done" ? "terminée" : "à venir"}</span>
                  }
                </div>
                <div style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 18, color: C.ink, letterSpacing: "-0.01em", lineHeight: 1.1 }}>{w.title}</div>
                <div style={{ fontSize: 13.5, color: C.soft, lineHeight: 1.4, marginTop: 3 }}>{w.desc}</div>
                {state === "current" && (
                  <div style={{ marginTop: 11 }}>
                    <div style={{ height: 6, borderRadius: 999, background: rgba(w.accent, 0.18), overflow: "hidden" }}>
                      <div style={{ width: `${(prog / 7) * 100}%`, height: "100%", background: w.accent, borderRadius: 999 }} />
                    </div>
                    <div style={{ fontSize: 11.5, color: w.accent, fontWeight: 700, marginTop: 5 }}>
                      Jour {prog} sur 7{prog === 7 ? " — bientôt la semaine suivante" : ""}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Bottom-sheet notion ───────────────────────────────────────────────────────
function NotionSheet({ open, onClose, currentDay }: { open: boolean; onClose: () => void; currentDay: number }) {
  if (!open) return null
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 60, background: rgba(C.ink, 0.55), display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 440, maxHeight: "86vh", overflowY: "auto", background: C.bg, borderRadius: "26px 26px 0 0", padding: "10px 22px 30px", border: `1.5px solid ${C.line}`, borderBottom: "none" }}>
        <div style={{ width: 42, height: 5, borderRadius: 999, background: C.line, margin: "0 auto 18px" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontFamily: "var(--label)", fontSize: 11, fontWeight: 700, color: C.leaf, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>Jour {currentDay} · La notion du jour</span>
          <button onClick={onClose} style={{ cursor: "pointer", width: 34, height: 34, borderRadius: 999, border: "none", background: C.surface, color: C.soft, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <Ic name="close" col={C.soft} sw={2} s={18} />
          </button>
        </div>
        <div style={{ fontFamily: "var(--heading)", fontWeight: 700, fontSize: 26, color: C.ink, letterSpacing: "-0.015em", lineHeight: 1.1, marginBottom: 14 }}>Le premier cap</div>
        {[
          "Une semaine que tu tiens. Si tu te sens parfois un peu flagada, c'est normal — et c'est même bon signe.",
          "Pendant ces premiers jours, le corps a fait le tri : il s'est délesté de ce qui l'encombrait. Ce petit coup de mou, c'est le ménage qui se termine.",
          "À partir de maintenant, le vent tourne. L'énergie remonte, le sommeil se pose, la tête s'éclaircit. Tu as fait le plus dur — la suite, c'est la récompense.",
        ].map((t, i) => (
          <p key={i} style={{ fontSize: 15.5, lineHeight: 1.6, color: C.ink, marginBottom: 12 }}>{t}</p>
        ))}
        <div style={{ marginTop: 6, background: rgba(C.leaf, 0.1), border: `1.5px solid ${rgba(C.leaf, 0.3)}`, borderRadius: 14, padding: "13px 15px", fontSize: 14, color: C.leaf, lineHeight: 1.45, fontWeight: 700 }}>
          Aujourd'hui, sois doux avec toi. Bois, marche, respire. Le corps travaille pour toi.
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function MethodePage() {
  const router = useRouter()
  const supabase = createClient()
  const [currentDay, setCurrentDay]   = useState(1)
  const [openPillar, setOpenPillar]   = useState<string | null>(null)
  const [notion, setNotion]           = useState(false)
  const [ready, setReady]             = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.replace("/login"); return }
      const { data } = await supabase.from("profiles").select("program_start").eq("id", user.id).maybeSingle()
      if (data?.program_start) setCurrentDay(calcCurrentDay(data.program_start))
      setReady(true)
    })
  }, []) // eslint-disable-line

  if (!ready) return <div style={{ minHeight: "100svh", background: C.bg }} />

  return (
    <div style={{ minHeight: "100svh", background: C.chassis, display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 440, minHeight: "100svh", background: C.bg, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, padding: "22px 18px 96px" }}>

          {/* En-tête */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontFamily: "var(--label)", fontSize: 10.5, color: C.soft, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 8 }}>La méthode</div>
            <div style={{ fontFamily: "var(--heading)", fontWeight: 700, fontSize: 34, color: C.ink, letterSpacing: "-0.01em", lineHeight: 1.04 }}>Nettoyer,<br />réveiller, durer</div>
            <div style={{ fontSize: 15, color: C.soft, marginTop: 8, lineHeight: 1.45 }}>Manger ce pour quoi le corps est fait — du vivant.</div>
          </div>

          {/* Arc 3 semaines */}
          <div style={{ fontFamily: "var(--label)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: C.soft, marginBottom: 12 }}>Les trois semaines</div>
          <div style={{ marginBottom: 26 }}><WeekArc currentDay={currentDay} /></div>

          {/* Notion du jour */}
          <div style={{ background: C.leaf, borderRadius: 24, padding: "18px", marginBottom: 26, position: "relative", overflow: "hidden", boxShadow: `0 18px 36px -20px ${rgba(C.leaf, 0.8)}` }}>
            <div style={{ position: "absolute", right: -30, top: -30, width: 120, height: 120, borderRadius: 999, background: rgba("#FFFFFF", 0.07) }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, position: "relative" }}>
              <span style={{ width: 30, height: 30, borderRadius: 9, background: rgba("#FFFFFF", 0.16), color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <Ic name="spark" col="#fff" sw={1.8} s={18} />
              </span>
              <span style={{ fontFamily: "var(--label)", fontSize: 11, fontWeight: 700, color: rgba("#FFFFFF", 0.88), letterSpacing: "0.08em", textTransform: "uppercase" as const }}>Jour {currentDay} · La notion du jour</span>
            </div>
            <div style={{ fontFamily: "var(--heading)", fontWeight: 700, fontSize: 23, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.1, marginBottom: 7, position: "relative" }}>Le premier cap</div>
            <div style={{ fontSize: 14.5, color: rgba("#FFFFFF", 0.85), lineHeight: 1.5, marginBottom: 16, position: "relative" }}>Une semaine que tu tiens. Voici pourquoi tu te sens parfois flagada — et pourquoi ça annonce du bon.</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, position: "relative" }}>
              <button onClick={() => setNotion(true)} style={{ cursor: "pointer", border: "none", background: "#fff", color: C.leaf, fontFamily: "var(--label)", fontWeight: 700, fontSize: 14, padding: "12px 20px", borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Ic name="book" col={C.leaf} sw={1.9} s={18} />Lire · 2 min
              </button>
              <span style={{ fontSize: 12, color: rgba("#FFFFFF", 0.85), fontWeight: 600, textAlign: "right" as const, lineHeight: 1.3 }}>{currentDay}ᵉ sur 21<br />débloquée</span>
            </div>
          </div>

          {/* Piliers 2×2 */}
          <div style={{ fontFamily: "var(--label)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: C.soft, marginBottom: 12 }}>Les piliers de la cure</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11, marginBottom: 26, alignItems: "start" }}>
            {PILLARS.map(p => {
              const isOpen = openPillar === p.key
              return (
                <button key={p.key} onClick={() => setOpenPillar(cur => cur === p.key ? null : p.key)} style={{ textAlign: "left", cursor: "pointer", border: `1.5px solid ${isOpen ? rgba(C.leaf, 0.4) : C.line}`, background: isOpen ? rgba(C.leaf, 0.1) : C.surface, borderRadius: 18, padding: 14, display: "flex", flexDirection: "column", gap: 8, transition: "all .15s" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ width: 36, height: 36, borderRadius: 11, background: rgba(C.leaf, 0.14), color: C.leaf, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Ic name={p.icon} col={C.leaf} sw={1.8} s={21} />
                    </span>
                    <Ic name={isOpen ? "minus" : "plus"} col={C.soft} sw={2} s={17} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 15.5, color: C.ink, letterSpacing: "-0.01em", lineHeight: 1.12 }}>{p.title}</div>
                    <div style={{ fontSize: 12.5, color: C.soft, lineHeight: 1.35, marginTop: 3 }}>{p.line}</div>
                  </div>
                  {isOpen && <div style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.45, borderTop: `1px solid ${rgba(C.leaf, 0.24)}`, paddingTop: 9 }}>{p.more}</div>}
                </button>
              )
            })}
          </div>

          {/* Ce qu'on met de côté */}
          <div style={{ fontFamily: "var(--label)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: C.soft, marginBottom: 12 }}>Ce qu'on met de côté</div>
          <div style={{ background: C.surface, border: `1.5px solid ${C.line}`, borderRadius: 20, padding: "16px 17px 8px" }}>
            <div style={{ display: "flex", gap: 11, marginBottom: 14 }}>
              <span style={{ flexShrink: 0, width: 38, height: 38, borderRadius: 11, background: rgba(C.soft, 0.14), color: C.soft, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <Ic name="pause" col={C.soft} sw={1.7} s={21} />
              </span>
              <div style={{ fontSize: 14, color: C.ink, lineHeight: 1.5 }}>
                <span style={{ fontFamily: "var(--heading)", fontWeight: 600 }}>Rien de définitif.</span> Juste ce qui alourdit, mis en pause le temps de la cure pour laisser le corps respirer.
              </div>
            </div>
            <div>
              {ASIDE.map(([name, why], i) => (
                <div key={name} style={{ display: "flex", alignItems: "baseline", gap: 11, padding: "11px 2px", borderTop: `1px solid ${C.line}` }}>
                  <span style={{ flexShrink: 0, width: 14, color: C.soft, fontWeight: 700, fontSize: 16, lineHeight: 1 }}>—</span>
                  <span style={{ flex: 1, fontSize: 14.5, fontWeight: 600, color: C.ink }}>{name}</span>
                  <span style={{ flexShrink: 0, fontSize: 12.5, color: C.soft, fontStyle: "italic" }}>{why}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <BottomTabs active="methode" currentDay={currentDay} />
      </div>

      <NotionSheet open={notion} onClose={() => setNotion(false)} currentDay={currentDay} />
    </div>
  )
}
