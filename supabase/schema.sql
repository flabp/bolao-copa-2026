-- Bolão Copa do Mundo 2026 - Database Schema
-- Run this in the Supabase SQL Editor

-- Participants table
CREATE TABLE IF NOT EXISTS participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  avatar_color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Predictions table
CREATE TABLE IF NOT EXISTS predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  match_id TEXT NOT NULL,
  home_score INTEGER NOT NULL CHECK (home_score >= 0),
  away_score INTEGER NOT NULL CHECK (away_score >= 0),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant_id, match_id)
);

-- Match results table (admin updates)
CREATE TABLE IF NOT EXISTS match_results (
  match_id TEXT PRIMARY KEY,
  home_score INTEGER NOT NULL CHECK (home_score >= 0),
  away_score INTEGER NOT NULL CHECK (away_score >= 0),
  home_penalties INTEGER,
  away_penalties INTEGER,
  status TEXT DEFAULT 'finished' CHECK (status IN ('scheduled', 'in_progress', 'finished')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Secure RLS policies: Read public, Write only via service_role (server API routes)

-- Participants: public read, service_role write
CREATE POLICY "select_participants" ON participants FOR SELECT USING (true);
CREATE POLICY "service_insert_participants" ON participants FOR INSERT
  WITH CHECK (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');
CREATE POLICY "service_update_participants" ON participants FOR UPDATE
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');
CREATE POLICY "service_delete_participants" ON participants FOR DELETE
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- Predictions: public read, service_role write
CREATE POLICY "select_predictions" ON predictions FOR SELECT USING (true);
CREATE POLICY "service_insert_predictions" ON predictions FOR INSERT
  WITH CHECK (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');
CREATE POLICY "service_update_predictions" ON predictions FOR UPDATE
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');
CREATE POLICY "service_delete_predictions" ON predictions FOR DELETE
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- Match Results: public read, service_role write
CREATE POLICY "select_match_results" ON match_results FOR SELECT USING (true);
CREATE POLICY "service_insert_match_results" ON match_results FOR INSERT
  WITH CHECK (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');
CREATE POLICY "service_update_match_results" ON match_results FOR UPDATE
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- Settings: public read, service_role write
CREATE POLICY "select_settings" ON settings FOR SELECT USING (true);
CREATE POLICY "service_insert_settings" ON settings FOR INSERT
  WITH CHECK (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');
CREATE POLICY "service_update_settings" ON settings FOR UPDATE
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('scoring', '{"exactScore": 10, "correctResult": 5, "correctGoalDiff": 3, "oneTeamCorrect": 1, "knockoutMultiplier": 1.5, "lateKnockoutMultiplier": 2}'),
  ('pool_name', '"Bolão da Copa 2026"'),
  ('admin_password', '"admin123"')
ON CONFLICT (key) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_predictions_participant ON predictions(participant_id);
CREATE INDEX IF NOT EXISTS idx_predictions_match ON predictions(match_id);
CREATE INDEX IF NOT EXISTS idx_match_results_status ON match_results(status);
