-- Profiles RLS
CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Standards RLS (Public read)
CREATE POLICY "Standards are viewable by everyone." ON standards FOR SELECT USING (true);

-- Subjects RLS
CREATE POLICY "Subjects are viewable by everyone." ON subjects FOR SELECT USING (true);

-- Mediums RLS
CREATE POLICY "Mediums are viewable by everyone." ON mediums FOR SELECT USING (true);

-- Categories RLS
CREATE POLICY "Categories are viewable by everyone." ON categories FOR SELECT USING (true);

-- Resource Types RLS
CREATE POLICY "Resource types are viewable by everyone." ON resource_types FOR SELECT USING (true);

-- Tags RLS
CREATE POLICY "Tags are viewable by everyone." ON tags FOR SELECT USING (true);

-- Articles RLS
CREATE POLICY "Published articles are viewable by everyone." ON articles
  FOR SELECT USING (status = 'published');
  
-- Resources RLS
CREATE POLICY "Published resources are viewable by everyone." ON resources
  FOR SELECT USING (status = 'published');

-- Question Papers RLS
CREATE POLICY "Published question papers are viewable by everyone." ON question_papers
  FOR SELECT USING (status = 'published');

-- Announcements RLS
CREATE POLICY "Published announcements are viewable by everyone." ON announcements
  FOR SELECT USING (status = 'published');

-- Bookmarks RLS
CREATE POLICY "Users can view their own bookmarks." ON bookmarks
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own bookmarks." ON bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own bookmarks." ON bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- Downloads RLS (Insert for everyone, Select for admins/own)
CREATE POLICY "Anyone can insert downloads." ON downloads
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own downloads." ON downloads
  FOR SELECT USING (auth.uid() = user_id);

-- Note: Admin operations will be performed via Next.js Server Actions using the 
-- SUPABASE_SERVICE_ROLE_KEY which bypasses RLS to allow full CMS management.
