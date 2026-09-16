-- 1. Comments and View Tracking (from p3_features.sql)
ALTER TABLE resources ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;
ALTER TABLE question_papers ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;

CREATE OR REPLACE FUNCTION increment_view_count(table_name TEXT, record_id UUID)
RETURNS VOID AS $$
BEGIN
  IF table_name = 'resources' THEN
    UPDATE resources SET views_count = views_count + 1 WHERE id = record_id;
  ELSIF table_name = 'question_papers' THEN
    UPDATE question_papers SET views_count = views_count + 1 WHERE id = record_id;
  ELSIF table_name = 'articles' THEN
    UPDATE articles SET views_count = views_count + 1 WHERE id = record_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    content_id UUID NOT NULL,
    content_type TEXT NOT NULL CHECK (content_type IN ('resource', 'question_paper', 'article')),
    comment_text TEXT NOT NULL,
    status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_comments_content ON comments(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);

-- 2. Community Acquisition (from community_acquisition.sql)
CREATE TABLE IF NOT EXISTS community_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    is_enabled BOOLEAN DEFAULT true,
    label TEXT NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    qr_code_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS community_clicks_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    link_id UUID REFERENCES community_links(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    page_location TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_clicks_analytics ENABLE ROW LEVEL SECURITY;

-- Drop existing old policies just in case
DROP POLICY IF EXISTS "Anyone can view approved comments" ON comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON comments;
DROP POLICY IF EXISTS "Admins can manage comments" ON comments;
DROP POLICY IF EXISTS "Public can view approved comments" ON comments;
DROP POLICY IF EXISTS "Users can insert comments" ON comments;
DROP POLICY IF EXISTS "Users can update own comments" ON comments;

DROP POLICY IF EXISTS "Public can view active community links" ON community_links;
DROP POLICY IF EXISTS "Auth users can manage community links" ON community_links;
DROP POLICY IF EXISTS "Admins can manage community links" ON community_links;
DROP POLICY IF EXISTS "Public can view enabled community links" ON community_links;

DROP POLICY IF EXISTS "Public can insert click analytics" ON community_clicks_analytics;
DROP POLICY IF EXISTS "Auth users can view analytics" ON community_clicks_analytics;
DROP POLICY IF EXISTS "Anyone can insert community clicks" ON community_clicks_analytics;
DROP POLICY IF EXISTS "Admins view clicks" ON community_clicks_analytics;

-- Recreate proper policies
CREATE POLICY "Anyone can view approved comments" ON comments FOR SELECT USING (status = 'approved');
CREATE POLICY "Authenticated users can create comments" ON comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage comments" ON comments FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Public can view active community links" ON community_links FOR SELECT USING (is_enabled = true);
CREATE POLICY "Admins can manage community links" ON community_links FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Public can insert click analytics" ON community_clicks_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view click analytics" ON community_clicks_analytics FOR SELECT TO authenticated USING (is_admin(auth.uid()));
