// courses-screen.jsx — backtoenergy · écran « Courses »
// Liste auto-déduite des menus, rangée par rayon. Direction visuelle : « Édito tonique »
// (papier sable + Baloo 2), cohérente avec les écrans J0 et Jour.
// L'ancienne version « Nuit verte » est conservée dans _archive_nuitverte/.

const { useState, useEffect } = React;

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
  amberInk: "#A9742A",
  terraInk: "#C2552A"
};
const WK = ["#4E7A3C", "#E2A21E", "#C2552A"];
const SER = "'Baloo 2', sans-serif";
const GRO = "'Space Grotesk', sans-serif";
const BODY = "'Hanken Grotesk', sans-serif";

function rgba(hex, a) {
  const h = hex.replace("#", "");
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`;
}

// qty: { n, unit, scale } — unit "x" => "×n" ; sinon "n unit". scale=false => ne double pas.
const GROUPS = [
{
  key: "fl", title: "Fruits & légumes", sub: "le vivant", icon: "leaf", tone: "green",
  items: [
  { name: "Concombres", n: 2, unit: "x", frais: true },
  { name: "Céleri branche", n: 1, unit: "botte", frais: true },
  { name: "Épinards frais", n: 150, unit: "g", frais: true, bio: true },
  { name: "Courgettes", n: 3, unit: "x", frais: true, bio: true },
  { name: "Radis", n: 1, unit: "botte", frais: true },
  { name: "Avocats", n: 2, unit: "x", frais: true },
  { name: "Jeunes pousses", n: 1, unit: "sachet", frais: true },
  { name: "Pommes vertes", n: 3, unit: "x", frais: true },
  { name: "Citrons", n: 3, unit: "x" },
  { name: "Basilic frais", n: 1, unit: "botte", frais: true },
  { name: "Oignons", n: 2, unit: "x" },
  { name: "Gingembre", n: 1, unit: "racine", scale: false }]

},
{
  key: "prot", title: "Protéines", sub: "une par repas, jamais deux", icon: "fish", tone: "terra",
  note: "Une seule protéine animale par repas — jamais le poisson ET la viande ensemble.",
  items: [
  { name: "Œufs", n: 6, unit: "x", bio: true },
  { name: "Filet de cabillaud", n: 150, unit: "g", frais: true },
  { name: "Blanc de poulet", n: 120, unit: "g", frais: true },
  { name: "Sardines (boîte)", n: 1, unit: "x", scale: false }]

},
{
  key: "epic", title: "Épicerie & secs", sub: "ça se garde", icon: "box", tone: "amber",
  items: [
  { name: "Quinoa", n: 250, unit: "g", scale: false, bio: true },
  { name: "Sarrasin", n: 250, unit: "g", scale: false },
  { name: "Pois chiches (bocal)", n: 1, unit: "x", scale: false },
  { name: "Graines de courge", n: 1, unit: "sachet", scale: false },
  { name: "Huile d'olive", n: 1, unit: "bouteille", scale: false, bio: true },
  { name: "Crème de cajou", n: 1, unit: "pot", scale: false },
  { name: "Lait de coco", n: 1, unit: "brique", scale: false },
  { name: "Bouillon de légumes", n: 1, unit: "paquet", scale: false }]

},
{
  key: "bois", title: "Boissons", sub: "à garder sous la main · café toujours autorisé", icon: "bottle", tone: "green",
  items: [
  { name: "Thé vert", n: 1, unit: "boîte", scale: false },
  { name: "Infusions", n: 1, unit: "boîte", scale: false },
  { name: "Café", n: 1, unit: "paquet", scale: false }]

}];

// tons d'accent sur papier sable : icône/texte foncés + fond très léger
const TONES = {
  green: { fg: c.green, bg: rgba(c.green, 0.14) },
  amber: { fg: c.amberInk, bg: rgba(c.pop, 0.22) },
  terra: { fg: c.terraInk, bg: rgba(c.accent, 0.13) }
};

function Ic({ name, col = c.ink, sw = 1.7, s = 22 }) {
  const p = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: col, strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "jour":return <svg {...p}><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" /></svg>;
    case "courses":return <svg {...p}><path d="M5 8h14l-1.2 10.5a1.5 1.5 0 0 1-1.5 1.3H7.7a1.5 1.5 0 0 1-1.5-1.3z" /><path d="M8.5 8a3.5 3.5 0 0 1 7 0" /></svg>;
    case "recettes":return <svg {...p}><path d="M4 13a8 8 0 0 0 16 0z" /><path d="M12 5c-1.6 0-2.6 1-2.6 2.6M12 5c1.6 0 2.6 1 2.6 2.6" /></svg>;
    case "methode":return <svg {...p}><path d="M5 5.5A1.5 1.5 0 0 1 6.5 4H18v16H6.5A1.5 1.5 0 0 0 5 21z" /><path d="M18 4v16" /></svg>;
    case "coach":return <svg {...p}><path d="M5 6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5v7A1.5 1.5 0 0 1 17.5 15H10l-4 3.5V15H6.5A1.5 1.5 0 0 1 5 13.5z" /></svg>;
    case "leaf":return <svg {...p}><path d="M5 18c0-7 5-12 14-12 0 9-5 14-12 14-1 0-2-.5-2-2z" /><path d="M9 16c2-3 4-5 7-6" /></svg>;
    case "fish":return <svg {...p}><path d="M3 12c3-4 8-5 13-3 2 .8 3.5 2 5 3-1.5 1-3 2.2-5 3-5 2-10 1-13-3z" /><path d="M18 10.5v.2" /><path d="M3 12c-.5-1.5-.5-3 0-4.5M3 12c-.5 1.5-.5 3 0 4.5" /></svg>;
    case "box":return <svg {...p}><path d="M4 8l8-4 8 4-8 4z" /><path d="M4 8v8l8 4 8-4V8" /><path d="M12 12v8" /></svg>;
    case "bottle":return <svg {...p}><path d="M10 3h4M10.5 3v3.5c0 .8-.4 1.4-1 2-.9.8-1.5 1.8-1.5 3V19a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V11.5c0-1.2-.6-2.2-1.5-3-.6-.6-1-1.2-1-2V3" /></svg>;
    case "check":return <svg {...p}><path d="M5 12.5l4.5 4.5L19 7" /></svg>;
    case "sprout":return <svg {...p}><path d="M12 20v-7M12 13c0-3-2-5-5-5 0 3 2 5 5 5zM12 11c0-2.5 2-4.5 5-4.5 0 2.5-2 4.5-5 4.5z" /></svg>;
    default:return null;
  }
}

function fmtQty(it, portions) {
  const mult = it.scale === false ? 1 : portions;
  const n = it.n * mult;
  if (it.unit === "x") return "×" + n;
  return n + " " + it.unit;
}

function Tag({ kind }) {
  const map = {
    frais: { bg: rgba(c.pop, 0.22), col: c.amberInk, txt: "frais" },
    bio: { bg: rgba(c.green, 0.14), col: c.green, txt: "bio" }
  };
  const t = map[kind];
  return <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.02em", color: t.col, background: t.bg, padding: "2px 7px", borderRadius: 999 }}>{t.txt}</span>;
}

function Row({ it, portions }) {
  return (
    <div style={{ width: "100%", padding: "12px 14px", display: "flex", alignItems: "center", gap: 11 }}>
      <span style={{ flex: "0 0 auto", width: 6, height: 6, borderRadius: 999, background: c.green }}></span>
      <span style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
        <span style={{ fontSize: 14.5, fontWeight: 600, color: c.ink }}>{it.name}</span>
        {it.frais && <Tag kind="frais" />}
        {it.bio && <Tag kind="bio" />}
      </span>
      <span style={{ flex: "0 0 auto", fontFamily: GRO, fontSize: 12, fontWeight: 700, color: c.soft }}>{fmtQty(it, portions)}</span>
    </div>);

}

function Step({ n, tone, title, when, desc, anchor }) {
  const t = TONES[tone];
  return (
    <div style={{ flex: 1 }} data-comment-anchor={anchor}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
        <span style={{ width: 26, height: 26, borderRadius: 999, background: tone === "green" ? c.green : c.pop, color: tone === "green" ? "#fff" : c.ink, fontFamily: SER, fontWeight: 700, fontSize: 14, display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>{n}</span>
        <span style={{ fontFamily: SER, fontWeight: 600, fontSize: 14.5, color: c.ink }}>{title}</span>
      </div>
      <div style={{ display: "inline-block", fontFamily: GRO, fontSize: 10.5, fontWeight: 700, color: t.fg, background: t.bg, padding: "2px 8px", borderRadius: 999, marginBottom: 6 }}>{when}</div>
      <div style={{ fontSize: 12.5, color: c.soft, lineHeight: 1.4, textWrap: "pretty" }}>{desc}</div>
    </div>);

}

// ---------- App ----------
const PALETTES = [
["#EFE6CF", "#FBF6EA", "#E2D4B5", "#1C160C"], ["#EDE0BE", "#FAF3DC", "#DECBA0", "#1B1709"],
["#EEDCAE", "#FBF0CF", "#DCC58E", "#1C1607"], ["#ECD3A6", "#FAEDC6", "#D9BE86", "#1C1406"],
["#F1E2D2", "#FCF2E6", "#E7D3BD", "#1E130C"], ["#F0E6DE", "#FBF4EE", "#E4D5C9", "#1B130E"],
["#EFEDE3", "#FBFAF3", "#DEDCCB", "#14160F"], ["#E9EBE6", "#F8FAF6", "#D7DBD2", "#14160F"],
["#E6EBDC", "#F7FAEF", "#D6DEC6", "#121710"], ["#E2E7D5", "#F4F8EC", "#D0DABE", "#131710"]];

const TWEAK_DEFAULTS = { ambiance: PALETTES[0] };

function App() {
  const [portions, setPortions] = useState(() => Number(localStorage.getItem("bte-portions")) || 1);
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const amb = t.ambiance && t.ambiance.length === 4 ? t.ambiance : PALETTES[0];
  c.bg = amb[0];c.paper2 = amb[1];c.line = amb[2];c.chassis = amb[3];

  useEffect(() => {localStorage.setItem("bte-portions", String(portions));}, [portions]);

  const tabs = [["Jour", "jour", false, "Aujourd'hui.html"], ["Courses", "courses", true, null], ["Recettes", "recettes", false, "Recettes.html"], ["Méthode", "methode", false, "Méthode.html"], ["Coach", "coach", false, "Coach.html"]];

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
          {/* en-tête — même patron que l'écran Jour */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontFamily: GRO, fontWeight: 700, fontSize: 12, color: "#fff", background: WK[0], padding: "5px 12px", borderRadius: 999, whiteSpace: "nowrap" }}>SEMAINE 1</span>
            </div>
            <div style={{ fontFamily: SER, fontWeight: 600, fontSize: 30, color: c.ink, letterSpacing: "-0.01em", lineHeight: 1.0 }}>Tes courses</div>
            <div style={{ fontSize: 13, color: c.soft, fontWeight: 600, marginTop: 6, lineHeight: 1.35, textWrap: "pretty" }}>Ta liste, déduite de tes menus — rien à cocher, juste ton pense-bête.</div>
          </div>

          {/* toggle portions */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 18 }}>
            <div style={{ fontSize: 13.5, color: c.soft, fontWeight: 600 }}>Tu cuisines pour…</div>
            <div style={{ display: "flex", background: c.paper2, border: `1.5px solid ${c.line}`, borderRadius: 999, padding: 4 }}>
              {[1, 2].map((p) => {
                const on = portions === p;
                return (
                  <button key={p} onClick={() => setPortions(p)} style={{ cursor: "pointer", border: "none", background: on ? c.green : "transparent", color: on ? "#fff" : c.soft, fontFamily: GRO, fontWeight: 700, fontSize: 13, padding: "8px 18px", borderRadius: 999, transition: "all .15s" }}>{p === 1 ? "Pour 1" : "Pour 2"}</button>);

              })}
            </div>
          </div>

          {/* bandeau rythme deux temps */}
          <div style={{ background: c.paper2, border: `1.5px solid ${c.line}`, borderRadius: 18, padding: "16px 16px 14px", marginBottom: 22 }}>
            <div style={{ fontFamily: SER, fontWeight: 600, fontSize: 15.5, color: c.ink, marginBottom: 13 }}>Le rythme des courses</div>
            <div style={{ display: "flex", gap: 12 }}>
              <Step n="1" tone="green" title="Le gros plein" when="Maintenant" desc="Secs, boissons, épicerie : tout ce qui se garde." />
              <div style={{ width: 1, background: c.line, flex: "0 0 auto", alignSelf: "stretch" }}></div>
              <Step n="2" tone="amber" title="Le frais" when="En milieu de semaine" desc="Tu rachètes tes fruits & légumes vers le jour 4, pour qu'ils soient toujours bien frais." anchor="0473b341b7-div-235-5" />
            </div>
          </div>

          {/* liste par rayon */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {GROUPS.map((g) => {
              const tone = TONES[g.tone];
              return (
              <div key={g.key}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, padding: "0 2px" }}>
                  <span style={{ width: 32, height: 32, borderRadius: 10, background: tone.bg, color: tone.fg, display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}><Ic name={g.icon} col={tone.fg} sw={1.8} s={19} /></span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: SER, fontWeight: 600, fontSize: 17, color: c.ink, letterSpacing: "-0.01em", lineHeight: 1 }}>{g.title}</div>
                    <div style={{ fontSize: 12, color: c.soft, marginTop: 3 }}>{g.sub}</div>
                  </div>
                </div>

                {g.note &&
                <div style={{ background: rgba(c.accent, 0.1), border: `1.5px solid ${rgba(c.accent, 0.3)}`, borderRadius: 13, padding: "9px 12px", fontSize: 12.5, color: c.terraInk, lineHeight: 1.4, marginBottom: 9, fontWeight: 600 }}>{g.note}</div>
                }

                <div style={{ background: c.paper2, border: `1.5px solid ${c.line}`, borderRadius: 16, overflow: "hidden" }}>
                  {g.items.map((it, i) =>
                  <div key={g.key + "-" + it.name} data-comment-anchor={it.name === "Café" ? "56aab60966-div-205-15" : undefined} style={{ borderTop: i ? `1px solid ${c.line}` : "none" }}>
                      <Row it={it} portions={portions} />
                    </div>
                  )}
                </div>
              </div>);
            })}
          </div>

          {/* pied : bio & local */}
          <div style={{ marginTop: 18, padding: "0 4px", display: "flex", gap: 10 }}>
            <span style={{ flex: "0 0 auto", color: c.green, marginTop: 1 }}><Ic name="sprout" col={c.green} sw={1.7} s={20} /></span>
            <div style={{ fontSize: 12.5, color: c.soft, lineHeight: 1.5, textWrap: "pretty" }}>
              <span style={{ fontWeight: 700, color: c.ink }}>Bio & local, quand tu peux</span> — surtout pour les légumes. Souvent pas plus cher dès que tu cuisines toi-même.
            </div>
          </div>
        </div>

        {/* barre basse — identique à l'écran Jour */}
        <div style={{ position: "sticky", bottom: 0, background: c.bg, borderTop: `1px solid ${c.line}`, padding: "9px 8px 16px", display: "flex", justifyContent: "space-between" }}>
          {tabs.map(([txt, ic, active, href]) =>
          <a key={txt} href={href || undefined} style={{ flex: "1 1 0", textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: active ? c.accent : c.soft, cursor: href ? "pointer" : "default" }}>
              <Ic name={ic} col={active ? c.accent : c.soft} sw={active ? 2.1 : 1.7} s={23} />
              <span style={{ fontFamily: GRO, fontSize: 10, fontWeight: active ? 700 : 500 }}>{txt}</span>
            </a>
          )}
        </div>
      </div>
    </div>
    {panel}
    </React.Fragment>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
