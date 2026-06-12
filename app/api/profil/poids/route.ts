import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { createServiceClient } from "@/lib/supabase/service"
import { calcCurrentDay } from "@/data/program"

function browserClient(req: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: () => {},
      },
    }
  )
}

export async function GET(req: NextRequest) {
  const supabase = browserClient(req)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const service = createServiceClient()
  const { data, error } = await service
    .from("weight_logs")
    .select("id, value, day_number, logged_at")
    .eq("coachee_id", user.id)
    .order("logged_at", { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  const supabase = browserClient(req)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const { value } = await req.json()
  if (!value || isNaN(Number(value))) {
    return NextResponse.json({ error: "invalid value" }, { status: 400 })
  }

  const service = createServiceClient()

  const { data: profile } = await service
    .from("profiles")
    .select("program_start")
    .eq("id", user.id)
    .maybeSingle()

  const day_number = profile?.program_start ? calcCurrentDay(profile.program_start) : null

  const today = new Date().toISOString().slice(0, 10)

  const { data, error } = await service
    .from("weight_logs")
    .insert({ coachee_id: user.id, value: Number(value), day_number, logged_at: today })
    .select("id, value, day_number, logged_at")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
