-- Ajouter current_day à profiles si absent
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_day integer DEFAULT 1;

-- Créer journal_entries si absente (déjà créée — cette migration ajoute les colonnes manquantes)
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  day integer NOT NULL,
  energie integer,
  humeur integer,
  hydratation integer,
  sommeil integer,
  note text,
  created_at timestamptz DEFAULT now()
);

-- RLS (idempotente)
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'journal_entries'
    AND policyname = 'Users can manage own journal entries'
  ) THEN
    CREATE POLICY "Users can manage own journal entries"
      ON public.journal_entries
      FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;
