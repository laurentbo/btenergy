-- Table de déduplication des emails transactionnels
CREATE TABLE IF NOT EXISTS email_logs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade,
  type       text not null,
  created_at timestamptz default now(),
  unique (user_id, type)
);

ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
-- Seul le service role écrit dans cette table ; les users peuvent lire leurs propres entrées
CREATE POLICY "email_logs_select_own" ON email_logs FOR SELECT USING (user_id = auth.uid());
