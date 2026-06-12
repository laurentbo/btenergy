-- Table pour l'évolution du poids (visible par le coach, jamais affichée ailleurs dans l'app)
create table if not exists weight_logs (
  id           uuid primary key default gen_random_uuid(),
  coachee_id   uuid references auth.users not null,
  value        numeric(5,2) not null,
  day_number   int,
  logged_at    date not null default current_date,
  created_at   timestamptz not null default now()
);

-- Index pour les requêtes par coachee
create index if not exists weight_logs_coachee_idx on weight_logs(coachee_id, logged_at);
