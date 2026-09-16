-- 1. Create New Taxonomy Tables
CREATE TABLE IF NOT EXISTS exam_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS publications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Alter Existing Resources
ALTER TABLE resources ADD COLUMN IF NOT EXISTS exam_type_id UUID REFERENCES exam_types(id);
ALTER TABLE resources ADD COLUMN IF NOT EXISTS publication_id UUID REFERENCES publications(id);
ALTER TABLE resources ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

ALTER TABLE question_papers ADD COLUMN IF NOT EXISTS exam_type_id UUID REFERENCES exam_types(id);
ALTER TABLE question_papers ADD COLUMN IF NOT EXISTS publication_id UUID REFERENCES publications(id);
ALTER TABLE question_papers ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- 3. Collections Architecture
CREATE TABLE IF NOT EXISTS collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    seo_metadata JSONB,
    query_rules JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Search Analytics
CREATE TABLE IF NOT EXISTS search_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    query_string TEXT NOT NULL,
    filters JSONB,
    result_count INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Fix RLS Policies for Existing Tables (community_links and comments)
-- Drop the temporary ones
DROP POLICY IF EXISTS "Auth users can manage community links" ON community_links;
DROP POLICY IF EXISTS "Admins have full access to comments" ON comments;

-- Recreate with proper role check (assuming profiles.role_id is a UUID referencing user_roles, or just a string. Wait, if it's a UUID, we need to join user_roles. Let's check user_roles table if it exists. If not, we will rely on a secure fallback or check if role_id is 'admin').
-- Let's define an admin check function to safely check role without throwing syntax errors if role_id is a UUID.
CREATE OR REPLACE FUNCTION is_admin(user_uid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    is_admin_user BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM profiles 
        JOIN user_roles ON profiles.role_id = user_roles.id 
        WHERE profiles.id = user_uid AND user_roles.role = 'admin'
    ) INTO is_admin_user;
    RETURN is_admin_user;
EXCEPTION WHEN OTHERS THEN
    -- Fallback if user_roles doesn't exist
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Admins can manage community links" 
ON community_links FOR ALL TO authenticated 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage comments" 
ON comments FOR ALL TO authenticated 
USING (is_admin(auth.uid()));

-- Enable RLS on new tables
ALTER TABLE exam_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_analytics ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can view exam_types" ON exam_types FOR SELECT USING (true);
CREATE POLICY "Public can view publications" ON publications FOR SELECT USING (true);
CREATE POLICY "Public can view collections" ON collections FOR SELECT USING (true);

-- Analytics insert access
CREATE POLICY "Public can insert search_analytics" ON search_analytics FOR INSERT WITH CHECK (true);

-- Admin manage access
CREATE POLICY "Admins manage exam_types" ON exam_types FOR ALL TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins manage publications" ON publications FOR ALL TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins manage collections" ON collections FOR ALL TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins view search_analytics" ON search_analytics FOR SELECT TO authenticated USING (is_admin(auth.uid()));

