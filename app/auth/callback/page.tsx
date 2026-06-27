"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { hasProgramStarted } from "@/data/program"

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

      if (type === "recovery") {
        if (code) {
          const supabase = createClient()
          await supabase.auth.exchangeCodeForSession(code)
        }
        window.location.replace("/auth/reset-password")
        return
      }

      if (code) {
        const supabase = createClient()
        await supabase.auth.exchangeCodeForSession(code)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { window.location.replace("/"); return }

        const { data: profile } = await supabase
          .from("profiles").select("start_date, role").eq("id", user.id).maybeSingle()

        if (profile?.role === "coach" || profile?.role === "admin") {
          window.location.replace("/coach"); return
        }

        window.location.replace(hasProgramStarted(profile?.start_date) ? "/jour" : "/bienvenue")
        return
      }

      window.location.replace("/")
    }

    void handleCallback()
  }, [])

  return (
    <div style={{ minHeight: "100svh", display: "flex", alignItems: "center", justifyContent: "center", background: "#EFE6CF", color: "#857A61", fontFamily: "var(--sans)", fontSize: 15 }}>
      Chargement…
    </div>
  )
}
