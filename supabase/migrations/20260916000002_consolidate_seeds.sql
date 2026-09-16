-- 1. Comments and View Tracking (from p3_features.sql)
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
    question_paper_id UUID REFERENCES question_papers(id) ON DELETE CASCADE,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE resources ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;
ALTER TABLE question_papers ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;

CREATE OR REPLACE FUNCTION increment_view_count(table_name TEXT, record_id UUID)
RETURNS void AS $$
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

-- 2. Community Acquisition (from community_acquisition.sql)
CREATE TABLE IF NOT EXISTS community_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL, -- e.g., 'whatsapp', 'telegram', 'google_play'
    url TEXT NOT NULL,
    label TEXT NOT NULL,
    description TEXT,
    qr_code_url TEXT,
    is_enabled BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS community_clicks_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    link_id UUID REFERENCES community_links(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_agent TEXT,
    ip_address TEXT,
    referer TEXT
);

-- Note: RLS policies for comments and community_links were already fixed in previous migrations, 
-- but let's ensure they are enabled.
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_clicks_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view approved comments" ON comments FOR SELECT USING (is_approved = true OR auth.uid() = user_id);
CREATE POLICY "Users can insert comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public can view enabled community links" ON community_links FOR SELECT USING (is_enabled = true);
CREATE POLICY "Anyone can insert community clicks" ON community_clicks_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view clicks" ON community_clicks_analytics FOR SELECT TO authenticated USING (is_admin(auth.uid()));
