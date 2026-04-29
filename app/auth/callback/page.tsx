"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function AuthCallbackPage() {
  const [status, setStatus] = useState("Connexion en cours…")

  useEffect(() => {
    const supabase = createClient()

    const handleCallback = async () => {
      const url = new URL(window.location.href)

      // Cas PKCE : ?code=xxx
      const code = url.searchParams.get("code")
      // Cas OTP : ?token_hash=xxx&type=magiclink
      const token_hash = url.searchParams.get("token_hash")
      const type = url.searchParams.get("type")
      // Cas implicit : #access_token=xxx (hash fragment)
      const hashParams = new URLSearchParams(window.location.hash.replace("#", ""))
      const access_token = hashParams.get("access_token")
      const refresh_token = hashParams.get("refresh_token")

      try {
        if (code) {
          await supabase.auth.exchangeCodeForSession(code)
        } else if (token_hash && type) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await supabase.auth.verifyOtp({ token_hash, type: type as any })
        } else if (access_token && refresh_token) {
          await supabase.auth.setSession({ access_token, refresh_token })
        } else {
          setStatus("Lien invalide ou expiré.")
          return
        }

        // Envoyer le mail de bienvenue si première connexion
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await fetch("/api/auth/welcome", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id, email: user.email }),
          }).catch(() => {})
        }

        if (type === "recovery") {
          window.location.href = "/auth/reset-password"
        } else {
          window.location.href = "/"
        }
      } catch {
        setStatus("Erreur de connexion. Veuillez réessayer.")
      }
    }

    handleCallback()
  }, [])

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "#070d0f",
      color: "#fff",
      fontFamily: "system-ui, sans-serif",
      fontSize: "16px",
    }}>
      {status}
    </div>
  )
}
