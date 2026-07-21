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

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 })
  }

  const db = adminClient()
  const { data: coachProfile } = await db
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  if (!coachProfile || (coachProfile.role !== "coach" && coachProfile.role !== "admin")) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 })
  }

  const { collabId, emails_enabled } = await request.json()
  if (typeof collabId !== "string" || typeof emails_enabled !== "boolean") {
    return NextResponse.json({ error: "Paramètres invalides." }, { status: 400 })
  }

  const { error } = await db
    .from("profiles")
    .update({ emails_enabled })
    .eq("id", collabId)
    .eq("role", "collaborateur")

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
