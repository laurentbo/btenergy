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

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 })
  }

  const db = adminClient()
  const { data: me } = await db
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  if (!me || (me.role !== "coach" && me.role !== "admin")) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const collabId = searchParams.get("id")
  if (!collabId) {
    return NextResponse.json({ error: "ID manquant." }, { status: 400 })
  }

  // Vérifie que le collab appartient bien à ce coach
  const { data: collab } = await db
    .from("profiles")
    .select("id, role, coach_id")
    .eq("id", collabId)
    .maybeSingle()

  if (!collab || collab.role !== "collaborateur" || collab.coach_id !== user.id) {
    return NextResponse.json({ error: "Collaborateur introuvable." }, { status: 404 })
  }

  // Supprime le profil (cascade sur les tables liées via FK)
  await db.from("profiles").delete().eq("id", collabId)

  // Supprime le compte auth
  await db.auth.admin.deleteUser(collabId)

  return NextResponse.json({ success: true })
}
