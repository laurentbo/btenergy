"use client"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { C, rgba, Ic, Wordmark } from "@/components/bte-ui"

function useDesktop() {
  const [d, setD] = useState(false)
  useEffect(() => {
    const check = () => setD(window.innerWidth >= 880)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  return d
}

function Field({
  id, label, type = "text", icon, value, onChange, placeholder, valid, onEnter,
}: {
  id: string; label: string; type?: string; icon: string; value: string
  onChange: (v: string) => void; placeholder: string; valid: boolean; onEnter?: () => void
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
        <Ic name={icon} col={C.terra} sw={1.9} s={20} />
        <input
          id={id} type={type} placeholder={placeholder} value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onEnter?.()}
          style={{
            flex: 1, minWidth: 0, border: "none", background: "transparent",
            outline: "none", color: C.ink, fontFamily: "var(--label)",
            fontSize: 15, fontWeight: 500,
            letterSpacing: type === "password" ? "0.08em" : "normal",
          }}
        />
        {valid && <Ic name="check" col={C.leaf} sw={2.4} s={18} />}
      </div>
    </div>
  )
}

export default function LoginPage() {
  const desktop = useDesktop()
  const supabase = createClient()
  const [email, setEmail]     = useState("")
  const [pwd, setPwd]         = useState("")
  const [error, setError]     = useState("")
  const [loading, setLoading] = useState(false)

  const emailOk = /.+@.+\..+/.test(email)
  const ready   = emailOk && pwd.length >= 6

  async function handleLogin() {
    if (!ready || loading) return
    setError(""); setLoading(true)
    const { error: e } = await supabase.auth.signInWithPassword({ email, password: pwd })
    if (e) {
      setError("Ça ne correspond pas — revérifie le mail d'invitation de Laurent.")
      setLoading(false)
      return
    }
    window.location.href = "/programme"
  }

  const inner = (
    <div style={{ width: "100%", maxWidth: 410, display: "flex", flexDirection: "column", alignItems: "stretch" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
        <Wordmark s={22} />
      </div>

      <h1 style={{
        margin: "0 0 10px", textAlign: "center",
        fontFamily: "var(--heading)", fontWeight: 700, fontSize: 38,
        lineHeight: 1.05, letterSpacing: "-0.015em", color: C.ink,
      }}>
        Content de te <span style={{ color: C.terra }}>retrouver.</span>
      </h1>
      <p style={{
        margin: "0 0 28px", textAlign: "center",
        fontSize: 15.5, lineHeight: 1.55, color: C.soft,
      }}>
        Tes identifiants sont dans le mail d'invitation de Laurent.
      </p>

      <Field id="cx-email" label="Ton email" type="email" icon="mail"
        value={email} onChange={setEmail} placeholder="prenom@email.fr"
        valid={emailOk} onEnter={handleLogin} />
      <Field id="cx-pwd" label="Ton mot de passe" type="password" icon="lock"
        value={pwd} onChange={setPwd} placeholder="••••••••"
        valid={pwd.length >= 6} onEnter={handleLogin} />

      {error && (
        <p style={{ margin: "-6px 0 12px", fontSize: 13, color: C.terraInk, lineHeight: 1.4 }}>
          {error}
        </p>
      )}

      <button onClick={handleLogin} disabled={!ready || loading} style={{
        width: "100%", cursor: ready && !loading ? "pointer" : "default",
        border: "none", background: C.terra, color: "#fff",
        fontFamily: "var(--label)", fontWeight: 700, fontSize: 15,
        letterSpacing: "0.02em", padding: "15px 18px", borderRadius: 999,
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9,
        opacity: ready && !loading ? 1 : 0.55,
        boxShadow: `0 14px 26px -14px ${rgba(C.terra, 0.9)}`,
        transition: "opacity 0.15s", marginTop: 4,
      }}>
        {loading ? "Connexion…" : "Me connecter"}
        {!loading && <Ic name="arrow" col="#fff" sw={2.2} s={18} />}
      </button>

      <div style={{
        borderTop: `1.5px solid ${C.line}`, marginTop: 28, paddingTop: 20,
        textAlign: "center", fontSize: 13, lineHeight: 1.55, color: C.soft,
      }}>
        Première fois ici ? Tout part de l'invitation que{" "}
        <b style={{ color: C.ink, fontWeight: 600 }}>Laurent</b> t'a envoyée par mail.<br />
        Mot de passe égaré ou un souci pour entrer ?{" "}
        <a href="mailto:laurent.bocle@gmail.com" style={{ color: C.leaf, fontWeight: 600 }}>Écris-lui, il te répond.</a>
      </div>
    </div>
  )

  return (
    <div style={{
      minHeight: "100svh",
      background: desktop ? C.chassis : C.bg,
      fontFamily: "var(--sans)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: desktop ? "48px 24px" : "32px 24px",
    }}>
      {desktop ? (
        <div style={{
          background: C.bg, border: `1.5px solid ${C.line}`, borderRadius: 26,
          padding: "56px 52px 44px", width: "100%", maxWidth: 520,
          display: "flex", justifyContent: "center",
          boxShadow: "0 30px 60px -30px rgba(0,0,0,0.5)",
        }}>
          {inner}
        </div>
      ) : inner}

      <div style={{
        marginTop: 26, fontFamily: "var(--label)", fontSize: 11,
        letterSpacing: "0.1em", textTransform: "uppercase" as const,
        color: desktop ? rgba("#EFE6CF", 0.45) : C.soft,
        display: "flex", alignItems: "center", gap: 16,
      }}>
        <span>backtoenergy · programme 21 jours</span>
        <span style={{ opacity: 0.5 }}>·</span>
        <a href="/login/coach" style={{ color: "inherit", textDecoration: "none" }}>Espace coach</a>
      </div>
    </div>
  )
}
