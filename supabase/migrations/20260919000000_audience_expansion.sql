-- Create Education Segments Table
CREATE TABLE IF NOT EXISTS education_segments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert Default Segments
INSERT INTO education_segments (name, slug, description, display_order)
VALUES 
    ('School Students', 'school', 'Resources for classes 1 to 12', 1),
    ('Teachers', 'teachers', 'Lesson plans, teaching notes and worksheets', 2),
    ('Competitive Exams', 'competitive-exams', 'TNPSC, TRB, and other exam materials', 3)
ON CONFLICT (slug) DO NOTHING;

-- Add segment foreign key to resources and question_papers
ALTER TABLE resources 
ADD COLUMN IF NOT EXISTS education_segment_id UUID REFERENCES education_segments(id);

ALTER TABLE question_papers 
ADD COLUMN IF NOT EXISTS education_segment_id UUID REFERENCES education_segments(id);

-- Backfill existing resources to 'school' to maintain backwards compatibility
DO $$
DECLARE
    school_segment_id UUID;
BEGIN
    SELECT id INTO school_segment_id FROM education_segments WHERE slug = 'school' LIMIT 1;
    
    IF school_segment_id IS NOT NULL THEN
        UPDATE resources SET education_segment_id = school_segment_id WHERE education_segment_id IS NULL;
        UPDATE question_papers SET education_segment_id = school_segment_id WHERE education_segment_id IS NULL;
    END IF;
END $$;
