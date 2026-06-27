// accueil-shared.jsx — backtoenergy · page d'accueil publique
// Tokens + composants communs (direction « Édito tonique »)

const acC = {
  chassis: "#1C160C",
  bg: "#EFE6CF",
  paper: "#FBF6EA",
  line: "#E2D4B5",
  ink: "#1E1B14",
  soft: "#857A61",
  green: "#4E7A3C",
  accent: "#E8622A",
  pop: "#F2B431",
  popInk: "#A9742A",
  terraInk: "#C2552A"
};

const AC_SER = "'Baloo 2', sans-serif";
const AC_GRO = "'Space Grotesk', sans-serif";
const AC_BODY = "'Hanken Grotesk', sans-serif";

function acRgba(hex, a) {
  const h = hex.replace("#", "");
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`;
}

// semaines (accents profonds — progression/contexte uniquement)
const acWeeks = [
  { num: "Semaine 1", title: "Détox & Purification", col: "#4E7A3C", days: "Jours 1 – 7", body: "On allège tout. Le corps évacue, tu bois beaucoup, tu manges simple. La fatigue peut monter avant de redescendre — c'est normal, ça travaille." },
  { num: "Semaine 2", title: "Énergie & Vitalité", col: "#E2A21E", days: "Jours 8 – 14", body: "Le brouillard se lève. L'énergie remonte, les associations deviennent des réflexes — tu n'as plus besoin de réfléchir devant ton assiette." },
  { num: "Semaine 3", title: "Ancrage & Performance", col: "#C2552A", days: "Jours 15 – 21", body: "C'est ta façon de manger, maintenant. Tu n'y penses plus, tu le sens : plus léger, plus net, plus solide." }
];

// repères (points d'appui, pas des interdits)
const acReperes = [
  { ic: "link", title: "Des associations simples", body: "Protéines ou féculents avec tes légumes — jamais les deux dans la même assiette." },
  { ic: "leaf", title: "Des aliments vivants", body: "Ce qui sort de la terre, du marché, de la mer. Rien d'industriel, rien de compliqué." },
  { ic: "apple", title: "Les fruits, toujours seuls", body: "En encas, jamais en dessert — c'est là qu'ils te font vraiment du bien." },
  { ic: "walk", title: "Bouger chaque jour", body: "Trente minutes dehors. Ça fait partie du programme, pas du bonus." }
];

// ---------- icônes (linéaires arrondies, trait 1.7) ----------
function AcIc({ name, col = acC.ink, sw = 1.7, s = 22 }) {
  const p = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: col, strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "leaf": return <svg {...p}><path d="M5 18c0-7 5-12 14-12 0 9-5 14-12 14-1 0-2-.5-2-2z"></path><path d="M9 16c2-3 4-5 7-6"></path></svg>;
    case "arrow": return <svg {...p}><path d="M5 12h14M13 6l6 6-6 6"></path></svg>;
    case "check": return <svg {...p}><path d="M5 12.5l4.5 4.5L19 7"></path></svg>;
    case "coffee": return <svg {...p}><path d="M4 9h13v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"></path><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17"></path><path d="M8 5c0-1 .8-1.2.8-2.4M12 5c0-1 .8-1.2.8-2.4"></path></svg>;
    case "walk": return <svg {...p}><circle cx="13.5" cy="4.8" r="1.7"></circle><path d="M13.2 8.2l-1.7 4 2.3 2v5.6"></path><path d="M13.8 11.6l3.1 1.6 1.6-1"></path><path d="M11.5 12.2l-2.4 1.2-1.4 3.4"></path></svg>;
    case "link": return <svg {...p}><path d="M9.5 14.5l5-5"></path><path d="M11 7.5l1.6-1.6a3.4 3.4 0 0 1 4.8 4.8L15.8 12.3"></path><path d="M13 16.5l-1.6 1.6a3.4 3.4 0 0 1-4.8-4.8L8.2 11.7"></path></svg>;
    case "mail": return <svg {...p}><rect x="3" y="5" width="18" height="14" rx="2.5"></rect><path d="M4 7l8 6 8-6"></path></svg>;
    case "lock": return <svg {...p}><rect x="5" y="11" width="14" height="9" rx="2.2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg>;
    case "apple": return <svg {...p}><path d="M12 8.5c-1-1.2-2.6-1.6-4-.9-2.2 1.1-2.8 4.3-1.4 7.1 1.3 2.6 3.2 4.3 5.4 3.4 2.2.9 4.1-.8 5.4-3.4 1.4-2.8.8-6-1.4-7.1-1.4-.7-3-.3-4 .9z"></path><path d="M12 8.5c0-2 .9-3.3 2.6-4" data-comment-anchor=""></path></svg>;
    case "chat": return <svg {...p}><path d="M5 6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5v7A1.5 1.5 0 0 1 17.5 15H10l-4 3.5V15H6.5A1.5 1.5 0 0 1 5 13.5z"></path></svg>;
    case "spark": return <svg {...p}><path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z"></path></svg>;
    case "bowl": return <svg {...p}><path d="M4 13a8 8 0 0 0 16 0z"></path><path d="M12 5c-1.6 0-2.6 1-2.6 2.6M12 5c1.6 0 2.6 1 2.6 2.6"></path></svg>;
    default: return null;
  }
}

function AcWordmark({ s = 22 }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
      <span style={{ width: s + 10, height: s + 10, borderRadius: 999, background: acC.green, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><AcIc name="leaf" col={acC.bg} sw={1.9} s={s - 2}></AcIc></span>
      <span style={{ fontFamily: AC_SER, fontWeight: 600, fontSize: s + 2, color: acC.ink, letterSpacing: "-0.01em" }}>backtoenergy</span>
    </span>);
}

function AcEyebrow({ children, col = acC.soft, mb = 16, size = 11.5 }) {
  return <div style={{ fontFamily: AC_GRO, fontSize: size, letterSpacing: "0.16em", textTransform: "uppercase", color: col, fontWeight: 700, marginBottom: mb }}>{children}</div>;
}

// CTA pill terracotta
function AcPrimary({ children, small }) {
  return (
    <a href="J0.html" style={{ textDecoration: "none", cursor: "pointer", background: acC.accent, color: "#fff", fontFamily: AC_GRO, fontWeight: 700, fontSize: small ? 13.5 : 15.5, letterSpacing: "0.02em", padding: small ? "12px 22px" : "16px 30px", borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 10, whiteSpace: "nowrap", boxShadow: `0 14px 26px -14px ${acRgba(acC.accent, 0.9)}` }}>
      {children}<AcIc name="arrow" col="#fff" sw={2.1} s={small ? 15 : 17}></AcIc>
    </a>);
}

// CTA fantôme (bordure)
function AcGhost({ children, col = acC.ink }) {
  return (
    <a href="J0.html" style={{ textDecoration: "none", cursor: "pointer", background: "transparent", color: col, fontFamily: AC_GRO, fontWeight: 700, fontSize: 13.5, letterSpacing: "0.02em", padding: "14px 24px", borderRadius: 999, border: `1.5px solid ${acRgba(col, 0.35)}`, display: "inline-flex", alignItems: "center", whiteSpace: "nowrap" }}>
      {children}
    </a>);
}

// header public commun
function AcHeader() {
  return (
    <header style={{ padding: "20px 48px", borderBottom: `1.5px solid ${acC.line}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <AcWordmark></AcWordmark>
      <nav style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <a href="J0.html" style={{ textDecoration: "none", fontFamily: AC_GRO, fontWeight: 500, fontSize: 13, color: acC.soft }}>Espace coach</a>
        <a href="J0.html" style={{ textDecoration: "none", fontFamily: AC_GRO, fontWeight: 700, fontSize: 13, color: acC.ink, border: `1.5px solid ${acC.ink}`, borderRadius: 999, padding: "9px 20px" }}>Connexion</a>
      </nav>
    </header>);
}

