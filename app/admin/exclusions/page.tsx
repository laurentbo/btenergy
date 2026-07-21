"use client"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

const OPTIONAL_KEYS = ["ail", "fenouil", "oignon", "poireau", "oeuf", "soja", "levure"] as const
const FIXED_KEYS = ["blé", "lait_vache", "sucre_raffiné"] as const

type Exclusions = Record<string, boolean | string[]>

export default function AdminExclusions() {
  const [exclusions, setExclusions] = useState<Exclusions>({
    blé: true, lait_vache: true, "sucre_raffiné": true,
    ail: false, fenouil: false, oignon: false, poireau: false,
    oeuf: false, soja: false, levure: false, autres: [],
  })
  const [emailsEnabled, setEmailsEnabled] = useState(true)
  const [autreInput, setAutreInput] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [adminSecret, setAdminSecret] = useState("")
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState("")
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const supabase = createClient()

  // Vérification email admin
  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) setEmail(user.email)
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
      if (adminEmail && user?.email === adminEmail) {
        setAuthed(true)
        loadExclusions()
      }
    }
    checkAdmin()
  }, []) // eslint-disable-line

  async function loadExclusions() {
    setLoading(true)
    const res = await fetch("/api/admin/exclusions")
    const data = await res.json()
    if (data.exclusions && Object.keys(data.exclusions).length > 0) {
      setExclusions(data.exclusions)
    }
    if (typeof data.emails_enabled === "boolean") {
      setEmailsEnabled(data.emails_enabled)
    }
    setLoading(false)
  }

  async function handleAuth() {
    const res = await fetch("/api/admin/exclusions", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": adminSecret,
      },
      body: JSON.stringify({ exclusions }),
    })
    if (res.status === 401) {
      setAuthError("Code admin incorrect.")
      return
    }
    setAuthed(true)
    setAuthError("")
    await loadExclusions()
  }

  function toggleOptional(key: string) {
    setExclusions(prev => ({ ...prev, [key]: !prev[key] }))
  }

  async function toggleEmails() {
    const next = !emailsEnabled
    setEmailsEnabled(next) // optimiste
    const res = await fetch("/api/admin/exclusions", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": adminSecret,
      },
      body: JSON.stringify({ emails_enabled: next }),
    })
    if (!res.ok) setEmailsEnabled(!next) // rollback si échec
  }

  function addAutre() {
    const val = autreInput.trim()
    if (!val) return
    const autres = (exclusions.autres as string[]) ?? []
    if (!autres.includes(val)) {
      setExclusions(prev => ({ ...prev, autres: [...autres, val] }))
    }
    setAutreInput("")
  }

  function removeAutre(item: string) {
    const autres = (exclusions.autres as string[]) ?? []
    setExclusions(prev => ({ ...prev, autres: autres.filter(a => a !== item) }))
  }

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    const res = await fetch("/api/admin/exclusions", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": adminSecret,
      },
      body: JSON.stringify({ exclusions }),
    })
    setSaving(false)
    if (res.ok) setSaved(true)
  }

  const S = {
    page: { minHeight: "100vh", background: "#F8F7F4", padding: "32px 20px", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" } as const,
    wrap: { maxWidth: 560, margin: "0 auto" } as const,
    h1:   { fontSize: 22, fontWeight: 900, color: "#2B2D2E", marginBottom: 8 } as const,
    card: { background: "#fff", borderRadius: 16, padding: "24px", border: "1px solid #e8e5e0", marginBottom: 20 } as const,
    label: { fontSize: 13, fontWeight: 600, color: "#2B2D2E" } as const,
    muted: { fontSize: 12, color: "#9b9590" } as const,
  }

  if (!authed) {
    return (
      <div style={S.page}>
        <div style={S.wrap}>
          <h1 style={S.h1}>Backoffice coach</h1>
          <p style={{ ...S.muted, marginBottom: 24 }}>Connecté en tant que : {email || "—"}</p>
          <div style={S.card}>
            <p style={{ ...S.label, marginBottom: 12 }}>Code admin requis</p>
            <input
              type="password"
              value={adminSecret}
              onChange={e => setAdminSecret(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAuth()}
              placeholder="Code admin…"
              style={{
                width: "100%", padding: "10px 14px", borderRadius: 8,
                border: "1.5px solid #d8d4cc", fontSize: 14, marginBottom: 12,
                boxSizing: "border-box" as const, outline: "none",
              }}
            />
            {authError && <p style={{ color: "#E76F51", fontSize: 13, marginBottom: 8 }}>{authError}</p>}
            <button onClick={handleAuth}
              style={{ background: "#2A9D8F", color: "#fff", fontWeight: 700, fontSize: 14, padding: "10px 24px", borderRadius: 8, border: "none", cursor: "pointer" }}>
              Accéder →
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={S.muted}>Chargement…</p>
      </div>
    )
  }

  return (
    <div style={S.page}>
      <div style={S.wrap}>
        <h1 style={S.h1}>Backoffice coach</h1>
        <p style={{ ...S.muted, marginBottom: 28 }}>Ces réglages s&apos;appliquent à tous les participants.</p>

        {/* Emails quotidiens */}
        <div style={S.card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#2B2D2E", marginBottom: 4 }}>
                Emails quotidiens du programme
              </p>
              <p style={S.muted}>
                {emailsEnabled
                  ? "Actifs — envoyés chaque matin aux participants en cours."
                  : "Coupés — aucun envoi tant que c'est désactivé."}
              </p>
            </div>
            <button
              onClick={toggleEmails}
              aria-pressed={emailsEnabled}
              style={{
                width: 48, height: 28, borderRadius: 999, border: "none", cursor: "pointer",
                background: emailsEnabled ? "#2A9D8F" : "#d8d4cc",
                position: "relative" as const, flexShrink: 0, transition: "background 0.15s",
              }}>
              <span style={{
                position: "absolute" as const, top: 3, left: emailsEnabled ? 23 : 3,
                width: 22, height: 22, borderRadius: "50%", background: "#fff",
                transition: "left 0.15s", boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
              }} />
            </button>
          </div>
        </div>

        {/* Exclusions fixes */}
        <div style={S.card}>
          <p style={{ fontSize: 12, fontWeight: 800, color: "#9b9590", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 16 }}>
            Exclusions par défaut (non modifiables)
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const }}>
            {FIXED_KEYS.map(key => (
              <span key={key} style={{
                background: "rgba(231,111,81,0.1)", color: "#E76F51",
                border: "1px solid rgba(231,111,81,0.3)", borderRadius: 20,
                padding: "6px 14px", fontSize: 13, fontWeight: 600,
                display: "flex", alignItems: "center", gap: 6,
              }}>
                🔒 {key.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>

        {/* Exclusions optionnelles */}
        <div style={S.card}>
          <p style={{ fontSize: 12, fontWeight: 800, color: "#9b9590", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 16 }}>
            Exclusions optionnelles
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {OPTIONAL_KEYS.map(key => {
              const checked = !!exclusions[key]
              return (
                <label key={key}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                    borderRadius: 10, cursor: "pointer",
                    background: checked ? "rgba(42,157,143,0.08)" : "#f8f7f4",
                    border: `1.5px solid ${checked ? "#2A9D8F" : "#e8e5e0"}`,
                    transition: "all 0.15s",
                  }}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleOptional(key)}
                    style={{ width: 16, height: 16, accentColor: "#2A9D8F" }}
                  />
                  <span style={{ fontSize: 14, fontWeight: checked ? 700 : 400, color: checked ? "#2A9D8F" : "#2B2D2E" }}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Autres exclusions libres */}
        <div style={S.card}>
          <p style={{ fontSize: 12, fontWeight: 800, color: "#9b9590", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 16 }}>
            Autres exclusions
          </p>
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <input
              type="text"
              value={autreInput}
              onChange={e => setAutreInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addAutre()}
              placeholder="Ex : maïs, café…"
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 8,
                border: "1.5px solid #d8d4cc", fontSize: 14, outline: "none",
              }}
            />
            <button onClick={addAutre}
              style={{ background: "#2A9D8F", color: "#fff", fontWeight: 700, fontSize: 13, padding: "10px 18px", borderRadius: 8, border: "none", cursor: "pointer" }}>
              Ajouter
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
            {((exclusions.autres as string[]) ?? []).map(item => (
              <span key={item} style={{
                background: "rgba(42,157,143,0.08)", color: "#2B2D2E",
                border: "1px solid #e8e5e0", borderRadius: 20,
                padding: "5px 12px", fontSize: 13,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                {item}
                <button
                  onClick={() => removeAutre(item)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#E76F51", fontWeight: 700, fontSize: 14, padding: 0 }}>
                  ❌
                </button>
              </span>
            ))}
            {((exclusions.autres as string[]) ?? []).length === 0 && (
              <p style={S.muted}>Aucune exclusion supplémentaire.</p>
            )}
          </div>
        </div>

        {/* Bouton sauvegarde */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: "100%", background: saving ? "#9b9590" : "#2A9D8F", color: "#fff",
            fontWeight: 700, fontSize: 15, padding: "14px", borderRadius: 12,
            border: "none", cursor: saving ? "not-allowed" : "pointer",
            boxShadow: "0 4px 16px rgba(42,157,143,0.3)",
          }}>
          {saving ? "Enregistrement…" : "Enregistrer les exclusions →"}
        </button>
        {saved && (
          <p style={{ textAlign: "center" as const, color: "#2A9D8F", fontWeight: 600, fontSize: 14, marginTop: 12 }}>
            ✅ Exclusions mises à jour avec succès.
          </p>
        )}
      </div>
    </div>
  )
}
