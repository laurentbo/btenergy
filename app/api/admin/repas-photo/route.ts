import { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { createServiceClient } from "@/lib/supabase/service"

const ALLOWED_SLOTS = ["petit-dej", "dejeuner", "diner"] as const
type Slot = (typeof ALLOWED_SLOTS)[number]

async function getCoachUser() {
  const cookieStore = await cookies()
  const supabase = createServerClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const admin = createServiceClient()
  const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).maybeSingle()
  if (profile?.role !== "coach" && profile?.role !== "admin") return null
  return user
}

export async function POST(req: NextRequest) {
  const coach = await getCoachUser()
  if (!coach) return Response.json({ error: "non autorisé" }, { status: 403 })

  const formData = await req.formData()
  const slot = formData.get("slot") as string
  const file = formData.get("file") as File | null

  if (!file || !ALLOWED_SLOTS.includes(slot as Slot)) {
    return Response.json({ error: "slot ou fichier invalide" }, { status: 400 })
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg"
  const filename = `${slot}.${ext}`
  const buf = Buffer.from(await file.arrayBuffer())

  const supabase = createServiceClient()

  // Remove old file for this slot (any extension)
  for (const oldExt of ["jpg", "jpeg", "png", "webp"]) {
    await supabase.storage.from("repas").remove([`${slot}.${oldExt}`])
  }

  const { error } = await supabase.storage
    .from("repas")
    .upload(filename, buf, {
      contentType: file.type,
      upsert: true,
      cacheControl: "no-cache",
    })

  if (error) return Response.json({ error: error.message }, { status: 500 })

  const { data } = supabase.storage.from("repas").getPublicUrl(filename)
  return Response.json({ url: data.publicUrl })
}

export async function GET() {
  const supabase = createServiceClient()
  const urls: Record<string, string | null> = {}

  const { data: files } = await supabase.storage.from("repas").list("", { limit: 20 })

  for (const slot of ALLOWED_SLOTS) {
    const match = files?.find((f) => f.name.startsWith(slot + "."))
    if (match) {
      const { data } = supabase.storage.from("repas").getPublicUrl(match.name)
      urls[slot] = data.publicUrl
    } else {
      urls[slot] = null
    }
  }

  return Response.json(urls)
}
