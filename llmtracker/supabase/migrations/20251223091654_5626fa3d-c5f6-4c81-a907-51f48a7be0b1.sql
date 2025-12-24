-- Enable RLS on llm_results
ALTER TABLE public.llm_results ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view results for prompts in their projects
CREATE POLICY "Users can view results for their prompts"
ON public.llm_results
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.prompts p
    JOIN public.projects proj ON p.project_id = proj.id
    WHERE p.id = llm_results.prompt_id
    AND proj.owner_id = auth.uid()
  )
);

-- Policy: Users can insert results for prompts in their projects
CREATE POLICY "Users can insert results for their prompts"
ON public.llm_results
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.prompts p
    JOIN public.projects proj ON p.project_id = proj.id
    WHERE p.id = llm_results.prompt_id
    AND proj.owner_id = auth.uid()
  )
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);