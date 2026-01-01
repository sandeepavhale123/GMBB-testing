import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AbWorkspaceMember, AbWorkspaceRole } from '../types/workspace';
import { toast } from 'sonner';
import { useAbWorkspaceContext } from '../context/AbWorkspaceContext';

interface InviteMemberInput {
  email: string;
  role: AbWorkspaceRole;
}

interface UpdateMemberInput {
  memberId: string;
  role: AbWorkspaceRole;
}

export function useAbWorkspaceMembers() {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useAbWorkspaceContext();

  const membersQuery = useQuery({
    queryKey: ['ab-workspace-members', currentWorkspace?.id],
    queryFn: async (): Promise<AbWorkspaceMember[]> => {
      if (!currentWorkspace) return [];

      const { data, error } = await supabase
        .from('ab_workspace_members')
        .select('*')
        .eq('workspace_id', currentWorkspace.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return (data || []) as AbWorkspaceMember[];
    },
    enabled: !!currentWorkspace,
  });

  const inviteMember = useMutation({
    mutationFn: async (input: InviteMemberInput): Promise<AbWorkspaceMember> => {
      if (!currentWorkspace) throw new Error('No workspace selected');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in');

      // Check if member already exists
      const { data: existing } = await supabase
        .from('ab_workspace_members')
        .select('id')
        .eq('workspace_id', currentWorkspace.id)
        .eq('email', input.email.toLowerCase())
        .single();

      if (existing) {
        throw new Error('This email has already been invited');
      }

      const { data, error } = await supabase
        .from('ab_workspace_members')
        .insert({
          workspace_id: currentWorkspace.id,
          email: input.email.toLowerCase(),
          role: input.role,
          invited_by: user.id,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return data as AbWorkspaceMember;
    },
    onSuccess: () => {
      toast.success('Invitation sent');
      queryClient.invalidateQueries({ queryKey: ['ab-workspace-members', currentWorkspace?.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to invite member');
    },
  });

  const updateMemberRole = useMutation({
    mutationFn: async (input: UpdateMemberInput): Promise<AbWorkspaceMember> => {
      const { data, error } = await supabase
        .from('ab_workspace_members')
        .update({ role: input.role })
        .eq('id', input.memberId)
        .select()
        .single();

      if (error) throw error;
      return data as AbWorkspaceMember;
    },
    onSuccess: () => {
      toast.success('Member role updated');
      queryClient.invalidateQueries({ queryKey: ['ab-workspace-members', currentWorkspace?.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update member role');
    },
  });

  const removeMember = useMutation({
    mutationFn: async (memberId: string): Promise<void> => {
      const { error } = await supabase
        .from('ab_workspace_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Member removed');
      queryClient.invalidateQueries({ queryKey: ['ab-workspace-members', currentWorkspace?.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove member');
    },
  });

  return {
    members: membersQuery.data || [],
    isLoading: membersQuery.isLoading,
    inviteMember,
    updateMemberRole,
    removeMember,
  };
}
