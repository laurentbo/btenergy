"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { C, rgba, Ic, Wordmark } from "@/components/bte-ui"

function Field({
  id, label, value, onChange, onEnter,
}: {
  id: string; label: string; value: string
  onChange: (v: string) => void; onEnter?: () => void
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label htmlFor={id} style={{
        fontFamily: "var(--label)", fontSize: 10.5, fontWeight: 700,
        letterSpacing: "0.16em", textTransform: "uppercase" as const,
        color: C.soft, marginBottom: 9, display: "block",
      }}>{label}</label>
      <div style={{
        display: "flex", alignItems: "center", gap: 11,
        background: C.surface, border: `2px solid ${C.ink}`,
        borderRadius: 12, padding: "13px 15px",
      }}>
        <Ic name="lock" col={C.terra} sw={1.9} s={20} />
        <input
          id={id} type="password" placeholder="••••••••" value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onEnter?.()}
          style={{
            flex: 1, minWidth: 0, border: "none", background: "transparent",
            outline: "none", color: C.ink, fontFamily: "var(--label)",
            fontSize: 15, fontWeight: 500, letterSpacing: "0.08em",
          }}
        />
      </div>
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: "100svh", background: C.bg, fontFamily: "var(--sans)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "32px 24px",
    }}>
      <div style={{ width: "100%", maxWidth: 410 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
          <Wordmark s={22} />
        </div>
        {children}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  // "confirm"  : on attend un clic explicite avant de consommer le lien
  //              (un lien email pré-visité par un scanner de sécurité ne
  //              déclenche jamais verifyOtp, donc le token reste valide)
  // "form"     : lien vérifié, on peut saisir le nouveau mot de passe
  // "error"    : lien invalide/expiré
  const [step, setStep]         = useState<"confirm" | "form" | "error">("confirm")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm]   = useState("")
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)

  async function handleConfirmLink() {
    setLoading(true); setError("")
    const supabase = createClient()
    const params = new URLSearchParams(window.location.search)
    const tokenHash = params.get("token_hash")
    const type = params.get("type")

    if (!tokenHash || type !== "recovery") {
      setError("Ouvrez cette page depuis le lien reçu par email pour réinitialiser votre mot de passe.")
      setStep("error"); setLoading(false)
      return
    }

    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "recovery",
    })

    if (verifyError) {
      setError("Lien de réinitialisation invalide ou expiré. Demandez un nouveau lien.")
      setStep("error"); setLoading(false)
      return
    }

    window.history.replaceState({}, "", "/auth/reset-password")
    setStep("form"); setLoading(false)
  }

  async function handleSubmit() {
    if (password.length < 8) { setError("Le mot de passe doit faire au moins 8 caractères."); return }
    if (password !== confirm) { setError("Les mots de passe ne correspondent pas."); return }
    setError(""); setLoading(true)
    const supabase = createClient()
    const { error: e } = await supabase.auth.updateUser({ password })
    if (e) { setError("Erreur : " + e.message); setLoading(false); return }
    window.location.href = "/"
  }

  if (step === "confirm") {
    return (
      <Card>
        <div style={{ background: C.surface, border: `1.5px solid ${C.line}`, borderRadius: 18, padding: "32px 28px" }}>
          <h1 style={{
            margin: "0 0 10px", textAlign: "center",
            fontFamily: "var(--heading)", fontWeight: 700, fontSize: 26,
            lineHeight: 1.1, color: C.ink,
          }}>
            Réinitialiser ton <span style={{ color: C.terra }}>mot de passe</span>
          </h1>
          <p style={{ margin: "0 0 24px", textAlign: "center", fontSize: 14.5, lineHeight: 1.55, color: C.soft }}>
            Clique pour confirmer que c&apos;est bien toi qui ouvres ce lien.
          </p>
          {error && (
            <p style={{ margin: "0 0 14px", fontSize: 13, color: C.terraInk, lineHeight: 1.4, textAlign: "center" }}>
              {error}
            </p>
          )}
          <button onClick={handleConfirmLink} disabled={loading} style={{
            width: "100%", cursor: loading ? "default" : "pointer",
            border: "none", background: C.terra, color: "#fff",
            fontFamily: "var(--label)", fontWeight: 700, fontSize: 15,
            letterSpacing: "0.02em", padding: "15px 18px", borderRadius: 999,
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9,
            opacity: loading ? 0.55 : 1,
            boxShadow: `0 14px 26px -14px ${rgba(C.terra, 0.9)}`,
          }}>
            {loading ? "Vérification…" : "Continuer"}
            {!loading && <Ic name="arrow" col="#fff" sw={2.2} s={18} />}
          </button>
        </div>
      </Card>
    )
  }

  if (step === "error") {
    return (
      <Card>
        <div style={{
          background: C.surface, border: `1.5px solid ${C.line}`, borderRadius: 18,
          padding: "32px 28px", textAlign: "center",
        }}>
          <h1 style={{ margin: "0 0 10px", fontFamily: "var(--heading)", fontWeight: 700, fontSize: 24, color: C.ink }}>
            Lien <span style={{ color: C.terraInk }}>invalide</span>
          </h1>
          <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: C.soft }}>{error}</p>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div style={{ background: C.surface, border: `1.5px solid ${C.line}`, borderRadius: 18, padding: "32px 28px" }}>
        <h1 style={{
          margin: "0 0 10px", textAlign: "center",
          fontFamily: "var(--heading)", fontWeight: 700, fontSize: 26,
          lineHeight: 1.1, color: C.ink,
        }}>
          Choisis ton <span style={{ color: C.terra }}>mot de passe</span>
        </h1>
        <p style={{ margin: "0 0 24px", textAlign: "center", fontSize: 14.5, lineHeight: 1.55, color: C.soft }}>
          Au moins 8 caractères, pour accéder à ton programme.
        </p>

        <Field id="rp-pwd" label="Nouveau mot de passe" value={password} onChange={setPassword} onEnter={handleSubmit} />
        <Field id="rp-pwd2" label="Confirmer le mot de passe" value={confirm} onChange={setConfirm} onEnter={handleSubmit} />

        {error && (
          <p style={{ margin: "-6px 0 12px", fontSize: 13, color: C.terraInk, lineHeight: 1.4 }}>
            {error}
          </p>
        )}

        <button onClick={handleSubmit} disabled={!password || !confirm || loading} style={{
          width: "100%", cursor: (!password || !confirm || loading) ? "default" : "pointer",
          border: "none", background: C.terra, color: "#fff",
          fontFamily: "var(--label)", fontWeight: 700, fontSize: 15,
          letterSpacing: "0.02em", padding: "15px 18px", borderRadius: 999,
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9,
          opacity: (!password || !confirm || loading) ? 0.55 : 1,
          boxShadow: `0 14px 26px -14px ${rgba(C.terra, 0.9)}`,
          marginTop: 4,
        }}>
          {loading ? "Enregistrement…" : "Accéder à mon programme"}
          {!loading && <Ic name="arrow" col="#fff" sw={2.2} s={18} />}
        </button>
      </div>
    </Card>
  )
}
