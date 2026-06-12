-- Fix trigger: ne pas fixer program_start à today à la création du compte.
-- Le flow invite doit laisser program_start à NULL pour que l'utilisateur
-- arrive sur Jour 0 (bienvenue) et non Jour 1.

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  v_company companies%rowtype;
  v_code text := new.raw_user_meta_data->>'company_code';
begin
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
    null
  )
  on conflict (id) do nothing;

  return new;
end;
$$;
