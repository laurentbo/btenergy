// coach-screen.jsx — backtoenergy · écran « Coach »
// Chat simple et humain : c'est Laurent qui répond, pas un bot.
// Direction visuelle : « Édito tonique » (papier sable + Baloo 2), cohérente avec les autres écrans.
// L'ancienne version « Nuit verte » est conservée dans _archive_nuitverte/.

const { useState, useRef, useEffect } = React;

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
const SER = "'Baloo 2', sans-serif";
const GRO = "'Space Grotesk', sans-serif";
const BODY = "'Hanken Grotesk', sans-serif";
function rgba(hex, a) {const h = hex.replace("#", "");return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`;}

const SEED = [
{ type: "date", label: "Samedi" },
{ from: "coach", time: "9:05", text: "Salut ! Bienvenue dans tes 21 jours. Je suis là tout du long — une question, un doute, une envie de craquer : tu m'écris, je te réponds vite." },
{ from: "me", time: "9:12", text: "Merci ! J'avoue que le premier jour me fait un peu peur." },
{ from: "coach", time: "9:20", text: "Normal, et c'est bon signe que tu te lances. On y va doucement : aujourd'hui, juste ton jus du matin et un déjeuner simple. Rien à réussir." },
{ type: "date", label: "Aujourd'hui" },
{ from: "me", time: "8:40", text: "Petit coup de mou ce matin, c'est normal ?" },
{ from: "coach", time: "8:58", text: "Oui, très. C'est le corps qui fait le tri en ce moment — au jour 7, c'est classique. Bois bien, marche un peu si tu peux. Ça passe d'ici demain." },
{ from: "me", time: "9:03", text: "Ok, ça me rassure. Merci Laurent !" },
{ from: "coach", time: "9:15", text: "Toujours là. Tu fais le plus dur — profite bien de ton velouté ce soir." }];


function Ic({ name, col = c.ink, sw = 1.7, s = 22 }) {
  const p = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: col, strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "jour":return <svg {...p}><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" /></svg>;
    case "courses":return <svg {...p}><path d="M5 8h14l-1.2 10.5a1.5 1.5 0 0 1-1.5 1.3H7.7a1.5 1.5 0 0 1-1.5-1.3z" /><path d="M8.5 8a3.5 3.5 0 0 1 7 0" /></svg>;
    case "recettes":return <svg {...p}><path d="M4 13a8 8 0 0 0 16 0z" /><path d="M12 5c-1.6 0-2.6 1-2.6 2.6M12 5c1.6 0 2.6 1 2.6 2.6" /></svg>;
    case "methode":return <svg {...p}><path d="M5 5.5A1.5 1.5 0 0 1 6.5 4H18v16H6.5A1.5 1.5 0 0 0 5 21z" /><path d="M18 4v16" /></svg>;
    case "coach":return <svg {...p}><path d="M5 6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5v7A1.5 1.5 0 0 1 17.5 15H10l-4 3.5V15H6.5A1.5 1.5 0 0 1 5 13.5z" /></svg>;
    case "send":return <svg {...p}><path d="M5 12l14-7-5 16-3.5-6.5z" /><path d="M10.5 14.5L19 5" /></svg>;
    case "clock":return <svg {...p}><circle cx="12" cy="12" r="8" /><path d="M12 8v4l2.5 2" /></svg>;
    default:return null;
  }
}

function nowHM() {
  const d = new Date();
  return d.getHours() + ":" + String(d.getMinutes()).padStart(2, "0");
}

function DateSep({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0 4px" }}>
      <div style={{ flex: 1, height: 1, background: c.line }}></div>
      <span style={{ fontFamily: GRO, fontSize: 10.5, fontWeight: 700, color: c.soft, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: c.line }}></div>
    </div>);

}

function Bubble({ m }) {
  const me = m.from === "me";
  return (
    <div style={{ display: "flex", justifyContent: me ? "flex-end" : "flex-start", gap: 9 }}>
      {!me &&
      <div style={{ flex: "0 0 auto", width: 30, height: 30, borderRadius: 999, background: c.green, color: "#fff", fontFamily: SER, fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", alignSelf: "flex-end" }}>L</div>
      }
      <div style={{ maxWidth: "76%", display: "flex", flexDirection: "column", alignItems: me ? "flex-end" : "flex-start", gap: 3 }}>
        <div style={{
          background: me ? c.green : c.paper2,
          color: me ? "#fff" : c.ink,
          border: me ? "none" : `1.5px solid ${c.line}`,
          borderRadius: me ? "18px 18px 6px 18px" : "18px 18px 18px 6px",
          padding: "11px 14px", fontSize: 14.5, lineHeight: 1.45, textWrap: "pretty",
          boxShadow: me ? `0 10px 20px -14px ${rgba(c.green, 0.8)}` : `0 8px 16px -14px ${rgba(c.chassis, 0.5)}`
        }}>{m.text}</div>
        <span style={{ fontFamily: GRO, fontSize: 10.5, color: c.soft, fontWeight: 500, padding: "0 4px" }}>{m.time}</span>
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
  const [msgs, setMsgs] = useState(SEED);
  const [draft, setDraft] = useState("");
  const threadRef = useRef(null);
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const amb = t.ambiance && t.ambiance.length === 4 ? t.ambiance : PALETTES[0];
  c.bg = amb[0];c.paper2 = amb[1];c.line = amb[2];c.chassis = amb[3];

  const scrollBottom = () => {const el = threadRef.current;if (el) el.scrollTop = el.scrollHeight;};
  useEffect(() => {scrollBottom();}, [msgs.length]);

  const send = () => {
    const txt = draft.trim();
    if (!txt) return;
    setMsgs((m) => [...m, { from: "me", time: nowHM(), text: txt }]);
    setDraft("");
  };
  const onKey = (e) => {if (e.key === "Enter" && !e.shiftKey) {e.preventDefault();send();}};

  const lastFromMe = msgs.length && msgs[msgs.length - 1].from === "me";

  const tabs = [["Jour", "jour", false, "Aujourd'hui.html"], ["Courses", "courses", false, "Courses.html"], ["Recettes", "recettes", false, "Recettes.html"], ["Méthode", "methode", false, "Méthode.html"], ["Coach", "coach", true, null]];

  const panel =
  <TweaksPanel>
      <TweakSection label="Ambiance du fond" />
      <TweakColor label="Fond" value={t.ambiance} options={PALETTES} onChange={(v) => setTweak("ambiance", v)} />
    </TweaksPanel>;

  return (
    <React.Fragment>
    <div style={{ height: "100vh", background: c.chassis, display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 440, height: "100vh", background: c.bg, display: "flex", flexDirection: "column" }} data-screen-label="Coach">

        {/* en-tête coach */}
        <div style={{ flex: "0 0 auto", background: c.bg, borderBottom: `1.5px solid ${c.line}`, padding: "14px 18px", display: "flex", alignItems: "center", gap: 13 }}>
          <div style={{ flex: "0 0 auto", width: 46, height: 46, borderRadius: 999, background: c.green, color: "#fff", fontFamily: SER, fontWeight: 700, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>L</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: SER, fontWeight: 700, fontSize: 20, color: c.ink, letterSpacing: "-0.01em", lineHeight: 1.05 }}>Laurent</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 2, fontFamily: GRO, fontSize: 11.5, color: c.soft, fontWeight: 500 }}>
              <Ic name="clock" col={c.green} sw={1.9} s={13} />
              Ecris-moi, je te réponds rapidement
            </div>
          </div>
        </div>

        {/* fil */}
        <div ref={threadRef} style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 12 }}>
          {/* note d'intro */}
          <div style={{ background: rgba(c.green, 0.1), border: `1.5px solid ${rgba(c.green, 0.3)}`, borderRadius: 14, padding: "11px 14px", fontSize: 12.5, color: c.green, fontWeight: 600, lineHeight: 1.45, textAlign: "center", textWrap: "pretty" }}>
            Ici c'est moi, Laurent — pas un robot. Écris-moi comme à un ami.
          </div>

          {msgs.map((m, i) => m.type === "date" ? <DateSep key={"d" + i} label={m.label} /> : <Bubble key={i} m={m} />)}

          {lastFromMe &&
            <div style={{ textAlign: "center", fontFamily: GRO, fontSize: 11, color: c.soft, fontWeight: 500, padding: "2px 0 6px" }}>
              Envoyé · Laurent te répond rapidement
            </div>
            }
        </div>

        {/* champ de saisie */}
        <div style={{ flex: "0 0 auto", background: c.bg, borderTop: `1.5px solid ${c.line}`, padding: "10px 14px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
            <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKey}
                rows={1}
                placeholder="Écris à Laurent…"
                style={{ flex: 1, resize: "none", border: `1.5px solid ${c.line}`, background: c.paper2, borderRadius: 22, padding: "12px 16px", fontFamily: BODY, fontSize: 15, color: c.ink, outline: "none", lineHeight: 1.4, maxHeight: 120 }}>
              </textarea>
            <button onClick={send} aria-label="Envoyer" disabled={!draft.trim()} style={{
                flex: "0 0 auto", width: 46, height: 46, borderRadius: 999, border: draft.trim() ? "none" : `1.5px solid ${c.line}`,
                background: draft.trim() ? c.green : c.paper2, color: draft.trim() ? "#fff" : c.soft,
                cursor: draft.trim() ? "pointer" : "default", display: "inline-flex", alignItems: "center", justifyContent: "center",
                transition: "all .15s"
              }}><Ic name="send" col={draft.trim() ? "#fff" : c.soft} sw={1.9} s={22} /></button>
          </div>
        </div>

        {/* barre basse — identique aux autres écrans */}
        <div style={{ flex: "0 0 auto", background: c.bg, borderTop: `1px solid ${c.line}`, padding: "9px 8px 16px", display: "flex", justifyContent: "space-between" }}>
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