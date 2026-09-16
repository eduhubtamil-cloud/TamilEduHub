-- 1. Insert the 'avatars' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage RLS for avatars bucket
CREATE POLICY "Public avatars are viewable by everyone" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Users can update their own avatars" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'avatars');

CREATE POLICY "Users can delete their own avatars" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'avatars');

-- 3. Database RLS for profiles table (allow users to update their own profile)
-- (Note: profiles are created automatically via trigger, we just need UPDATE)
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE TO authenticated USING (auth.uid() = id);
