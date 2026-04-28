import { magicLinkEmail, welcomeEmail, resetPasswordEmail, stepEmail } from "@/lib/email-templates"

export default function EmailPreview() {
  const emails = [
    { label: "Magic Link", html: magicLinkEmail("Laurent", "https://backtoenergy.fr/auth/callback?token=xxx") },
    { label: "Bienvenue", html: welcomeEmail("Laurent", "https://backtoenergy.fr") },
    { label: "Reset Password (Coach)", html: resetPasswordEmail("Laurent", "https://backtoenergy.fr/auth/reset-password?token=xxx") },
    { label: "Email Jour 1", html: stepEmail("Laurent", 1, "https://backtoenergy.fr") },
    { label: "Email Jour 8", html: stepEmail("Laurent", 8, "https://backtoenergy.fr") },
    { label: "Email Jour 15", html: stepEmail("Laurent", 15, "https://backtoenergy.fr") },
  ]

  return (
    <div style={{ background: "#111", minHeight: "100vh", padding: "32px 24px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <h1 style={{ color: "#fff", fontFamily: "sans-serif", marginBottom: 8 }}>Email Preview</h1>
        <p style={{ color: "#888", fontFamily: "sans-serif", marginBottom: 40, fontSize: 14 }}>Maquettes des emails BTENERGY</p>
        {emails.map(({ label, html }) => (
          <div key={label} style={{ marginBottom: 64 }}>
            <p style={{ color: "#4cc9f0", fontFamily: "sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontSize: 12, marginBottom: 12 }}>
              {label}
            </p>
            <div style={{ border: "1px solid rgba(76,201,240,0.2)", borderRadius: 12, overflow: "hidden" }}>
              <iframe
                srcDoc={html}
                style={{ width: "100%", height: 600, border: "none", display: "block" }}
                title={label}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
