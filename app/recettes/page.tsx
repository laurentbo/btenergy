"use client"
import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { calcCurrentDay } from "@/data/program"
import { C, rgba, Ic, BottomTabs } from "@/components/bte-ui"

// ── Données ───────────────────────────────────────────────────────────────────
const TYPES: Record<string, { label: string; color: string }> = {
  jus:     { label: "Jus",          color: "#4E7A3C" },
  poisson: { label: "Poisson",      color: "#2F7E90" },
  viande:  { label: "Viande maigre",color: "#C2552A" },
  vege:    { label: "Végé",         color: "#6E8F28" },
}

type Recipe = {
  key: string; type: keyof typeof TYPES; week: number; time?: string; title: string
  alt: string; sensation: string; ingredients: [string, string][]; swaps: string[]; why: string
}

const RECIPES: Recipe[] = [
  { key: "jus-vert", type: "jus", week: 1, time: "3 min", title: "Jus vert du réveil", alt: "2 alternatives",
    sensation: "Une gorgée fraîche, presque végétale, qui réveille sans secouer. En quelques minutes le corps s'allège et la tête s'éclaircit.",
    ingredients: [["Concombre","1"],["Céleri branche","2 branches"],["Épinards frais","1 poignée"],["Citron","½"],["Pomme verte","1"],["Gingembre","1 cm"]],
    swaps: ["Pas de céleri ? → fenouil, même fraîcheur","Trop relevé ? → enlève le gingembre"],
    why: "Le jus, c'est ton repas du matin à lui seul : pressé et bu à jeun, il passe vite et te laisse léger. La pomme reste un fruit — ici isolée, jamais en fin de repas." },
  { key: "tonic", type: "jus", week: 2, time: "4 min", title: "Tonic carotte-curcuma", alt: "1 alternative",
    sensation: "Doux, légèrement épicé, ça réchauffe de l'intérieur. Un petit coup de boost tranquille pour la matinée.",
    ingredients: [["Carottes","3"],["Curcuma frais","1 cm"],["Citron","½"],["Pomme","1"],["Eau","10 cl"]],
    swaps: ["Sans pomme ? → un peu de fenouil pour la douceur"],
    why: "Un jus de légumes-racines pris seul, à jeun. Le curcuma se réveille avec le citron ; rien d'autre dans l'estomac pour le ralentir." },
  { key: "jus-betterave", type: "jus", week: 3, time: "5 min", title: "Jus betterave & pomme", alt: "1 alternative",
    sensation: "Terreux et sucré-doux, une belle couleur qui réveille l'œil autant que le corps. Tu te sens posé, ancré.",
    ingredients: [["Betterave crue","1"],["Pomme verte","1"],["Citron","½"],["Gingembre","1 cm"]],
    swaps: ["Trop puissant ? → moitié betterave, moitié carotte"],
    why: "Pris seul le matin. La betterave et la pomme se pressent ensemble — fruit et légume en jus, isolés de tout repas." },
  { key: "cabillaud", type: "poisson", week: 1, title: "Cabillaud vapeur & légumes", alt: "saumon en alternative",
    sensation: "Léger, fondant, tout en finesse. Un déjeuner qui cale sans alourdir — tu repars net.",
    ingredients: [["Filet de cabillaud","150 g"],["Brocoli","½"],["Courgette","1"],["Citron","½"],["Huile d'olive","filet"],["Aneth","quelques brins"]],
    swaps: ["Pas de cabillaud ? → saumon, même cuisson vapeur","Sans brocoli ? → haricots verts"],
    why: "Du poisson avec des légumes, sans féculent : une seule protéine, digestion légère. On ne mélange jamais le poisson avec une autre protéine animale." },
  { key: "saumon", type: "poisson", week: 2, title: "Papillote de saumon & fenouil", alt: "cabillaud en alternative",
    sensation: "Parfumé, moelleux, ça sent bon dès l'ouverture de la papillote. Réconfortant sans être lourd.",
    ingredients: [["Pavé de saumon","140 g"],["Fenouil","1"],["Courgette","1"],["Citron","½"],["Huile d'olive","filet"]],
    swaps: ["Pas de saumon ? → cabillaud","Sans fenouil ? → poireau émincé"],
    why: "Poisson + légumes, sans féculent le midi : l'énergie reste stable l'après-midi. Une protéine animale par repas, pas deux." },
  { key: "sardines", type: "poisson", week: 3, title: "Sardines grillées & grande salade", alt: "maquereau en alternative",
    sensation: "Franc, iodé, ça réveille les papilles. Simplissime et plein de vie.",
    ingredients: [["Sardines fraîches","4"],["Roquette","2 poignées"],["Tomates","2"],["Citron","½"],["Huile d'olive","filet"]],
    swaps: ["Pas de sardines ? → maquereau, même esprit"],
    why: "Petit poisson + salade crue, sans féculent : une protéine légère, beaucoup de vivant à côté." },
  { key: "poulet", type: "viande", week: 1, title: "Poulet citron & courgettes", alt: "dinde en alternative",
    sensation: "Tendre et parfumé au citron, un classique qui rassure. Tu sors de table content et léger.",
    ingredients: [["Blanc de poulet","120 g"],["Courgettes","2"],["Citron","½"],["Thym","2 branches"],["Huile d'olive","filet"]],
    swaps: ["Pas de poulet ? → escalope de dinde","Sans courgette ? → aubergine rôtie"],
    why: "Viande maigre + légumes, sans féculent : une protéine, une digestion tranquille. Jamais deux protéines animales dans la même assiette." },
  { key: "dinde", type: "viande", week: 2, title: "Émincé de dinde & légumes verts", alt: "poulet en alternative",
    sensation: "Doux, sauté minute, encore croquant. Ça nourrit franchement sans peser.",
    ingredients: [["Émincé de dinde","120 g"],["Haricots verts","1 poignée"],["Courgette","1"],["Ail","1 gousse"],["Huile d'olive","filet"]],
    swaps: ["Pas de dinde ? → poulet","Sans haricots ? → brocoli"],
    why: "Volaille maigre + légumes verts, sans féculent : léger et rassasiant. Une seule protéine animale au repas." },
  { key: "buddha", type: "vege", week: 1, title: "Buddha bowl de printemps", alt: "2 alternatives",
    sensation: "Du croquant, du fondant, des couleurs : ça nourrit pour de vrai. Tu sors de table calé mais léger, sans le coup de barre de 14 h.",
    ingredients: [["Quinoa cuit","80 g"],["Avocat","½"],["Radis","4"],["Jeunes pousses","1 poignée"],["Graines de courge","1 c. à s."],["Huile d'olive + citron","filet"]],
    swaps: ["Pas de quinoa ? → sarrasin, même moelleux","Sans avocat ? → pois chiches rôtis"],
    why: "Que du végétal : une céréale, des légumes, de bonnes graisses. Pas de protéine animale avec le féculent — la digestion reste tranquille." },
  { key: "veloute", type: "vege", week: 1, title: "Velouté courgette & basilic", alt: "1 alternative",
    sensation: "Tout doux, tout chaud, réconfortant. Le genre de dîner qui apaise et prépare une nuit tranquille.",
    ingredients: [["Courgettes","2"],["Oignon","½"],["Basilic frais","1 poignée"],["Crème de cajou","1 c. à s."],["Bouillon de légumes","40 cl"],["Huile d'olive","filet"]],
    swaps: ["Pas de cajou ? → lait de coco, même velouté"],
    why: "Léger et sans féculent lourd le soir : le corps se repose. La crème de cajou remplace la crème de vache — zéro laitage." },
  { key: "curry", type: "vege", week: 2, title: "Curry de pois chiches & épinards", alt: "lentilles en alternative",
    sensation: "Parfumé, doux-épicé, ça enveloppe. Un dîner végétal qui tient au corps sans l'alourdir.",
    ingredients: [["Pois chiches cuits","120 g"],["Épinards frais","2 poignées"],["Lait de coco","15 cl"],["Oignon","½"],["Curry doux","1 c. à c."]],
    swaps: ["Pas de pois chiches ? → lentilles corail","Plus doux ? → moins de curry, plus de coco"],
    why: "Légumineuse + légumes, sans protéine animale : on peut associer aux féculents sans souci. Tout végétal, tout en douceur." },
  { key: "galettes", type: "vege", week: 3, title: "Galettes de sarrasin & ratatouille", alt: "1 alternative",
    sensation: "Moelleux dedans, doré dehors, avec une ratatouille fondante. Généreux et réconfortant.",
    ingredients: [["Farine de sarrasin","60 g"],["Eau","12 cl"],["Aubergine","½"],["Courgette","1"],["Tomates","2"],["Huile d'olive","filet"]],
    swaps: ["Sans aubergine ? → poivron rouge"],
    why: "Sarrasin (sans gluten) + légumes : un repas végétal complet. Aucune protéine animale, donc féculent bienvenu." },
]

