import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const { data, error } = await supabase
    .from("coach_settings")
    .select("exclusions")
    .limit(1)
    .maybeSingle()

  if (error || !data) {
    return NextResponse.json({ exclusions: {} })
  }
  return NextResponse.json({ exclusions: data.exclusions })
}

export async function PATCH(req: NextRequest) {
  // Vérification admin basique via header secret
  const authHeader = req.headers.get("x-admin-secret")
  if (authHeader !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const { exclusions } = await req.json()
  if (!exclusions) return NextResponse.json({ error: "Données manquantes" }, { status: 400 })

  // Upsert : met à jour la première ligne ou insère si vide
  const { data: existing } = await supabase
    .from("coach_settings")
    .select("id")
    .limit(1)
    .maybeSingle()

  let error
  if (existing?.id) {
    ;({ error } = await supabase
      .from("coach_settings")
      .update({ exclusions, updated_at: new Date().toISOString() })
      .eq("id", existing.id))
  } else {
    ;({ error } = await supabase.from("coach_settings").insert({ exclusions }))
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
