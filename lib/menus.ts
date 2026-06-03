import { createClient } from "@/lib/supabase/client"
import type { MealPlan, MealFieldName, ResolvedDayMenu, FoodPreference } from "@/lib/supabase/types"

// ── Base plan ─────────────────────────────────────────────────────────────────

export async function fetchAllMealPlans(): Promise<MealPlan[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("meal_plans")
    .select("*")
    .order("jour")
  if (error) throw error
  return data ?? []
}

export async function updateMealPlanField(
  jour: number,
  field: MealFieldName | "nom_jour",
  value: string,
  updatedBy: string
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from("meal_plans")
    .update({ [field]: value, updated_at: new Date().toISOString(), updated_by: updatedBy })
    .eq("jour", jour)
  if (error) throw error
}

// ── User overrides ─────────────────────────────────────────────────────────────

export async function fetchUserOverrides(userId: string, jour?: number) {
  const supabase = createClient()
  let query = supabase
    .from("user_meal_overrides")
    .select("*")
    .eq("user_id", userId)
  if (jour !== undefined) query = query.eq("jour", jour)
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function upsertUserOverride(
  userId: string,
  jour: number,
  field: MealFieldName,
  value: string | null,
  reason: string | null,
  createdBy: string
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from("user_meal_overrides")
    .upsert(
      { user_id: userId, jour, field_name: field, override_value: value, reason, created_by: createdBy },
      { onConflict: "user_id,jour,field_name" }
    )
  if (error) throw error
}

export async function deleteUserOverride(
  userId: string,
  jour: number,
  field: MealFieldName
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from("user_meal_overrides")
    .delete()
    .eq("user_id", userId)
    .eq("jour", jour)
    .eq("field_name", field)
  if (error) throw error
}

// ── Resolved menu (base + overrides merged) ───────────────────────────────────

export async function fetchResolvedDayMenu(userId: string, jour: number): Promise<ResolvedDayMenu | null> {
  const supabase = createClient()
  const [{ data: plan }, { data: overrides }] = await Promise.all([
    supabase.from("meal_plans").select("*").eq("jour", jour).maybeSingle(),
    supabase.from("user_meal_overrides").select("*").eq("user_id", userId).eq("jour", jour),
  ])
  if (!plan) return null

  const overrideMap = Object.fromEntries(
    (overrides ?? []).map((o) => [o.field_name, o.override_value])
  )
  const overriddenFields = (overrides ?? []).map((o) => o.field_name as MealFieldName)
  const fields: MealFieldName[] = [
    "petit_dejeuner", "dejeuner", "diner", "astuce_umami", "snack_note",
  ]

  const resolved: Record<string, string | null> = {}
  for (const f of fields) {
    resolved[f] = f in overrideMap ? overrideMap[f] : plan[f]
  }

  return {
    jour: plan.jour,
    semaine: plan.semaine,
    nom_jour: plan.nom_jour,
    is_weekend: plan.is_weekend,
    ...resolved,
    overriddenFields,
  } as ResolvedDayMenu
}

// ── Food preferences ──────────────────────────────────────────────────────────

export async function fetchFoodPreferences(userId: string): Promise<FoodPreference[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("user_food_preferences")
    .select("*")
    .eq("user_id", userId)
    .order("ingredient")
  if (error) throw error
  return data ?? []
}

export async function addFoodPreference(
  userId: string,
  ingredient: string,
  type: FoodPreference["type"],
  note?: string
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from("user_food_preferences")
    .upsert({ user_id: userId, ingredient: ingredient.trim().toLowerCase(), type, note: note ?? null }, { onConflict: "user_id,ingredient" })
  if (error) throw error
}

export async function deleteFoodPreference(userId: string, ingredient: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from("user_food_preferences")
    .delete()
    .eq("user_id", userId)
    .eq("ingredient", ingredient)
  if (error) throw error
}
