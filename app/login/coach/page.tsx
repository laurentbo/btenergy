"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function LoginCoach() {
  const [email, setEmail]     = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]     = useState("")
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleLogin() {
    setError(""); setLoading(true)
    const { error: e } = await supabase.auth.signInWithPassword({ email, password })
    if (e) { setError(e.message); setLoading(false); return }
    window.location.href = "/coach"
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
          <h1 className="text-2xl font-black gradient-text">BTENERGY</h1>
          <p className="text-sm mt-1" style={{ color: "var(--blue)" }}>Espace coach</p>
        </div>

        <div className="card p-6">
          <h2 className="font-bold text-base mb-4" style={{ color: "var(--text-primary)" }}>Connexion Coach</h2>
          <div className="space-y-4">
            {[
              { label: "Email", value: email, set: setEmail, type: "email", placeholder: "coach@btenergy.fr" },
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
              {loading ? "Connexion..." : "Accéder au dashboard →"}
            </button>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link href="/login" className="text-xs" style={{ color: "var(--text-muted)" }}>
            ← Espace collaborateur
          </Link>
        </div>
      </div>
    </div>
  )
}
