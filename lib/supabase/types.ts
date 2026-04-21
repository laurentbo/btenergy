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
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: { role: Role }
  }
}
