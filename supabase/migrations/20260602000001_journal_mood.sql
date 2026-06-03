-- Lot 2 : MoodPicker — ajout mood_score à journal
ALTER TABLE journal
  ADD COLUMN IF NOT EXISTS mood_score SMALLINT
  CHECK (mood_score BETWEEN 1 AND 4);
