-- Add selected_models column to prompts table
ALTER TABLE public.prompts ADD COLUMN selected_models text[] DEFAULT '{}'::text[];