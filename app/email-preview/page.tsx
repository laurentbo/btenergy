import {
  magicLinkEmail, welcomeEmail, resetPasswordEmail,
  stepEmail, midpointEmail, postCureEmail,
} from "@/lib/email-templates"
import {
  viewLogin, viewOnboarding, viewWelcomeScreen, viewJ1Onboarding,
  viewProfileSetup, viewDashboardProgramme, viewDashboardJournal,
  viewDashboardProgression, viewDashboardProfil,
} from "@/lib/app-views"

const SITE = "https://backtoenergy.fr"

const EMAILS = [
  { label: "Lien de connexion",        html: magicLinkEmail("Laurent", `${SITE}/auth/callback?token_hash=xxx&type=magiclink`) },
  { label: "Bienvenue",               html: welcomeEmail("Laurent", SITE) },
  { label: "Email Jour 1",            html: stepEmail("Laurent", 1, SITE) },
  { label: "Email Jour 8",            html: stepEmail("Laurent", 8, SITE) },
  { label: "Email Jour 15",           html: stepEmail("Laurent", 15, SITE) },
  { label: "Mi-parcours (Jour 10)",   html: midpointEmail("Laurent", SITE) },
  { label: "Fin de cure (Jour 22)",   html: postCureEmail("Laurent", SITE) },
  { label: "Reset Password (Coach)",  html: resetPasswordEmail("Laurent", `${SITE}/auth/reset-password?token=xxx`) },
]

const VIEWS = [
  { label: "Connexion",               html: viewLogin() },
  { label: "Onboarding (nouvel user)",html: viewOnboarding() },
  { label: "Écran de bienvenue",      html: viewWelcomeScreen() },
  { label: "Onboarding Jour 1",       html: viewJ1Onboarding() },
  { label: "Config profil",           html: viewProfileSetup() },
  { label: "Dashboard — Programme",   html: viewDashboardProgramme() },
  { label: "Dashboard — Journal",     html: viewDashboardJournal() },
  { label: "Dashboard — Progression", html: viewDashboardProgression() },
  { label: "Dashboard — Profil",      html: viewDashboardProfil() },
]

function Section({ title, subtitle, items, height }: {
  title: string
  subtitle: string
  items: { label: string; html: string }[]
  height: number
}) {
  return (
    <div style={{ marginBottom: 72 }}>
      <h2 style={{ color: "#ffffff", fontFamily: "sans-serif", fontSize: 20, fontWeight: 900, marginBottom: 4 }}>
        {title}
      </h2>
      <p style={{ color: "#666", fontFamily: "sans-serif", fontSize: 13, marginBottom: 32 }}>{subtitle}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 32 }}>
        {items.map(({ label, html }) => (
          <div key={label}>
            <p style={{ color: "#4cc9f0", fontFamily: "sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontSize: 11, marginBottom: 10 }}>
              {label}
            </p>
            <div style={{ border: "1px solid rgba(76,201,240,0.18)", borderRadius: 14, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.5)" }}>
              <iframe
                srcDoc={html}
                style={{ width: "100%", height, border: "none", display: "block" }}
                title={label}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PreviewPage() {
  return (
    <div style={{ background: "#070d0f", minHeight: "100vh", padding: "48px 32px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 56, borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: 32 }}>
          <p style={{ color: "#2dd4a0", fontFamily: "sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>
            Design Overview
          </p>
          <h1 style={{ color: "#ffffff", fontFamily: "sans-serif", fontSize: 28, fontWeight: 900, marginBottom: 8 }}>
            Backtoenergy — Mails &amp; Vues
          </h1>
          <p style={{ color: "#555", fontFamily: "sans-serif", fontSize: 14 }}>
            {EMAILS.length} emails · {VIEWS.length} vues coaché
          </p>
        </div>

        <Section
          title="Emails"
          subtitle="Tous les emails envoyés aux coachés via Resend"
          items={EMAILS}
          height={620}
        />

        <Section
          title="Vues App"
          subtitle="Toutes les pages et états vus par le coaché"
          items={VIEWS}
          height={680}
        />

      </div>
    </div>
  )
}
