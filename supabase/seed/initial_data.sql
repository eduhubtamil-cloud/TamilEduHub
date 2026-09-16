-- Seed data for roles
-- Note: roles were already inserted in the initial schema, but included here for completeness if needed.
-- INSERT INTO roles (name) VALUES ('Super Admin'), ('Editor'), ('Author'), ('User') ON CONFLICT DO NOTHING;

-- Seed data for standards
INSERT INTO standards (name, slug, display_order, seo_title, seo_description) VALUES
('12th Standard', '12th-standard', 1, '12th Standard Study Materials & Guides', 'Download 12th standard PDF resources.'),
('11th Standard', '11th-standard', 2, '11th Standard Study Materials & Guides', 'Download 11th standard PDF resources.'),
('10th Standard', '10th-standard', 3, '10th Standard Study Materials & Guides', 'Download 10th standard PDF resources.'),
('9th Standard', '9th-standard', 4, '9th Standard Study Materials & Guides', 'Download 9th standard PDF resources.'),
('8th Standard', '8th-standard', 5, '8th Standard Study Materials & Guides', 'Download 8th standard PDF resources.'),
('7th Standard', '7th-standard', 6, '7th Standard Study Materials & Guides', 'Download 7th standard PDF resources.'),
('6th Standard', '6th-standard', 7, '6th Standard Study Materials & Guides', 'Download 6th standard PDF resources.'),
('5th Standard', '5th-standard', 8, '5th Standard Study Materials & Guides', 'Download 5th standard PDF resources.'),
('4th Standard', '4th-standard', 9, '4th Standard Study Materials & Guides', 'Download 4th standard PDF resources.'),
('3rd Standard', '3rd-standard', 10, '3rd Standard Study Materials & Guides', 'Download 3rd standard PDF resources.'),
('2nd Standard', '2nd-standard', 11, '2nd Standard Study Materials & Guides', 'Download 2nd standard PDF resources.'),
('1st Standard', '1st-standard', 12, '1st Standard Study Materials & Guides', 'Download 1st standard PDF resources.')
ON CONFLICT (slug) DO NOTHING;

-- Seed data for subjects
INSERT INTO subjects (name, slug, display_order) VALUES
('Tamil', 'tamil', 1),
('English', 'english', 2),
('Mathematics', 'mathematics', 3),
('Science', 'science', 4),
('Social Science', 'social-science', 5),
('Physics', 'physics', 6),
('Chemistry', 'chemistry', 7),
('Biology', 'biology', 8),
('Computer Science', 'computer-science', 9),
('Accountancy', 'accountancy', 10),
('Commerce', 'commerce', 11),
('Economics', 'economics', 12)
ON CONFLICT (slug) DO NOTHING;

-- Seed data for mediums
INSERT INTO mediums (name, slug) VALUES
('Tamil Medium', 'tamil-medium'),
('English Medium', 'english-medium'),
('Bilingual', 'bilingual')
ON CONFLICT (slug) DO NOTHING;

-- Seed data for resource types
INSERT INTO resource_types (name, slug) VALUES
('Study Guide', 'study-guide'),
('Question Paper', 'question-paper'),
('Textbook', 'textbook'),
('Answer Key', 'answer-key'),
('Notes', 'notes'),
('Worksheet', 'worksheet'),
('Model Paper', 'model-paper'),
('Revision Material', 'revision-material')
ON CONFLICT (slug) DO NOTHING;

-- Seed data for categories (for articles)
INSERT INTO categories (name, slug) VALUES
('Educational Articles', 'educational-articles'),
('Exam Tips', 'exam-tips'),
('Announcements', 'announcements'),
('Study Guides', 'study-guides')
ON CONFLICT (slug) DO NOTHING;
