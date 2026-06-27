// profil-screen.jsx — backtoenergy · écran Profil (minimal)
// Accès : depuis l'en-tête de l'écran Jour (avatar) — pas un 6e onglet.
// Contenu : identité, évolution du poids (optionnelle), note à moi-même (tweakable), déconnexion.
// Réutilise accueil-shared.jsx (acC, AcIc, acRgba, AC_*) + tweaks-panel.jsx.

const { useState, useEffect } = React;

const PF_USER = "Cécile";
const PF_EMAIL = "cecile.m@email.fr";

const PF_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "showSelfNote": true,
  "selfNotePos": "avant le poids",
  "showWeightCard": true
}/*EDITMODE-END*/;

// note à moi-même — privée, jamais transmise (contrepoint de la carte poids)
function PfSelfNote() {
  const [note, setNote] = useState(() => {
    try { return localStorage.getItem("bte-profil-self-note") || ""; } catch (e) { return ""; }
  });
  useEffect(() => {
    try { localStorage.setItem("bte-profil-self-note", note); } catch (e) {}
  }, [note]);
  return (
    <div style={{ background: acC.paper, border: `1.5px solid ${acC.line}`, borderRadius: 18, padding: "20px 18px 18px", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
        <span style={{ fontFamily: AC_SER, fontWeight: 600, fontSize: 19, letterSpacing: "-0.01em", color: acC.ink }}>Note à moi-même</span>
      </div>
      <p style={{ margin: "0 0 14px", fontSize: 13.5, lineHeight: 1.55, color: acC.soft, textWrap: "pretty" }}>Si tu veux noter un truc, un objectif, ce que tu veux ;)</p>
      <textarea aria-label="Note à moi-même" rows={4} placeholder="Écris-la avec tes mots…" value={note} onChange={(e) => setNote(e.target.value)} style={{ display: "block", width: "100%", boxSizing: "border-box", resize: "vertical", minHeight: 96, background: acC.paper, border: `2px solid ${acC.ink}`, borderRadius: 12, padding: "12px 14px", color: acC.ink, fontFamily: AC_BODY, fontSize: 14.5, lineHeight: 1.55, outline: "none" }}></textarea>
      {note.trim() !== "" ?
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 10 }}>
          <AcIc name="check" col={acC.green} sw={2.2} s={15}></AcIc>
          <span style={{ fontFamily: AC_GRO, fontSize: 11, fontWeight: 500, color: acC.soft }}>Gardée ici, sur ton téléphone.</span>
        </div> : null}
    </div>);
}

