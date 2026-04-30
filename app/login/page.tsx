"use client"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

type Step = "form" | "sent"

function LoginContent() {
  const [email, setEmail]     = useState("")
  const [step, setStep]       = useState<Step>("form")
  const [error, setError]     = useState("")
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    // Erreur en query string (venant de notre route handler)
    if (searchParams.get("error")) {
      setError("Lien invalide ou expiré. Demandez un nouveau lien.")
      return
    }

    const hash = window.location.hash
    if (!hash) return

    const hashParams = new URLSearchParams(hash.replace("#", ""))

    // Flux implicite Supabase : tokens valides dans le hash → on établit la session
    const access_token  = hashParams.get("access_token")
    const refresh_token = hashParams.get("refresh_token")
    if (access_token && refresh_token) {
      setLoading(true)
      window.history.replaceState(null, "", window.location.pathname)
      const supabase = createClient()
      supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
        if (error) {
          setError("Lien invalide ou expiré. Demandez un nouveau lien.")
          setLoading(false)
        } else {
          // Session établie côté client — rechargement dur pour que le proxy la lise
          window.location.replace("/")
        }
      })
      return
    }

    // Erreur Supabase en hash (flux implicite, OTP expiré, etc.)
    if (hashParams.get("error")) {
      const code = hashParams.get("error_code")
      setError(
        code === "otp_expired"
          ? "Ce lien est expiré. Demandez un nouveau lien ci-dessous."
          : "Lien invalide ou expiré. Demandez un nouveau lien."
      )
      window.history.replaceState(null, "", window.location.pathname)
    }
  }, [searchParams])

  async function handleSend() {
    setError(""); setLoading(true)

    const res = await fetch("/api/send-magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    })

    const { error: err } = await res.json()
    if (err) { setError(err); setLoading(false); return }

    setStep("sent")
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
          <h1 className="text-2xl font-black gradient-text">BTENERGY</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Back to Energy</p>
        </div>

        {step === "form" ? (
          <div className="card p-6">
            <h2 className="font-bold text-base mb-1" style={{ color: "var(--text-primary)" }}>
              Accéder à mon programme
            </h2>
            <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
              Un lien de connexion sécurisé vous sera envoyé par email.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
                  Email
                </label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  onKeyDown={e => e.key === "Enter" && !(!email || loading) && handleSend()}
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                  style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                />
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <button
                onClick={handleSend}
                disabled={!email || loading}
                className="btn-primary w-full text-sm"
                style={{ opacity: (!email || loading) ? 0.5 : 1 }}>
                {loading ? "Envoi en cours..." : "Recevoir mon lien de connexion →"}
              </button>
            </div>
          </div>
        ) : (
          <div className="card p-6 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
              style={{ background: "rgba(76,201,240,0.1)", border: "1px solid rgba(76,201,240,0.2)" }}>
              ✉️
            </div>
            <h2 className="font-bold text-base mb-2" style={{ color: "var(--text-primary)" }}>
              Vérifiez votre boîte mail
            </h2>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}>
              Un lien de connexion a été envoyé à<br />
              <strong style={{ color: "var(--text-primary)" }}>{email}</strong>
            </p>
            <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
              Le lien expire dans 1 heure. Vérifiez vos spams si vous ne le trouvez pas.
            </p>
            <button
              onClick={() => { setStep("form"); setError("") }}
              className="text-xs"
              style={{ color: "var(--text-muted)" }}>
              ← Renvoyer un lien
            </button>
          </div>
        )}

        <div className="text-center mt-4">
          <Link href="/login/coach" className="text-xs" style={{ color: "var(--text-muted)" }}>
            Vous êtes coach ? →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginCollaborateur() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
