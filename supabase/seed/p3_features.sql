-- P3 Features: Views and Comments

-- 1. Add view counting columns
ALTER TABLE resources ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;
ALTER TABLE question_papers ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;

-- 2. Create an RPC to increment views atomically
CREATE OR REPLACE FUNCTION increment_view_count(table_name TEXT, record_id UUID)
RETURNS VOID AS $$
BEGIN
  IF table_name = 'resources' THEN
    UPDATE resources SET views_count = views_count + 1 WHERE id = record_id;
  ELSIF table_name = 'question_papers' THEN
    UPDATE question_papers SET views_count = views_count + 1 WHERE id = record_id;
  ELSIF table_name = 'articles' THEN
    UPDATE articles SET views_count = views_count + 1 WHERE id = record_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create Comments Table
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    content_id UUID NOT NULL,
    content_type TEXT NOT NULL CHECK (content_type IN ('resource', 'question_paper', 'article')),
    comment_text TEXT NOT NULL,
    status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for fast retrieval
CREATE INDEX IF NOT EXISTS idx_comments_content ON comments(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);

-- RLS for comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved comments
CREATE POLICY "Anyone can view approved comments" 
ON comments FOR SELECT 
USING (status = 'approved');

-- Authenticated users can insert comments
CREATE POLICY "Authenticated users can create comments" 
ON comments FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments" 
ON comments FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);



