import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()

  const supabase = createServerClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json(null, { status: 401 })

  const admin = createServerClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )

  // Vérifie que le demandeur est bien le coach de ce collaborateur
  const { data: me } = await admin.from("profiles").select("role").eq("id", user.id).maybeSingle()
  if (me?.role !== "coach" && me?.role !== "admin") {
    return NextResponse.json(null, { status: 403 })
  }

  const { data: collab } = await admin
    .from("profiles").select("*").eq("id", id).maybeSingle()
  if (!collab) return NextResponse.json(null, { status: 404 })

  // Journal entries
  const { data: entries } = await admin
    .from("journal_entries").select("*").eq("user_id", id).order("created_at", { ascending: false })

  // Overrides (tous les jours)
  const { data: overrides } = await admin
    .from("program_overrides").select("*").eq("collaborateur_id", id)

  return NextResponse.json({ collab, entries: entries ?? [], overrides: overrides ?? [] })
}
