CREATE OR REPLACE FUNCTION public.increment_view_count(table_name TEXT, record_id UUID)
RETURNS VOID AS $$
BEGIN
  IF table_name = 'resources' THEN
    UPDATE public.resources SET views_count = views_count + 1 WHERE id = record_id AND status = 'published';
  ELSIF table_name = 'question_papers' THEN
    UPDATE public.question_papers SET views_count = views_count + 1 WHERE id = record_id AND status = 'published';
  ELSIF table_name = 'articles' THEN
    UPDATE public.articles SET views_count = views_count + 1 WHERE id = record_id AND status = 'published';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';