function ProfilScreen() {
  const [t, setTweak] = useTweaks(PF_TWEAK_DEFAULTS);
  const [entries, setEntries] = useState([
  { label: "Jour 1", date: "1 juin", kg: "72,5" },
  { label: "Jour 8", date: "8 juin", kg: "71" }]
  );
  const [newKg, setNewKg] = useState("");
  const todayLabel = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
  const addEntry = () => {
    if (newKg.trim() === "") return;
    setEntries([...entries, { label: "Jour 12", date: todayLabel, kg: newKg.replace(".", ",") }]);
    setNewKg("");
  };

  return (
    <div style={{ minHeight: "100vh", background: acC.chassis, display: "flex", justifyContent: "center", fontFamily: AC_BODY }}>
      <div data-screen-label="Profil" style={{ width: "100%", maxWidth: 440, minHeight: "100vh", background: acC.bg, color: acC.ink, display: "flex", flexDirection: "column", padding: "20px 18px 36px" }}>

        {/* top bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 26 }}>
          <a href="Aujourd'hui.html" aria-label="Retour à ma journée" style={{ flex: "0 0 auto", width: 42, height: 42, borderRadius: 999, border: `2px solid ${acC.ink}`, display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
            <span style={{ display: "inline-flex", transform: "rotate(180deg)" }}><AcIc name="arrow" col={acC.ink} sw={2} s={19}></AcIc></span>
          </a>
          <span style={{ fontFamily: AC_GRO, fontWeight: 700, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: acC.soft }}>Ton profil</span>
        </div>

        {/* identité */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <span style={{ flex: "0 0 auto", width: 64, height: 64, borderRadius: 999, background: acC.accent, color: acC.bg, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: AC_SER, fontWeight: 600, fontSize: 28 }}>{PF_USER[0]}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: AC_SER, fontWeight: 700, fontSize: 27, letterSpacing: "-0.015em", lineHeight: 1.05, color: acC.ink }}>{PF_USER}</div>
          </div>
        </div>

        {/* note à moi-même (tweak) — avant le poids */}
        {t.showSelfNote && t.selfNotePos === "avant le poids" ? <PfSelfNote></PfSelfNote> : null}

        {/* évolution du poids (optionnelle) */}
        {t.showWeightCard ?
        <div style={{ background: acC.paper, border: `1.5px solid ${acC.line}`, borderRadius: 18, padding: "20px 18px 18px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
            <span style={{ fontFamily: AC_SER, fontWeight: 600, fontSize: 19, letterSpacing: "-0.01em", color: acC.ink }}>L'évolution de ton poids</span>
            <span style={{ fontFamily: AC_GRO, fontWeight: 700, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: acC.popInk, background: acRgba(acC.pop, 0.22), padding: "4px 10px", borderRadius: 999 }}>Si tu veux</span>
          </div>
          <p style={{ margin: "0 0 16px", fontSize: 13.5, lineHeight: 1.55, color: acC.soft, textWrap: "pretty" }}>Note-le quand ça te dit, c'est tout.</p>

          {entries.length > 0 ?
          <div style={{ display: "flex", flexDirection: "column", marginBottom: 16 }}>
              {entries.map((e, i) =>
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 2px", borderTop: i === 0 ? "none" : `1.5px solid ${acC.line}` }}>
                  <span style={{ flex: "0 0 auto", width: 8, height: 8, borderRadius: 999, background: acC.green }}></span>
                  <span style={{ flex: 1, fontSize: 14, color: acC.ink, fontWeight: 600 }}>{e.label} <span style={{ color: acC.soft, fontWeight: 400 }}>· {e.date}</span></span>
                  <span style={{ flex: "0 0 auto", fontFamily: AC_GRO, fontWeight: 700, fontSize: 14.5, color: acC.ink }}>{e.kg} kg</span>
                </div>
            )}
            </div> : null}

          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: acC.paper, border: `2px solid ${acC.ink}`, borderRadius: 12, padding: "11px 14px" }}>
              <input aria-label="Ton poids aujourd'hui" type="number" inputMode="decimal" min="30" max="250" step="0.5" placeholder={todayLabel + "…"} value={newKg} onChange={(e) => setNewKg(e.target.value)} style={{ flex: 1, width: "100%", minWidth: 0, border: "none", background: "transparent", outline: "none", color: acC.ink, fontFamily: AC_GRO, fontSize: 15, fontWeight: 700 }}></input>
              <span style={{ flex: "0 0 auto", fontFamily: AC_GRO, fontSize: 12, fontWeight: 500, color: acC.soft }}>kg</span>
            </div>
            <button onClick={addEntry} style={{ flex: "0 0 auto", cursor: newKg.trim() !== "" ? "pointer" : "default", border: "none", background: acC.green, color: "#fff", fontFamily: AC_GRO, fontWeight: 700, fontSize: 13.5, letterSpacing: "0.02em", padding: "0 22px", borderRadius: 999, opacity: newKg.trim() !== "" ? 1 : 0.55, transition: "opacity 0.15s" }}>Noter</button>
          </div>
        </div> : null}

        {/* note à moi-même (tweak) — après le poids */}
        {t.showSelfNote && t.selfNotePos === "après le poids" ? <PfSelfNote></PfSelfNote> : null}

        <div style={{ flex: 1 }}></div>

        {/* déconnexion */}
        <a href="Connexion.html" style={{ textDecoration: "none", textAlign: "center", border: `1.5px solid ${acRgba(acC.ink, 0.35)}`, color: acC.ink, background: "transparent", fontFamily: AC_GRO, fontWeight: 700, fontSize: 13.5, padding: "13px 18px", borderRadius: 999 }}>Me déconnecter</a>
        <div style={{ marginTop: 14, textAlign: "center", fontFamily: AC_GRO, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: acC.soft }}>backtoenergy · programme 21 jours</div>

        <TweaksPanel>
          <TweakSection label="Note à moi-même"></TweakSection>
          <TweakToggle label="Afficher la carte" value={t.showSelfNote} onChange={(v) => setTweak("showSelfNote", v)}></TweakToggle>
          <TweakRadio label="Position" value={t.selfNotePos} options={["avant le poids", "après le poids"]} onChange={(v) => setTweak("selfNotePos", v)}></TweakRadio>
          <TweakSection label="Poids"></TweakSection>
          <TweakToggle label="Journal du poids" value={t.showWeightCard} onChange={(v) => setTweak("showWeightCard", v)}></TweakToggle>
        </TweaksPanel>
      </div>
    </div>);
}

ReactDOM.createRoot(document.getElementById("root")).render(<ProfilScreen></ProfilScreen>);