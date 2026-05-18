import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdmin } from "@supabase/supabase-js"
import { resend, FROM } from "@/lib/resend"
import { chapter1Email, chapter2Email, chapter3Email } from "@/lib/email-templates"

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://backtoenergy.fr"

export async function POST(request: NextRequest) {
  const { day } = await request.json()

  // Seuls les jours d'ouverture de chapitre déclenchent un email automatique.
  const CHAPTER_DAYS = [1, 8, 15]
  if (!day || !CHAPTER_DAYS.includes(day)) {
    return NextResponse.json({ ok: true, skipped: true })
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

  // Choisit le template selon le chapitre
  const SUBJECTS: Record<number, string> = {
    1:  "Bienvenue — premier matin · Back to Energy",
    8:  "Deuxième chapitre · Back to Energy",
    15: "Dernier chapitre · Back to Energy",
  }
  const TEMPLATES: Record<number, (p: string, u: string) => string> = {
    1:  chapter1Email,
    8:  chapter2Email,
    15: chapter3Email,
  }

  const html = TEMPLATES[day](prenom, SITE)
  const { error: sendError } = await resend.emails.send({
    from: FROM,
    to: user.email!,
    subject: SUBJECTS[day],
    html,
  })

  if (sendError) {
    await db.from("email_logs").delete().eq("user_id", user.id).eq("type", type)
    console.error("Resend step error:", sendError)
    return NextResponse.json({ error: "Erreur envoi email." }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
