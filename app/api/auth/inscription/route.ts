import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"
import { NextRequest, NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: "Email requis" }, { status: 400 })

  const { error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm` },
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await resend.emails.send({
    from: "Backtoenergy <bonjour@backtoenergy.fr>",
    to: email,
    subject: "Backtoenergy – ton programme est prêt",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#2B2D2E;background:#F8F7F4;padding:32px;border-radius:12px">
        <h1 style="color:#2A9D8F;font-size:22px;margin-bottom:8px">Force tranquille.</h1>
        <p style="font-size:16px;line-height:1.6">Ton programme Backtoenergy – 21 jours – est prêt.</p>
        <hr style="border:1px solid #E9C46A;margin:24px 0"/>
        <h2 style="font-size:16px;color:#2B2D2E">Les 3 étapes :</h2>
        <ul style="line-height:2;padding-left:20px">
          <li><strong>S1 (J1-7)</strong> – Détox &amp; Purification · Le corps évacue</li>
          <li><strong>S2 (J8-14)</strong> – Énergie &amp; Vitalité · L'énergie remonte</li>
          <li><strong>S3 (J15-21)</strong> – Ancrage &amp; Performance · Habitudes ancrées</li>
        </ul>
        <hr style="border:1px solid #E9C46A;margin:24px 0"/>
        <p><strong>Ce qu'on retire temporairement :</strong> blé, lait de vache, sucre raffiné.</p>
        <p><strong>Rituel non négociable :</strong> 30 min d'activité physique par jour.</p>
        <p>Ton premier jour commence quand tu veux.</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/courses"
           style="display:inline-block;margin-top:16px;padding:12px 24px;background:#2A9D8F;color:white;border-radius:8px;text-decoration:none;font-weight:600">
          Voir la liste de courses →
        </a>
        <p style="font-size:12px;color:#888;margin-top:32px">
          Le lien de connexion t'a été envoyé séparément par Supabase.
          Il est valable 24h.
        </p>
      </div>
    `,
  })

  return NextResponse.json({ success: true })
}
