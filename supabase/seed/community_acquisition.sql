-- Community Acquisition Features

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

-- Analytics table
CREATE TABLE IF NOT EXISTS community_clicks_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    link_id UUID REFERENCES community_links(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    page_location TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE community_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_clicks_analytics ENABLE ROW LEVEL SECURITY;

-- Public can view links and insert analytics
CREATE POLICY "Public can view active community links" ON community_links FOR SELECT USING (is_enabled = true);
CREATE POLICY "Public can insert click analytics" ON community_clicks_analytics FOR INSERT WITH CHECK (true);

-- Admins can manage links (For MVP, all auth users can manage to bypass role issues)
CREATE POLICY "Auth users can manage community links" ON community_links FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth users can view analytics" ON community_clicks_analytics FOR SELECT TO authenticated USING (true);

-- Seed Initial Data
INSERT INTO community_links (platform, url, label, description, display_order)
VALUES 
('whatsapp_channel', 'https://whatsapp.com/channel/example', 'Join WhatsApp Channel', 'Get daily educational updates directly on WhatsApp.', 1),
('telegram_community', 'https://t.me/example', 'Join Telegram Community', 'Connect with thousands of students and teachers.', 2),
('google_play', 'https://play.google.com/store/apps/details?id=com.example', 'Get it on Google Play', 'Download our official Android app.', 3)
ON CONFLICT DO NOTHING;
