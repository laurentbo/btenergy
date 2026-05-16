import { NextRequest, NextResponse } from "next/server"
import { createClient as createAdmin } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"
import { Resend } from "resend"
import { randomBytes } from "crypto"

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://backtoenergy.fr"
const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = "Laurent – Back to Energy <programme@backtoenergy.fr>"

function adminClient() {
  return createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

function inviteEmail(prenom: string, email: string, password: string): string {
  const nom = prenom.charAt(0).toUpperCase() + prenom.slice(1).toLowerCase()
  return `
<!DOCTYPE html><html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F8F7F4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F7F4;">
<tr><td align="center" style="padding:40px 20px;">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

  <!-- Logo -->
  <tr><td align="center" style="padding-bottom:28px;">
    <span style="font-size:24px;font-weight:900;color:#2A9D8F;">Back to Energy</span>
  </td></tr>

  <!-- Card -->
  <tr><td style="background:#ffffff;border:1px solid #e8e5e0;border-radius:20px;padding:40px;">

    <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.1em;color:#2A9D8F;text-transform:uppercase;">Ton accès est prêt</p>
    <h1 style="margin:0 0 20px;font-size:24px;font-weight:900;color:#2B2D2E;line-height:1.2;">Bienvenue ${nom} 🎉</h1>

    <p style="margin:0 0 16px;font-size:15px;color:#4a4a4a;line-height:1.7;">
      Je t'ai ouvert un accès au programme <strong style="color:#2B2D2E;">Back to Energy — 21 jours</strong>.<br>
      Pendant 3 semaines, on remet le corps à zéro : énergie, digestion, clarté mentale.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0faf8;border:2px solid #2A9D8F;border-radius:14px;margin-bottom:28px;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:0.08em;color:#2A9D8F;text-transform:uppercase;">Tes identifiants de connexion</p>
        <p style="margin:0 0 6px;font-size:14px;color:#2B2D2E;"><strong>Email :</strong> ${email}</p>
        <p style="margin:0;font-size:14px;color:#2B2D2E;"><strong>Mot de passe temporaire :</strong>
          <span style="display:inline-block;margin-left:8px;padding:4px 12px;background:#fff;border:1.5px solid #2A9D8F;border-radius:8px;font-family:monospace;font-size:15px;font-weight:700;color:#2A9D8F;letter-spacing:0.05em;">${password}</span>
        </p>
      </td></tr>
    </table>

    <p style="margin:0 0 6px;font-size:13px;font-weight:700;letter-spacing:0.08em;color:#2B2D2E;text-transform:uppercase;">Ton parcours en 3 semaines</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr><td style="padding:8px 0;border-bottom:1px solid #f0ece7;">
        <span style="font-size:14px;color:#2B2D2E;">🌅 <strong>Semaine 1</strong> — Détox &amp; Purification</span>
      </td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #f0ece7;">
        <span style="font-size:14px;color:#2B2D2E;">⚡ <strong>Semaine 2</strong> — Énergie &amp; Vitalité</span>
      </td></tr>
      <tr><td style="padding:8px 0;">
        <span style="font-size:14px;color:#2B2D2E;">🏔️ <strong>Semaine 3</strong> — Ancrage &amp; Performance</span>
      </td></tr>
    </table>

    <table cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
      <tr><td align="center" style="border-radius:12px;background:#2A9D8F;">
        <a href="${SITE}/login" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.02em;">
          Me connecter →
        </a>
      </td></tr>
    </table>

    <p style="margin:0;font-size:12px;color:#9b9590;text-align:center;line-height:1.7;">
      Pense à changer ton mot de passe dès ta première connexion.<br>
      À très vite — Laurent 🌿
    </p>

  </td></tr>

  <!-- Footer -->
  <tr><td align="center" style="padding-top:24px;">
    <p style="margin:0;font-size:11px;color:#9b9590;">Back to Energy · backtoenergy.fr</p>
  </td></tr>

</table></td></tr></table>
</body></html>
  `.trim()
}

export async function POST(request: NextRequest) {
  // Vérifie que l'appelant est un coach connecté
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 })
  }

  const { data: coachProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  if (!coachProfile || coachProfile.role !== "coach") {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 })
  }

  const body = await request.json()
  const { email, prenom } = body as { email?: string; prenom?: string }

  if (!email || typeof email !== "string" || !prenom || typeof prenom !== "string") {
    return NextResponse.json({ error: "Email et prénom requis." }, { status: 400 })
  }

  const emailLower = email.toLowerCase().trim()
  const tempPassword = randomBytes(4).toString("hex") // ex: a3f2b1c4

  const db = adminClient()

  // Crée (ou récupère) l'utilisateur dans Supabase Auth
  const { data: created, error: createError } = await db.auth.admin.createUser({
    email: emailLower,
    password: tempPassword,
    email_confirm: true,
  })

  let userId: string

  if (createError) {
    // Si l'utilisateur existe déjà, on met à jour son mot de passe
    if (createError.message.includes("already been registered") || createError.message.includes("already exists")) {
      const { data: list } = await db.auth.admin.listUsers()
      const existing = list?.users.find(u => u.email === emailLower)
      if (!existing) {
        return NextResponse.json({ error: "Impossible de créer ou retrouver l'utilisateur." }, { status: 500 })
      }
      await db.auth.admin.updateUserById(existing.id, { password: tempPassword })
      userId = existing.id
    } else {
      console.error("[invite] createUser error:", createError)
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }
  } else {
    userId = created.user.id
  }

  // Upsert profil
  const { error: profileError } = await db.from("profiles").upsert({
    id: userId,
    email: emailLower,
    prenom: prenom.trim(),
    role: "collaborateur",
    coach_id: user.id,
  }, { onConflict: "id" })

  if (profileError) {
    console.error("[invite] profile upsert error:", profileError)
    return NextResponse.json({ error: "Erreur lors de la création du profil." }, { status: 500 })
  }

  // Envoie l'email d'invitation
  const { error: sendError } = await resend.emails.send({
    from: FROM,
    to: emailLower,
    subject: "🎉 Ton accès au programme Back to Energy – 21 jours",
    html: inviteEmail(prenom.trim(), emailLower, tempPassword),
  })

  if (sendError) {
    console.error("[invite] resend error:", sendError)
    return NextResponse.json({ error: "Erreur lors de l'envoi de l'email." }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
