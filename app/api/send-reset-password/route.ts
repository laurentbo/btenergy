import { NextRequest, NextResponse } from "next/server"
import { createClient as createAdmin } from "@supabase/supabase-js"
import { resend, FROM } from "@/lib/resend"
import { resetPasswordEmail } from "@/lib/email-templates"

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
    return NextResponse.json({ error: "Email manquant." }, { status: 400 })
  }

  const db = admin()

  // Récupère le profil (tous les utilisateurs, pas juste coaches)
  const { data: profile } = await db
    .from("profiles")
    .select("prenom")
    .eq("email", email.toLowerCase())
    .maybeSingle()

  if (!profile) {
    // Répond toujours OK pour éviter l'énumération d'emails
    return NextResponse.json({ ok: true })
  }

  // Génère le lien de réinitialisation
  const { data, error } = await db.auth.admin.generateLink({
    type: "recovery",
    email: email.toLowerCase(),
    options: { redirectTo: `${SITE}/auth/callback?type=recovery` },
  })

  if (error || !data?.properties?.action_link) {
    console.error("generateLink recovery error:", error)
    return NextResponse.json({ ok: true }) // Ne pas exposer l'erreur
  }

  await resend.emails.send({
    from: FROM,
    to: email.toLowerCase(),
    subject: "🔑 Réinitialisation de votre mot de passe — BACKToENERGY",
    html: resetPasswordEmail(profile.prenom ?? "", data.properties.action_link),
  })

  return NextResponse.json({ ok: true })
}
