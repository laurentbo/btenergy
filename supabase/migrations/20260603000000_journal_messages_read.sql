-- Lot 3 : chat coach — colonnes read + policy admin
ALTER TABLE journal_messages
  ADD COLUMN IF NOT EXISTS read_by_coach BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS read_by_user  BOOLEAN NOT NULL DEFAULT FALSE;

CREATE POLICY IF NOT EXISTS "jm_admin_all" ON journal_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );
