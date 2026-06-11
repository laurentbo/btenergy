"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { calcCurrentDay } from "@/data/program"
import { C, rgba, Ic, BottomTabs } from "@/components/bte-ui"

// ── Données ───────────────────────────────────────────────────────────────────
type Item = { name: string; n: number; unit: string; scale?: boolean; frais?: boolean; bio?: boolean }
type Group = { key: string; title: string; sub: string; icon: string; tone: "green" | "amber" | "terra"; note?: string; items: Item[] }

const GROUPS: Group[] = [
  {
    key: "fl", title: "Fruits & légumes", sub: "le vivant", icon: "leaf", tone: "green",
    items: [
      { name: "Concombres",    n: 2,   unit: "x",      frais: true },
      { name: "Céleri branche",n: 1,   unit: "botte",  frais: true },
      { name: "Épinards frais",n: 150, unit: "g",      frais: true, bio: true },
      { name: "Courgettes",    n: 3,   unit: "x",      frais: true, bio: true },
      { name: "Radis",         n: 1,   unit: "botte",  frais: true },
      { name: "Avocats",       n: 2,   unit: "x",      frais: true },
      { name: "Jeunes pousses",n: 1,   unit: "sachet", frais: true },
      { name: "Pommes vertes", n: 3,   unit: "x",      frais: true },
      { name: "Citrons",       n: 3,   unit: "x" },
      { name: "Basilic frais", n: 1,   unit: "botte",  frais: true },
      { name: "Oignons",       n: 2,   unit: "x" },
      { name: "Gingembre",     n: 1,   unit: "racine", scale: false },
    ],
  },
  {
    key: "prot", title: "Protéines", sub: "une par repas, jamais deux", icon: "fish", tone: "terra",
    note: "Une seule protéine animale par repas — jamais le poisson ET la viande ensemble.",
    items: [
      { name: "Œufs",               n: 6,   unit: "x",   bio: true },
      { name: "Filet de cabillaud",  n: 150, unit: "g",   frais: true },
      { name: "Blanc de poulet",     n: 120, unit: "g",   frais: true },
      { name: "Sardines (boîte)",    n: 1,   unit: "x",   scale: false },
    ],
  },
  {
    key: "epic", title: "Épicerie & secs", sub: "ça se garde", icon: "box", tone: "amber",
    items: [
      { name: "Quinoa",            n: 250, unit: "g",        scale: false, bio: true },
      { name: "Sarrasin",          n: 250, unit: "g",        scale: false },
      { name: "Pois chiches",      n: 1,   unit: "bocal",    scale: false },
      { name: "Graines de courge", n: 1,   unit: "sachet",   scale: false },
      { name: "Huile d'olive",     n: 1,   unit: "bouteille",scale: false, bio: true },
      { name: "Crème de cajou",    n: 1,   unit: "pot",      scale: false },
      { name: "Lait de coco",      n: 1,   unit: "brique",   scale: false },
      { name: "Bouillon de légumes",n: 1,  unit: "paquet",   scale: false },
    ],
  },
  {
    key: "bois", title: "Boissons", sub: "à garder sous la main · café toujours autorisé", icon: "bottle", tone: "green",
    items: [
      { name: "Thé vert",   n: 1, unit: "boîte",  scale: false },
      { name: "Infusions",  n: 1, unit: "boîte",  scale: false },
      { name: "Café",       n: 1, unit: "paquet", scale: false },
    ],
  },
]

const TONES = {
  green: { fg: C.leaf,     bg: rgba(C.leaf,  0.14) },
  amber: { fg: C.amberInk, bg: rgba(C.amber, 0.22) },
  terra: { fg: C.terraInk, bg: rgba(C.terra, 0.13) },
}

