// j0-screen.jsx — backtoenergy · parcours d'entrée : mail → connexion → Jour 0
// Direction visuelle : A2 « Édito tonique » (papier crème, Spectral + Space Grotesk).

const { useState, useEffect } = React;

// ---------- couleurs (Édito tonique) ----------
const c = {
  chassis: "#1C160C",
  bg: "#EFE6CF", // sable doré chaud (base) — du corps, sans virer orange
  paper2: "#FBF6EA", // cartes claires qui ressortent sur le sable
  ink: "#1E1B14", // encre
  soft: "#857A61", // texte doux
  line: "#E2D4B5", // filets
  green: "#4E7A3C", // vert (notes, signatures)
  greenSurf: "#DCEAC2", // surface verte (bloc démarrage)
  accent: "#E8622A", // terracotta (CTA, accent titres)
  pop: "#F2B431" // ambre pop (slots, surlignage)
};
// accents par semaine (trio tonique)
const WK = ["#4E7A3C", "#E2A21E", "#C2552A"];

const SER = "'Baloo 2', sans-serif";
const GRO = "'Space Grotesk', sans-serif";
const BODY = "'Hanken Grotesk', sans-serif";

function rgba(hex, a) {
  const h = hex.replace("#", "");
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`;
}

const USER = "Cécile";
const COACH = "Laurent";
const EMAIL = "cecile.m@email.fr";

function tomorrowLabel() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const s = d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ---------- icônes (linéaires arrondies) ----------
function Ic({ name, col = c.ink, sw = 1.7, s = 22 }) {
  const p = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: col, strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "jour":return <svg {...p}><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" /></svg>;
    case "courses":return <svg {...p}><path d="M5 8h14l-1.2 10.5a1.5 1.5 0 0 1-1.5 1.3H7.7a1.5 1.5 0 0 1-1.5-1.3z" /><path d="M8.5 8a3.5 3.5 0 0 1 7 0" /></svg>;
    case "recettes":return <svg {...p}><path d="M4 13a8 8 0 0 0 16 0z" /><path d="M12 5c-1.6 0-2.6 1-2.6 2.6M12 5c1.6 0 2.6 1 2.6 2.6" /></svg>;
    case "methode":return <svg {...p}><path d="M5 5.5A1.5 1.5 0 0 1 6.5 4H18v16H6.5A1.5 1.5 0 0 0 5 21z" /><path d="M18 4v16" /></svg>;
    case "coach":return <svg {...p}><path d="M5 6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5v7A1.5 1.5 0 0 1 17.5 15H10l-4 3.5V15H6.5A1.5 1.5 0 0 1 5 13.5z" /></svg>;
    case "chevron":return <svg {...p}><path d="M6 9l6 6 6-6" /></svg>;
    case "arrow":return <svg {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case "back":return <svg {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>;
    case "check":return <svg {...p}><path d="M5 12.5l4.5 4.5L19 7" /></svg>;
    case "leaf":return <svg {...p}><path d="M5 18c0-7 5-12 14-12 0 9-5 14-12 14-1 0-2-.5-2-2z" /><path d="M9 16c2-3 4-5 7-6" /></svg>;
    case "spark":return <svg {...p}><path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z" /></svg>;
    case "mail":return <svg {...p}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M4 7l8 6 8-6" /></svg>;
    case "lock":return <svg {...p}><rect x="5" y="11" width="14" height="9" rx="2.2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>;
    case "coffee":return <svg {...p}><path d="M4 9h13v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" /><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17" /><path d="M8 5c0-1 .8-1.2.8-2.4M12 5c0-1 .8-1.2.8-2.4" /></svg>;
    case "heart":return <svg {...p}><path d="M12 20s-7-4.5-9.2-9C1.3 8 3 4.5 6.3 4.5c2 0 3.2 1.2 3.7 2.2C10.5 5.7 11.7 4.5 13.7 4.5 17 4.5 18.7 8 17.2 11 15 15.5 12 20 12 20z" /></svg>;
    case "book":return <svg {...p}><path d="M5 5.5A1.5 1.5 0 0 1 6.5 4H18v16H6.5A1.5 1.5 0 0 0 5 21z" /><path d="M18 4v16" /></svg>;
    case "link":return <svg {...p}><path d="M9.5 14.5l5-5" /><path d="M11 7.5l1.6-1.6a3.4 3.4 0 0 1 4.8 4.8L15.8 12.3" /><path d="M13 16.5l-1.6 1.6a3.4 3.4 0 0 1-4.8-4.8L8.2 11.7" /></svg>;
    case "aside":return <svg {...p}><circle cx="12" cy="12" r="8.2" /><path d="M8.4 12h7.2" /></svg>;
    case "walk":return <svg {...p}><circle cx="13.5" cy="4.8" r="1.7" /><path d="M13.2 8.2l-1.7 4 2.3 2v5.6" /><path d="M13.8 11.6l3.1 1.6 1.6-1" /><path d="M11.5 12.2l-2.4 1.2-1.4 3.4" /></svg>;
    default:return null;
  }
}

// avatar éditorial (initiale)
function Avatar({ s = 46, bg = c.accent, fg = c.bg, ring }) {
  return (
    <span style={{ flex: "0 0 auto", width: s, height: s, borderRadius: 999, background: bg, border: ring ? `2px solid ${c.ink}` : "none", color: fg, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: SER, fontWeight: 600, fontSize: s * 0.46 }}>L</span>);
}

function Wordmark({ s = 22 }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
      <span style={{ width: s + 10, height: s + 10, borderRadius: 999, background: c.green, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Ic name="leaf" col={c.bg} sw={1.9} s={s - 2} /></span>
      <span style={{ fontFamily: SER, fontWeight: 600, fontSize: s + 2, color: c.ink, letterSpacing: "-0.01em" }}>backtoenergy</span>
    </span>);
}

// CTA plein (terracotta)
function PrimaryBtn({ as = "button", children, ...rest }) {
  const El = as;
  return (
    <El {...rest} style={{ width: "100%", textDecoration: "none", cursor: "pointer", border: "none", background: c.accent, color: "#fff", fontFamily: GRO, fontWeight: 700, fontSize: 15.5, letterSpacing: "0.01em", padding: "15px 18px", borderRadius: 999, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, whiteSpace: "nowrap", boxShadow: `0 14px 26px -14px ${rgba(c.accent, 0.9)}` }}>
      {children}
    </El>);
}

function Eyebrow({ children, col = c.soft }) {
  return <div style={{ fontFamily: GRO, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: col, fontWeight: 700, marginBottom: 14 }}>{children}</div>;
}

// ====================================================================
// ÉTAPE 1 — Mail d'invitation
// ====================================================================
function MailStep({ onNext }) {
  return (
    <div style={{ minHeight: "100%", background: c.bg, color: c.ink, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 22px 13px", borderBottom: `1px solid ${c.line}`, display: "flex", alignItems: "center", gap: 12 }}>
        <Ic name="back" col={c.soft} sw={2} s={20} />
        <span style={{ fontFamily: GRO, fontWeight: 600, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: c.soft }}>Boîte de réception</span>
      </div>

      <div style={{ padding: "24px 22px 28px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 20 }}>
          <Avatar s={48} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: SER, fontWeight: 600, fontSize: 17, color: c.ink }}>{COACH} · backtoenergy</div>
          </div>
          <span style={{ fontFamily: GRO, fontWeight: 700, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: c.ink, background: c.pop, padding: "5px 11px", borderRadius: 999 }}>Invitation</span>
        </div>

        <div style={{ fontFamily: SER, fontWeight: 600, fontSize: 33, color: c.ink, letterSpacing: "-0.02em", lineHeight: 1.04, marginBottom: 20 }}>
          Ça y est <span style={{ color: c.accent }}>{USER}</span> — ton programme t'attend
        </div>

        <div style={{ fontSize: 15.5, lineHeight: 1.62, color: c.ink, textWrap: "pretty", display: "flex", flexDirection: "column", gap: 13 }}>
          <p>Salut {USER},</p>
          <p>J'ai préparé tes 21 jours, repas par repas. À partir de demain, on réveille la machine en douceur — sans privation, sans te prendre la tête, et je suis là à chaque étape.</p>
          <p>Active ton accès, je te montre le chemin avant qu'on commence.</p>
          <p style={{ fontFamily: SER, fontSize: 16, color: c.green }}>— {COACH}</p>
        </div>

        <div style={{ flex: 1, minHeight: 18 }}></div>

        <PrimaryBtn onClick={onNext}>Activer mon accès <Ic name="arrow" col="#fff" sw={2.2} s={19} /></PrimaryBtn>
        <div style={{ marginTop: 12, textAlign: "center", fontFamily: GRO, fontSize: 11.5, color: c.soft, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <Ic name="lock" col={c.soft} sw={1.7} s={14} /> Lien personnel et sécurisé
        </div>
      </div>
    </div>);
}

// ====================================================================
// ÉTAPE 2 — Connexion
// ====================================================================
function LoginStep({ onBack, onNext }) {
  const [sent, setSent] = useState(false);
  return (
    <div style={{ minHeight: "100%", background: c.bg, color: c.ink, display: "flex", flexDirection: "column", padding: "20px 24px 28px" }}>
      <button onClick={onBack} aria-label="Retour" style={{ alignSelf: "flex-start", cursor: "pointer", width: 42, height: 42, borderRadius: 999, border: `2px solid ${c.ink}`, background: "transparent", color: c.ink, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Ic name="back" col={c.ink} sw={2} s={19} /></button>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Wordmark s={20} />
        <div style={{ fontFamily: SER, fontWeight: 600, fontSize: 40, color: c.ink, letterSpacing: "-0.02em", lineHeight: 1.0, marginTop: 26 }}>Active ton <span style={{ color: c.accent }}>accès</span></div>
        <div style={{ fontFamily: SER, fontSize: 16, color: c.green, lineHeight: 1.45, marginTop: 10, marginBottom: 28, textWrap: "pretty" }}>On t'a préparé ton programme. Connecte-toi pour la découvrir avant qu'on démarre.</div>

        <label style={{ fontFamily: GRO, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: c.soft, marginBottom: 9, display: "block" }}>Ton email</label>
        <div style={{ display: "flex", alignItems: "center", gap: 11, background: c.paper2, border: `2px solid ${c.ink}`, borderRadius: 12, padding: "13px 15px", marginBottom: 16 }}>
          <Ic name="mail" col={c.accent} sw={1.9} s={20} />
          <input defaultValue={EMAIL} readOnly style={{ flex: 1, minWidth: 0, border: "none", background: "transparent", outline: "none", color: c.ink, fontFamily: GRO, fontSize: 15, fontWeight: 500 }} />
          <Ic name="check" col={c.green} sw={2.4} s={18} />
        </div>

        {!sent ?
        <React.Fragment>
          <button onClick={() => setSent(true)} style={{ width: "100%", cursor: "pointer", border: `2px solid ${c.ink}`, background: "transparent", color: c.ink, fontFamily: GRO, fontWeight: 700, fontSize: 14, padding: "13px 18px", borderRadius: 999, marginBottom: 12, whiteSpace: "nowrap" }}>Recevoir mon lien magique</button>
          <PrimaryBtn onClick={onNext}>Entrer dans mon programme <Ic name="arrow" col="#fff" sw={2.2} s={19} /></PrimaryBtn>
        </React.Fragment> :
        <React.Fragment>
          <div style={{ display: "flex", gap: 11, background: rgba(c.green, 0.1), border: `1.5px solid ${rgba(c.green, 0.4)}`, borderRadius: 12, padding: "13px 15px", marginBottom: 16 }}>
            <span style={{ flex: "0 0 auto", marginTop: 1 }}><Ic name="check" col={c.green} sw={2.4} s={20} /></span>
            <div style={{ fontSize: 13.5, lineHeight: 1.5, color: c.ink }}>Lien envoyé à <b style={{ color: c.green }}>{EMAIL}</b>. Clique dessus pour entrer — ou continue directement&nbsp;:</div>
          </div>
          <PrimaryBtn onClick={onNext}>Entrer dans mon programme <Ic name="arrow" col="#fff" sw={2.2} s={19} /></PrimaryBtn>
        </React.Fragment>}
      </div>

      <div style={{ textAlign: "center", fontFamily: GRO, fontSize: 11.5, color: c.soft, lineHeight: 1.5 }}>Un souci pour te connecter&nbsp;? Écris à {COACH}, il te répond.</div>
    </div>);
}

// ====================================================================
// ÉTAPE 3 — Jour 0
// ====================================================================
const WEEKS = [
{ num: "01", theme: "Détox & Purification", word: "Nettoie", desc: "Comme une vidange en douceur, le corps se nettoie. Maux de tête ou petit coup de mou ? Bon signe : c'est la détox qui opère.", accent: WK[0] },
{ num: "02", theme: "Énergie & Vitalité", word: "Ça remonte", desc: "L'énergie remonte, le sommeil s'allège — un vrai apaisement s'installe.", accent: WK[1] },
{ num: "03", theme: "Ancrage & Performance", word: "Ancre", desc: "Les bons réflexes deviennent les tiens : une nouvelle énergie, et des effets sur la silhouette — en respectant un max les principes.", accent: WK[2] }];


const TABS_INFO = [
{ icon: "jour", t: "Jour", d: "Tes 3 repas du jour, ce que tu vas ressentir, et le « pourquoi » de chaque assiette." },
{ icon: "courses", t: "Courses", d: "À ta dispo : une liste de courses, avec un fond de placard." },
{ icon: "recettes", t: "Recettes", d: "Le carnet des 21 jours, à parcourir et chercher quand tu veux." },
{ icon: "methode", t: "Méthode", d: "La notion du jour en 2 min, pour comprendre ce que tu fais." },
{ icon: "coach", t: "Coach", d: `Moi, ${COACH}, en vrai — je te réponds personnellement.` }];


const PRINCIPLES = [
{ icon: "link", t: "Les bonnes associations", d: "Protéine et féculent jamais ensemble, fruits toujours seuls : ça digère sans fermenter." },
{ icon: "leaf", t: "Le vivant", d: "Fruits, légumes, graines, jus — du cru plein d'énergie, un maximum en local et bio." },
{ icon: "aside", t: "Ce qu'on met de côté", d: "Blé, sucre raffiné, laitages de vache : on les met de côté, en douceur." },
{ icon: "walk", t: "Un temps à soi", d: "30 min de marche, ou autre chose qui te fait du bien — un moment rien qu'à toi, chaque jour." }];


function J0Step() {
  const start = tomorrowLabel();
  const tabs = [["Jour", "jour", true, null], ["Courses", "courses", false, "Courses.html"], ["Recettes", "recettes", false, "Recettes.html"], ["Méthode", "methode", false, "Méthode.html"], ["Coach", "coach", false, "Coach.html"]];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", background: c.bg, color: c.ink }}>
      <div style={{ flex: 1, padding: "24px 22px 30px" }}>
        {/* en-tête */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontFamily: GRO, fontWeight: 700, fontSize: 12, color: c.bg, background: c.ink, padding: "5px 12px", borderRadius: 999, whiteSpace: "nowrap" }}>JOUR 00<span style={{ color: c.pop }}> / 21</span></span>
          <span style={{ fontFamily: GRO, fontWeight: 700, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: c.green }}>La veille</span>
        </div>
        <div style={{ fontFamily: SER, fontWeight: 600, fontSize: 36, lineHeight: 1.0, letterSpacing: "-0.02em", marginBottom: 16, whiteSpace: "nowrap" }}>Bienvenue <span style={{ color: c.accent }}>{USER}</span></div>

        {/* bandeau intro (terracotta) */}
        <div style={{ background: c.accent, borderRadius: 14, padding: "14px 16px", marginBottom: 22, display: "flex", alignItems: "center", gap: 13 }}>
          <span style={{ flex: "0 0 auto", color: "#fff" }}><Ic name="spark" col="#fff" sw={1.9} s={26} /></span>
          <div style={{ width: 1, height: 30, background: "rgba(255,255,255,0.4)", flex: "0 0 auto" }}></div>
          <div style={{ color: "#fff", fontSize: 13.5, fontWeight: 600, lineHeight: 1.35, textWrap: "pretty" }}>Salut {USER} ! Voilà ton programme pour relancer le moteur — une cuisine gourmande, un max de bio, des bonnes associations alimentaires et quelques produits à mettre de côté un maximum durant ces trois semaines. Si tu es OK pour lancer demain, ça se passe tout en bas :)</div>
        </div>

        {/* parcours · 3 semaines */}
        <div>
        <Eyebrow>Ton parcours · 3 semaines</Eyebrow>
        <div style={{ fontFamily: SER, fontWeight: 600, fontSize: 26, letterSpacing: "-0.01em", lineHeight: 1.05, marginBottom: 4 }}>21 jours, trois temps</div>
        <div style={{ borderTop: `1px solid ${c.line}`, marginTop: 16 }}>
          {WEEKS.map((w) =>
          <div key={w.num} style={{ borderBottom: `1px solid ${c.line}`, padding: "15px 0", display: "flex", gap: 15, alignItems: "flex-start" }}>
            <div style={{ fontFamily: SER, fontWeight: 700, fontSize: 30, color: w.accent, lineHeight: 1, width: 36, flex: "0 0 auto" }}>{w.num}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: SER, fontWeight: 600, fontSize: 19, color: c.ink, lineHeight: 1.15, marginBottom: 1 }}>{w.word}</div>
              <div style={{ fontFamily: GRO, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: w.accent, marginBottom: 6 }}>{w.theme}</div>
              <div style={{ fontFamily: SER, fontSize: 14, color: c.green, lineHeight: 1.45, textWrap: "pretty" }}>{w.desc}</div>
            </div>
          </div>
          )}
        </div>
        </div>

        {/* ce qui nous guide */}
        <div style={{ marginTop: 28 }}>
          <Eyebrow>Ce qui nous guide</Eyebrow>
          <div style={{ fontFamily: SER, fontWeight: 600, fontSize: 26, letterSpacing: "-0.01em", lineHeight: 1.05, marginBottom: 14 }}>Quatre principes simples</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {PRINCIPLES.map((p) =>
            <div key={p.t} style={{ background: c.paper2, border: `1.5px solid ${c.line}`, borderRadius: 14, padding: "13px 13px 12px" }}>
              <span style={{ display: "inline-flex", marginBottom: 9, color: c.accent }}><Ic name={p.icon} col={c.accent} sw={1.9} s={22} /></span>
              <div style={{ fontFamily: SER, fontWeight: 600, fontSize: 15.5, color: c.ink, lineHeight: 1.12, marginBottom: 3 }}>{p.t}</div>
              <div style={{ fontSize: 12, color: c.soft, lineHeight: 1.4, textWrap: "pretty" }}>{p.d}</div>
            </div>
            )}
          </div>
        </div>

        {/* l'appli au quotidien */}
        <div style={{ marginTop: 28 }}>
          <Eyebrow>L'appli au quotidien</Eyebrow>
          <div style={{ fontFamily: SER, fontWeight: 600, fontSize: 26, letterSpacing: "-0.01em", lineHeight: 1.05, marginBottom: 6 }}>Cinq onglets, un rituel</div>
          <div style={{ fontFamily: SER, fontSize: 14.5, color: c.green, lineHeight: 1.45, marginBottom: 14, textWrap: "pretty" }}>Tous les matins, tu reçois une notif avec le lien de ta journée. Et dans tes onglets, tu trouves :</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {TABS_INFO.map((r) =>
            <div key={r.t} style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
              <span style={{ flex: "0 0 auto", width: 42, height: 42, borderRadius: 12, background: c.paper2, border: `1.5px solid ${c.line}`, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Ic name={r.icon} col={c.ink} sw={1.8} s={22} /></span>
              <div style={{ flex: 1, minWidth: 0, paddingTop: 1 }}>
                <div style={{ fontFamily: SER, fontWeight: 600, fontSize: 17, color: c.ink, lineHeight: 1.1, marginBottom: 1 }}>{r.t}</div>
                <div style={{ fontSize: 13, color: c.soft, lineHeight: 1.4, textWrap: "pretty" }}>{r.d}</div>
              </div>
            </div>
            )}
          </div>
        </div>

        {/* préparer ses courses */}
        <a href="Courses.html" style={{ display: "flex", alignItems: "center", gap: 13, textDecoration: "none", background: c.paper2, border: `1.5px solid ${c.line}`, borderRadius: 16, padding: "15px 16px", marginTop: 24, marginBottom: 22 }}>
          <span style={{ flex: "0 0 auto", width: 44, height: 44, borderRadius: 12, background: rgba(c.green, 0.14), display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Ic name="courses" col={c.green} sw={1.9} s={23} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: SER, fontWeight: 600, fontSize: 17, color: c.ink, lineHeight: 1.1 }}>Prépare tes courses ce soir</div>
            <div style={{ fontSize: 12.5, color: c.soft, lineHeight: 1.35, marginTop: 2 }}>Ta liste pour les premiers jours est déjà prête.</div>
          </div>
          <span style={{ flex: "0 0 auto", color: c.accent, transform: "rotate(-90deg)" }}><Ic name="chevron" col={c.accent} sw={2.2} s={20} /></span>
        </a>

        {/* mot de Laurent (bloc encre) — réassurance avant le départ */}
        <div style={{ background: c.ink, borderRadius: 18, padding: "18px 18px 20px", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar s={46} bg={c.pop} fg={c.ink} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ fontFamily: SER, fontWeight: 700, fontSize: 18, color: c.bg, lineHeight: 1.2, whiteSpace: "nowrap" }}>{COACH}</span>
                <span style={{ flex: "0 0 auto", width: 17, height: 17, borderRadius: 999, background: c.pop, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Ic name="check" col={c.ink} sw={2.6} s={11} /></span>
              </div>
              
            </div>
          </div>
          <div style={{ fontFamily: SER, fontSize: 17, lineHeight: 1.5, color: c.bg, textWrap: "pretty", marginTop: 13 }}>
            « À ta dispo tout au long du parcours — pour tes questions, et pour les ressentis que tu pourras avoir. »
          </div>
        </div>

        {/* CTA démarrage (bloc lumineux) */}
        <div style={{ background: c.green, borderRadius: 20, padding: "22px 18px 18px", textAlign: "center", boxShadow: `0 22px 46px -26px ${rgba(c.green, 0.7)}` }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: GRO, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: c.pop, marginBottom: 11 }}>
            <Ic name="spark" col={c.pop} sw={2} s={15} /> On commence demain
          </div>
          <div style={{ fontFamily: SER, fontWeight: 600, fontSize: 30, color: "#FBF6EA", letterSpacing: "-0.01em", lineHeight: 1.06, marginBottom: 6 }}>{start}</div>
          <div style={{ fontSize: 13.5, color: "rgba(251,246,234,0.85)", lineHeight: 1.5, marginBottom: 16, textWrap: "pretty" }}>Ton Jour 1 s'ouvre demain matin. D'ici là, profite de ta soirée — tu as déjà fait le plus important : dire oui.</div>
          <PrimaryBtn as="a" href="Aujourd'hui.html">Découvrir mon Jour 1 <Ic name="arrow" col="#fff" sw={2.2} s={19} /></PrimaryBtn>
          <div style={{ marginTop: 11, fontFamily: GRO, fontSize: 11, color: "rgba(251,246,234,0.6)" }}>Aperçu — le programme s'ouvre vraiment demain.</div>
        </div>
      </div>

      {/* barre basse */}
      <div style={{ position: "sticky", bottom: 0, background: c.bg, borderTop: `1px solid ${c.line}`, padding: "9px 8px 16px", display: "flex", justifyContent: "space-between" }}>
        {tabs.map(([txt, ic, active, href]) =>
        <a key={txt} href={href || undefined} style={{ flex: "1 1 0", textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: active ? c.accent : c.soft, cursor: href ? "pointer" : "default" }}>
          <Ic name={ic} col={active ? c.accent : c.soft} sw={active ? 2.1 : 1.7} s={23} />
          <span style={{ fontFamily: GRO, fontSize: 10, fontWeight: active ? 700 : 500 }}>{txt}</span>
        </a>
        )}
      </div>
    </div>);
}

// ====================================================================
// Desktop — page éditoriale large (>= 880px)
// ====================================================================
function useIsDesktop(bp = 880) {
  const [d, setD] = useState(() => typeof window !== "undefined" && window.innerWidth >= bp);
  useEffect(() => {
    const on = () => setD(window.innerWidth >= bp);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, [bp]);
  return d;
}

function CoachCard({ s = 50 }) {
  return (
    <div style={{ background: c.ink, borderRadius: 20, padding: "22px 22px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
        <Avatar s={s} bg={c.pop} fg={c.ink} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontFamily: SER, fontWeight: 700, fontSize: 19, color: c.bg, lineHeight: 1.2, whiteSpace: "nowrap" }}>{COACH}</span>
            <span style={{ flex: "0 0 auto", width: 18, height: 18, borderRadius: 999, background: c.pop, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Ic name="check" col={c.ink} sw={2.6} s={12} /></span>
          </div>
          
        </div>
      </div>
      <div style={{ fontFamily: SER, fontSize: 15.5, lineHeight: 1.5, color: c.bg, textWrap: "pretty", marginTop: 15 }}>« À ta dispo tout au long du parcours — pour tes questions, et pour les ressentis que tu pourras avoir. »</div>
    </div>);
}

function CtaCard() {
  const start = tomorrowLabel();
  return (
    <div style={{ background: c.green, borderRadius: 20, padding: "26px 24px 22px", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", boxShadow: `0 22px 46px -26px ${rgba(c.green, 0.7)}` }}>
      <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, fontFamily: GRO, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: c.pop, marginBottom: 11 }}>
        <Ic name="spark" col={c.pop} sw={2} s={15} /> On commence demain
      </div>
      <div style={{ fontFamily: SER, fontWeight: 600, fontSize: 32, color: "#FBF6EA", letterSpacing: "-0.01em", lineHeight: 1.06, marginBottom: 7 }}>{start}</div>
      <div style={{ fontSize: 14, color: "rgba(251,246,234,0.85)", lineHeight: 1.5, marginBottom: 18, textWrap: "pretty", maxWidth: 360, marginLeft: "auto", marginRight: "auto" }}>Ton Jour 1 s'ouvre demain matin. D'ici là, profite de ta soirée — tu as déjà fait le plus important : dire oui.</div>
      <div style={{ maxWidth: 320, width: "100%", marginLeft: "auto", marginRight: "auto" }}>
        <PrimaryBtn as="a" href="Aujourd'hui.html">Découvrir mon Jour 1 <Ic name="arrow" col="#fff" sw={2.2} s={19} /></PrimaryBtn>
      </div>
      <div style={{ marginTop: 11, fontFamily: GRO, fontSize: 11, color: "rgba(251,246,234,0.6)" }}>Aperçu — le programme s'ouvre vraiment demain.</div>
    </div>);
}

function J0Desktop() {
  const nav = [["Jour", null], ["Courses", "Courses.html"], ["Recettes", "Recettes.html"], ["Méthode", "Méthode.html"], ["Coach", "Coach.html"]];
  const sec = { marginBottom: 56 };
  const h2 = { fontFamily: SER, fontWeight: 600, fontSize: 32, letterSpacing: "-0.015em", lineHeight: 1.05, marginBottom: 18 };
  return (
    <div style={{ minHeight: "100vh", background: c.bg, color: c.ink }}>
      {/* nav haute */}
      <div style={{ position: "sticky", top: 0, zIndex: 5, background: rgba(c.bg, 0.92), backdropFilter: "blur(8px)", borderBottom: `1px solid ${c.line}` }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
          <Wordmark s={18} />
          <div style={{ display: "flex", gap: 28 }}>
            {nav.map(([n, href]) =>
            <a key={n} href={href || undefined} style={{ textDecoration: "none", fontFamily: GRO, fontWeight: n === "Jour" ? 700 : 500, fontSize: 13.5, letterSpacing: "0.02em", color: n === "Jour" ? c.accent : c.soft, cursor: href ? "pointer" : "default" }}>{n}</a>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "44px 40px 64px" }}>
        {/* hero */}
        <div style={{ display: "grid", gridTemplateColumns: "1.25fr 0.85fr", gap: 44, alignItems: "center", ...sec }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 18 }}>
              <span style={{ fontFamily: GRO, fontWeight: 700, fontSize: 12, color: c.bg, background: c.ink, padding: "5px 12px", borderRadius: 999, whiteSpace: "nowrap" }}>JOUR 00<span style={{ color: c.pop }}> / 21</span></span>
              <span style={{ fontFamily: GRO, fontWeight: 700, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: c.green }}>La veille</span>
            </div>
            <div style={{ fontFamily: SER, fontWeight: 600, fontSize: 62, lineHeight: 0.98, letterSpacing: "-0.025em", marginBottom: 22 }}>Bienvenue <span style={{ color: c.accent }}>{USER}</span></div>
            <div style={{ background: c.accent, borderRadius: 14, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14, maxWidth: 520 }}>
              <span style={{ flex: "0 0 auto", color: "#fff" }}><Ic name="spark" col="#fff" sw={1.9} s={28} /></span>
              <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.4)", flex: "0 0 auto" }}></div>
              <div style={{ color: "#fff", fontSize: 14.5, fontWeight: 600, lineHeight: 1.35, textWrap: "pretty" }}>Salut {USER} ! Voilà ton programme pour relancer le moteur — une cuisine gourmande, un max de bio, des bonnes associations alimentaires et quelques produits à mettre de côté un maximum durant ces trois semaines. Si tu es OK pour lancer demain, ça se passe tout en bas :)</div>
            </div>
          </div>
          <CoachCard s={52} />
        </div>

        {/* parcours — 3 colonnes */}
        <div style={sec}>
          <Eyebrow>Ton parcours · 3 semaines</Eyebrow>
          <div style={h2}>21 jours, trois temps</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {WEEKS.map((w) =>
            <div key={w.num} style={{ background: c.paper2, border: `1.5px solid ${c.line}`, borderRadius: 16, padding: "20px 18px", borderTop: `4px solid ${w.accent}` }}>
              <div style={{ fontFamily: SER, fontWeight: 600, fontSize: 36, color: w.accent, lineHeight: 0.9, marginBottom: 10 }}>{w.num}</div>
              <div style={{ fontFamily: SER, fontWeight: 600, fontSize: 21, color: c.ink, lineHeight: 1.1, marginBottom: 4 }}>{w.word}</div>
              <div style={{ fontFamily: GRO, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: w.accent, marginBottom: 9 }}>{w.theme}</div>
              <div style={{ fontFamily: SER, fontSize: 14.5, color: c.green, lineHeight: 1.4, textWrap: "pretty" }}>{w.desc}</div>
            </div>
            )}
          </div>
        </div>

        {/* appli + principes — 2 colonnes */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 44, ...sec }}>
          <div>
            <Eyebrow>Ce qui nous guide</Eyebrow>
            <div style={h2}>Quatre principes simples</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {PRINCIPLES.map((p) =>
              <div key={p.t} style={{ background: c.paper2, border: `1.5px solid ${c.line}`, borderRadius: 14, padding: "15px 15px 14px" }}>
                <span style={{ display: "inline-flex", marginBottom: 10, color: c.accent }}><Ic name={p.icon} col={c.accent} sw={1.9} s={23} /></span>
                <div style={{ fontFamily: SER, fontWeight: 600, fontSize: 16, color: c.ink, lineHeight: 1.12, marginBottom: 4 }}>{p.t}</div>
                <div style={{ fontSize: 12.5, color: c.soft, lineHeight: 1.42, textWrap: "pretty" }}>{p.d}</div>
              </div>
              )}
            </div>
          </div>
          <div>
            <Eyebrow>L'appli au quotidien</Eyebrow>
            <div style={h2}>Cinq onglets, un rituel</div>
            <div style={{ fontFamily: SER, fontSize: 15, color: c.green, lineHeight: 1.45, marginBottom: 16, textWrap: "pretty" }}>Tous les matins, tu reçois une notif avec le lien de ta journée. Et dans tes onglets, tu trouves :</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {TABS_INFO.map((r) =>
              <div key={r.t} style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
                <span style={{ flex: "0 0 auto", width: 44, height: 44, borderRadius: 12, background: c.paper2, border: `1.5px solid ${c.line}`, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Ic name={r.icon} col={c.ink} sw={1.8} s={23} /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: SER, fontWeight: 600, fontSize: 17.5, color: c.ink, lineHeight: 1.1, marginBottom: 1 }}>{r.t}</div>
                  <div style={{ fontSize: 13.5, color: c.soft, lineHeight: 1.42, textWrap: "pretty" }}>{r.d}</div>
                </div>
              </div>
              )}
            </div>
          </div>
        </div>

        {/* courses + départ — 2 colonnes */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 24, alignItems: "stretch" }}>
          <a href="Courses.html" style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none", background: c.paper2, border: `1.5px solid ${c.line}`, borderRadius: 18, padding: "20px 20px" }}>
            <span style={{ flex: "0 0 auto", width: 48, height: 48, borderRadius: 13, background: rgba(c.green, 0.14), display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Ic name="courses" col={c.green} sw={1.9} s={25} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: SER, fontWeight: 600, fontSize: 18.5, color: c.ink, lineHeight: 1.1 }}>Prépare tes courses ce soir</div>
              <div style={{ fontSize: 13.5, color: c.soft, lineHeight: 1.35, marginTop: 3 }}>Ta liste pour les premiers jours est déjà prête.</div>
            </div>
            <span style={{ flex: "0 0 auto", color: c.accent, transform: "rotate(-90deg)" }}><Ic name="chevron" col={c.accent} sw={2.2} s={22} /></span>
          </a>
          <CtaCard />
        </div>
      </div>
    </div>);
}

// ====================================================================
// App — stepper persistant + ambiance du fond (Tweaks)
// ====================================================================
const PALETTES = [
["#EFE6CF", "#FBF6EA", "#E2D4B5", "#1C160C"], // Sable doré
["#EDE0BE", "#FAF3DC", "#DECBA0", "#1B1709"], // Blé doré (plus saturé)
["#EEDCAE", "#FBF0CF", "#DCC58E", "#1C1607"], // Miel (chaud)
["#ECD3A6", "#FAEDC6", "#D9BE86", "#1C1406"], // Caramel doux (plus chaud)
["#F1E2D2", "#FCF2E6", "#E7D3BD", "#1E130C"], // Terre / argile chaude
["#F0E6DE", "#FBF4EE", "#E4D5C9", "#1B130E"], // Lin rosé
["#EFEDE3", "#FBFAF3", "#DEDCCB", "#14160F"], // Crème froid
["#E9EBE6", "#F8FAF6", "#D7DBD2", "#14160F"], // Brume (gris-vert pâle)
["#E6EBDC", "#F7FAEF", "#D6DEC6", "#121710"], // Vert très clair
["#E2E7D5", "#F4F8EC", "#D0DABE", "#131710"] // Sauge (plus vert)
];
const TWEAK_DEFAULTS = { ambiance: PALETTES[3] };

function App() {
  const [step, setStep] = useState(() => localStorage.getItem("bte-j0-step") || "mail");
  useEffect(() => {localStorage.setItem("bte-j0-step", step);}, [step]);
  useEffect(() => {window.scrollTo(0, 0);}, [step]);
  const isDesktop = useIsDesktop();
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // applique l'ambiance choisie sur les tokens de fond (lus à chaque rendu)
  const amb = t.ambiance && t.ambiance.length === 4 ? t.ambiance : PALETTES[0];
  c.bg = amb[0];c.paper2 = amb[1];c.line = amb[2];c.chassis = amb[3];

  const panel =
  <TweaksPanel>
      <TweakSection label="Ambiance du fond" />
      <TweakColor label="Fond" value={t.ambiance} options={PALETTES} onChange={(v) => setTweak("ambiance", v)} />
    </TweaksPanel>;

  const content = step === "j0" && isDesktop ?
  <J0Desktop /> :
  <div style={{ minHeight: "100vh", background: c.chassis, display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 440, minHeight: "100vh", background: c.bg, position: "relative", display: "flex", flexDirection: "column" }}>
        {step === "mail" && <MailStep onNext={() => setStep("login")} />}
        {step === "login" && <LoginStep onBack={() => setStep("mail")} onNext={() => setStep("j0")} />}
        {step === "j0" && <J0Step />}

        {step !== "j0" &&
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, display: "flex" }}>
          <span style={{ flex: 1, background: c.accent }}></span>
          <span style={{ flex: 1, background: step === "login" ? c.accent : c.line }}></span>
          <span style={{ flex: 1, background: c.line }}></span>
        </div>
      }
      </div>
    </div>;

  return <React.Fragment>{content}{panel}</React.Fragment>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);