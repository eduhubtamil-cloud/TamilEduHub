CREATE TABLE IF NOT EXISTS public.advertisements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    ad_code TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active ads" ON public.advertisements
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage ads" ON public.advertisements
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.roles 
    WHERE roles.user_id = auth.uid() 
    AND roles.role IN ('admin', 'super_admin')
  )
);
