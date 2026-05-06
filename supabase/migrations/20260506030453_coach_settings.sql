CREATE TABLE coach_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exclusions JSONB DEFAULT '{"blé":true,"lait_vache":true,"sucre_raffiné":true,"ail":false,"fenouil":false,"oignon":false,"poireau":false,"oeuf":false,"soja":false,"levure":false,"autres":[]}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE coach_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coach only" ON coach_settings
  USING (auth.jwt() ->> 'role' = 'service_role');

INSERT INTO coach_settings (exclusions) VALUES (
  '{"blé":true,"lait_vache":true,"sucre_raffiné":true,"ail":false,"fenouil":false,"oignon":false,"poireau":false,"oeuf":false,"soja":false,"levure":false,"autres":[]}'
);
