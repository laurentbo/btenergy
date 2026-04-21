"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function LoginCollaborateur() {
  const [email, setEmail]   = useState("")
  const [code, setCode]     = useState("")
  const [step, setStep]     = useState<"form" | "otp" | "done">("form")
  const [otp, setOtp]       = useState("")
  const [error, setError]   = useState("")
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSendOTP() {
    setError(""); setLoading(true)
    // Vérifie le code entreprise
    const { data: company } = await supabase
      .from("companies").select("id").eq("code", code.toUpperCase()).single()
    if (!company) { setError("Code entreprise invalide."); setLoading(false); return }

    const { error: e } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true, data: { company_code: code.toUpperCase() } },
    })
    if (e) { setError(e.message); setLoading(false); return }
    setStep("otp"); setLoading(false)
  }

  async function handleVerifyOTP() {
    setError(""); setLoading(true)
    const { error: e } = await supabase.auth.verifyOtp({ email, token: otp, type: "email" })
    if (e) { setError(e.message); setLoading(false); return }
    setStep("done"); setLoading(false)
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "var(--bg-primary)" }}>

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-3"
            style={{ background: "linear-gradient(135deg, var(--green-dim), var(--blue-dim))", color: "#070d0f" }}>
            B
          </div>
          <h1 className="text-2xl font-black gradient-text">BTENERGY</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Espace collaborateur</p>
        </div>

        <div className="card p-6">
          {step === "form" && (
            <>
              <h2 className="font-bold text-base mb-4" style={{ color: "var(--text-primary)" }}>
                Accéder à mon programme
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Email</label>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                    style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
                    Code entreprise
                  </label>
                  <input
                    type="text" value={code} onChange={e => setCode(e.target.value)}
                    placeholder="EX: CORP2024"
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none uppercase"
                    style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)", letterSpacing: "0.1em" }}
                  />
                </div>
                {error && <p className="text-xs text-red-400">{error}</p>}
                <button
                  onClick={handleSendOTP}
                  disabled={!email || !code || loading}
                  className="btn-primary w-full text-sm"
                  style={{ opacity: (!email || !code || loading) ? 0.5 : 1 }}>
                  {loading ? "Envoi..." : "Recevoir mon code →"}
                </button>
              </div>
            </>
          )}

          {step === "otp" && (
            <>
              <h2 className="font-bold text-base mb-2" style={{ color: "var(--text-primary)" }}>Code envoyé ✉️</h2>
              <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                Un code à 6 chiffres a été envoyé à <strong>{email}</strong>
              </p>
              <div className="space-y-4">
                <input
                  type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)}
                  placeholder="000000"
                  className="w-full rounded-xl px-4 py-3 text-2xl font-black text-center outline-none tracking-widest"
                  style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--green)" }}
                />
                {error && <p className="text-xs text-red-400">{error}</p>}
                <button onClick={handleVerifyOTP} disabled={otp.length < 6 || loading}
                  className="btn-primary w-full text-sm"
                  style={{ opacity: (otp.length < 6 || loading) ? 0.5 : 1 }}>
                  {loading ? "Vérification..." : "Accéder à mon programme →"}
                </button>
                <button onClick={() => setStep("form")} className="w-full text-center text-xs"
                  style={{ color: "var(--text-muted)" }}>
                  ← Recommencer
                </button>
              </div>
            </>
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
