"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function AuthCallbackPage() {
  const [status, setStatus] = useState("Connexion en cours…")

  useEffect(() => {
    const supabase = createClient()

    const handleCallback = async () => {
      const url = new URL(window.location.href)
      const code        = url.searchParams.get("code")
      const token_hash  = url.searchParams.get("token_hash")
      const type        = url.searchParams.get("type")
      const hashParams  = new URLSearchParams(window.location.hash.replace("#", ""))
      const access_token  = hashParams.get("access_token")
      const refresh_token = hashParams.get("refresh_token")

      let authError: { message: string } | null = null

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        authError = error
      } else if (token_hash && type) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await supabase.auth.verifyOtp({ token_hash, type: type as any })
        authError = error
      } else if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({ access_token, refresh_token })
        authError = error
      } else {
        setStatus("Lien invalide ou expiré.")
        return
      }

      // Si l'authentification a échoué — on affiche l'erreur, on NE redirige PAS
      if (authError) {
        setStatus(`Lien invalide ou expiré. (${authError.message})`)
        return
      }

      // Mail de bienvenue (fire-and-forget)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        fetch("/api/auth/welcome", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, email: user.email }),
        }).catch(() => {})
      }

      window.location.href = type === "recovery" ? "/auth/reset-password" : "/"
    }

    handleCallback()
  }, [])

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "100vh", background: "#070d0f",
      color: "#fff", fontFamily: "system-ui, sans-serif", fontSize: "16px",
    }}>
      {status}
    </div>
  )
}
