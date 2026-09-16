CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact messages" ON public.contact_messages
FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can view contact messages" ON public.contact_messages
FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.roles 
    WHERE roles.user_id = auth.uid() 
    AND roles.role IN ('admin', 'super_admin')
  )
);
