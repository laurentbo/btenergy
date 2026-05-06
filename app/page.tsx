"use client"
import { useState } from "react"
import Link from "next/link"

export default function AccueilPublic() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleInscription(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    await fetch("/api/auth/inscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    })
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <div style={{ background: "#F8F7F4", color: "#2B2D2E", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", minHeight: "100vh" }}>

      {/* ── Header minimal ── */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e8e5e0", padding: "0 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <span style={{ fontWeight: 900, fontSize: 18, color: "#2A9D8F" }}>Backtoenergy</span>
          <Link href="/login" style={{ fontSize: 13, color: "#2A9D8F", fontWeight: 600, textDecoration: "none" }}>
            Se connecter →
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px 80px" }}>

        {/* ── Bloc 1 : Héro ── */}
        <section style={{ textAlign: "center", padding: "72px 0 56px" }}>
          <h1 style={{ fontSize: "clamp(32px,6vw,52px)", fontWeight: 900, lineHeight: 1.15, color: "#2B2D2E", margin: "0 0 16px" }}>
            Ballonnements, fatigue,<br />prise de poids ?
          </h1>
          <p style={{ fontSize: 20, fontWeight: 700, color: "#2A9D8F", margin: "0 0 12px" }}>
            Ton corps sature. On le nettoie naturellement.
          </p>
          <p style={{ fontSize: 15, color: "#6b6b6b", margin: "0 0 36px", letterSpacing: "0.02em" }}>
            Alimentation non transformée · Associations simples · 21 jours
          </p>
          <a href="#inscription"
            style={{
              display: "inline-block",
              background: "#2A9D8F",
              color: "#fff",
              fontWeight: 700,
              fontSize: 16,
              padding: "16px 36px",
              borderRadius: 12,
              textDecoration: "none",
              boxShadow: "0 4px 24px rgba(42,157,143,0.25)",
            }}>
            Commencer gratuitement →
          </a>
        </section>

        {/* ── Bloc 2 : 4 Signes d'alerte ── */}
        <section style={{ marginBottom: 72 }}>
          <h2 style={{ textAlign: "center", fontSize: 22, fontWeight: 800, color: "#2B2D2E", marginBottom: 32 }}>
            Tu reconnais ces signaux ?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 16 }}>
            {[
              { icon: "🫃", text: "Ventre gonflé après les repas" },
              { icon: "⚖️", text: "Prise de poids sans explication" },
              { icon: "😴", text: "Fatigue chronique, brouillard mental" },
              { icon: "🌙", text: "Sommeil non réparateur" },
            ].map(({ icon, text }) => (
              <div key={text} style={{
                background: "#fff",
                borderRadius: 16,
                padding: "24px 20px",
                textAlign: "center",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                border: "1px solid #e8e5e0",
              }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#2B2D2E", lineHeight: 1.5, margin: 0 }}>{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bloc 3 : Solution naturelle ── */}
        <section style={{ marginBottom: 72 }}>
          <h2 style={{ textAlign: "center", fontSize: 22, fontWeight: 800, color: "#2B2D2E", marginBottom: 32 }}>
            Une remise à zéro en 21 jours
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: "28px 24px", border: "2px solid #2A9D8F" }}>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#2A9D8F", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>On mise sur</p>
              {[
                "Aliments bruts non transformés",
                "Associations alimentaires simples",
                "30 min d'activité physique / jour",
              ].map(item => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                  <span style={{ color: "#2A9D8F", fontWeight: 900, fontSize: 16, flexShrink: 0 }}>✅</span>
                  <span style={{ fontSize: 14, color: "#2B2D2E", lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "#fff", borderRadius: 16, padding: "28px 24px", border: "1px solid #e8e5e0" }}>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#E76F51", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>On retire temporairement</p>
              {[
                "Blé (temporaire)",
                "Lait de vache (temporaire)",
                "Sucre raffiné (temporaire)",
              ].map(item => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                  <span style={{ color: "#E76F51", fontWeight: 900, fontSize: 16, flexShrink: 0 }}>❌</span>
                  <span style={{ fontSize: 14, color: "#2B2D2E", lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bloc 4 : Préparation ── */}
        <section style={{ marginBottom: 72 }}>
          <h2 style={{ textAlign: "center", fontSize: 22, fontWeight: 800, color: "#2B2D2E", marginBottom: 8 }}>
            Prépare les 3 jours avant J1
          </h2>
          <p style={{ textAlign: "center", color: "#6b6b6b", fontSize: 14, marginBottom: 28 }}>Liste de courses initiale</p>
          <div style={{
            background: "#fff",
            borderRadius: 16,
            padding: "28px 28px 20px",
            border: "1px solid #e8e5e0",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px 24px",
            marginBottom: 20,
          }}>
            {[
              "Citrons (5-6)",
              "Fenouil (1 bulbe)",
              "Fruits de saison",
              "Abricots secs",
              "Dattes Medjool",
              "Figues sèches",
              "Raisins secs",
              "Amandes",
              "Noix de cajou",
              "Noix du Brésil",
              "Miel brut",
              "Anis étoilé",
              "Curcuma",
              "Cannelle",
            ].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid #f0ece7" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2A9D8F", flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: "#2B2D2E" }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{
            background: "#fff8f0",
            borderLeft: "4px solid #E76F51",
            borderRadius: "0 12px 12px 0",
            padding: "16px 20px",
          }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#E76F51", margin: "0 0 6px" }}>À retirer maintenant</p>
            <p style={{ fontSize: 14, color: "#2B2D2E", margin: 0, lineHeight: 1.6 }}>
              Sucre ajouté, pain blanc, lait de vache, fromage industriel.
            </p>
          </div>
        </section>

        {/* ── Bloc 5 : Programme 3 semaines ── */}
        <section style={{ marginBottom: 72 }}>
          <h2 style={{ textAlign: "center", fontSize: 22, fontWeight: 800, color: "#2B2D2E", marginBottom: 32 }}>
            3 semaines, 3 étapes
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 20 }}>
            {[
              { label: "S1 DÉTOX",     days: "J1-7",   desc: "Le corps évacue",        bg: "#E76F51" },
              { label: "S2 VITALITÉ",  days: "J8-14",  desc: "L'énergie remonte",      bg: "#E9C46A" },
              { label: "S3 ANCRAGE",   days: "J15-21", desc: "Habitudes ancrées",      bg: "#2A9D8F" },
            ].map(({ label, days, desc, bg }) => (
              <div key={label} style={{
                background: "#fff",
                borderRadius: 16,
                padding: "24px 16px",
                textAlign: "center",
                border: "1px solid #e8e5e0",
                borderTop: `4px solid ${bg}`,
              }}>
                <p style={{ fontSize: 12, fontWeight: 900, color: bg, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px" }}>{label}</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#2B2D2E", margin: "0 0 8px" }}>{days}</p>
                <p style={{ fontSize: 13, color: "#6b6b6b", margin: 0, lineHeight: 1.4 }}>&ldquo;{desc}&rdquo;</p>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: 14, fontWeight: 600, color: "#2B2D2E", padding: "16px 0", borderTop: "1px solid #e8e5e0", borderBottom: "1px solid #e8e5e0" }}>
            Rituel quotidien non négociable : <span style={{ color: "#2A9D8F" }}>30 minutes d&apos;activité physique.</span>
          </p>
        </section>

        {/* ── Bloc 6 : Inscription ── */}
        <section id="inscription" style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: "#2B2D2E", marginBottom: 8 }}>
            Prêt à démarrer ?
          </h2>
          <p style={{ fontSize: 15, color: "#6b6b6b", marginBottom: 32 }}>
            Entre ton email — ton accès arrive en moins d&apos;une minute.
          </p>

          {submitted ? (
            <div style={{
              background: "#f0faf8",
              border: "2px solid #2A9D8F",
              borderRadius: 16,
              padding: "32px 24px",
            }}>
              <p style={{ fontSize: 20, margin: "0 0 8px" }}>✅</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#2A9D8F", margin: "0 0 8px" }}>C&apos;est parti !</p>
              <p style={{ fontSize: 14, color: "#2B2D2E", margin: 0, lineHeight: 1.6 }}>
                Vérifie ta boîte mail — ton lien arrive dans moins d&apos;une minute.
              </p>
            </div>
          ) : (
            <form onSubmit={handleInscription} style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              <input
                type="email"
                required
                placeholder="ton@email.fr"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  flex: "1 1 240px",
                  padding: "14px 18px",
                  borderRadius: 10,
                  border: "1.5px solid #d8d4cc",
                  fontSize: 15,
                  color: "#2B2D2E",
                  background: "#fff",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                disabled={loading || !email}
                style={{
                  background: "#2A9D8F",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 15,
                  padding: "14px 28px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  opacity: (!email || loading) ? 0.6 : 1,
                  whiteSpace: "nowrap",
                }}>
                {loading ? "Envoi…" : "Recevoir mon lien →"}
              </button>
            </form>
          )}
        </section>

      </main>

      <footer style={{ borderTop: "1px solid #e8e5e0", padding: "24px", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "#9b9590", margin: 0 }}>
          Backtoenergy · Programme 21 jours · backtoenergy.fr
        </p>
      </footer>
    </div>
  )
}