// photo (filtre léger, coins arrondis)
function AcPhoto({ src, h, radius = 18, style = {} }) {
  return <img src={src} alt="" style={{ display: "block", width: "100%", height: h, objectFit: "cover", borderRadius: radius, filter: "saturate(1.05) brightness(1.02)", ...style }}></img>;
}

// encart Laurent (vert, sensation)
function AcLaurent({ compact }) {
  return (
    <div style={{ background: acRgba(acC.green, 0.10), border: `1.5px solid ${acRgba(acC.green, 0.35)}`, borderRadius: 18, padding: compact ? "26px 28px" : "32px 36px", display: "flex", gap: 22, alignItems: "flex-start" }}>
      <span style={{ flex: "0 0 auto", width: 54, height: 54, borderRadius: 999, background: acC.accent, color: acC.bg, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: AC_SER, fontWeight: 600, fontSize: 24 }}>L</span>
      <div style={{ flex: 1 }}>
        <AcEyebrow col={acC.green} mb={10} size={11}>Ton coach, un humain</AcEyebrow>
        <p style={{ margin: "0 0 12px", fontFamily: AC_SER, fontWeight: 600, fontSize: compact ? 21 : 24, lineHeight: 1.3, color: acC.ink, letterSpacing: "-0.01em", textWrap: "pretty" }}>
          « Tu m'écris quand tu veux, je te réponds personnellement. Tu n'es jamais seul·e face à une question. »
        </p>
        <p style={{ margin: 0, fontSize: 14, color: acC.soft, fontWeight: 500 }}>— Laurent, coach backtoenergy</p>
      </div>
    </div>);
}

// ligne café (non-privation)
function AcCafe({ style = {} }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, ...style }}>
      <span style={{ width: 34, height: 34, borderRadius: 999, background: acRgba(acC.pop, 0.22), display: "inline-flex", alignItems: "center", justifyContent: "center" }}><AcIc name="coffee" col={acC.popInk} sw={1.8} s={18}></AcIc></span>
      <span style={{ fontSize: 14.5, color: acC.soft, fontWeight: 500 }}>Et le café ? Il reste. Dès le premier matin.</span>
    </div>);
}

function AcFooter() {
  return (
    <footer style={{ borderTop: `1.5px solid ${acC.line}`, padding: "26px 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontFamily: AC_GRO, fontWeight: 700, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: acC.soft }}>backtoenergy</span>
      <span style={{ fontSize: 12.5, color: acC.soft }}>Programme 21 jours · méthode Verissimo · backtoenergy.fr</span>
    </footer>);
}

Object.assign(window, {
  acC, acRgba, acWeeks, acReperes, AC_SER, AC_GRO, AC_BODY,
  AcIc, AcWordmark, AcEyebrow, AcPrimary, AcGhost, AcHeader, AcPhoto, AcLaurent, AcCafe, AcFooter
});
