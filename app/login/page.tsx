"use client"
import { useState } from "react"
import Link from "next/link"

type Step = "form" | "sent"

export default function LoginCollaborateur() {
  const [email, setEmail]     = useState("")
  const [step, setStep]       = useState<Step>("form")
  const [error, setError]     = useState("")
  const [loading, setLoading] = useState(false)

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
