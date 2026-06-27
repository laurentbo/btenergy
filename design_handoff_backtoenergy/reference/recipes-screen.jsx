// recipes-screen.jsx — backtoenergy · écran « Recettes » (carnet des 21 jours)
// Recherche + filtres par type de protéine. Direction visuelle : « Édito tonique »
// (papier sable + Baloo 2), cohérente avec les écrans J0, Jour et Courses.
// L'ancienne version « Nuit verte » est conservée dans _archive_nuitverte/.

const { useState, useMemo } = React;

// ---------- couleurs (Édito tonique) ----------
const c = {
  chassis: "#1C160C",
  bg: "#EFE6CF",
  paper2: "#FBF6EA",
  ink: "#1E1B14",
  soft: "#857A61",
  line: "#E2D4B5",
  green: "#4E7A3C",
  accent: "#E8622A",
  pop: "#F2B431",
  terraInk: "#C2552A"
};
const SER = "'Baloo 2', sans-serif";
const GRO = "'Space Grotesk', sans-serif";
const BODY = "'Hanken Grotesk', sans-serif";
function rgba(hex, a) { const h = hex.replace("#", ""); return `rgba(${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)},${a})`; }

// type de protéine — accents profonds (portent du blanc en aplat, lisibles en texte sur sable)
const TYPES = {
  jus: { label: "Jus", color: "#4E7A3C" },
  poisson: { label: "Poisson", color: "#2F7E90" },
  viande: { label: "Viande maigre", color: "#C2552A" },
  vege: { label: "Végé", color: "#6E8F28" },
};

