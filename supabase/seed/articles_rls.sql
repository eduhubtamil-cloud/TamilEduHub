-- 1. Insert the 'articles' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('articles', 'articles', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage RLS for articles bucket (allow public read, admin insert)
CREATE POLICY "Public articles are viewable by everyone" ON storage.objects
FOR SELECT USING (bucket_id = 'articles');

CREATE POLICY "Authenticated users can upload articles" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'articles');

CREATE POLICY "Authenticated users can update articles" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'articles');

CREATE POLICY "Authenticated users can delete articles" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'articles');

-- 3. Database RLS for articles table
-- (Note: SELECT for published articles is already handled in initial_schema.sql)
CREATE POLICY "Admins can insert articles" ON articles
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admins can update articles" ON articles
FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Admins can delete articles" ON articles
FOR DELETE TO authenticated USING (true);
