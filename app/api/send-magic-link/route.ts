import { NextRequest, NextResponse } from "next/server"
import { createClient as createAdmin } from "@supabase/supabase-js"
import { resend, FROM } from "@/lib/resend"
import { magicLinkEmail } from "@/lib/email-templates"

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

  // 1. Génère le lien — Supabase valide que l'email existe dans auth.users
  const { data, error } = await db.auth.admin.generateLink({
    type: "magiclink",
    email: emailLower,
    options: { redirectTo: `${SITE}/auth/callback` },
  })

  if (error || !data?.properties?.hashed_token) {
    // Réponse identique qu'il y ait un compte ou non (évite l'énumération d'emails)
    return NextResponse.json({ ok: true })
  }

  // 2. Vérifie le rôle via l'ID (fiable même si profiles.email n'est pas synchronisé)
  const userId = data.user?.id
  let prenom = "vous"

  if (userId) {
    const { data: profile } = await db
      .from("profiles")
      .select("role, prenom")
      .eq("id", userId)
      .maybeSingle()

    if (!profile || profile.role !== "collaborateur") {
      if (profile?.role === "coach" || profile?.role === "admin") {
        return NextResponse.json({ error: "coach_redirect" }, { status: 403 })
      }
      return NextResponse.json({ error: "Aucun compte trouvé pour cet email." }, { status: 404 })
    }

    prenom = profile.prenom ?? "vous"
  }

  // 3. Construit l'URL de callback avec le token_hash
  const callbackUrl = `${SITE}/auth/callback?token_hash=${data.properties.hashed_token}&type=magiclink`

  // 4. Envoie l'email via Resend
  const { error: sendError } = await resend.emails.send({
    from: FROM,
    to: emailLower,
    subject: "Votre lien de connexion Backtoenergy",
    html: magicLinkEmail(prenom, callbackUrl),
  })

  if (sendError) {
    console.error("Resend error:", sendError)
    return NextResponse.json({ error: "Erreur lors de l'envoi de l'email." }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
