import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/service"
import { redirect } from "next/navigation"
import { calcCurrentDay, hasProgramStarted } from "@/data/program"
import { JourClient, type DayOverride } from "./JourClient"

// Résolu côté serveur avant le premier rendu : la page ne doit jamais
// afficher un jour qui n'est pas celui de l'utilisateur.
export default async function JourPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/bienvenue")

  const { data: profile } = await supabase
    .from("profiles").select("prenom, start_date").eq("id", user.id).maybeSingle()
  if (!hasProgramStarted(profile?.start_date)) redirect("/bienvenue")

  const p = profile?.prenom
  const prenom = p ? p.charAt(0).toUpperCase() + p.slice(1).toLowerCase() : null
  // dayIndex > 21 clampé à 21 — écran "programme terminé" à créer (TODO)
  const day = calcCurrentDay(profile?.start_date)

  // Personnalisations du coach (service client : le collaborateur lit ses propres overrides)
  const { data: rows } = await createServiceClient()
    .from("program_overrides")
    .select("day, coach_note, meal_overrides")
    .eq("collaborateur_id", user.id)
  const overrides: Record<number, DayOverride> = {}
  for (const r of rows ?? []) {
    overrides[r.day] = { coach_note: r.coach_note, meal_overrides: r.meal_overrides }
  }

  return <JourClient initialDay={day} prenom={prenom} overrides={overrides} />
}
