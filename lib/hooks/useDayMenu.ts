"use client"
import { useState, useEffect } from "react"
import { fetchResolvedDayMenu } from "@/lib/menus"
import type { ResolvedDayMenu } from "@/lib/supabase/types"

type UseDayMenuResult = {
  menu: ResolvedDayMenu | null
  loading: boolean
  error: string | null
  reload: () => void
}

export function useDayMenu(userId: string | null, jour: number): UseDayMenuResult {
  const [menu, setMenu] = useState<ResolvedDayMenu | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!userId || jour < 1 || jour > 21) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchResolvedDayMenu(userId, jour)
      .then((data) => { if (!cancelled) { setMenu(data); setLoading(false) } })
      .catch((e) => { if (!cancelled) { setError(e.message ?? "Erreur"); setLoading(false) } })
    return () => { cancelled = true }
  }, [userId, jour, tick])

  return { menu, loading, error, reload: () => setTick((t) => t + 1) }
}
