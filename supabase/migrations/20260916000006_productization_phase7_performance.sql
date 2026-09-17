-- Phase 7: Performance Indexing

-- 1. Composite indexes for Homepage buckets (Status + Sort Order)
CREATE INDEX IF NOT EXISTS idx_resources_status_created_at ON resources(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_status_views_count ON resources(status, views_count DESC);
CREATE INDEX IF NOT EXISTS idx_question_papers_status_created_at ON question_papers(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_status_published_at ON articles(status, published_at DESC);

-- 2. Composite indexes for Taxonomy Landing Pages (Filtering + Sort)
-- When a user visits /6th-standard, it filters by standard_id and sorts by created_at
CREATE INDEX IF NOT EXISTS idx_resources_standard_created ON resources(standard_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_subject_created ON resources(subject_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_type_created ON resources(resource_type_id, status, created_at DESC);

-- 3. Taxonomy slugs (Critical for [...slug] router resolving)
CREATE UNIQUE INDEX IF NOT EXISTS idx_standards_slug ON standards(slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_subjects_slug ON subjects(slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_resource_types_slug ON resource_types(slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_exam_types_slug ON exam_types(slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug);
