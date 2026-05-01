import { NextRequest, NextResponse } from "next/server"
import { createClient as createAdmin } from "@supabase/supabase-js"
import { resend, FROM } from "@/lib/resend"
import { invitationEmail } from "@/lib/email-templates"

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://backtoenergy.fr"

function admin() {
  return createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function POST(request: NextRequest) {
  const { email } = await request.json()

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Paramètres manquants." }, { status: 400 })
  }

  const db = admin()
  const emailLower = email.toLowerCase().trim()

  const { data, error } = await db.auth.admin.generateLink({
    type: "magiclink",
    email: emailLower,
    options: { redirectTo: `${SITE}/auth/callback` },
  })

  if (error || !data?.properties?.hashed_token) {
    return NextResponse.json({ error: "Impossible de générer le lien." }, { status: 500 })
  }

  const userId = data.user?.id
  let prenom: string | null = null

  if (userId) {
    const { data: profile } = await db
      .from("profiles")
      .select("role, prenom")
      .eq("id", userId)
      .maybeSingle()

    if (!profile || profile.role !== "collaborateur") {
      return NextResponse.json({ error: "Compte non trouvé." }, { status: 404 })
    }

    prenom = profile.prenom ?? null
  }

  const callbackUrl = `${SITE}/auth/callback?token_hash=${data.properties.hashed_token}&type=magiclink`

  const { error: sendError } = await resend.emails.send({
    from: FROM,
    to: emailLower,
    subject: "🌱 Votre programme Backtoenergy vous attend",
    html: invitationEmail(prenom, callbackUrl),
  })

  if (sendError) {
    console.error("Resend error:", sendError)
    return NextResponse.json({ error: "Erreur lors de l'envoi." }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
