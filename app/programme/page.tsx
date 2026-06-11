"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { calcCurrentDay } from "@/data/program"

export default function ProgrammePage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.replace("/login"); return }
      const { data } = await supabase
        .from("profiles")
        .select("program_start")
        .eq("id", user.id)
        .maybeSingle()

      const start = data?.program_start
      if (!start) {
        router.replace("/bienvenue")
        return
      }

      // Si le programme commence demain ou plus tard → bienvenue (jour 0)
      const startDate = new Date(start)
      const today = new Date()
      startDate.setHours(0, 0, 0, 0)
      today.setHours(0, 0, 0, 0)
      if (startDate > today) {
        router.replace("/bienvenue")
        return
      }

      const day = calcCurrentDay(start)
      router.replace(`/programme/${day}`)
    })
  }, []) // eslint-disable-line

  return <div style={{ minHeight: "100svh", background: "var(--bg)" }} />
}
