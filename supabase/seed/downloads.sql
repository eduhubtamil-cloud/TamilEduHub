-- Table for tracking downloads
CREATE TABLE IF NOT EXISTS public.downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
    question_paper_id UUID REFERENCES public.question_papers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

-- Only authenticated admins can view all downloads, but anyone can insert via service role API
CREATE POLICY "Admins can view downloads" ON public.downloads
FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.roles 
    WHERE roles.user_id = auth.uid() 
    AND roles.role IN ('admin', 'super_admin')
  )
);
