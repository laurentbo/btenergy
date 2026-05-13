CREATE TABLE IF NOT EXISTS questions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  coach_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  day integer NOT NULL DEFAULT 1,
  text text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  answer text,
  answered_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'questions' AND policyname = 'q_user_read') THEN
    CREATE POLICY q_user_read ON questions FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'questions' AND policyname = 'q_user_insert') THEN
    CREATE POLICY q_user_insert ON questions FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'questions' AND policyname = 'q_coach_all') THEN
    CREATE POLICY q_coach_all ON questions FOR ALL USING (
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('coach','admin'))
    );
  END IF;
END $$;
