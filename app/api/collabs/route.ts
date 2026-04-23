import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const cookieStore = await cookies()

  // Vérifie la session avec le client anon
  const supabase = createServerClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json([], { status: 401 })

  // Service role pour bypass RLS
  const admin = createServerClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )

  // Vérifie que c'est bien un coach
  const { data: me } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  if (me?.role !== "coach" && me?.role !== "admin") {
    return NextResponse.json([], { status: 403 })
  }

  // Récupère les collaborateurs de ce coach
  const { data: profiles } = await admin
    .from("profiles")
    .select("*")
    .eq("coach_id", user.id)
    .eq("role", "collaborateur")
    .order("created_at", { ascending: false })

  if (!profiles || profiles.length === 0) return NextResponse.json([])

  // Enrichit avec les données journal
  const enriched = await Promise.all(profiles.map(async (p: any) => {
    const { data: entries } = await admin
      .from("journal_entries")
      .select("*")
      .eq("user_id", p.id)
      .order("created_at", { ascending: false })

    const last_entry = entries?.[0] ?? null
    const avg_energie = entries?.length
      ? Math.round(entries.reduce((s: number, e: any) => s + e.energie, 0) / entries.length * 10) / 10
      : null

    return { ...p, last_entry, avg_energie }
  }))

  return NextResponse.json(enriched)
}
