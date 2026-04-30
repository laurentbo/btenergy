-- ──────────────────────────────────────────────────────────────
-- BTENERGY — Schéma Supabase
-- À exécuter dans SQL Editor > New Query sur votre projet Supabase
-- ──────────────────────────────────────────────────────────────

-- 1. Extension UUID
create extension if not exists "uuid-ossp";

-- 2. Type rôle
create type role as enum ('collaborateur', 'coach', 'admin');

-- 3. Companies
create table companies (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  code       text not null unique,  -- code d'invitation ex: "CORP2024"
  coach_id   uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

-- 4. Profiles (extension de auth.users)
create table profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  email          text not null,
  prenom         text,
  role           role not null default 'collaborateur',
  genre          text check (genre in ('homme', 'femme')),
  age            int,
  taille         int,   -- cm
  poids          numeric(5,1),  -- kg
  company_id     uuid references companies(id) on delete set null,
  coach_id       uuid references auth.users(id) on delete set null,
  current_day    int not null default 1,
  program_start  date,
  created_at     timestamptz default now()
);

-- 5. Journal entries
create table journal_entries (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references profiles(id) on delete cascade,
  day          int not null,
  energie      int not null check (energie between 1 and 10),
  humeur       int not null check (humeur between 1 and 10),
  hydratation  int not null check (hydratation between 1 and 10),
  sommeil      int not null check (sommeil between 1 and 10),
  note         text,
  created_at   timestamptz default now(),
  unique (user_id, day)  -- un journal par jour
);

-- ──────────────────────────────────────────────────────────────
-- Row Level Security
-- ──────────────────────────────────────────────────────────────

alter table profiles       enable row level security;
alter table companies      enable row level security;
alter table journal_entries enable row level security;

-- Profiles : lecture propre + coach voit ses collabs
create policy "profiles_self_read" on profiles
  for select using (auth.uid() = id);

create policy "profiles_coach_read" on profiles
  for select using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role in ('coach','admin')
        and profiles.coach_id = auth.uid()
    )
  );

create policy "profiles_self_write" on profiles
  for all using (auth.uid() = id);

-- Companies : coach voit les siennes
create policy "companies_coach_read" on companies
  for select using (coach_id = auth.uid());

create policy "companies_public_code_read" on companies
  for select using (true);  -- pour valider le code entreprise à l'inscription

-- Journal : propre + coach voit ses collabs
create policy "journal_self" on journal_entries
  for all using (auth.uid() = user_id);

create policy "journal_coach_read" on journal_entries
  for select using (
    exists (
      select 1 from profiles p
      where p.id = journal_entries.user_id
        and p.coach_id = auth.uid()
    )
  );

-- ──────────────────────────────────────────────────────────────
-- Trigger : création profil à l'inscription
-- ──────────────────────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  v_company companies%rowtype;
  v_code text := new.raw_user_meta_data->>'company_code';
begin
  -- Cherche la company via le code
  if v_code is not null then
    select * into v_company from companies where code = upper(v_code);
  end if;

  insert into public.profiles (id, email, role, company_id, coach_id, program_start)
  values (
    new.id,
    new.email,
    'collaborateur',
    v_company.id,
    v_company.coach_id,
    current_date
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ──────────────────────────────────────────────────────────────
-- Données de test (à adapter)
-- ──────────────────────────────────────────────────────────────

-- Après avoir créé votre compte coach via l'interface Supabase Auth,
-- mettez à jour son rôle :
-- update profiles set role = 'coach' where email = 'votre@email.com';

-- Créer une entreprise avec un code :
-- insert into companies (name, code, coach_id)
-- values ('Acme Corp', 'ACME2024', 'VOTRE_USER_ID');

-- ──────────────────────────────────────────────────────────────
-- meal_logs : modifications personnelles de la coachée
-- ──────────────────────────────────────────────────────────────
create table meal_logs (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references profiles(id) on delete cascade,
  day        int not null check (day between 1 and 21),
  moment     text not null check (moment in ('matin','midi','après-midi','soir')),
  items      text[] not null,
  note       text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, day, moment)
);

alter table meal_logs enable row level security;

create policy "meal_logs_self" on meal_logs
  for all using (auth.uid() = user_id);

create policy "meal_logs_coach_read" on meal_logs
  for select using (
    exists (
      select 1 from profiles p
      where p.id = meal_logs.user_id
        and p.coach_id = auth.uid()
    )
  );

-- ──────────────────────────────────────────────────────────────
-- email_logs : dédoublonnage des emails automatiques
-- ──────────────────────────────────────────────────────────────
create table email_logs (
  id       uuid primary key default uuid_generate_v4(),
  user_id  uuid references profiles(id) on delete cascade,
  type     text not null,  -- 'welcome' | 'step_1' … 'step_21'
  sent_at  timestamptz default now(),
  unique(user_id, type)
);

alter table email_logs enable row level security;

-- Seul le service_role écrit dans cette table (API routes)
create policy "email_logs_service_only" on email_logs
  for all using (false);

-- ──────────────────────────────────────────────────────────────
-- program_overrides : personnalisations du coach par collaborateur/jour
-- ──────────────────────────────────────────────────────────────
create table program_overrides (
  id                 uuid primary key default uuid_generate_v4(),
  collaborateur_id   uuid references profiles(id) on delete cascade,
  coach_id           uuid references auth.users(id) on delete set null,
  day                int not null check (day between 1 and 21),
  coach_note         text,
  tip_override       text,
  intention_override text,
  meal_overrides     jsonb,
  updated_at         timestamptz default now(),
  unique(collaborateur_id, day)
);

alter table program_overrides enable row level security;

-- Collaborateur : lecture de ses propres overrides
create policy "overrides_collab_read" on program_overrides
  for select using (auth.uid() = collaborateur_id);

-- Coach : lecture de ses overrides (via coach_id)
create policy "overrides_coach_read" on program_overrides
  for select using (coach_id = auth.uid());

-- Coach : insertion (doit poser son propre coach_id)
create policy "overrides_coach_insert" on program_overrides
  for insert with check (coach_id = auth.uid());

-- Coach : mise à jour de ses propres overrides
create policy "overrides_coach_update" on program_overrides
  for update using (coach_id = auth.uid());

-- Coach : suppression de ses propres overrides
create policy "overrides_coach_delete" on program_overrides
  for delete using (coach_id = auth.uid());
