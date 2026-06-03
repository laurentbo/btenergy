"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export default function AuthCallbackPage() {
  useEffect(() => {
    async function handleCallback() {
      const url = new URL(window.location.href)
      const code = url.searchParams.get("code")
      const type = url.searchParams.get("type")
      const hash = window.location.hash

      if (hash) {
        window.location.replace(`/auth/reset-password${hash}`)
        return
      }

      if (code) {
        const supabase = createClient()
        await supabase.auth.exchangeCodeForSession(code)
      }

      window.location.replace(type === "recovery" ? "/auth/reset-password" : "/")
    }

    void handleCallback()
  }, [])

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--bg-primary)", color: "var(--text-muted)" }}
    >
      Chargement...
    </div>
  )
}
