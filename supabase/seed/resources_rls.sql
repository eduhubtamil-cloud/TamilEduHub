-- Allow authenticated users to insert resources
CREATE POLICY "Admins can insert resources"
ON resources FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update resources
CREATE POLICY "Admins can update resources"
ON resources FOR UPDATE
TO authenticated
USING (true);

-- Allow authenticated users to delete resources
CREATE POLICY "Admins can delete resources"
ON resources FOR DELETE
TO authenticated
USING (true);
