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

  if (!email) {
    return NextResponse.json({ error: "Paramètres manquants." }, { status: 400 })
  }

  const db = admin()

  // Vérifie que le collaborateur existe
  const { data: profile } = await db
    .from("profiles")
    .select("prenom")
    .eq("email", email.toLowerCase())
    .eq("role", "collaborateur")
    .maybeSingle()

  if (!profile) {
    return NextResponse.json({ error: "Aucun compte trouvé pour cet email." }, { status: 404 })
  }

  // 3. Génère le lien magique via Admin API
  const { data, error } = await db.auth.admin.generateLink({
    type: "magiclink",
    email: email.toLowerCase(),
    options: { redirectTo: `${SITE}/auth/callback` },
  })

  if (error || !data?.properties?.action_link) {
    console.error("generateLink error:", error)
    return NextResponse.json({ error: "Impossible de générer le lien." }, { status: 500 })
  }

  // 4. Envoie via Resend
  const prenom = profile.prenom ?? "vous"
  const { error: sendError } = await resend.emails.send({
    from: FROM,
    to: email.toLowerCase(),
    subject: "🔗 Votre lien de connexion — BTENERGY",
    html: magicLinkEmail(prenom, data.properties.action_link),
  })

  if (sendError) {
    console.error("Resend error:", sendError)
    return NextResponse.json({ error: "Erreur lors de l'envoi de l'email." }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
