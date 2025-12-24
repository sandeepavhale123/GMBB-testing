-- Enable RLS on project_members
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view members of their projects
CREATE POLICY "Users can view members of their projects"
ON public.project_members
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_members.project_id
    AND projects.owner_id = auth.uid()
  )
);

-- Policy: Users can manage members of their projects
CREATE POLICY "Users can manage members of their projects"
ON public.project_members
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_members.project_id
    AND projects.owner_id = auth.uid()
  )
);