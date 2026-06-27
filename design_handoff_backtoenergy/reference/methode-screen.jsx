// methode-screen.jsx — backtoenergy · écran « Méthode »
// Donne du sens au voyage. Direction visuelle : « Édito tonique »
// (papier sable + Baloo 2), cohérente avec les écrans J0, Jour, Courses et Recettes.
// L'ancienne version « Nuit verte » est conservée dans _archive_nuitverte/.

const { useState } = React;

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
  pop: "#F2B431"
};
const WK = ["#4E7A3C", "#E2A21E", "#C2552A"];
const SER = "'Baloo 2', sans-serif";
const GRO = "'Space Grotesk', sans-serif";
const BODY = "'Hanken Grotesk', sans-serif";
function rgba(hex, a) {const h = hex.replace("#", "");return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`;}

const TODAY = 7;

const WEEKS = [
{ n: 1, range: "J1 – J7", title: "Détox & purification", desc: "Libérer le corps de sa charge toxique.", state: "current", prog: 7, total: 7, accent: WK[0] },
{ n: 2, range: "J8 – J14", title: "Énergie & vitalité", desc: "L'énergie revient, le sommeil s'améliore.", state: "soon", accent: WK[1] },
{ n: 3, range: "J15 – J21", title: "Ancrage & performance", desc: "Ancrer les réflexes, devenir autonome.", state: "soon", accent: WK[2] }];


const PILLARS = [
{ key: "jus", icon: "drop", title: "Les jus alcalins", line: "Drainer, rééquilibrer le pH.", more: "Pressés à cru, ils apportent minéraux et vitamines directement assimilables. Ils alcalinisent le terrain, drainent les déchets acides et reposent la digestion." },
{ key: "assoc", icon: "link", title: "Les bonnes associations", line: "Manger sans fermenter.", more: "Certains aliments digèrent mal ensemble : protéines et féculents fermentent et encrassent. En ne mariant que ce qui s'accorde, on digère vite et léger." },
{ key: "repos", icon: "moon", title: "Le repos digestif", line: "Laisser le corps souffler.", more: "Digérer mobilise 30 à 40 % de ton énergie. En allégeant les repas, tu rends cette énergie au corps — pour qu'il nettoie et se répare." },
{ key: "vivant", icon: "sprout", title: "Le vivant", line: "Des aliments pleins d'enzymes.", more: "Cru, l'aliment garde ses enzymes, celles que la cuisson détruit et qui font une partie du travail à ta place. Plus c'est vivant, plus ça nourrit vraiment." }];


const ASIDE = [
["Blé & gluten", "inflammatoire"],
["Laitages de vache", "acidifiants"],
["Protéine + féculent", "fermentent ensemble"],
["Deux protéines / repas", "digestion longue"],
["Fruits en fin de repas", "toujours seuls"]];


function Ic({ name, col = c.ink, sw = 1.7, s = 22 }) {
  const p = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: col, strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "jour":return <svg {...p}><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" /></svg>;
    case "courses":return <svg {...p}><path d="M5 8h14l-1.2 10.5a1.5 1.5 0 0 1-1.5 1.3H7.7a1.5 1.5 0 0 1-1.5-1.3z" /><path d="M8.5 8a3.5 3.5 0 0 1 7 0" /></svg>;
    case "recettes":return <svg {...p}><path d="M4 13a8 8 0 0 0 16 0z" /><path d="M12 5c-1.6 0-2.6 1-2.6 2.6M12 5c1.6 0 2.6 1 2.6 2.6" /></svg>;
    case "methode":return <svg {...p}><path d="M5 5.5A1.5 1.5 0 0 1 6.5 4H18v16H6.5A1.5 1.5 0 0 0 5 21z" /><path d="M18 4v16" /></svg>;
    case "coach":return <svg {...p}><path d="M5 6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5v7A1.5 1.5 0 0 1 17.5 15H10l-4 3.5V15H6.5A1.5 1.5 0 0 1 5 13.5z" /></svg>;
    case "drop":return <svg {...p}><path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z" /></svg>;
    case "link":return <svg {...p}><path d="M9 12h6" /><path d="M9.5 8H8a4 4 0 0 0 0 8h1.5M14.5 8H16a4 4 0 0 1 0 8h-1.5" /></svg>;
    case "moon":return <svg {...p}><path d="M20 14.5A8 8 0 0 1 9.5 4 7 7 0 1 0 20 14.5z" /></svg>;
    case "sprout":return <svg {...p}><path d="M12 20v-7M12 13c0-3-2-5-5-5 0 3 2 5 5 5zM12 11c0-2.5 2-4.5 5-4.5 0 2.5-2 4.5-5 4.5z" /></svg>;
    case "book":return <svg {...p}><path d="M5 5.5A1.5 1.5 0 0 1 6.5 4H18v16H6.5A1.5 1.5 0 0 0 5 21z" /><path d="M18 4v16" /></svg>;
    case "clock":return <svg {...p}><circle cx="12" cy="12" r="8" /><path d="M12 8v4l2.5 2" /></svg>;
    case "check":return <svg {...p}><path d="M5 12.5l4.5 4.5L19 7" /></svg>;
    case "plus":return <svg {...p}><path d="M12 6v12M6 12h12" /></svg>;
    case "minus":return <svg {...p}><path d="M6 12h12" /></svg>;
    case "close":return <svg {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>;
    case "arrow":return <svg {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case "pause":return <svg {...p}><circle cx="12" cy="12" r="9" /><path d="M10 9v6M14 9v6" /></svg>;
    case "spark":return <svg {...p}><path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z" /></svg>;
    default:return null;
  }
}

function SectionLabel({ children }) {
  return <div style={{ fontFamily: GRO, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: c.soft, marginBottom: 12 }}>{children}</div>;
}

function WeekArc() {
  return (
    <div style={{ position: "relative", paddingLeft: 6 }}>
      {WEEKS.map((w, i) => {
        const current = w.state === "current";
        const last = i === WEEKS.length - 1;
        const acc = w.accent;
        return (
          <div key={w.n} style={{ display: "flex", gap: 15, position: "relative" }}>
            {/* colonne noeud + ligne */}
            <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 38, height: 38, borderRadius: 999, background: current ? acc : c.paper2, border: `2px solid ${current ? acc : rgba(acc, 0.55)}`, color: current ? "#fff" : acc, fontFamily: SER, fontWeight: 700, fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto", zIndex: 1 }}>{w.n}</div>
              {!last && <div style={{ width: 2, flex: 1, background: c.line, marginTop: 2, marginBottom: 2 }}></div>}
            </div>
            {/* carte semaine */}
            <div style={{ flex: 1, paddingBottom: last ? 0 : 16 }}>
              <div style={{ background: current ? rgba(acc, 0.1) : c.paper2, border: `1.5px solid ${current ? rgba(acc, 0.4) : c.line}`, borderRadius: 18, padding: "13px 15px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 3 }}>
                  <span style={{ fontFamily: GRO, fontSize: 11, fontWeight: 700, color: c.soft, letterSpacing: "0.03em" }}>{w.range}</span>
                  {current ?
                  <span style={{ fontFamily: GRO, fontSize: 10.5, fontWeight: 700, color: "#fff", background: acc, padding: "3px 9px", borderRadius: 999 }}>tu es ici · J{TODAY}</span> :
                  <span style={{ fontFamily: GRO, fontSize: 10.5, fontWeight: 700, color: c.soft, background: c.bg, border: `1px solid ${c.line}`, padding: "3px 9px", borderRadius: 999 }}>à venir</span>}
                </div>
                <div style={{ fontFamily: SER, fontWeight: 600, fontSize: 18, color: c.ink, letterSpacing: "-0.01em", lineHeight: 1.1 }}>{w.title}</div>
                <div style={{ fontSize: 13.5, color: c.soft, lineHeight: 1.4, marginTop: 3, textWrap: "pretty" }}>{w.desc}</div>
                {current &&
                <div style={{ marginTop: 11 }}>
                    <div style={{ height: 6, borderRadius: 999, background: rgba(acc, 0.18), overflow: "hidden" }}>
                      <div style={{ width: `${w.prog / w.total * 100}%`, height: "100%", background: acc, borderRadius: 999 }}></div>
                    </div>
                    <div style={{ fontSize: 11.5, color: acc, fontWeight: 700, marginTop: 5 }}>Jour {w.prog} sur {w.total} — bientôt la semaine 2</div>
                  </div>
                }
              </div>
            </div>
          </div>);

      })}
    </div>);

}

function Pillar({ p, open, onToggle }) {
  return (
    <button onClick={onToggle} style={{ textAlign: "left", cursor: "pointer", border: `1.5px solid ${open ? rgba(c.green, 0.4) : c.line}`, background: open ? rgba(c.green, 0.1) : c.paper2, borderRadius: 18, padding: 14, display: "flex", flexDirection: "column", gap: 8, transition: "all .15s", minHeight: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ width: 36, height: 36, borderRadius: 11, background: rgba(c.green, 0.14), color: c.green, display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}><Ic name={p.icon} col={c.green} sw={1.8} s={21} /></span>
        <span style={{ color: c.soft }}><Ic name={open ? "minus" : "plus"} col={c.soft} sw={2} s={17} /></span>
      </div>
      <div>
        <div style={{ fontFamily: SER, fontWeight: 600, fontSize: 15.5, color: c.ink, letterSpacing: "-0.01em", lineHeight: 1.12 }}>{p.title}</div>
        <div style={{ fontSize: 12.5, color: c.soft, lineHeight: 1.35, marginTop: 3 }}>{p.line}</div>
      </div>
      {open && <div style={{ fontSize: 12.5, color: c.ink, lineHeight: 1.45, borderTop: `1px solid ${rgba(c.green, 0.24)}`, paddingTop: 9, textWrap: "pretty" }}>{p.more}</div>}
    </button>);

}

function NotionSheet({ open, onClose }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 60, background: rgba("#1E1B14", 0.55), display: "flex", alignItems: "flex-end", justifyContent: "center", animation: "bteFade .2s ease" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 440, maxHeight: "86vh", overflowY: "auto", background: c.bg, borderRadius: "26px 26px 0 0", padding: "10px 22px 30px", border: `1.5px solid ${c.line}`, borderBottom: "none", animation: "bteUp .26s cubic-bezier(.2,.8,.2,1)" }}>
        <div style={{ width: 42, height: 5, borderRadius: 999, background: c.line, margin: "0 auto 18px", position: "sticky", top: 0 }}></div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontFamily: GRO, fontSize: 11, fontWeight: 700, color: c.green, letterSpacing: "0.08em", textTransform: "uppercase" }}>Jour {TODAY} · La notion du jour</span>
          <button onClick={onClose} style={{ cursor: "pointer", width: 34, height: 34, borderRadius: 999, border: "none", background: c.paper2, color: c.soft, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Ic name="close" col={c.soft} sw={2} s={18} /></button>
        </div>
        <div style={{ fontFamily: SER, fontWeight: 700, fontSize: 26, color: c.ink, letterSpacing: "-0.015em", lineHeight: 1.1, marginBottom: 14 }}>Le premier cap</div>
        {[
        "Une semaine que tu tiens. Si tu te sens parfois un peu flagada, c'est normal — et c'est même bon signe.",
        "Pendant ces premiers jours, le corps a fait le tri : il s'est délesté de ce qui l'encombrait. Ce petit coup de mou, c'est le ménage qui se termine.",
        "À partir de maintenant, le vent tourne. L'énergie remonte, le sommeil se pose, la tête s'éclaircit. Tu as fait le plus dur — la suite, c'est la récompense."].
        map((t, i) =>
        <p key={i} style={{ fontSize: 15.5, lineHeight: 1.6, color: c.ink, marginBottom: 12, textWrap: "pretty" }}>{t}</p>
        )}
        <div style={{ marginTop: 6, background: rgba(c.green, 0.1), border: `1.5px solid ${rgba(c.green, 0.3)}`, borderRadius: 14, padding: "13px 15px", fontSize: 14, color: c.green, lineHeight: 1.45, fontWeight: 700 }}>
          Aujourd'hui, sois doux avec toi. Bois, marche, respire. Le corps travaille pour toi.
        </div>
      </div>
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
  const [openPillar, setOpenPillar] = useState(null);
  const [notion, setNotion] = useState(false);
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const amb = t.ambiance && t.ambiance.length === 4 ? t.ambiance : PALETTES[0];
  c.bg = amb[0];c.paper2 = amb[1];c.line = amb[2];c.chassis = amb[3];

  const tabs = [["Jour", "jour", false, "Aujourd'hui.html"], ["Courses", "courses", false, "Courses.html"], ["Recettes", "recettes", false, "Recettes.html"], ["Méthode", "methode", true, null], ["Coach", "coach", false, "Coach.html"]];

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
          {/* en-tête essence */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontFamily: GRO, fontSize: 10.5, color: c.soft, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>La méthode</div>
            <div style={{ fontFamily: SER, fontWeight: 700, fontSize: 34, color: c.ink, letterSpacing: "-0.01em", lineHeight: 1.04 }}>Nettoyer,<br />réveiller, durer</div>
            <div style={{ fontSize: 15, color: c.soft, marginTop: 8, lineHeight: 1.45, textWrap: "pretty" }}>Manger ce pour quoi le corps est fait — du vivant.</div>
          </div>

          {/* arc des 3 semaines */}
          <SectionLabel>Les trois semaines</SectionLabel>
          <div style={{ marginBottom: 26 }}><WeekArc /></div>

          {/* notion du jour */}
          <div style={{ background: c.green, borderRadius: 24, padding: "18px 18px 18px", marginBottom: 26, position: "relative", overflow: "hidden", boxShadow: `0 18px 36px -20px ${rgba(c.green, 0.8)}` }}>
            <div style={{ position: "absolute", right: -30, top: -30, width: 120, height: 120, borderRadius: 999, background: rgba("#FFFFFF", 0.07) }}></div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, position: "relative" }}>
              <span style={{ width: 30, height: 30, borderRadius: 9, background: rgba("#FFFFFF", 0.16), color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Ic name="spark" col="#fff" sw={1.8} s={18} /></span>
              <span style={{ fontFamily: GRO, fontSize: 11, fontWeight: 700, color: rgba("#FFFFFF", 0.88), letterSpacing: "0.08em", textTransform: "uppercase" }}>Jour {TODAY} · La notion du jour</span>
            </div>
            <div style={{ fontFamily: SER, fontWeight: 700, fontSize: 23, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.1, marginBottom: 7, position: "relative" }}>Le premier cap</div>
            <div style={{ fontSize: 14.5, color: rgba("#FFFFFF", 0.85), lineHeight: 1.5, marginBottom: 16, position: "relative", textWrap: "pretty" }}>Une semaine que tu tiens. Voici pourquoi tu te sens parfois flagada — et pourquoi ça annonce du bon.</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, position: "relative" }}>
              <button onClick={() => setNotion(true)} style={{ cursor: "pointer", border: "none", background: "#fff", color: c.green, fontFamily: GRO, fontWeight: 700, fontSize: 14, padding: "12px 20px", borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 8 }}><Ic name="book" col={c.green} sw={1.9} s={18} />Lire · 2 min</button>
              <span style={{ fontSize: 12, color: rgba("#FFFFFF", 0.85), fontWeight: 600, textAlign: "right", lineHeight: 1.3 }}>7ᵉ sur 21<br />débloquée</span>
            </div>
          </div>

          {/* piliers 2x2 */}
          <SectionLabel>Les piliers de la méthode</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11, marginBottom: 26, alignItems: "start" }}>
            {PILLARS.map((p) => <Pillar key={p.key} p={p} open={openPillar === p.key} onToggle={() => setOpenPillar((cur) => cur === p.key ? null : p.key)} />)}
          </div>

          {/* ce qu'on met de côté */}
          <SectionLabel>Ce qu'on met de côté</SectionLabel>
          <div style={{ background: c.paper2, border: `1.5px solid ${c.line}`, borderRadius: 20, padding: "16px 17px 8px" }}>
            <div style={{ display: "flex", gap: 11, marginBottom: 14 }}>
              <span style={{ flex: "0 0 auto", width: 38, height: 38, borderRadius: 11, background: rgba(c.soft, 0.14), color: c.soft, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Ic name="pause" col={c.soft} sw={1.7} s={21} /></span>
              <div style={{ fontSize: 14, color: c.ink, lineHeight: 1.5, textWrap: "pretty" }}>
                <span style={{ fontFamily: SER, fontWeight: 600 }}>Rien de définitif.</span> Juste ce qui alourdit, mis en pause le temps du programme pour laisser le corps respirer.
              </div>
            </div>
            <div>
              {ASIDE.map(([name, why], i) =>
              <div key={name} style={{ display: "flex", alignItems: "baseline", gap: 11, padding: "11px 2px", borderTop: `1px solid ${c.line}` }}>
                  <span style={{ flex: "0 0 auto", width: 14, color: c.soft, fontWeight: 700, fontSize: 16, lineHeight: 1 }}>—</span>
                  <span style={{ flex: 1, fontSize: 14.5, fontWeight: 600, color: c.ink }}>{name}</span>
                  <span style={{ flex: "0 0 auto", fontSize: 12.5, color: c.soft, fontStyle: "italic" }}>{why}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* barre basse — identique aux autres écrans */}
        <div style={{ position: "sticky", bottom: 0, background: c.bg, borderTop: `1px solid ${c.line}`, padding: "9px 8px 16px", display: "flex", justifyContent: "space-between" }}>
          {tabs.map(([txt, ic, active, href]) =>
          <a key={txt} href={href || undefined} style={{ flex: "1 1 0", textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: active ? c.accent : c.soft, cursor: href ? "pointer" : "default" }}>
              <Ic name={ic} col={active ? c.accent : c.soft} sw={active ? 2.1 : 1.7} s={23} />
              <span style={{ fontFamily: GRO, fontSize: 10, fontWeight: active ? 700 : 500 }}>{txt}</span>
            </a>
          )}
        </div>
      </div>

      <NotionSheet open={notion} onClose={() => setNotion(false)} />
    </div>
    {panel}
    </React.Fragment>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
