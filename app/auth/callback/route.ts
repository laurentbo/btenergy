import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { resend, FROM } from "@/lib/resend"
import { welcomeEmail } from "@/lib/email-templates"
import { createClient as createAdmin } from "@supabase/supabase-js"

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://backtoenergy.fr"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code       = searchParams.get("code")
  const token_hash = searchParams.get("token_hash")
  const type       = searchParams.get("type") as "magiclink" | "recovery" | null

  const supabase = await createClient()

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  } else if (token_hash && type) {
    await supabase.auth.verifyOtp({ token_hash, type })
  }

  // Récupère l'utilisateur après échange
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // Envoie le mail de bienvenue si c'est la première connexion (email_logs vide pour cet user)
    const admin = createAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { error: insertErr } = await admin
      .from("email_logs")
      .insert({ user_id: user.id, type: "welcome" })

    if (!insertErr) {
      // Première connexion → récupère prénom
      const { data: profile } = await admin
        .from("profiles")
        .select("prenom")
        .eq("id", user.id)
        .maybeSingle()

      const prenom = profile?.prenom ?? "vous"

      await resend.emails.send({
        from: FROM,
        to: user.email!,
        subject: "🌱 Bienvenue dans votre programme 21 Jours — BTENERGY",
        html: welcomeEmail(prenom, SITE),
      })
    }
  }

  // Redirige vers l'app selon le type
  if (type === "recovery") {
    return NextResponse.redirect(new URL("/auth/reset-password", request.url))
  }

  return NextResponse.redirect(new URL(SITE))
}
