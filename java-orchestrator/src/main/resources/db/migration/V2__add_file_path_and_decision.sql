-- Flyway Migration V2: Add file path, final decision and risk score columns to tasks
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS file_path VARCHAR(500);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS final_decision VARCHAR(100);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS risk_score DOUBLE PRECISION;