function fmtQty(it: Item, portions: number) {
  const mult = it.scale === false ? 1 : portions
  const n = it.n * mult
  return it.unit === "x" ? `×${n}` : `${n} ${it.unit}`
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CoursesPage() {
  const router = useRouter()
  const supabase = createClient()
  const [currentDay, setCurrentDay] = useState(1)
  const [portions, setPortions]     = useState(1)
  const [ready, setReady]           = useState(false)

  useEffect(() => {
    const stored = typeof window !== "undefined" ? Number(localStorage.getItem("bte-portions")) || 1 : 1
    setPortions(stored)
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.replace("/login"); return }
      const { data } = await supabase.from("profiles").select("program_start").eq("id", user.id).maybeSingle()
      if (data?.program_start) setCurrentDay(calcCurrentDay(data.program_start))
      setReady(true)
    })
  }, []) // eslint-disable-line

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("bte-portions", String(portions))
  }, [portions])

  const semaine   = Math.ceil(currentDay / 7)
  const weekColor = [C.leaf, "#E2A21E", C.terraInk][semaine - 1] ?? C.leaf

  if (!ready) return <div style={{ minHeight: "100svh", background: C.bg }} />

  return (
    <div style={{ minHeight: "100svh", background: C.chassis, display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 440, minHeight: "100svh", background: C.bg, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, padding: "22px 18px 96px" }}>

          {/* En-tête */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 10 }}>
              <span style={{
                fontFamily: "var(--label)", fontWeight: 700, fontSize: 12,
                color: "#fff", background: weekColor,
                padding: "5px 12px", borderRadius: 999, whiteSpace: "nowrap" as const,
              }}>SEMAINE {semaine}</span>
            </div>
            <div style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 30, color: C.ink, letterSpacing: "-0.01em", lineHeight: 1 }}>
              Tes courses
            </div>
            <div style={{ fontSize: 13, color: C.soft, fontWeight: 600, marginTop: 6, lineHeight: 1.35 }}>
              Ta liste, déduite de tes menus — rien à cocher, juste ton pense-bête.
            </div>
          </div>

          {/* Toggle portions */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 18 }}>
            <div style={{ fontSize: 13.5, color: C.soft, fontWeight: 600 }}>Tu cuisines pour…</div>
            <div style={{ display: "flex", background: C.surface, border: `1.5px solid ${C.line}`, borderRadius: 999, padding: 4 }}>
              {[1, 2].map(p => {
                const on = portions === p
                return (
                  <button key={p} onClick={() => setPortions(p)} style={{
                    cursor: "pointer", border: "none",
                    background: on ? C.leaf : "transparent",
                    color: on ? "#fff" : C.soft,
                    fontFamily: "var(--label)", fontWeight: 700, fontSize: 13,
                    padding: "8px 18px", borderRadius: 999, transition: "all .15s",
                  }}>
                    {p === 1 ? "Pour 1" : "Pour 2"}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Rythme des courses */}
          <div style={{ background: C.surface, border: `1.5px solid ${C.line}`, borderRadius: 18, padding: "16px 16px 14px", marginBottom: 22 }}>
            <div style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 15.5, color: C.ink, marginBottom: 13 }}>
              Le rythme des courses
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {/* Étape 1 */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                  <span style={{ width: 26, height: 26, borderRadius: 999, background: C.leaf, color: "#fff", fontFamily: "var(--heading)", fontWeight: 700, fontSize: 14, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>1</span>
                  <span style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 14.5, color: C.ink }}>Le gros plein</span>
                </div>
                <div style={{ display: "inline-block", fontFamily: "var(--label)", fontSize: 10.5, fontWeight: 700, color: C.leaf, background: rgba(C.leaf, 0.14), padding: "2px 8px", borderRadius: 999, marginBottom: 6 }}>Maintenant</div>
                <div style={{ fontSize: 12.5, color: C.soft, lineHeight: 1.4 }}>Secs, boissons, épicerie : tout ce qui se garde.</div>
              </div>
              <div style={{ width: 1, background: C.line, flexShrink: 0, alignSelf: "stretch" }} />
              {/* Étape 2 */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                  <span style={{ width: 26, height: 26, borderRadius: 999, background: C.amber, color: C.ink, fontFamily: "var(--heading)", fontWeight: 700, fontSize: 14, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>2</span>
                  <span style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 14.5, color: C.ink }}>Le frais</span>
                </div>
                <div style={{ display: "inline-block", fontFamily: "var(--label)", fontSize: 10.5, fontWeight: 700, color: C.amberInk, background: rgba(C.amber, 0.22), padding: "2px 8px", borderRadius: 999, marginBottom: 6 }}>En milieu de semaine</div>
                <div style={{ fontSize: 12.5, color: C.soft, lineHeight: 1.4 }}>Tu rachètes tes fruits & légumes vers le jour 4, pour qu'ils soient toujours bien frais.</div>
              </div>
            </div>
          </div>

          {/* Liste par rayon */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {GROUPS.map(g => {
              const tone = TONES[g.tone]
              return (
                <div key={g.key}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, padding: "0 2px" }}>
                    <span style={{ width: 32, height: 32, borderRadius: 10, background: tone.bg, color: tone.fg, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Ic name={g.icon} col={tone.fg} sw={1.8} s={19} />
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 17, color: C.ink, letterSpacing: "-0.01em", lineHeight: 1 }}>{g.title}</div>
                      <div style={{ fontSize: 12, color: C.soft, marginTop: 3 }}>{g.sub}</div>
                    </div>
                  </div>

                  {g.note && (
                    <div style={{ background: rgba(C.terra, 0.1), border: `1.5px solid ${rgba(C.terra, 0.3)}`, borderRadius: 13, padding: "9px 12px", fontSize: 12.5, color: C.terraInk, lineHeight: 1.4, marginBottom: 9, fontWeight: 600 }}>
                      {g.note}
                    </div>
                  )}

                  <div style={{ background: C.surface, border: `1.5px solid ${C.line}`, borderRadius: 16, overflow: "hidden" }}>
                    {g.items.map((it, i) => (
                      <div key={it.name} style={{ borderTop: i ? `1px solid ${C.line}` : "none" }}>
                        <div style={{ width: "100%", padding: "12px 14px", display: "flex", alignItems: "center", gap: 11 }}>
                          <span style={{ flexShrink: 0, width: 6, height: 6, borderRadius: 999, background: C.leaf }} />
                          <span style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" as const }}>
                            <span style={{ fontSize: 14.5, fontWeight: 600, color: C.ink }}>{it.name}</span>
                            {it.frais && <span style={{ fontSize: 10, fontWeight: 700, color: C.amberInk, background: rgba(C.amber, 0.22), padding: "2px 7px", borderRadius: 999 }}>frais</span>}
                            {it.bio   && <span style={{ fontSize: 10, fontWeight: 700, color: C.leaf,     background: rgba(C.leaf,  0.14), padding: "2px 7px", borderRadius: 999 }}>bio</span>}
                          </span>
                          <span style={{ flexShrink: 0, fontFamily: "var(--label)", fontSize: 12, fontWeight: 700, color: C.soft }}>
                            {fmtQty(it, portions)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pied bio & local */}
          <div style={{ marginTop: 18, padding: "0 4px", display: "flex", gap: 10 }}>
            <span style={{ flexShrink: 0, color: C.leaf, marginTop: 1 }}>
              <Ic name="sprout" col={C.leaf} sw={1.7} s={20} />
            </span>
            <div style={{ fontSize: 12.5, color: C.soft, lineHeight: 1.5 }}>
              <span style={{ fontWeight: 700, color: C.ink }}>Bio & local, quand tu peux</span> — surtout pour les légumes. Souvent pas plus cher dès que tu cuisines toi-même.
            </div>
          </div>
        </div>

        <BottomTabs active="courses" currentDay={currentDay} />
      </div>
    </div>
  )
}
