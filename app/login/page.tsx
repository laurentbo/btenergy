"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function LoginCollaborateur() {
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)
  const supabase = createClient()

  async function handleLogin() {
    setError(""); setLoading(true)
    const { error: e } = await supabase.auth.signInWithPassword({ email, password })
    if (e) { setError("Email ou mot de passe incorrect."); setLoading(false); return }
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "var(--bg-primary)" }}>
      <div className="w-full" style={{ maxWidth: 400 }}>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-black gradient-text">Backtoenergy</h1>
        </div>

        <div className="card p-7">
          <p className="text-xs uppercase tracking-widest mb-5 font-semibold"
            style={{ color: "var(--text-muted)" }}>Création de ton login</p>
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2"
                style={{ color: "var(--text-muted)" }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="ton@email.com"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2"
                style={{ color: "var(--text-muted)" }}>Mot de passe</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={e => e.key === "Enter" && email && password && !loading && handleLogin()}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button onClick={handleLogin} disabled={!email || !password || loading}
              className="btn-primary w-full text-sm"
              style={{ opacity: (!email || !password || loading) ? 0.5 : 1 }}>
              {loading ? "Connexion..." : "Se connecter →"}
            </button>
          </div>
        </div>

        <div className="text-center mt-5">
          <Link href="/login/coach" className="text-xs" style={{ color: "var(--text-muted)" }}>
            Vous êtes coach ? →
          </Link>
        </div>

      </div>
    </div>
  )
}
