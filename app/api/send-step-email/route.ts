import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdmin } from "@supabase/supabase-js"
import { resend, FROM } from "@/lib/resend"
import { stepEmail, midpointEmail, postCureEmail } from "@/lib/email-templates"

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://backtoenergy.fr"

export async function POST(request: NextRequest) {
  const { day } = await request.json()

  if (!day || day < 1 || day > 22) {
    return NextResponse.json({ error: "Jour invalide." }, { status: 400 })
  }

  // Auth : récupère l'utilisateur connecté
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 })

  const db = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // Dédoublonnage : essaie d'insérer la clé unique (user_id, type)
  const type = `step_${day}`
  const { error: insertErr } = await db
    .from("email_logs")
    .insert({ user_id: user.id, type })

  if (insertErr) {
    // Email déjà envoyé pour ce jour → skip silencieusement
    return NextResponse.json({ ok: true, skipped: true })
  }

  // Récupère le profil pour le prénom
  const { data: profile } = await db
    .from("profiles")
    .select("prenom")
    .eq("id", user.id)
    .maybeSingle()

  const prenom = profile?.prenom ?? "vous"

  // Day 22: Send post-cure email only
  if (day === 22) {
    const { error: sendError } = await resend.emails.send({
      from: FROM,
      to: user.email!,
      subject: "Félicitations — Programme BTENERGY complété 🎉",
      html: postCureEmail(prenom, SITE),
    })

    if (sendError) {
      await db.from("email_logs").delete().eq("user_id", user.id).eq("type", type)
      console.error("Resend post-cure error:", sendError)
      return NextResponse.json({ error: "Erreur envoi email." }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  }

  // Day 10: Send step email + midpoint email
  if (day === 10) {
    const { error: stepErr } = await resend.emails.send({
      from: FROM,
      to: user.email!,
      subject: `Jour ${day} · Programme BTENERGY`,
      html: stepEmail(prenom, day, SITE),
    })

    if (stepErr) {
      await db.from("email_logs").delete().eq("user_id", user.id).eq("type", type)
      console.error("Resend step error:", stepErr)
      return NextResponse.json({ error: "Erreur envoi email." }, { status: 500 })
    }

    const { error: midErr } = await resend.emails.send({
      from: FROM,
      to: user.email!,
      subject: "Jour 10 — Halfway There 🏔️",
      html: midpointEmail(prenom, SITE),
    })

    if (midErr) {
      console.error("Resend midpoint error:", midErr)
      // Log the error but don't fail — step email was sent
    }

    return NextResponse.json({ ok: true })
  }

  // Default: Send regular step email
  const { error: sendError } = await resend.emails.send({
    from: FROM,
    to: user.email!,
    subject: `Jour ${day} · Programme BTENERGY`,
    html: stepEmail(prenom, day, SITE),
  })

  if (sendError) {
    await db.from("email_logs").delete().eq("user_id", user.id).eq("type", type)
    console.error("Resend step error:", sendError)
    return NextResponse.json({ error: "Erreur envoi email." }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
