-- Fix the is_admin function to correctly check the roles table
CREATE OR REPLACE FUNCTION is_admin(user_uid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    is_admin_user BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM profiles 
        JOIN roles ON profiles.role_id = roles.id 
        WHERE profiles.id = user_uid AND roles.name = 'Super Admin'
    ) INTO is_admin_user;
    RETURN is_admin_user;
EXCEPTION WHEN OTHERS THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add Admin ALL access policies for all core tables
DROP POLICY IF EXISTS "Admins manage standards" ON standards;
CREATE POLICY "Admins manage standards" ON standards FOR ALL TO authenticated USING (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Admins manage subjects" ON subjects;
CREATE POLICY "Admins manage subjects" ON subjects FOR ALL TO authenticated USING (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Admins manage mediums" ON mediums;
CREATE POLICY "Admins manage mediums" ON mediums FOR ALL TO authenticated USING (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Admins manage categories" ON categories;
CREATE POLICY "Admins manage categories" ON categories FOR ALL TO authenticated USING (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Admins manage resource_types" ON resource_types;
CREATE POLICY "Admins manage resource_types" ON resource_types FOR ALL TO authenticated USING (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Admins manage tags" ON tags;
CREATE POLICY "Admins manage tags" ON tags FOR ALL TO authenticated USING (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Admins manage articles" ON articles;
CREATE POLICY "Admins manage articles" ON articles FOR ALL TO authenticated USING (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Admins manage resources" ON resources;
CREATE POLICY "Admins manage resources" ON resources FOR ALL TO authenticated USING (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Admins manage question_papers" ON question_papers;
CREATE POLICY "Admins manage question_papers" ON question_papers FOR ALL TO authenticated USING (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Admins manage announcements" ON announcements;
CREATE POLICY "Admins manage announcements" ON announcements FOR ALL TO authenticated USING (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Admins manage advertisements" ON advertisements;
CREATE POLICY "Admins manage advertisements" ON advertisements FOR ALL TO authenticated USING (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Admins manage site_settings" ON site_settings;
CREATE POLICY "Admins manage site_settings" ON site_settings FOR ALL TO authenticated USING (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Admins manage navigation_items" ON navigation_items;
CREATE POLICY "Admins manage navigation_items" ON navigation_items FOR ALL TO authenticated USING (is_admin(auth.uid()));
