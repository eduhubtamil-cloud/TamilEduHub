-- Allow authenticated users to insert question papers
CREATE POLICY "Admins can insert question_papers"
ON question_papers FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update question papers
CREATE POLICY "Admins can update question_papers"
ON question_papers FOR UPDATE
TO authenticated
USING (true);

-- Allow authenticated users to delete question papers
CREATE POLICY "Admins can delete question_papers"
ON question_papers FOR DELETE
TO authenticated
USING (true);
