"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function ResetPasswordPage() {
  const [password, setPassword]   = useState("")
  const [confirm, setConfirm]     = useState("")
  const [error, setError]         = useState("")
  const [loading, setLoading]     = useState(false)

  async function handleSubmit() {
    if (password.length < 8) { setError("Le mot de passe doit faire au moins 8 caractères."); return }
    if (password !== confirm) { setError("Les mots de passe ne correspondent pas."); return }
    setError(""); setLoading(true)
    const supabase = createClient()
    const { error: e } = await supabase.auth.updateUser({ password })
    if (e) { setError("Erreur : " + e.message); setLoading(false); return }
    window.location.href = "/"
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
          <h2 className="font-bold text-base mb-1" style={{ color: "var(--text-primary)" }}>
            Définir mon mot de passe
          </h2>
          <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
            Choisissez un mot de passe pour accéder à votre programme.
          </p>
          <div className="space-y-4">
            {[
              { label: "Nouveau mot de passe", value: password, set: setPassword },
              { label: "Confirmer le mot de passe", value: confirm, set: setConfirm },
            ].map(({ label, value, set }) => (
              <div key={label}>
                <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>{label}</label>
                <input type="password" value={value} onChange={e => set(e.target.value)}
                  placeholder="••••••••"
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                  style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                />
              </div>
            ))}
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button onClick={handleSubmit} disabled={!password || !confirm || loading}
              className="btn-primary w-full text-sm"
              style={{ opacity: (!password || !confirm || loading) ? 0.5 : 1 }}>
              {loading ? "Enregistrement..." : "Accéder à mon programme →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
