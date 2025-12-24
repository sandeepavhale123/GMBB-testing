-- Add brand and domain mention tracking columns to llm_results
ALTER TABLE public.llm_results 
ADD COLUMN brand_mentioned BOOLEAN DEFAULT false,
ADD COLUMN domain_mentioned BOOLEAN DEFAULT false;