const RECIPES = [
  {
    key: "jus-vert", type: "jus", week: 1, time: "3 min", title: "Jus vert du réveil",
    alt: "2 alternatives",
    sensation: "Une gorgée fraîche, presque végétale, qui réveille sans secouer. En quelques minutes le corps s'allège et la tête s'éclaircit.",
    caution: null,
    ingredients: [["Concombre","1"],["Céleri branche","2 branches"],["Épinards frais","1 poignée"],["Citron","½"],["Pomme verte","1"],["Gingembre","1 cm"]],
    swaps: ["Pas de céleri ? → fenouil, même fraîcheur", "Trop relevé ? → enlève le gingembre"],
    why: "Le jus, c'est ton repas du matin à lui seul : pressé et bu à jeun, il passe vite et te laisse léger. La pomme reste un fruit — ici isolée, jamais en fin de repas.",
  },
  {
    key: "tonic", type: "jus", week: 2, time: "4 min", title: "Tonic carotte-curcuma",
    alt: "1 alternative",
    sensation: "Doux, légèrement épicé, ça réchauffe de l'intérieur. Un petit coup de boost tranquille pour la matinée.",
    caution: null,
    ingredients: [["Carottes","3"],["Curcuma frais","1 cm"],["Citron","½"],["Pomme","1"],["Eau","10 cl"]],
    swaps: ["Sans pomme ? → un peu de fenouil pour la douceur"],
    why: "Un jus de légumes-racines pris seul, à jeun. Le curcuma se réveille avec le citron ; rien d'autre dans l'estomac pour le ralentir.",
  },
  {
    key: "jus-betterave", type: "jus", week: 3, time: "5 min", title: "Jus betterave & pomme",
    alt: "1 alternative",
    sensation: "Terreux et sucré-doux, une belle couleur qui réveille l'œil autant que le corps. Tu te sens posé, ancré.",
    caution: null,
    ingredients: [["Betterave crue","1"],["Pomme verte","1"],["Citron","½"],["Gingembre","1 cm"]],
    swaps: ["Trop puissant ? → moitié betterave, moitié carotte"],
    why: "Pris seul le matin. La betterave et la pomme se pressent ensemble — fruit et légume en jus, isolés de tout repas.",
  },
  {
    key: "cabillaud", type: "poisson", week: 1, title: "Cabillaud vapeur & légumes",
    alt: "saumon en alternative",
    sensation: "Léger, fondant, tout en finesse. Un déjeuner qui cale sans alourdir — tu repars net.",
    caution: null,
    ingredients: [["Filet de cabillaud","150 g"],["Brocoli","½"],["Courgette","1"],["Citron","½"],["Huile d'olive","filet"],["Aneth","quelques brins"]],
    swaps: ["Pas de cabillaud ? → saumon, même cuisson vapeur", "Sans brocoli ? → haricots verts"],
    why: "Du poisson avec des légumes, sans féculent : une seule protéine, digestion légère. On ne mélange jamais le poisson avec une autre protéine animale.",
  },
  {
    key: "saumon", type: "poisson", week: 2, title: "Papillote de saumon & fenouil",
    alt: "cabillaud en alternative",
    sensation: "Parfumé, moelleux, ça sent bon dès l'ouverture de la papillote. Réconfortant sans être lourd.",
    caution: null,
    ingredients: [["Pavé de saumon","140 g"],["Fenouil","1"],["Courgette","1"],["Citron","½"],["Huile d'olive","filet"]],
    swaps: ["Pas de saumon ? → cabillaud", "Sans fenouil ? → poireau émincé"],
    why: "Poisson + légumes, sans féculent le midi : l'énergie reste stable l'après-midi. Une protéine animale par repas, pas deux.",
  },
  {
    key: "sardines", type: "poisson", week: 3, title: "Sardines grillées & grande salade",
    alt: "maquereau en alternative",
    sensation: "Franc, iodé, ça réveille les papilles. Simplissime et plein de vie.",
    caution: null,
    ingredients: [["Sardines fraîches","4"],["Roquette","2 poignées"],["Tomates","2"],["Citron","½"],["Huile d'olive","filet"]],
    swaps: ["Pas de sardines ? → maquereau, même esprit"],
    why: "Petit poisson + salade crue, sans féculent : une protéine légère, beaucoup de vivant à côté.",
  },
  {
    key: "poulet", type: "viande", week: 1, title: "Poulet citron & courgettes",
    alt: "dinde en alternative",
    sensation: "Tendre et parfumé au citron, un classique qui rassure. Tu sors de table content et léger.",
    caution: null,
    ingredients: [["Blanc de poulet","120 g"],["Courgettes","2"],["Citron","½"],["Thym","2 branches"],["Huile d'olive","filet"]],
    swaps: ["Pas de poulet ? → escalope de dinde", "Sans courgette ? → aubergine rôtie"],
    why: "Viande maigre + légumes, sans féculent : une protéine, une digestion tranquille. Jamais deux protéines animales dans la même assiette.",
  },
  {
    key: "dinde", type: "viande", week: 2, title: "Émincé de dinde & légumes verts",
    alt: "poulet en alternative",
    sensation: "Doux, sauté minute, encore croquant. Ça nourrit franchement sans peser.",
    caution: null,
    ingredients: [["Émincé de dinde","120 g"],["Haricots verts","1 poignée"],["Courgette","1"],["Ail","1 gousse"],["Huile d'olive","filet"]],
    swaps: ["Pas de dinde ? → poulet", "Sans haricots ? → brocoli"],
    why: "Volaille maigre + légumes verts, sans féculent : léger et rassasiant. Une seule protéine animale au repas.",
  },
  {
    key: "buddha", type: "vege", week: 1, title: "Buddha bowl de printemps",
    alt: "2 alternatives",
    sensation: "Du croquant, du fondant, des couleurs : ça nourrit pour de vrai. Tu sors de table calé mais léger, sans le coup de barre de 14 h.",
    caution: null,
    ingredients: [["Quinoa cuit","80 g"],["Avocat","½"],["Radis","4"],["Jeunes pousses","1 poignée"],["Graines de courge","1 c. à s."],["Huile d'olive + citron","filet"]],
    swaps: ["Pas de quinoa ? → sarrasin, même moelleux", "Sans avocat ? → pois chiches rôtis"],
    why: "Que du végétal : une céréale, des légumes, de bonnes graisses. Pas de protéine animale avec le féculent — la digestion reste tranquille.",
  },
  {
    key: "veloute", type: "vege", week: 1, title: "Velouté courgette & basilic",
    alt: "1 alternative",
    sensation: "Tout doux, tout chaud, réconfortant. Le genre de dîner qui apaise et prépare une nuit tranquille.",
    caution: null,
    ingredients: [["Courgettes","2"],["Oignon","½"],["Basilic frais","1 poignée"],["Crème de cajou","1 c. à s."],["Bouillon de légumes","40 cl"],["Huile d'olive","filet"]],
    swaps: ["Pas de cajou ? → lait de coco, même velouté"],
    why: "Léger et sans féculent lourd le soir : le corps se repose. La crème de cajou remplace la crème de vache — zéro laitage.",
  },
  {
    key: "curry", type: "vege", week: 2, title: "Curry de pois chiches & épinards",
    alt: "lentilles en alternative",
    sensation: "Parfumé, doux-épicé, ça enveloppe. Un dîner végétal qui tient au corps sans l'alourdir.",
    caution: null,
    ingredients: [["Pois chiches cuits","120 g"],["Épinards frais","2 poignées"],["Lait de coco","15 cl"],["Oignon","½"],["Curry doux","1 c. à c."]],
    swaps: ["Pas de pois chiches ? → lentilles corail", "Plus doux ? → moins de curry, plus de coco"],
    why: "Légumineuse + légumes, sans protéine animale : on peut associer aux féculents sans souci. Tout végétal, tout en douceur.",
  },
  {
    key: "galettes", type: "vege", week: 3, title: "Galettes de sarrasin & ratatouille",
    alt: "1 alternative",
    sensation: "Moelleux dedans, doré dehors, avec une ratatouille fondante. Généreux et réconfortant.",
    caution: null,
    ingredients: [["Farine de sarrasin","60 g"],["Eau","12 cl"],["Aubergine","½"],["Courgette","1"],["Tomates","2"],["Huile d'olive","filet"]],
    swaps: ["Sans aubergine ? → poivron rouge"],
    why: "Sarrasin (sans gluten) + légumes : un repas végétal complet. Aucune protéine animale, donc féculent bienvenu.",
  },
];

