-- Migration: Add display_order column to publications table if not exists
ALTER TABLE public.publications ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;
