import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { code } = await req.json()
  if (!code) return NextResponse.json({ valid: false })

  // service_role pour bypass RLS sur la table companies
  const admin = createServerClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )

  const { data } = await admin
    .from("companies")
    .select("id")
    .eq("code", code.toUpperCase().trim())
    .maybeSingle()

  return NextResponse.json({ valid: !!data })
}
