CREATE TABLE IF NOT EXISTS public.mediums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.resource_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    display_order INT DEFAULT 0
);

ALTER TABLE public.mediums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view mediums" ON public.mediums FOR SELECT USING (true);
CREATE POLICY "Admins can manage mediums" ON public.mediums FOR ALL USING (
  EXISTS (SELECT 1 FROM public.roles WHERE roles.user_id = auth.uid() AND roles.role IN ('admin', 'super_admin'))
);

CREATE POLICY "Anyone can view resource types" ON public.resource_types FOR SELECT USING (true);
CREATE POLICY "Admins can manage resource types" ON public.resource_types FOR ALL USING (
  EXISTS (SELECT 1 FROM public.roles WHERE roles.user_id = auth.uid() AND roles.role IN ('admin', 'super_admin'))
);

-- Seed some basic mediums
INSERT INTO public.mediums (name, slug, display_order)
VALUES 
('Tamil Medium', 'tamil-medium', 1),
('English Medium', 'english-medium', 2)
ON CONFLICT (slug) DO NOTHING;

-- Seed some basic resource types
INSERT INTO public.resource_types (name, slug, display_order)
VALUES
('Study Material', 'study-material', 1),
('Guide', 'guide', 2),
('Question Paper', 'question-paper', 3),
('Notes', 'notes', 4)
ON CONFLICT (slug) DO NOTHING;
