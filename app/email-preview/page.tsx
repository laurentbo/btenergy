// Page de revue des 6 emails Back to Energy v2.
// Accès réservé en dev — ajouter une protection auth en prod.
import {
  welcomeEmail,
  magicLinkEmail,
  resetPasswordEmail,
  chapter1Email,
  chapter2Email,
  chapter3Email,
} from "@/lib/email-templates"

const SITE = "https://backtoenergy.fr"

const EMAILS = [
  { label: "Bienvenue (jour 0)",          html: welcomeEmail("Laurent", SITE) },
  { label: "Magic link — connexion",       html: magicLinkEmail("Laurent", `${SITE}/auth/callback?token_hash=xxx&type=magiclink`) },
  { label: "Reset password (coach)",       html: resetPasswordEmail("", `${SITE}/auth/reset-password?token=xxx`) },
  { label: "Chapitre 1 — Détox (jour 1)", html: chapter1Email("Laurent", SITE) },
  { label: "Chapitre 2 — Énergie (j 8)",  html: chapter2Email("Laurent", SITE) },
  { label: "Chapitre 3 — Ancrage (j 15)", html: chapter3Email("Laurent", SITE) },
]

export default function EmailPreviewPage() {
  return (
    <div style={{ background: "#EEE7D6", minHeight: "100vh", padding: "48px 32px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ marginBottom: 48, borderBottom: "1px solid #E2D9C0", paddingBottom: 28 }}>
          <p style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.15em",
            textTransform: "uppercase", color: "#8A7E68", marginBottom: 8,
          }}>Design Review</p>
          <h1 style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: 28, fontWeight: 400, color: "#2A2520", marginBottom: 8,
          }}>Back to Energy — Emails</h1>
          <p style={{ fontFamily: "system-ui, sans-serif", color: "#8A7E68", fontSize: 13 }}>
            {EMAILS.length} emails · cream chaud · Instrument Serif · tutoiement
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
          gap: 40,
        }}>
          {EMAILS.map(({ label, html }) => (
            <div key={label}>
              <p style={{
                fontFamily: "system-ui, sans-serif",
                fontWeight: 600, fontSize: 11, letterSpacing: "0.12em",
                textTransform: "uppercase", color: "#8A7E68",
                marginBottom: 10,
              }}>{label}</p>
              <div style={{
                border: "1px solid #E2D9C0", borderRadius: 14,
                overflow: "hidden",
                boxShadow: "0 4px 24px rgba(42,37,32,0.08)",
              }}>
                <iframe
                  srcDoc={html}
                  style={{ width: "100%", height: 680, border: "none", display: "block" }}
                  title={label}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
