"use client"
import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"

type Tab = "parcours" | "comms" | "data" | "deploy"

const PARCOURS_USER = [
  {
    label: "Entrée",
    pages: [
      { route: "/", name: "Landing page", file: "app/page.tsx", tags: ["wording", "design"] },
      { route: "/login", name: "Connexion", file: "app/login/page.tsx", tags: ["wording"] },
      { route: "/welcome", name: "Bienvenue", file: "app/welcome/page.tsx", tags: ["wording", "design"] },
    ],
  },
  {
    label: "Programme",
    pages: [
      { route: "/dashboard", name: "Dashboard", file: "app/dashboard/page.tsx", tags: ["design", "parcours"] },
      { route: "/programme", name: "Programme", file: "app/programme/page.tsx", tags: ["design", "parcours"] },
      { route: "/programme/[jour]", name: "Jour détaillé", file: "app/programme/[jour]/page.tsx", tags: ["wording", "design", "parcours"] },
    ],
  },
]

const COMPOSANTS = [
  { name: "EnergyCheckin", file: "components/EnergyCheckin.tsx", tags: ["design"] },
  { name: "VitalityScore", file: "components/VitalityScore.tsx", tags: ["design"] },
  { name: "Timeline21", file: "components/Timeline21.tsx", tags: ["design", "parcours"] },
  { name: "MealCard", file: "components/MealCard.tsx", tags: ["design", "wording"] },
  { name: "RitualCard", file: "components/RitualCard.tsx", tags: ["design"] },
  { name: "PrincipesSection", file: "components/PrincipesSection.tsx", tags: ["wording", "design"] },
  { name: "LearnTab", file: "app/programme/components/LearnTab.tsx", tags: ["wording"] },
  { name: "MealsBlock", file: "app/programme/components/MealsBlock.tsx", tags: ["design"] },
  { name: "ProgramEditor", file: "components/ProgramEditor.tsx", tags: ["design"] },
]

const PARCOURS_COACH = [
  { route: "/login/coach", name: "Login coach", file: "app/login/coach/page.tsx", tags: ["wording"] },
  { route: "/coach", name: "Dashboard coach", file: "app/coach/page.tsx", tags: ["design", "parcours"] },
  { route: "/coach/menus", name: "Menus coach", file: "app/coach/menus/page.tsx", tags: ["design"] },
  { route: "/coach/preview/[id]", name: "Prévisualisation", file: "app/coach/preview/[id]/page.tsx", tags: ["design"] },
  { route: "/admin/exclusions", name: "Exclusions alimentaires", file: "app/admin/exclusions/page.tsx", tags: ["parcours"] },
]

const EMAILS = [
  { name: "Bienvenue", timing: "J+0 · après inscription", preview: "public/email-preview/bienvenue.html", source: "lib/email-templates.ts" },
  { name: "Jour 1", timing: "J+1 · démarrage programme", preview: "public/email-preview/jour-1.html", source: "lib/email-templates.ts" },
  { name: "Jour 8", timing: "J+8 · mi-parcours", preview: "public/email-preview/jour-8.html", source: "lib/email-templates.ts" },
  { name: "Jour 15", timing: "J+15 · fin de programme", preview: "public/email-preview/jour-15.html", source: "lib/email-templates.ts" },
  { name: "Magic link", timing: "Connexion sans mot de passe", preview: "public/email-preview/magic-link.html", source: "lib/email-templates.ts" },
  { name: "Reset password", timing: "Réinitialisation mdp", preview: "public/email-preview/reset-password.html", source: "lib/email-templates.ts" },
]

const DATA_FILES = [
  { file: "data/program.ts", name: "Programme principal", desc: "Structure des 21 jours, rituels, étapes" },
  { file: "lib/menus.ts", name: "Menus & repas", desc: "Plans alimentaires, repas par jour" },
  { file: "lib/principles.ts", name: "Principes", desc: "Contenu affiché dans PrincipesSection" },
  { file: "data/verissimo.ts", name: "Données Verissimo", desc: "Données nutritionnelles de référence" },
  { file: "data/equivalences.ts", name: "Équivalences", desc: "Table d'équivalences alimentaires" },
  { file: "app/globals.css", name: "Style global", desc: "Variables CSS, polices, couleurs, tokens" },
  { file: "lib/email-templates.ts", name: "Templates email", desc: "Source de tous les emails envoyés" },
]

