-- ── Lot 1 : migration 5 repas → 3 repas + encas ──────────────────────────────
-- Non-destructif : les colonnes collation sont renommées (données conservées).
-- Un simple RENAME suffit — réversible par un nouveau RENAME si besoin.

-- Archiver les collations (pas de DROP)
ALTER TABLE meal_plans
  RENAME COLUMN collation_matin     TO collation_matin_archive;

ALTER TABLE meal_plans
  RENAME COLUMN collation_apres_midi TO collation_apres_midi_archive;

-- Ajouter la note encas (niveau jour, optionnelle)
ALTER TABLE meal_plans
  ADD COLUMN IF NOT EXISTS snack_note TEXT;

-- Mettre à jour la contrainte CHECK sur user_meal_overrides
-- Les anciens field_name de collation ne sont plus des valeurs valides.
-- On remplace la contrainte sans supprimer les lignes existantes.
ALTER TABLE user_meal_overrides
  DROP CONSTRAINT IF EXISTS user_meal_overrides_field_name_check;

ALTER TABLE user_meal_overrides
  ADD CONSTRAINT user_meal_overrides_field_name_check
  CHECK (field_name IN ('petit_dejeuner', 'dejeuner', 'diner', 'astuce_umami', 'snack_note'));
