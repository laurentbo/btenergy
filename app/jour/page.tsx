import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { calcCurrentDay, hasProgramStarted } from "@/data/program"
import { JourClient } from "./JourClient"

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

  return <JourClient initialDay={day} prenom={prenom} />
}
