-- Add all potentially missing JSONB columns to analyses table
ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS threats JSONB;
ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS recommendations JSONB;
ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS sender_analysis JSONB;
ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS content_analysis JSONB;
