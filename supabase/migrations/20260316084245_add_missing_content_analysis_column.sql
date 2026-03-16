-- Add content_analysis column if it doesn't exist
ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS content_analysis JSONB;