const FILTERS = [["all","Tout"],["jus","Jus"],["poisson","Poisson"],["viande","Viande maigre"],["vege","Végé"]]

// ── Bottom-sheet « Pourquoi » ─────────────────────────────────────────────────
function WhySheet({ recipe, onClose }: { recipe: Recipe | null; onClose: () => void }) {
  if (!recipe) return null
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 60, background: rgba(C.ink, 0.55), display: "flex", alignItems: "flex-end", justifyContent: "center", animation: "fadeIn .2s ease" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 440, background: C.bg, borderRadius: "26px 26px 0 0", padding: "10px 20px 26px", border: `1.5px solid ${C.line}`, borderBottom: "none", animation: "bteUp .26s cubic-bezier(.2,.8,.2,1)" }}>
        <div style={{ width: 42, height: 5, borderRadius: 999, background: C.line, margin: "0 auto 16px" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ width: 32, height: 32, borderRadius: 10, background: rgba(C.leaf, 0.16), color: C.leaf, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <Ic name="spark" col={C.leaf} sw={1.8} s={19} />
            </span>
            <div style={{ fontFamily: "var(--heading)", fontWeight: 700, fontSize: 19, color: C.ink, letterSpacing: "-0.01em" }}>Pourquoi cette association&nbsp;?</div>
          </div>
          <button onClick={onClose} style={{ cursor: "pointer", width: 34, height: 34, borderRadius: 999, border: "none", background: C.surface, color: C.soft, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <Ic name="close" col={C.soft} sw={2} s={18} />
          </button>
        </div>
        <div style={{ fontFamily: "var(--label)", fontSize: 12, fontWeight: 700, color: C.leaf, marginBottom: 6 }}>{recipe.title}</div>
        <div style={{ fontSize: 15.5, lineHeight: 1.55, color: C.ink }}>{recipe.why}</div>
        <div style={{ marginTop: 16, fontSize: 12, color: C.soft, lineHeight: 1.5, borderTop: `1px solid ${C.line}`, paddingTop: 14 }}>
          La méthode tient en quelques gestes simples — on te les explique au fil des jours, jamais comme une liste d'interdits.
        </div>
      </div>
    </div>
  )
}

// ── Détail recette ────────────────────────────────────────────────────────────
function RecipeDetail({ r, onClose }: { r: Recipe; onClose: () => void }) {
  const [why, setWhy] = useState<Recipe | null>(null)
  const t = TYPES[r.type]
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 40, background: C.bg, display: "flex", justifyContent: "center", animation: "bteSlide .28s cubic-bezier(.2,.8,.2,1)" }}>
      <div style={{ width: "100%", maxWidth: 440, height: "100%", overflowY: "auto", background: C.bg }}>
        {/* Top bar */}
        <div style={{ position: "sticky", top: 0, zIndex: 5, background: rgba(C.bg, 0.92), backdropFilter: "blur(8px)", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: `1px solid ${C.line}` }}>
          <button onClick={onClose} style={{ cursor: "pointer", width: 40, height: 40, borderRadius: 999, border: `1.5px solid ${C.line}`, background: C.surface, color: C.ink, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <Ic name="back" col={C.ink} sw={2} s={20} />
          </button>
          <span style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 16, color: C.ink }}>Recette</span>
        </div>

        {/* Photo placeholder */}
        <div style={{ width: "100%", height: 220, background: C.line, filter: "saturate(1.05) brightness(1.02)" }} />

        <div style={{ padding: "16px 18px 40px" }}>
          {/* Tags */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8, flexWrap: "wrap" as const }}>
            <span style={{ fontFamily: "var(--label)", fontSize: 11, fontWeight: 700, color: t.color, background: rgba(t.color, 0.13), padding: "4px 10px", borderRadius: 999 }}>{t.label}</span>
            <span style={{ fontFamily: "var(--label)", fontSize: 11, fontWeight: 700, color: C.soft, background: C.surface, border: `1px solid ${C.line}`, padding: "4px 10px", borderRadius: 999 }}>Sem. {r.week}</span>
            {r.time && <span style={{ fontFamily: "var(--label)", fontSize: 11, fontWeight: 700, color: C.soft, display: "inline-flex", alignItems: "center", gap: 4, background: C.surface, border: `1px solid ${C.line}`, padding: "4px 10px", borderRadius: 999 }}><Ic name="clock" col={C.soft} sw={1.8} s={13} />{r.time}</span>}
          </div>

          {/* Titre */}
          <div style={{ fontFamily: "var(--heading)", fontWeight: 700, fontSize: 27, color: C.ink, letterSpacing: "-0.015em", lineHeight: 1.05, marginBottom: 18 }}>{r.title}</div>

          {/* Ingrédients */}
          <div style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 15.5, color: C.ink, marginBottom: 9 }}>Ce qu'il te faut</div>
          <div style={{ border: `1.5px solid ${C.line}`, borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
            {r.ingredients.map(([name, qty], i) => (
              <div key={name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderTop: i ? `1px solid ${C.line}` : "none", background: C.surface }}>
                <span style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14.5, color: C.ink }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: C.leaf, flexShrink: 0 }} />{name}
                </span>
                <span style={{ fontFamily: "var(--label)", fontSize: 12, fontWeight: 700, color: C.soft }}>{qty}</span>
              </div>
            ))}
          </div>

          {/* Alternatives */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
            <span style={{ width: 26, height: 26, borderRadius: 9, background: rgba(C.terra, 0.14), color: C.terra, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ic name="swap" col={C.terra} sw={1.9} s={16} /></span>
            <span style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 15.5, color: C.ink }}>Pas envie&nbsp;? Échange</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
            {r.swaps.map(s => (
              <div key={s} style={{ background: C.surface, border: `1.5px solid ${C.line}`, borderRadius: 12, padding: "10px 13px", fontSize: 13.5, color: C.ink, lineHeight: 1.35 }}>{s}</div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button style={{ flex: 1, cursor: "pointer", border: "none", background: C.terra, color: "#fff", fontFamily: "var(--label)", fontWeight: 700, fontSize: 15, padding: "15px 18px", borderRadius: 999, boxShadow: `0 12px 24px -12px ${rgba(C.terra, 0.9)}` }}>
              Cuisiner ce plat
            </button>
            <button onClick={() => setWhy(r)} style={{ flexShrink: 0, cursor: "pointer", width: 50, height: 50, borderRadius: 999, border: `1.5px solid ${C.line}`, background: C.surface, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <Ic name="info" col={C.leaf} sw={1.9} s={23} />
            </button>
          </div>
        </div>
        <WhySheet recipe={why} onClose={() => setWhy(null)} />
      </div>
    </div>
  )
}

// ── Carte recette ─────────────────────────────────────────────────────────────
function RecipeCard({ r, onOpen }: { r: Recipe; onOpen: (r: Recipe) => void }) {
  const t = TYPES[r.type]
  return (
    <button onClick={() => onOpen(r)} style={{ width: "100%", textAlign: "left", cursor: "pointer", border: `1.5px solid ${C.line}`, background: C.surface, borderRadius: 18, padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Photo pleine largeur */}
      <div style={{ width: "100%", height: 160, background: C.line, position: "relative", flexShrink: 0 }}>
        <span style={{ position: "absolute", top: 10, left: 10, width: 10, height: 10, borderRadius: 999, background: t.color, boxShadow: `0 0 0 2.5px ${rgba(C.surface, 0.9)}` }} />
      </div>
      {/* Infos */}
      <div style={{ padding: "12px 14px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" as const }}>
          <span style={{ fontFamily: "var(--label)", fontSize: 10.5, fontWeight: 700, color: t.color, background: rgba(t.color, 0.13), padding: "2px 8px", borderRadius: 999 }}>{t.label}</span>
          <span style={{ fontFamily: "var(--label)", fontSize: 10.5, fontWeight: 700, color: C.soft, background: C.bg, border: `1px solid ${C.line}`, padding: "2px 8px", borderRadius: 999 }}>Sem. {r.week}</span>
          {r.time && <span style={{ fontFamily: "var(--label)", fontSize: 10.5, fontWeight: 700, color: C.soft, display: "inline-flex", alignItems: "center", gap: 3 }}><Ic name="clock" col={C.soft} sw={1.8} s={12} />{r.time}</span>}
        </div>
        <div style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 18, color: C.ink, letterSpacing: "-0.01em", lineHeight: 1.1 }}>{r.title}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: C.soft }}>
            <Ic name="swap" col={C.terraInk} sw={1.9} s={14} />
            <span style={{ color: C.terraInk, fontWeight: 600 }}>{r.alt}</span>
          </div>
          <span style={{ transform: "rotate(-90deg)", flexShrink: 0, display: "inline-flex" }}><Ic name="chevron" col={C.soft} sw={2} s={18} /></span>
        </div>
      </div>
    </button>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function RecettesPage() {
  const router = useRouter()
  const supabase = createClient()
  const [currentDay, setCurrentDay] = useState(1)
  const [q, setQ]             = useState("")
  const [filter, setFilter]   = useState("all")
  const [open, setOpen]       = useState<Recipe | null>(null)
  const [ready, setReady]     = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.replace("/login"); return }
      const { data } = await supabase.from("profiles").select("program_start").eq("id", user.id).maybeSingle()
      if (data?.program_start) setCurrentDay(calcCurrentDay(data.program_start))
      setReady(true)
    })
  }, []) // eslint-disable-line

  const list = useMemo(() => {
    const ql = q.trim().toLowerCase()
    return RECIPES.filter(r => {
      if (filter !== "all" && r.type !== filter) return false
      if (!ql) return true
      if (r.title.toLowerCase().includes(ql)) return true
      return r.ingredients.some(([n]) => n.toLowerCase().includes(ql))
    })
  }, [q, filter])

  if (!ready) return <div style={{ minHeight: "100svh", background: C.bg }} />

  return (
    <div style={{ minHeight: "100svh", background: C.chassis, display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 440, minHeight: "100svh", background: C.bg, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, padding: "22px 18px 96px" }}>

          {/* En-tête */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: "var(--label)", fontSize: 10.5, color: C.soft, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const }}>Le carnet · 21 jours</div>
            <div style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 30, color: C.ink, letterSpacing: "-0.01em", lineHeight: 1.05, marginTop: 4 }}>Recettes</div>
            <div style={{ fontSize: 14, color: C.soft, marginTop: 4, lineHeight: 1.4 }}>Tout le programme à feuilleter, à ton rythme.</div>
          </div>

          {/* Recherche */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.surface, border: `1.5px solid ${C.line}`, borderRadius: 16, padding: "12px 14px", marginBottom: 14 }}>
            <Ic name="search" col={C.soft} sw={1.9} s={20} />
            <input
              value={q} onChange={e => setQ(e.target.value)}
              placeholder="Chercher un plat, un ingrédient…"
              style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "var(--sans)", fontSize: 15, color: C.ink }}
            />
            {q && <button onClick={() => setQ("")} style={{ cursor: "pointer", border: "none", background: "transparent", color: C.soft, display: "inline-flex" }}><Ic name="close" col={C.soft} sw={2} s={18} /></button>}
          </div>

          {/* Filtres */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 18, scrollbarWidth: "none" as const }}>
            {FILTERS.map(([key, label]) => {
              const on = filter === key
              const col = key === "all" ? C.leaf : (TYPES[key]?.color ?? C.leaf)
              return (
                <button key={key} onClick={() => setFilter(key)} style={{ flexShrink: 0, cursor: "pointer", border: `1.5px solid ${on ? col : C.line}`, background: on ? col : C.surface, color: on ? "#fff" : C.soft, fontFamily: "var(--label)", fontWeight: 700, fontSize: 13, padding: "8px 15px", borderRadius: 999, transition: "all .15s" }}>
                  {label}
                </button>
              )
            })}
          </div>

          {/* Compteur */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 12.5, color: C.soft, fontWeight: 600 }}>{list.length} recette{list.length > 1 ? "s" : ""}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, color: C.leaf, fontWeight: 700 }}>
              <Ic name="shield" col={C.leaf} sw={1.8} s={15} />Toutes conformes
            </span>
          </div>

          {/* Liste */}
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {list.map(r => <RecipeCard key={r.key} r={r} onOpen={setOpen} />)}
            {list.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 20px", color: C.soft }}>
                <div style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 17, color: C.ink, marginBottom: 4 }}>Rien sous ce nom</div>
                <div style={{ fontSize: 13.5 }}>Essaie un autre ingrédient, ou enlève le filtre.</div>
              </div>
            )}
          </div>
        </div>

        <BottomTabs active="recettes" currentDay={currentDay} />
      </div>

      {open && <RecipeDetail r={open} onClose={() => setOpen(null)} />}
    </div>
  )
}
