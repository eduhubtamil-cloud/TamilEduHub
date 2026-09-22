-- Migration: Admin user management RPCs and policies
CREATE POLICY "Roles are viewable by authenticated users." ON public.roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can update all profiles." ON public.profiles FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.is_admin(user_uid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    is_admin_user BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        JOIN public.roles ON public.profiles.role_id = public.roles.id 
        WHERE public.profiles.id = user_uid 
          AND public.roles.name IN ('Super Admin', 'Editor')
    ) INTO is_admin_user;
    RETURN is_admin_user;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_admin_users()
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  role_id uuid,
  role_name text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Administrator privileges required.';
  END IF;

  RETURN QUERY
  SELECT 
    u.id,
    u.email::text,
    p.full_name,
    p.role_id,
    r.name as role_name,
    u.created_at
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.id = u.id
  LEFT JOIN public.roles r ON p.role_id = r.id
  ORDER BY u.created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_user_role(target_user_id uuid, new_role_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Administrator privileges required.';
  END IF;

  UPDATE public.profiles
  SET role_id = new_role_id, updated_at = now()
  WHERE id = target_user_id;
END;
$$;
