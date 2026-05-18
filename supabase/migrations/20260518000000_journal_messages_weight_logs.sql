-- ──────────────────────────────────────────────────────────────────────────────
-- Back to Energy v2 — Journal partagé thread + suivi poids
-- ──────────────────────────────────────────────────────────────────────────────

-- ── journal_messages : fil de discussion coaché ↔ coach ──────────────────────
-- Remplace le modèle structuré (energie/humeur/etc.) par un thread libre.
-- Les entrées existantes dans journal_entries sont migrées ci-dessous.

create table journal_messages (
  id          uuid primary key default uuid_generate_v4(),
  coachee_id  uuid not null references profiles(id) on delete cascade,
  author      text not null check (author in ('coachee', 'coach')),
  body        text,
  photo_url   text,
  is_question boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Index pour récupérer le fil chronologique d'un coaché
create index journal_messages_coachee_created
  on journal_messages (coachee_id, created_at asc);

alter table journal_messages enable row level security;

-- Coaché : lecture + écriture de ses propres messages
create policy "jm_coachee_all" on journal_messages
  for all using (auth.uid() = coachee_id);

-- Coach : lecture des messages de ses coachés
create policy "jm_coach_read" on journal_messages
  for select using (
    exists (
      select 1 from profiles p
      where p.id = journal_messages.coachee_id
        and p.coach_id = auth.uid()
    )
  );

-- Coach : insertion de ses réponses (author = 'coach')
create policy "jm_coach_insert" on journal_messages
  for insert with check (
    author = 'coach'
    and exists (
      select 1 from profiles p
      where p.id = journal_messages.coachee_id
        and p.coach_id = auth.uid()
    )
  );

-- Migrer les journal_entries.note existants vers journal_messages ──────────────
-- Seules les lignes avec note non vide sont migrées.
insert into journal_messages (coachee_id, author, body, created_at)
select
  user_id,
  'coachee',
  note,
  created_at
from journal_entries
where note is not null and trim(note) <> ''
on conflict do nothing;


-- ── weight_logs : historique de poids ────────────────────────────────────────

create table weight_logs (
  id          uuid primary key default uuid_generate_v4(),
  coachee_id  uuid not null references profiles(id) on delete cascade,
  day_number  int  not null check (day_number between 0 and 21),
  kg          numeric(4,1) not null,
  created_at  timestamptz not null default now(),
  unique (coachee_id, day_number)
);

alter table weight_logs enable row level security;

-- Coaché : lecture + écriture de ses propres pesées
create policy "wl_coachee_all" on weight_logs
  for all using (auth.uid() = coachee_id);

-- Coach : lecture des pesées de ses coachés
create policy "wl_coach_read" on weight_logs
  for select using (
    exists (
      select 1 from profiles p
      where p.id = weight_logs.coachee_id
        and p.coach_id = auth.uid()
    )
  );

-- Insérer le poids de départ depuis profiles.poids si disponible ──────────────
insert into weight_logs (coachee_id, day_number, kg, created_at)
select id, 0, poids, created_at
from profiles
where poids is not null
on conflict do nothing;
