-- Phase 4: Search Optimization (Postgres Full Text Search with pg_trgm for Tamil support)

-- 1. Enable the pg_trgm extension
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Create GIN indexes for fast partial matching
CREATE INDEX IF NOT EXISTS idx_resources_title_trgm ON resources USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_resources_desc_trgm ON resources USING gin (description gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_articles_title_trgm ON articles USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_question_papers_title_trgm ON question_papers USING gin (title gin_trgm_ops);

-- We don't drop ilike, ilike automatically uses pg_trgm indexes under the hood in PostgreSQL!
