ALTER TABLE program_overrides
  ADD COLUMN IF NOT EXISTS ritual_matin_override text,
  ADD COLUMN IF NOT EXISTS ritual_soir_override  text;
