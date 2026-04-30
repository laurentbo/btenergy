import { NextRequest, NextResponse } from "next/server"
import { createClient as createAdmin } from "@supabase/supabase-js"
import { resend, FROM } from "@/lib/resend"
import { welcomeEmail } from "@/lib/email-templates"

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://backtoenergy.fr"

export async function POST(request: NextRequest) {
  const { userId, email } = await request.json()
  if (!userId || !email) return NextResponse.json({ ok: false })

  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // Envoie le mail de bienvenue seulement si première connexion
  const { error: insertErr } = await admin
    .from("email_logs")
    .insert({ user_id: userId, type: "welcome" })

  if (!insertErr) {
    const { data: profile } = await admin
      .from("profiles")
      .select("prenom")
      .eq("id", userId)
      .maybeSingle()

    const prenom = profile?.prenom ?? "vous"
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "🌱 Bienvenue dans votre programme 21 Jours — BACKToENERGY",
      html: welcomeEmail(prenom, SITE),
    })
  }

  return NextResponse.json({ ok: true })
}
