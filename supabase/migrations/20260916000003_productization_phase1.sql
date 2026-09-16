-- Phase 1 Productization Additions

ALTER TABLE resources ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS related_resources UUID[] DEFAULT '{}';

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_resources_is_featured ON resources(is_featured) WHERE is_featured = true;

-- Ensure storage RLS policies exist
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'resources');

DROP POLICY IF EXISTS "Auth Insert" ON storage.objects;
CREATE POLICY "Auth Insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'resources');

DROP POLICY IF EXISTS "Auth Update" ON storage.objects;
CREATE POLICY "Auth Update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'resources' AND owner = auth.uid());

DROP POLICY IF EXISTS "Auth Delete" ON storage.objects;
CREATE POLICY "Auth Delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'resources' AND owner = auth.uid());
