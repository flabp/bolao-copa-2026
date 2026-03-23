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

-- Public access policies (no auth required for simplicity)
CREATE POLICY "Anyone can read participants" ON participants FOR SELECT USING (true);
CREATE POLICY "Anyone can insert participants" ON participants FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update participants" ON participants FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete participants" ON participants FOR DELETE USING (true);

CREATE POLICY "Anyone can read predictions" ON predictions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert predictions" ON predictions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update predictions" ON predictions FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete predictions" ON predictions FOR DELETE USING (true);

CREATE POLICY "Anyone can read results" ON match_results FOR SELECT USING (true);
CREATE POLICY "Anyone can insert results" ON match_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update results" ON match_results FOR UPDATE USING (true);

CREATE POLICY "Anyone can read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Anyone can insert settings" ON settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update settings" ON settings FOR UPDATE USING (true);

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