const DOCS = ["OVERVIEW.md", "EVOLUTIONS.md", "CLAUDE.md", "AGENTS.md"]

const MIGRATIONS = [
  { date: "20260518", name: "journal_messages_weight_logs" },
  { date: "20260514", name: "meal_plans" },
  { date: "20260513", name: "create_questions" },
  { date: "20260506", name: "journal + coach_settings" },
  { date: "20260504", name: "add_programme_columns" },
  { date: "20260430", name: "email_logs + ritual_overrides + rls_welcome" },
]

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  wording:  { bg: "rgba(168,187,165,0.15)", color: "#A8BBA5" },
  design:   { bg: "rgba(92,181,81,0.12)",   color: "#5CB551" },
  parcours: { bg: "rgba(236,228,210,0.07)", color: "rgba(236,228,210,0.45)" },
}

function Tag({ label }: { label: string }) {
  const c = TAG_COLORS[label] ?? { bg: "rgba(236,228,210,0.07)", color: "rgba(236,228,210,0.45)" }
  return (
    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 500, background: c.bg, color: c.color }}>
      {label}
    </span>
  )
}

function PageCard({ page, onCopy }: { page: { route?: string; name: string; file: string; tags: string[] }; onCopy: (f: string) => void }) {
  return (
    <div
      onClick={() => onCopy(page.file)}
      title={`Copier : ${page.file}`}
      style={{
        background: "#1C1A14", border: "1px solid rgba(247,234,205,0.07)",
        borderRadius: 12, padding: "12px 14px", cursor: "pointer",
        transition: "border-color 0.15s",
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(92,181,81,0.35)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(247,234,205,0.07)")}
    >
      {page.route && (
        <div style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(236,228,210,0.3)", marginBottom: 4 }}>{page.route}</div>
      )}
      <div style={{ fontSize: 12, fontWeight: 500, color: "#ECE4D2", marginBottom: 7 }}>{page.name}</div>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
        {page.tags.map(t => <Tag key={t} label={t} />)}
      </div>
      <div style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(236,228,210,0.28)", background: "rgba(236,228,210,0.04)", padding: "3px 7px", borderRadius: 5, display: "inline-block" }}>
        {page.file}
      </div>
    </div>
  )
}

export default function AdminCockpit() {
  const [tab, setTab] = useState<Tab>("parcours")
  const [authed, setAuthed] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setAuthed(true)
      else window.location.href = "/login/coach"
    }
    checkAdmin()
  }, []) // eslint-disable-line

  const copyPath = useCallback((path: string) => {
    navigator.clipboard.writeText(path).catch(() => {})
    setToast(path)
    setTimeout(() => setToast(null), 2500)
  }, [])

  const S = {
    page:  { minHeight: "100vh", background: "#15130E", padding: "32px 20px", fontFamily: "'Geist', system-ui, sans-serif", color: "#ECE4D2" } as const,
    wrap:  { maxWidth: 820, margin: "0 auto" } as const,
    card:  { background: "#1C1A14", border: "1px solid rgba(247,234,205,0.07)", borderRadius: 14, padding: "16px 18px", marginBottom: 10 } as const,
    label: { fontSize: 10, fontWeight: 600, color: "rgba(236,228,210,0.34)", textTransform: "uppercase" as const, letterSpacing: "0.08em" } as const,
    mono:  { fontFamily: "monospace", fontSize: 11, color: "rgba(236,228,210,0.34)", background: "rgba(236,228,210,0.05)", padding: "3px 7px", borderRadius: 5 } as const,
    btn:   { background: "transparent", border: "1px solid rgba(247,234,205,0.15)", borderRadius: 7, padding: "5px 12px", fontSize: 11, color: "rgba(236,228,210,0.6)", cursor: "pointer", fontFamily: "'Geist', system-ui, sans-serif" } as const,
  }

  if (!authed) {
    return (
      <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 13, color: "rgba(236,228,210,0.34)" }}>Chargement…</span>
      </div>
    )
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: "parcours", label: "Parcours" },
    { id: "comms",    label: "Communications" },
    { id: "data",     label: "Data & contenu" },
    { id: "deploy",   label: "Déploiement" },
  ]

  return (
    <div style={S.page}>
      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#211E17", border: "1px solid rgba(92,181,81,0.35)", borderRadius: 10, padding: "10px 18px", fontSize: 12, color: "#5CB551", zIndex: 100, whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
          ✓ Copié : {toast}
        </div>
      )}
      <div style={S.wrap}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 400, color: "#ECE4D2", marginBottom: 3, fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic" }}>Cockpit BTENERGY</h1>
            <p style={{ fontSize: 11, color: "rgba(236,228,210,0.34)" }}>backtoenergy.fr · kekjbovoeyveucjakkle · Vercel auto-deploy</p>
          </div>
          <span style={{ background: "rgba(92,181,81,0.12)", color: "#5CB551", fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 20, marginTop: 4 }}>● live</span>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 2, marginBottom: 20, borderBottom: "1px solid rgba(247,234,205,0.07)" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: "8px 16px", fontSize: 12, fontWeight: 500, color: tab === t.id ? "#ECE4D2" : "rgba(236,228,210,0.38)", borderBottom: `2px solid ${tab === t.id ? "#5CB551" : "transparent"}`, marginBottom: -1, fontFamily: "'Geist', system-ui, sans-serif", transition: "color 0.15s" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── PARCOURS ── */}
        {tab === "parcours" && (
          <div>
            <p style={{ ...S.label, marginBottom: 8 }}>Espace utilisateur — cliquer une carte copie le chemin du fichier</p>
            {PARCOURS_USER.map(section => (
              <div key={section.label} style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 11, color: "rgba(236,228,210,0.3)", marginBottom: 8, paddingLeft: 2 }}>{section.label}</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
                  {section.pages.map(p => <PageCard key={p.file} page={p} onCopy={copyPath} />)}
                </div>
              </div>
            ))}

            <p style={{ ...S.label, margin: "20px 0 10px" }}>Composants</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))", gap: 8 }}>
              {COMPOSANTS.map(c => <PageCard key={c.file} page={c} onCopy={copyPath} />)}
            </div>

            <p style={{ ...S.label, margin: "20px 0 10px" }}>Espace coach & admin</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
              {PARCOURS_COACH.map(p => <PageCard key={p.file} page={p} onCopy={copyPath} />)}
            </div>
          </div>
        )}

        {/* ── COMMUNICATIONS ── */}
        {tab === "comms" && (
          <div>
            <p style={{ ...S.label, marginBottom: 12 }}>Templates email · source : lib/email-templates.ts</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              {EMAILS.map(e => (
                <div key={e.name} style={S.card}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500, color: "#ECE4D2", marginBottom: 2 }}>{e.name}</p>
                      <p style={{ fontSize: 11, color: "rgba(236,228,210,0.34)" }}>{e.timing}</p>
                    </div>
                    <span style={{ background: "rgba(92,181,81,0.1)", color: "#5CB551", fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 500 }}>actif</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
                    <span style={S.mono}>{e.source}</span>
                    <span style={S.mono}>{e.preview}</span>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => copyPath(e.source)} style={S.btn}>Copier source</button>
                    <button onClick={() => copyPath(e.preview)} style={S.btn}>Copier preview</button>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ ...S.label, marginBottom: 10 }}>Routes d'envoi</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["app/api/send-step-email/route.ts", "app/api/auth/welcome/route.ts", "app/api/send-reset-password/route.ts", "lib/resend.ts"].map(f => (
                <button key={f} onClick={() => copyPath(f)} style={{ ...S.mono, border: "1px solid rgba(247,234,205,0.07)", cursor: "pointer", background: "#1C1A14" }}>{f}</button>
              ))}
            </div>
          </div>
        )}

        {/* ── DATA ── */}
        {tab === "data" && (
          <div>
            <p style={{ ...S.label, marginBottom: 12 }}>Fichiers de contenu — cliquer copie le chemin</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginBottom: 20 }}>
              {DATA_FILES.map(d => (
                <div key={d.file} onClick={() => copyPath(d.file)} style={{ ...S.card, cursor: "pointer", marginBottom: 0 }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(92,181,81,0.35)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(247,234,205,0.07)")}
                >
                  <span style={S.mono}>{d.file}</span>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "#ECE4D2", margin: "7px 0 4px" }}>{d.name}</p>
                  <p style={{ fontSize: 11, color: "rgba(236,228,210,0.45)", lineHeight: 1.5 }}>{d.desc}</p>
                </div>
              ))}
            </div>
            <p style={{ ...S.label, marginBottom: 10 }}>Documentation projet</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {DOCS.map(d => (
                <button key={d} onClick={() => copyPath(d)} style={{ ...S.mono, border: "1px solid rgba(247,234,205,0.07)", cursor: "pointer", background: "#1C1A14" }}>{d}</button>
              ))}
            </div>
          </div>
        )}

        {/* ── DEPLOY ── */}
        {tab === "deploy" && (
          <div>
            <div style={S.card}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "#ECE4D2", marginBottom: 4 }}>Pipeline standard</p>
              <p style={{ fontSize: 11, color: "rgba(236,228,210,0.4)", marginBottom: 14 }}>Toute modification → git push → Vercel déploie automatiquement (~60s)</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                {["1 · Modifier fichier", "2 · git add -A", "3 · git commit -m \"...\"", "4 · git push origin main", "5 · Vérifier backtoenergy.fr"].map((step, i) => (
                  <div key={step} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, color: i === 4 ? "#5CB551" : "rgba(236,228,210,0.6)" }}>{step}</span>
                    {i < 4 && <span style={{ color: "rgba(236,228,210,0.2)", fontSize: 14 }}>→</span>}
                  </div>
                ))}
              </div>
            </div>

            <div style={S.card}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "#ECE4D2", marginBottom: 12 }}>Commande tout-en-un</p>
              <div style={{ background: "#15130E", border: "1px solid rgba(247,234,205,0.07)", borderRadius: 8, padding: "12px 14px", fontFamily: "monospace", fontSize: 12, color: "#A8BBA5", lineHeight: 1.8 }}>
                <span style={{ color: "rgba(236,228,210,0.3)" }}># depuis /Users/apple/btenergy</span><br />
                git add -A && git commit -m &quot;feat: [description]&quot; && git push origin main
              </div>
              <button onClick={() => copyPath('git add -A && git commit -m "feat: " && git push origin main')} style={{ ...S.btn, marginTop: 10 }}>
                Copier la commande
              </button>
            </div>

            <div style={S.card}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "#ECE4D2", marginBottom: 12 }}>Supabase · migrations ({MIGRATIONS.length} au total)</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {MIGRATIONS.map((m, i) => (
                  <div key={m.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 10px", background: i === 0 ? "rgba(92,181,81,0.07)" : "rgba(236,228,210,0.03)", borderRadius: 8, border: i === 0 ? "1px solid rgba(92,181,81,0.2)" : "1px solid transparent" }}>
                    <span style={{ fontFamily: "monospace", fontSize: 11, color: i === 0 ? "#A8BBA5" : "rgba(236,228,210,0.4)" }}>{m.name}</span>
                    <span style={{ fontSize: 10, color: "rgba(236,228,210,0.25)" }}>{m.date}{i === 0 ? " · dernière" : ""}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => copyPath("supabase/migrations/")} style={{ ...S.btn, marginTop: 12 }}>Copier chemin migrations</button>
            </div>

            <div style={S.card}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "#ECE4D2", marginBottom: 10 }}>Liens utiles</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { label: "Vercel dashboard", url: "https://vercel.com/laurentbocle-4466s-projects/btenergy" },
                  { label: "Supabase project", url: "https://supabase.com/dashboard/project/kekjbovoeyveucjakkle" },
                  { label: "GitHub repo", url: "https://github.com/laurentbo/btenergy" },
                  { label: "Site live", url: "https://backtoenergy.fr" },
                ].map(l => (
                  <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer" style={{ ...S.btn, textDecoration: "none", display: "inline-block" }}>
                    {l.label} ↗
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
