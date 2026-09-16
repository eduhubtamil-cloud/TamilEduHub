-- Allow public to read from resources bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'resources' );

-- Allow authenticated users to insert to resources bucket
CREATE POLICY "Auth Insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'resources' );

-- Allow authenticated users to update their own objects
CREATE POLICY "Auth Update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'resources' AND owner = auth.uid() );

-- Allow authenticated users to delete their own objects
CREATE POLICY "Auth Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'resources' AND owner = auth.uid() );
