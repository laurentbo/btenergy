import { NextRequest, NextResponse } from "next/server"
import { createClient as createAdmin } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"

function adminClient() {
  return createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

async function requireCoach() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return null

  const db = adminClient()
  const { data: profile } = await db
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  if (!profile || (profile.role !== "coach" && profile.role !== "admin")) return null
  return db
}

export async function GET() {
  const db = await requireCoach()
  if (!db) return NextResponse.json({ error: "Accès refusé." }, { status: 403 })

  const { data } = await db
    .from("coach_settings")
    .select("emails_enabled")
    .limit(1)
    .maybeSingle()

  return NextResponse.json({ emails_enabled: data?.emails_enabled ?? true })
}

export async function PATCH(request: NextRequest) {
  const db = await requireCoach()
  if (!db) return NextResponse.json({ error: "Accès refusé." }, { status: 403 })

  const { emails_enabled } = await request.json()
  if (typeof emails_enabled !== "boolean") {
    return NextResponse.json({ error: "Paramètre invalide." }, { status: 400 })
  }

  const { data: existing } = await db
    .from("coach_settings")
    .select("id")
    .limit(1)
    .maybeSingle()

  let error
  if (existing?.id) {
    ;({ error } = await db
      .from("coach_settings")
      .update({ emails_enabled, updated_at: new Date().toISOString() })
      .eq("id", existing.id))
  } else {
    ;({ error } = await db.from("coach_settings").insert({ emails_enabled }))
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