function Ic({ name, col = c.ink, sw = 1.7, s = 22 }) {
  const p = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: col, strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "jour": return (<svg {...p}><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" /></svg>);
    case "courses": return (<svg {...p}><path d="M5 8h14l-1.2 10.5a1.5 1.5 0 0 1-1.5 1.3H7.7a1.5 1.5 0 0 1-1.5-1.3z" /><path d="M8.5 8a3.5 3.5 0 0 1 7 0" /></svg>);
    case "recettes": return (<svg {...p}><path d="M4 13a8 8 0 0 0 16 0z" /><path d="M12 5c-1.6 0-2.6 1-2.6 2.6M12 5c1.6 0 2.6 1 2.6 2.6" /></svg>);
    case "methode": return (<svg {...p}><path d="M5 5.5A1.5 1.5 0 0 1 6.5 4H18v16H6.5A1.5 1.5 0 0 0 5 21z" /><path d="M18 4v16" /></svg>);
    case "coach": return (<svg {...p}><path d="M5 6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5v7A1.5 1.5 0 0 1 17.5 15H10l-4 3.5V15H6.5A1.5 1.5 0 0 1 5 13.5z" /></svg>);
    case "search": return (<svg {...p}><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5L21 21" /></svg>);
    case "clock": return (<svg {...p}><circle cx="12" cy="12" r="8" /><path d="M12 8v4l2.5 2" /></svg>);
    case "swap": return (<svg {...p}><path d="M7 7h11l-3-3M17 17H6l3 3" /></svg>);
    case "leaf": return (<svg {...p}><path d="M5 18c0-7 5-12 14-12 0 9-5 14-12 14-1 0-2-.5-2-2z" /><path d="M9 16c2-3 4-5 7-6" /></svg>);
    case "chevron": return (<svg {...p}><path d="M6 9l6 6 6-6" /></svg>);
    case "back": return (<svg {...p}><path d="M15 5l-7 7 7 7" /></svg>);
    case "info": return (<svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.6v.2" /></svg>);
    case "close": return (<svg {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>);
    case "spark": return (<svg {...p}><path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z" /></svg>);
    case "check": return (<svg {...p}><path d="M5 12.5l4.5 4.5L19 7" /></svg>);
    case "shield": return (<svg {...p}><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" /><path d="M9 12l2 2 4-4" /></svg>);
    case "wave": return (<svg {...p}><path d="M3 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0" /></svg>);
    default: return null;
  }
}

function SectionTitle({ children, icon, tint }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
      {icon && <span style={{ width: 26, height: 26, borderRadius: 9, background: rgba(tint, 0.14), color: tint, display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}><Ic name={icon} col={tint} sw={1.9} s={16} /></span>}
      <span style={{ fontFamily: SER, fontWeight: 600, fontSize: 15.5, color: c.ink, letterSpacing: "-0.01em" }}>{children}</span>
    </div>
  );
}

function WhySheet({ recipe, onClose }) {
  if (!recipe) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 60, background: rgba("#1E1B14", 0.55), display: "flex", alignItems: "flex-end", justifyContent: "center", animation: "bteFade .2s ease" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 440, background: c.bg, borderRadius: "26px 26px 0 0", padding: "10px 20px 26px", border: `1.5px solid ${c.line}`, borderBottom: "none", animation: "bteUp .26s cubic-bezier(.2,.8,.2,1)" }}>
        <div style={{ width: 42, height: 5, borderRadius: 999, background: c.line, margin: "0 auto 16px" }}></div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ width: 32, height: 32, borderRadius: 10, background: rgba(c.green, 0.16), color: c.green, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Ic name="spark" col={c.green} sw={1.8} s={19} /></span>
            <div style={{ fontFamily: SER, fontWeight: 700, fontSize: 19, color: c.ink, letterSpacing: "-0.01em" }}>Pourquoi cette association&nbsp;?</div>
          </div>
          <button onClick={onClose} style={{ cursor: "pointer", width: 34, height: 34, borderRadius: 999, border: "none", background: c.paper2, color: c.soft, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Ic name="close" col={c.soft} sw={2} s={18} /></button>
        </div>
        <div style={{ fontFamily: GRO, fontSize: 12, fontWeight: 700, color: c.green, marginBottom: 6 }}>{recipe.title}</div>
        <div style={{ fontSize: 15.5, lineHeight: 1.55, color: c.ink, textWrap: "pretty" }}>{recipe.why}</div>
        <div style={{ marginTop: 16, fontSize: 12, color: c.soft, lineHeight: 1.5, borderTop: `1px solid ${c.line}`, paddingTop: 14 }}>La méthode tient en quelques gestes simples — on te les explique au fil des jours, jamais comme une liste d'interdits.</div>
      </div>
    </div>
  );
}

function RecipeDetail({ r, onClose }) {
  const [why, setWhy] = useState(null);
  const t = TYPES[r.type];
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 40, background: c.bg, display: "flex", justifyContent: "center", animation: "bteSlide .28s cubic-bezier(.2,.8,.2,1)" }}>
      <div style={{ width: "100%", maxWidth: 440, height: "100%", overflowY: "auto", background: c.bg, position: "relative" }}>
        {/* top bar */}
        <div style={{ position: "sticky", top: 0, zIndex: 5, background: rgba(c.bg, 0.92), backdropFilter: "blur(8px)", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: `1px solid ${c.line}` }}>
          <button onClick={onClose} style={{ cursor: "pointer", width: 40, height: 40, borderRadius: 999, border: `1.5px solid ${c.line}`, background: c.paper2, color: c.ink, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Ic name="back" col={c.ink} sw={2} s={20} /></button>
          <span style={{ fontFamily: SER, fontWeight: 600, fontSize: 16, color: c.ink }}>Recette</span>
        </div>

        {/* 1. visuel */}
        <image-slot id={`rec-${r.key}`} style={{ display: "block", width: "100%", height: "220px", background: c.line, filter: "saturate(1.05) brightness(1.02)" }} shape="rect" placeholder={`Photo — ${r.title.toLowerCase()}`}></image-slot>

        <div style={{ padding: "16px 18px 40px" }}>
          {/* tags */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8, flexWrap: "wrap" }}>
            <span style={{ fontFamily: GRO, fontSize: 11, fontWeight: 700, color: t.color, background: rgba(t.color, 0.13), padding: "4px 10px", borderRadius: 999 }}>{t.label}</span>
            <span style={{ fontFamily: GRO, fontSize: 11, fontWeight: 700, color: c.soft, background: c.paper2, border: `1px solid ${c.line}`, padding: "4px 10px", borderRadius: 999 }}>Sem. {r.week}</span>
            {r.time && <span style={{ fontFamily: GRO, fontSize: 11, fontWeight: 700, color: c.soft, display: "inline-flex", alignItems: "center", gap: 4, background: c.paper2, border: `1px solid ${c.line}`, padding: "4px 10px", borderRadius: 999 }}><Ic name="clock" col={c.soft} sw={1.8} s={13} />{r.time}</span>}
          </div>

          {/* 2. titre */}
          <div style={{ fontFamily: SER, fontWeight: 700, fontSize: 27, color: c.ink, letterSpacing: "-0.015em", lineHeight: 1.05, marginBottom: 18 }}>{r.title}</div>

          {/* 3. ingrédients */}
          <SectionTitle>Ce qu'il te faut</SectionTitle>
          <div style={{ border: `1.5px solid ${c.line}`, borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
            {r.ingredients.map(([name, qty], i) => (
              <div key={name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderTop: i ? `1px solid ${c.line}` : "none", background: c.paper2 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14.5, color: c.ink }}><span style={{ width: 6, height: 6, borderRadius: 999, background: c.green }}></span>{name}</span>
                <span style={{ fontFamily: GRO, fontSize: 12, fontWeight: 700, color: c.soft }}>{qty}</span>
              </div>
            ))}
          </div>

          {/* 4. alternatives */}
          <SectionTitle icon="swap" tint={c.accent}>Pas envie&nbsp;? Échange</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
            {r.swaps.map((s) => <div key={s} style={{ background: c.paper2, border: `1.5px solid ${c.line}`, borderRadius: 12, padding: "10px 13px", fontSize: 13.5, color: c.ink, lineHeight: 1.35 }}>{s}</div>)}
          </div>

          {/* 5. CTA + (i) */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button style={{ flex: 1, cursor: "pointer", border: "none", background: c.accent, color: "#fff", fontFamily: GRO, fontWeight: 700, fontSize: 15, padding: "15px 18px", borderRadius: 999, boxShadow: `0 12px 24px -12px ${rgba(c.accent, 0.9)}` }}>Cuisiner ce plat</button>
            <button onClick={() => setWhy(r)} aria-label="Pourquoi cette association" style={{ flex: "0 0 auto", cursor: "pointer", width: 50, height: 50, borderRadius: 999, border: `1.5px solid ${c.line}`, background: c.paper2, color: c.green, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Ic name="info" col={c.green} sw={1.9} s={23} /></button>
          </div>
        </div>
        <WhySheet recipe={why} onClose={() => setWhy(null)} />
      </div>
    </div>
  );
}

function RecipeCard({ r, onOpen }) {
  const t = TYPES[r.type];
  return (
    <button onClick={() => onOpen(r)} style={{ width: "100%", textAlign: "left", cursor: "pointer", border: `1.5px solid ${c.line}`, background: c.paper2, borderRadius: 18, padding: 10, display: "flex", gap: 13, alignItems: "stretch" }}>
      <div style={{ flex: "0 0 auto", width: 92, height: 92, borderRadius: 14, overflow: "hidden", position: "relative", background: c.bg }}>
        <image-slot id={`th-${r.key}`} style={{ display: "block", width: "100%", height: "100%", filter: "saturate(1.05) brightness(1.02)" }} shape="rounded" radius="14" placeholder=" "></image-slot>
        <span style={{ position: "absolute", top: 6, left: 6, width: 9, height: 9, borderRadius: 999, background: t.color, boxShadow: `0 0 0 2px ${rgba("#FBF6EA", 0.9)}` }}></span>
      </div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 5, paddingRight: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontFamily: GRO, fontSize: 10.5, fontWeight: 700, color: t.color, background: rgba(t.color, 0.13), padding: "2px 8px", borderRadius: 999 }}>{t.label}</span>
          <span style={{ fontFamily: GRO, fontSize: 10.5, fontWeight: 700, color: c.soft, background: c.bg, border: `1px solid ${c.line}`, padding: "2px 8px", borderRadius: 999 }}>Sem. {r.week}</span>
          {r.time && <span style={{ fontFamily: GRO, fontSize: 10.5, fontWeight: 700, color: c.soft, display: "inline-flex", alignItems: "center", gap: 3 }}><Ic name="clock" col={c.soft} sw={1.8} s={12} />{r.time}</span>}
        </div>
        <div style={{ fontFamily: SER, fontWeight: 600, fontSize: 17.5, color: c.ink, letterSpacing: "-0.01em", lineHeight: 1.1 }}>{r.title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: c.soft }}>
          <Ic name="swap" col={c.terraInk} sw={1.9} s={14} /><span style={{ color: c.terraInk, fontWeight: 600 }}>{r.alt}</span>
        </div>
      </div>
      <span style={{ flex: "0 0 auto", alignSelf: "center", color: c.soft, transform: "rotate(-90deg)" }}><Ic name="chevron" col={c.soft} sw={2} s={20} /></span>
    </button>
  );
}

const FILTERS = [["all", "Tout"], ["jus", "Jus"], ["poisson", "Poisson"], ["viande", "Viande maigre"], ["vege", "Végé"]];

// ---------- App ----------
const PALETTES = [
["#EFE6CF", "#FBF6EA", "#E2D4B5", "#1C160C"], ["#EDE0BE", "#FAF3DC", "#DECBA0", "#1B1709"],
["#EEDCAE", "#FBF0CF", "#DCC58E", "#1C1607"], ["#ECD3A6", "#FAEDC6", "#D9BE86", "#1C1406"],
["#F1E2D2", "#FCF2E6", "#E7D3BD", "#1E130C"], ["#F0E6DE", "#FBF4EE", "#E4D5C9", "#1B130E"],
["#EFEDE3", "#FBFAF3", "#DEDCCB", "#14160F"], ["#E9EBE6", "#F8FAF6", "#D7DBD2", "#14160F"],
["#E6EBDC", "#F7FAEF", "#D6DEC6", "#121710"], ["#E2E7D5", "#F4F8EC", "#D0DABE", "#131710"]];

const TWEAK_DEFAULTS = { ambiance: PALETTES[0] };

function App() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(null);
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const amb = t.ambiance && t.ambiance.length === 4 ? t.ambiance : PALETTES[0];
  c.bg = amb[0]; c.paper2 = amb[1]; c.line = amb[2]; c.chassis = amb[3];

  const list = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return RECIPES.filter((r) => {
      if (filter !== "all" && r.type !== filter) return false;
      if (!ql) return true;
      if (r.title.toLowerCase().includes(ql)) return true;
      return r.ingredients.some(([n]) => n.toLowerCase().includes(ql));
    });
  }, [q, filter]);

  const tabs = [["Jour", "jour", false, "Aujourd'hui.html"], ["Courses", "courses", false, "Courses.html"], ["Recettes", "recettes", true, null], ["Méthode", "methode", false, "Méthode.html"], ["Coach", "coach", false, "Coach.html"]];

  const panel =
  <TweaksPanel>
      <TweakSection label="Ambiance du fond" />
      <TweakColor label="Fond" value={t.ambiance} options={PALETTES} onChange={(v) => setTweak("ambiance", v)} />
    </TweaksPanel>;

  return (
    <React.Fragment>
    <div style={{ minHeight: "100vh", background: c.chassis, display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 440, minHeight: "100vh", background: c.bg, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, padding: "22px 18px 96px" }}>
          {/* en-tête */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: GRO, fontSize: 10.5, color: c.soft, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Le carnet · 21 jours</div>
            <div style={{ fontFamily: SER, fontWeight: 600, fontSize: 30, color: c.ink, letterSpacing: "-0.01em", lineHeight: 1.05, marginTop: 4 }}>Recettes</div>
            <div style={{ fontSize: 14, color: c.soft, marginTop: 4, lineHeight: 1.4 }}>Tout le programme à feuilleter, à ton rythme.</div>
          </div>

          {/* recherche */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: c.paper2, border: `1.5px solid ${c.line}`, borderRadius: 16, padding: "12px 14px", marginBottom: 14 }}>
            <Ic name="search" col={c.soft} sw={1.9} s={20} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Chercher un plat, un ingrédient…" style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: BODY, fontSize: 15, color: c.ink }} />
            {q && <button onClick={() => setQ("")} style={{ cursor: "pointer", border: "none", background: "transparent", color: c.soft, display: "inline-flex" }}><Ic name="close" col={c.soft} sw={2} s={18} /></button>}
          </div>

          {/* filtres chips */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 18, msOverflowStyle: "none", scrollbarWidth: "none" }}>
            {FILTERS.map(([key, label]) => {
              const on = filter === key;
              const col = key === "all" ? c.green : (TYPES[key] ? TYPES[key].color : c.green);
              return (
                <button key={key} onClick={() => setFilter(key)} style={{ flex: "0 0 auto", cursor: "pointer", border: `1.5px solid ${on ? col : c.line}`, background: on ? col : c.paper2, color: on ? "#fff" : c.soft, fontFamily: GRO, fontWeight: 700, fontSize: 13, padding: "8px 15px", borderRadius: 999, transition: "all .15s" }}>{label}</button>
              );
            })}
          </div>

          {/* compteur + sûreté */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 12.5, color: c.soft, fontWeight: 600 }}>{list.length} recette{list.length > 1 ? "s" : ""}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, color: c.green, fontWeight: 700 }}><Ic name="shield" col={c.green} sw={1.8} s={15} />Toutes conformes</span>
          </div>

          {/* liste */}
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {list.map((r) => <RecipeCard key={r.key} r={r} onOpen={setOpen} />)}
            {list.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 20px", color: c.soft }}>
                <div style={{ fontFamily: SER, fontWeight: 600, fontSize: 17, color: c.ink, marginBottom: 4 }}>Rien sous ce nom</div>
                <div style={{ fontSize: 13.5 }}>Essaie un autre ingrédient, ou enlève le filtre.</div>
              </div>
            )}
          </div>
        </div>

        {/* barre basse — identique aux écrans Jour et Courses */}
        <div style={{ position: "sticky", bottom: 0, background: c.bg, borderTop: `1px solid ${c.line}`, padding: "9px 8px 16px", display: "flex", justifyContent: "space-between" }}>
          {tabs.map(([txt, ic, active, href]) => (
            <a key={txt} href={href || undefined} style={{ flex: "1 1 0", textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: active ? c.accent : c.soft, cursor: href ? "pointer" : "default" }}>
              <Ic name={ic} col={active ? c.accent : c.soft} sw={active ? 2.1 : 1.7} s={23} />
              <span style={{ fontFamily: GRO, fontSize: 10, fontWeight: active ? 700 : 500 }}>{txt}</span>
            </a>
          ))}
        </div>
      </div>

      {open && <RecipeDetail r={open} onClose={() => setOpen(null)} />}
    </div>
    {panel}
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
