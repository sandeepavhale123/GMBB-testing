import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AbWorkspace } from '../types/workspace';
import { toast } from 'sonner';
import { useAbWorkspaceContext } from '../context/AbWorkspaceContext';

interface CreateWorkspaceInput {
  name: string;
  logo_url?: string;
}

interface UpdateWorkspaceInput {
  name?: string;
  logo_url?: string | null;
}

function generateSlug(name: string): string {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now()}`;
}

export function useAbWorkspaces() {
  const queryClient = useQueryClient();
  const { refreshWorkspaces, setCurrentWorkspace } = useAbWorkspaceContext();

  const createWorkspace = useMutation({
    mutationFn: async (input: CreateWorkspaceInput): Promise<AbWorkspace> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in');

      const slug = generateSlug(input.name);

      const { data, error } = await supabase
        .from('ab_workspaces')
        .insert({
          name: input.name,
          slug,
          owner_id: user.id,
          logo_url: input.logo_url || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data as AbWorkspace;
    },
    onSuccess: async (workspace) => {
      toast.success('Workspace created');
      await refreshWorkspaces();
      setCurrentWorkspace(workspace);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create workspace');
    },
  });

  const updateWorkspace = useMutation({
    mutationFn: async ({ id, ...input }: UpdateWorkspaceInput & { id: string }): Promise<AbWorkspace> => {
      const { data, error } = await supabase
        .from('ab_workspaces')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as AbWorkspace;
    },
    onSuccess: async () => {
      toast.success('Workspace updated');
      await refreshWorkspaces();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update workspace');
    },
  });

  const deleteWorkspace = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('ab_workspaces')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: async () => {
      toast.success('Workspace deleted');
      await refreshWorkspaces();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete workspace');
    },
  });

  return {
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
  };
}
