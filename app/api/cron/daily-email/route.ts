import { NextRequest, NextResponse } from "next/server"
import { createClient as createAdmin } from "@supabase/supabase-js"
import { resend, FROM } from "@/lib/resend"
import { dailyEmail, type DailyMeal } from "@/lib/email-templates"
import { PROGRAM, calcRawDay } from "@/data/program"
import type { MealFieldName } from "@/lib/supabase/types"

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://backtoenergy.fr"

const SEMAINES: Record<1 | 2 | 3, { nom: string; accent: string }> = {
  1: { nom: "Détox & Purification", accent: "#4E7A3C" },
  2: { nom: "Énergie & Vitalité", accent: "#E2A21E" },
  3: { nom: "Ancrage & Performance", accent: "#C2552A" },
}

const MEAL_SLOTS: { field: MealFieldName; slot: string }[] = [
  { field: "petit_dejeuner", slot: "Petit-déjeuner" },
  { field: "dejeuner", slot: "Déjeuner" },
  { field: "diner", slot: "Dîner" },
]

// Garde le premier segment de la phrase — c'est l'intitulé, pas la recette complète.
function firstClause(s: string | null, max = 70): string {
  if (!s) return ""
  const clause = s.split(/[,.;]/)[0].trim()
  return clause.length > max ? clause.slice(0, max - 1).trim() + "…" : clause
}

export async function GET(request: NextRequest) {
  if (process.env.CRON_SECRET) {
    const auth = request.headers.get("authorization")
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  const db = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: settings } = await db
    .from("coach_settings")
    .select("emails_enabled")
    .limit(1)
    .maybeSingle()

  if (settings && settings.emails_enabled === false) {
    return NextResponse.json({ ok: true, sent: 0, skipped: 0, failed: 0, disabled: true })
  }

  const { data: profiles } = await db
    .from("profiles")
    .select("id, email, prenom, start_date")
    .eq("role", "collaborateur")
    .not("start_date", "is", null)

  let sent = 0, skipped = 0, failed = 0

  for (const profile of profiles ?? []) {
    const jour = calcRawDay(profile.start_date)
    if (jour < 1 || jour > 21) { skipped++; continue }

    // Dédoublonnage : un seul envoi par (user, jour)
    const type = `daily_${jour}`
    const { error: insertErr } = await db.from("email_logs").insert({ user_id: profile.id, type })
    if (insertErr) { skipped++; continue }

    const { data: plan } = await db.from("meal_plans").select("*").eq("jour", jour).maybeSingle()
    if (!plan) {
      await db.from("email_logs").delete().eq("user_id", profile.id).eq("type", type)
      skipped++
      continue
    }

    const { data: overrides } = await db
      .from("user_meal_overrides")
      .select("field_name, override_value")
      .eq("user_id", profile.id)
      .eq("jour", jour)

    const overrideMap = Object.fromEntries((overrides ?? []).map((o) => [o.field_name, o.override_value]))
    const ajuste = MEAL_SLOTS.some(({ field }) => field in overrideMap)

    const meals: DailyMeal[] = MEAL_SLOTS
      .map(({ field, slot }) => {
        const raw = field in overrideMap ? overrideMap[field] : plan[field]
        return raw ? { slot, title: firstClause(raw) } : null
      })
      .filter((m): m is DailyMeal => m !== null)

    if (meals.length === 0) { skipped++; continue } // jour libre / week-end sans menu

    const MOMENT_LABEL = ["au réveil", "à midi", "le soir"]
    const preheader = meals.map((m, i) => `${m.title} ${MOMENT_LABEL[i] ?? ""}`.trim()).join(", ") + "."

    const semaine = SEMAINES[plan.semaine as 1 | 2 | 3] ?? SEMAINES[1]

    const html = dailyEmail({
      prenom: profile.prenom,
      jour,
      semaineNum: plan.semaine as 1 | 2 | 3,
      semaineNom: semaine.nom,
      accent: semaine.accent,
      photoUrl: null,
      motDuJour: PROGRAM[jour - 1]?.coachWord ?? "",
      meals,
      ajuste,
      urlApp: `${SITE}/jour`,
      urlPrefs: `${SITE}/profil`,
      preheader,
    })

    const subject = jour === 1
      ? "Jour 1 sur 21 — on lance ta première journée"
      : `Jour ${jour} sur 21 — ta journée est prête`

    const { error: sendError } = await resend.emails.send({
      from: FROM,
      to: profile.email,
      subject,
      html,
    })

    if (sendError) {
      await db.from("email_logs").delete().eq("user_id", profile.id).eq("type", type)
      console.error("[cron daily-email] resend error:", sendError)
      failed++
    } else {
      sent++
    }
  }

  return NextResponse.json({ ok: true, sent, skipped, failed })
}
