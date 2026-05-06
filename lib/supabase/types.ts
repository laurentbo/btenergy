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
          updated_at: string
        }
        Insert: { exclusions?: Record<string, boolean | string[]> }
        Update: { exclusions?: Record<string, boolean | string[]>; updated_at?: string }
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
          updated_at?: string
        }
        Update: {
          activite?: string | null
          rituel_fait?: boolean
          energie?: number | null
          humeur?: string | null
          updated_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: { role: Role }
  }
}
