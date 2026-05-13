-- ── meal_plans : plan de base des 21 jours, éditable par le coach ────────────
CREATE TABLE IF NOT EXISTS meal_plans (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  jour                integer     NOT NULL UNIQUE CHECK (jour BETWEEN 1 AND 21),
  semaine             integer     NOT NULL CHECK (semaine BETWEEN 1 AND 3),
  nom_jour            text        NOT NULL,
  is_weekend          boolean     NOT NULL DEFAULT false,
  petit_dejeuner      text,
  collation_matin     text,
  dejeuner            text,
  collation_apres_midi text,
  diner               text,
  astuce_umami        text,
  updated_at          timestamptz DEFAULT now(),
  updated_by          uuid        REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

-- Tous les utilisateurs authentifiés peuvent lire
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'meal_plans' AND policyname = 'meal_plans_read') THEN
    CREATE POLICY meal_plans_read ON meal_plans FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- Seuls coach et admin peuvent modifier
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'meal_plans' AND policyname = 'meal_plans_coach_write') THEN
    CREATE POLICY meal_plans_coach_write ON meal_plans FOR ALL USING (
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('coach', 'admin'))
    );
  END IF;
END $$;

-- ── user_meal_overrides : adaptations par utilisateur ────────────────────────
CREATE TABLE IF NOT EXISTS user_meal_overrides (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  jour           integer     NOT NULL CHECK (jour BETWEEN 1 AND 21),
  field_name     text        NOT NULL CHECK (field_name IN (
                   'petit_dejeuner','collation_matin','dejeuner',
                   'collation_apres_midi','diner','astuce_umami')),
  override_value text,
  reason         text,
  created_at     timestamptz DEFAULT now(),
  created_by     uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  UNIQUE (user_id, jour, field_name)
);

ALTER TABLE user_meal_overrides ENABLE ROW LEVEL SECURITY;

-- L'utilisateur concerné peut lire ses propres overrides
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_meal_overrides' AND policyname = 'overrides_user_read') THEN
    CREATE POLICY overrides_user_read ON user_meal_overrides FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

-- Coach/admin peut tout faire
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_meal_overrides' AND policyname = 'overrides_coach_all') THEN
    CREATE POLICY overrides_coach_all ON user_meal_overrides FOR ALL USING (
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('coach', 'admin'))
    );
  END IF;
END $$;

-- ── user_food_preferences : exclusions globales par utilisateur ───────────────
CREATE TABLE IF NOT EXISTS user_food_preferences (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ingredient  text        NOT NULL,
  type        text        NOT NULL CHECK (type IN ('dislike', 'allergy', 'intolerance')),
  note        text,
  created_at  timestamptz DEFAULT now(),
  UNIQUE (user_id, ingredient)
);

ALTER TABLE user_food_preferences ENABLE ROW LEVEL SECURITY;

-- L'utilisateur peut lire et insérer ses propres préférences
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_food_preferences' AND policyname = 'prefs_user_read') THEN
    CREATE POLICY prefs_user_read ON user_food_preferences FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_food_preferences' AND policyname = 'prefs_user_insert') THEN
    CREATE POLICY prefs_user_insert ON user_food_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Coach/admin peut tout faire
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_food_preferences' AND policyname = 'prefs_coach_all') THEN
    CREATE POLICY prefs_coach_all ON user_food_preferences FOR ALL USING (
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('coach', 'admin'))
    );
  END IF;
END $$;
