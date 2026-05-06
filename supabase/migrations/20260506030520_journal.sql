CREATE TABLE journal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  jour INT NOT NULL CHECK (jour BETWEEN 1 AND 21),
  activite TEXT,
  rituel_fait BOOLEAN DEFAULT FALSE,
  energie INT CHECK (energie BETWEEN 1 AND 5),
  humeur TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, jour)
);

ALTER TABLE journal ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own journal"
  ON journal USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
