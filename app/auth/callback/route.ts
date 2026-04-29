import { createServerClient } from "@supabase/ssr"
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

  // Créer la réponse redirect en premier pour y écrire les cookies de session
  const redirectTo = type === "recovery"
    ? new URL("/auth/reset-password", SITE)
    : new URL(SITE)
  const response = NextResponse.redirect(redirectTo)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

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

  return response
}
