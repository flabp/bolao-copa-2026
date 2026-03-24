-- ============================================
-- MIGRATION: Segurança - RLS Restritivo
-- Executar no Supabase SQL Editor
-- ============================================

-- Adicionar colunas se não existem (idempotente)
DO $$ BEGIN
  ALTER TABLE participants ADD COLUMN IF NOT EXISTS password_code TEXT NOT NULL DEFAULT '';
  ALTER TABLE participants ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Adicionar constraint de score máximo
ALTER TABLE predictions DROP CONSTRAINT IF EXISTS predictions_home_score_max;
ALTER TABLE predictions ADD CONSTRAINT predictions_home_score_max CHECK (home_score >= 0 AND home_score <= 99);
ALTER TABLE predictions DROP CONSTRAINT IF EXISTS predictions_away_score_max;
ALTER TABLE predictions ADD CONSTRAINT predictions_away_score_max CHECK (away_score >= 0 AND away_score <= 99);

-- ============================================
-- REMOVER POLICIES PERMISSIVAS ANTIGAS
-- ============================================

-- Participants
DROP POLICY IF EXISTS "Anyone can read participants" ON participants;
DROP POLICY IF EXISTS "Anyone can insert participants" ON participants;
DROP POLICY IF EXISTS "Anyone can update participants" ON participants;
DROP POLICY IF EXISTS "Anyone can delete participants" ON participants;

-- Predictions
DROP POLICY IF EXISTS "Anyone can read predictions" ON predictions;
DROP POLICY IF EXISTS "Anyone can insert predictions" ON predictions;
DROP POLICY IF EXISTS "Anyone can update predictions" ON predictions;
DROP POLICY IF EXISTS "Anyone can delete predictions" ON predictions;

-- Match Results
DROP POLICY IF EXISTS "Anyone can read results" ON match_results;
DROP POLICY IF EXISTS "Anyone can insert results" ON match_results;
DROP POLICY IF EXISTS "Anyone can update results" ON match_results;

-- Settings
DROP POLICY IF EXISTS "Anyone can read settings" ON settings;
DROP POLICY IF EXISTS "Anyone can insert settings" ON settings;
DROP POLICY IF EXISTS "Anyone can update settings" ON settings;

-- ============================================
-- NOVAS POLICIES RESTRITIVAS
-- ============================================

-- PARTICIPANTS: Leitura pública (nomes no ranking), escrita apenas via service role
CREATE POLICY "select_participants" ON participants FOR SELECT USING (true);
-- INSERT/UPDATE/DELETE só funciona via service_role key (API routes do servidor)
-- O anon key NÃO consegue inserir/alterar/deletar
CREATE POLICY "service_insert_participants" ON participants FOR INSERT
  WITH CHECK (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');
CREATE POLICY "service_update_participants" ON participants FOR UPDATE
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');
CREATE POLICY "service_delete_participants" ON participants FOR DELETE
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- PREDICTIONS: Leitura pública (ranking), escrita apenas via service role
CREATE POLICY "select_predictions" ON predictions FOR SELECT USING (true);
CREATE POLICY "service_insert_predictions" ON predictions FOR INSERT
  WITH CHECK (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');
CREATE POLICY "service_update_predictions" ON predictions FOR UPDATE
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');
CREATE POLICY "service_delete_predictions" ON predictions FOR DELETE
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- MATCH RESULTS: Leitura pública, escrita apenas via service role
CREATE POLICY "select_match_results" ON match_results FOR SELECT USING (true);
CREATE POLICY "service_insert_match_results" ON match_results FOR INSERT
  WITH CHECK (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');
CREATE POLICY "service_update_match_results" ON match_results FOR UPDATE
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- SETTINGS: Leitura pública, escrita apenas via service role
CREATE POLICY "select_settings" ON settings FOR SELECT USING (true);
CREATE POLICY "service_insert_settings" ON settings FOR INSERT
  WITH CHECK (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');
CREATE POLICY "service_update_settings" ON settings FOR UPDATE
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- ============================================
-- REMOVER SENHA ADMIN PADRÃO DO SETTINGS
-- ============================================
DELETE FROM settings WHERE key = 'admin_password';
