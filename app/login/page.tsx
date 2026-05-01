"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

type Step = "login" | "forgot" | "forgot_sent"

export default function LoginCollaborateur() {
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [step, setStep]         = useState<Step>("login")
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)
  const supabase = createClient()

  async function handleLogin() {
    setError(""); setLoading(true)
    const { error: e } = await supabase.auth.signInWithPassword({ email, password })
    if (e) { setError("Email ou mot de passe incorrect."); setLoading(false); return }
    window.location.href = "/"
  }

  async function handleReset() {
    setError(""); setLoading(true)
    await fetch("/api/send-reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    })
    setStep("forgot_sent")
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "var(--bg-primary)" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-3"
            style={{ background: "linear-gradient(135deg, var(--green-dim), var(--blue-dim))", color: "#070d0f" }}>
            B
          </div>
          <h1 className="text-2xl font-black gradient-text">Backtoenergy</h1>
        </div>

        <div className="card p-6">

          {step === "login" && (
            <>
              <h2 className="font-bold text-base mb-4" style={{ color: "var(--text-primary)" }}>
                Accéder à mon programme
              </h2>
              <div className="space-y-4">
                {[
                  { label: "Email", value: email, set: setEmail, type: "email", placeholder: "votre@email.com" },
                  { label: "Mot de passe", value: password, set: setPassword, type: "password", placeholder: "••••••••" },
                ].map(({ label, value, set, type, placeholder }) => (
                  <div key={label}>
                    <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>{label}</label>
                    <input
                      type={type} value={value} onChange={e => set(e.target.value)}
                      placeholder={placeholder} onKeyDown={e => e.key === "Enter" && handleLogin()}
                      className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                      style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                    />
                  </div>
                ))}
                {error && <p className="text-xs text-red-400">{error}</p>}
                <button onClick={handleLogin} disabled={!email || !password || loading}
                  className="btn-primary w-full text-sm"
                  style={{ opacity: (!email || !password || loading) ? 0.5 : 1 }}>
                  {loading ? "Connexion..." : "Accéder à mon programme →"}
                </button>
                <div className="text-center">
                  <button onClick={() => { setStep("forgot"); setError("") }}
                    className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Mot de passe oublié ?
                  </button>
                </div>
              </div>
            </>
          )}

          {step === "forgot" && (
            <>
              <button onClick={() => setStep("login")} className="text-xs mb-4 block" style={{ color: "var(--text-muted)" }}>
                ← Retour
              </button>
              <h2 className="font-bold text-base mb-1" style={{ color: "var(--text-primary)" }}>
                Mot de passe oublié
              </h2>
              <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
                Entrez votre email. Vous recevrez un lien pour redéfinir votre mot de passe.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    onKeyDown={e => e.key === "Enter" && !(!email || loading) && handleReset()}
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                    style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                  />
                </div>
                <button onClick={handleReset} disabled={!email || loading}
                  className="btn-primary w-full text-sm"
                  style={{ opacity: (!email || loading) ? 0.5 : 1 }}>
                  {loading ? "Envoi en cours..." : "Envoyer le lien →"}
                </button>
              </div>
            </>
          )}

          {step === "forgot_sent" && (
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
                style={{ background: "rgba(76,201,240,0.1)", border: "1px solid rgba(76,201,240,0.2)" }}>
                ✉️
              </div>
              <h2 className="font-bold text-base mb-2" style={{ color: "var(--text-primary)" }}>Email envoyé</h2>
              <p className="text-sm mb-4" style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}>
                Si un compte existe pour<br />
                <strong style={{ color: "var(--text-primary)" }}>{email}</strong>,<br />
                vous recevrez un lien sous peu.
              </p>
              <button onClick={() => setStep("login")} className="text-xs" style={{ color: "var(--text-muted)" }}>
                ← Retour à la connexion
              </button>
            </div>
          )}

        </div>

        <div className="text-center mt-4">
          <Link href="/login/coach" className="text-xs" style={{ color: "var(--text-muted)" }}>
            Vous êtes coach ? →
          </Link>
        </div>
      </div>
    </div>
  )
}
