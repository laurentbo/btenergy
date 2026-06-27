// connexion-screen.jsx — backtoenergy · page de connexion publique (racine du site)
// Flux réel : mail d'invitation (email + mot de passe temporaire) → connexion → Jour 0.
// Réutilise les tokens/composants de accueil-shared.jsx (acC, AcIc, AcWordmark…).

const { useState, useEffect } = React;

function useCxDesktop() {
  const [d, setD] = useState(window.innerWidth >= 880);
  useEffect(() => {
    const r = () => setD(window.innerWidth >= 880);
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, []);
  return d;
}

function CxField({ id, label, type = "text", icon, value, onChange, placeholder, valid }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label htmlFor={id} style={{ fontFamily: AC_GRO, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: acC.soft, marginBottom: 9, display: "block" }}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: 11, background: acC.paper, border: `2px solid ${acC.ink}`, borderRadius: 12, padding: "13px 15px" }}>
        <AcIc name={icon} col={acC.accent} sw={1.9} s={20}></AcIc>
        <input id={id} type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} style={{ flex: 1, minWidth: 0, border: "none", background: "transparent", outline: "none", color: acC.ink, fontFamily: AC_GRO, fontSize: 15, fontWeight: 500, letterSpacing: type === "password" ? "0.08em" : "normal" }}></input>
        {valid ? <AcIc name="check" col={acC.green} sw={2.4} s={18}></AcIc> : null}
      </div>
    </div>);
}

function ConnexionPage() {
  const desktop = useCxDesktop();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const emailOk = /.+@.+\..+/.test(email);
  const ready = emailOk && pwd.length >= 6;

  const inner = (
    <div style={{ width: "100%", maxWidth: 410, display: "flex", flexDirection: "column", alignItems: "stretch" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}><AcWordmark s={22}></AcWordmark></div>

      <h1 style={{ margin: "0 0 10px", textAlign: "center", fontFamily: AC_SER, fontWeight: 700, fontSize: 38, lineHeight: 1.05, letterSpacing: "-0.015em", color: acC.ink }}>
        Content de te <span style={{ color: acC.accent }}>retrouver.</span>
      </h1>
      <p style={{ margin: "0 0 28px", textAlign: "center", fontSize: 15.5, lineHeight: 1.55, color: acC.soft, textWrap: "pretty" }}>
        Tes identifiants sont dans le mail d'invitation de Laurent.
      </p>

      <CxField id="cx-email" label="Ton email" type="email" icon="mail" value={email} onChange={setEmail} placeholder="prenom@email.fr" valid={emailOk}></CxField>
      <CxField id="cx-pwd" label="Ton mot de passe" type="password" icon="lock" value={pwd} onChange={setPwd} placeholder="••••••••" valid={pwd.length >= 6}></CxField>

      <a href="J0.html" onClick={(e) => { if (!ready) e.preventDefault(); }} style={{ width: "100%", boxSizing: "border-box", textDecoration: "none", cursor: ready ? "pointer" : "default", border: "none", background: acC.accent, color: "#fff", fontFamily: AC_GRO, fontWeight: 700, fontSize: 15, letterSpacing: "0.02em", padding: "15px 18px", borderRadius: 999, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, opacity: ready ? 1 : 0.55, boxShadow: `0 14px 26px -14px ${acRgba(acC.accent, 0.9)}`, transition: "opacity 0.15s", marginTop: 4 }}>
        Me connecter <AcIc name="arrow" col="#fff" sw={2.2} s={18}></AcIc>
      </a>

      <div style={{ borderTop: `1.5px solid ${acC.line}`, marginTop: 28, paddingTop: 20, textAlign: "center", fontSize: 13, lineHeight: 1.55, color: acC.soft, textWrap: "pretty" }}>
        Première fois ici ? Quelqu'un t'a donné ce lien ? Tu n'arrives pas à te connecter ?<br></br>
        <a href="mailto:laurent@backtoenergy.fr" style={{ color: acC.green, fontWeight: 600 }}>Envoie-moi un mail</a>, je m'occupe de toi. <span style={{ color: acC.soft }}>— Laurent</span>
      </div>
    </div>);

  return (
    <div data-screen-label="Connexion" style={{ minHeight: "100vh", background: desktop ? acC.chassis : acC.bg, fontFamily: AC_BODY, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: desktop ? "48px 24px" : "32px 24px" }}>
      {desktop ?
        <div style={{ background: acC.bg, border: `1.5px solid ${acC.line}`, borderRadius: 26, padding: "56px 52px 44px", width: "100%", maxWidth: 520, display: "flex", justifyContent: "center", boxShadow: "0 30px 60px -30px rgba(0,0,0,0.5)" }}>{inner}</div> :
        inner}
      <div style={{ marginTop: 26, fontFamily: AC_GRO, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: desktop ? acRgba("#EFE6CF", 0.45) : acC.soft, display: "flex", alignItems: "center", gap: 16 }}>
        <span>backtoenergy · programme 21 jours</span>
        <span style={{ opacity: 0.5 }}>·</span>
        <a href="Coach.html" style={{ color: "inherit", textDecoration: "none" }}>Espace coach</a>
      </div>
    </div>);
}

ReactDOM.createRoot(document.getElementById("root")).render(<ConnexionPage></ConnexionPage>);
