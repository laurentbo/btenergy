export type Role = "collaborateur" | "coach" | "admin"

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          prenom: string
          role: Role
          genre: "homme" | "femme" | null
          age: number | null
          taille: number | null
          poids: number | null
          company_id: string | null
          coach_id: string | null
          current_day: number
          program_start: string | null
          start_date: string | null
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at">
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>
      }
      companies: {
        Row: {
          id: string
          name: string
          code: string
          coach_id: string
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["companies"]["Row"], "created_at">
        Update: Partial<Database["public"]["Tables"]["companies"]["Insert"]>
      }
      journal_entries: {
        Row: {
          id: string
          user_id: string
          day: number
          energie: number
          humeur: number
          hydratation: number
          sommeil: number
          note: string | null
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["journal_entries"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["journal_entries"]["Insert"]>
      }
      meal_logs: {
        Row: {
          id: string
          user_id: string
          day: number
          moment: string
          items: string[]
          note: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["meal_logs"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Database["public"]["Tables"]["meal_logs"]["Insert"]>
      }
      email_logs: {
        Row: {
          id: string
          user_id: string
          type: string
          sent_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["email_logs"]["Row"], "id" | "sent_at">
        Update: Partial<Database["public"]["Tables"]["email_logs"]["Insert"]>
      }
      program_overrides: {
        Row: {
          id: string
          collaborateur_id: string
          coach_id: string | null
          day: number
          coach_note: string | null
          tip_override: string | null
          intention_override: string | null
          meal_overrides: Record<string, string[]> | null
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["program_overrides"]["Row"], "id" | "updated_at">
        Update: Partial<Database["public"]["Tables"]["program_overrides"]["Insert"]>
      }
      coach_settings: {
        Row: {
          id: string
          exclusions: Record<string, boolean | string[]>
          emails_enabled: boolean
          updated_at: string
        }
        Insert: { exclusions?: Record<string, boolean | string[]>; emails_enabled?: boolean }
        Update: { exclusions?: Record<string, boolean | string[]>; emails_enabled?: boolean; updated_at?: string }
      }
      journal: {
        Row: {
          id: string
          user_id: string
          jour: number
          activite: string | null
          rituel_fait: boolean
          energie: number | null
          humeur: string | null
          mood_score: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          jour: number
          activite?: string | null
          rituel_fait?: boolean
          energie?: number | null
          humeur?: string | null
          mood_score?: number | null
          updated_at?: string
        }
        Update: {
          activite?: string | null
          rituel_fait?: boolean
          energie?: number | null
          humeur?: string | null
          mood_score?: number | null
          updated_at?: string
        }
      }
      meal_plans: {
        Row: {
          id: string
          jour: number
          semaine: number
          nom_jour: string
          is_weekend: boolean
          petit_dejeuner: string | null
          dejeuner: string | null
          diner: string | null
          astuce_umami: string | null
          snack_note: string | null
          /** @deprecated renommé lors de la migration 3-repas — données conservées */
          collation_matin_archive: string | null
          /** @deprecated renommé lors de la migration 3-repas — données conservées */
          collation_apres_midi_archive: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: Omit<Database["public"]["Tables"]["meal_plans"]["Row"], "id" | "updated_at">
        Update: Partial<Database["public"]["Tables"]["meal_plans"]["Insert"]>
      }
      user_meal_overrides: {
        Row: {
          id: string
          user_id: string
          jour: number
          field_name: "petit_dejeuner" | "dejeuner" | "diner" | "astuce_umami" | "snack_note"
          override_value: string | null
          reason: string | null
          created_at: string
          created_by: string | null
        }
        Insert: Omit<Database["public"]["Tables"]["user_meal_overrides"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["user_meal_overrides"]["Insert"]>
      }
      user_food_preferences: {
        Row: {
          id: string
          user_id: string
          ingredient: string
          type: "dislike" | "allergy" | "intolerance"
          note: string | null
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["user_food_preferences"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["user_food_preferences"]["Insert"]>
      }
    }  // end Tables
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: { role: Role }
  }
}

export type MealPlan = Database["public"]["Tables"]["meal_plans"]["Row"]
export type MealOverride = Database["public"]["Tables"]["user_meal_overrides"]["Row"]
export type FoodPreference = Database["public"]["Tables"]["user_food_preferences"]["Row"]
export type MealFieldName = MealOverride["field_name"]

export type ResolvedDayMenu = {
  jour: number
  semaine: number
  nom_jour: string
  is_weekend: boolean
  petit_dejeuner: string | null
  dejeuner: string | null
  diner: string | null
  astuce_umami: string | null
  snack_note: string | null
  overriddenFields: MealFieldName[]
}
