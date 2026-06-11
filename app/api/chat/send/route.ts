import { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { createServiceClient } from "@/lib/supabase/service"
import { resend, FROM } from "@/lib/resend"

const COACH_EMAIL = "laurent.bocle@gmail.com"
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://backtoenergy.fr"

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createServerClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: "non autorisé" }, { status: 401 })

  const { body } = await req.json()
  if (!body?.trim()) return Response.json({ error: "message vide" }, { status: 400 })

  const admin = createServiceClient()

  // Get prenom
  const { data: profile } = await admin
    .from("profiles")
    .select("prenom")
    .eq("id", user.id)
    .maybeSingle()
  const prenom = profile?.prenom ?? "Un participant"

  // Insert message
  const { data: message, error } = await admin
    .from("journal_messages")
    .insert({
      coachee_id: user.id,
      author: "coachee",
      body: body.trim(),
      read_by_coach: false,
      read_by_user: true,
    })
    .select()
    .maybeSingle()

  if (error) return Response.json({ error: error.message }, { status: 500 })

  // Send email notification to Laurent
  await resend.emails.send({
    from: FROM,
    to: COACH_EMAIL,
    subject: `💬 Nouveau message de ${prenom}`,
    html: `
      <div style="font-family:-apple-system,sans-serif;background:#EFE6CF;padding:40px 24px;">
        <div style="max-width:480px;margin:0 auto;background:#FBF6EA;border-radius:16px;padding:32px;border:1px solid #E2D4B5;">
          <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#857A61;">Nouveau message</p>
          <p style="margin:0 0 20px;font-size:22px;font-weight:700;color:#1E1B14;">${prenom} t'a écrit</p>
          <div style="background:#EFE6CF;border-radius:12px;padding:16px 18px;margin-bottom:24px;">
            <p style="margin:0;font-size:15px;line-height:1.55;color:#1E1B14;">${body.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
          </div>
          <a href="${SITE}/coach/messages" style="display:inline-block;background:#4E7A3C;color:#fff;text-decoration:none;padding:13px 24px;border-radius:999px;font-weight:700;font-size:14px;">Répondre à ${prenom}</a>
        </div>
        <p style="text-align:center;margin-top:20px;font-size:11px;color:#857A61;">backtoenergy · programme 21 jours</p>
      </div>
    `,
  })

  return Response.json({ message })
}
