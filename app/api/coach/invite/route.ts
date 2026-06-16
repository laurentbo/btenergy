import { NextRequest, NextResponse } from "next/server"
import { createClient as createAdmin } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"
import { randomBytes } from "crypto"
import { resend, FROM } from "@/lib/resend"
import { invitationEmail } from "@/lib/email-templates"

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://backtoenergy.fr"

function adminClient() {
  return createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function POST(request: NextRequest) {
  // Vérifie la session avec le client anon
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 })
  }

  // Lit le profil avec service_role pour bypasser la RLS
  const db = adminClient()
  const { data: coachProfile } = await db
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  if (!coachProfile || (coachProfile.role !== "coach" && coachProfile.role !== "admin")) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 })
  }

  const body = await request.json()
  const { email, prenom } = body as { email?: string; prenom?: string }

  if (!email || typeof email !== "string" || !prenom || typeof prenom !== "string") {
    return NextResponse.json({ error: "Email et prénom requis." }, { status: 400 })
  }

  const emailLower = email.toLowerCase().trim()
  const tempPassword = randomBytes(4).toString("hex") // ex: a3f2b1c4

  // Crée (ou récupère) l'utilisateur dans Supabase Auth
  const { data: created, error: createError } = await db.auth.admin.createUser({
    email: emailLower,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { skip_profile_trigger: true },
  })

  let userId: string

  if (createError) {
    // Si l'utilisateur existe déjà, on le retrouve via la table profiles
    if (createError.message.includes("already been registered") || createError.message.includes("already exists")) {
      const { data: existingProfile } = await db
        .from("profiles")
        .select("id")
        .eq("email", emailLower)
        .maybeSingle()
      if (!existingProfile) {
        return NextResponse.json({ error: "Impossible de créer ou retrouver l'utilisateur." }, { status: 500 })
      }
      await db.auth.admin.updateUserById(existingProfile.id, { password: tempPassword })
      userId = existingProfile.id
    } else {
      console.error("[invite] createUser error:", createError)
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }
  } else {
    userId = created.user.id
  }

  // Upsert profil — program_start remis à null pour que l'utilisateur reparte du Jour 0
  const { error: profileError } = await db.from("profiles").upsert({
    id: userId,
    email: emailLower,
    prenom: prenom.trim(),
    role: "collaborateur",
    coach_id: user.id,
    current_day: 1,
    program_start: null,
  }, { onConflict: "id" })

  if (profileError) {
    console.error("[invite] profile upsert error:", profileError)
    return NextResponse.json({ error: "Erreur lors de la création du profil." }, { status: 500 })
  }

  // Envoie l'email d'invitation
  const { error: sendError } = await resend.emails.send({
    from: FROM,
    to: emailLower,
    subject: "Ton accès backtoenergy est prêt",
    html: invitationEmail(prenom.trim(), `${SITE}/login`, emailLower, tempPassword),
  })

  if (sendError) {
    console.error("[invite] resend error:", sendError)
    return NextResponse.json({ error: "Erreur lors de l'envoi de l'email." }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
