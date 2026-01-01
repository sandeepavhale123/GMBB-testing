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

      // Insert the member record
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

      // Get inviter's name from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, first_name, email')
        .eq('id', user.id)
        .single();

      const inviterName = profile?.full_name || profile?.first_name || profile?.email || 'A team member';

      // Send invitation email via edge function
      try {
        const { error: emailError } = await supabase.functions.invoke('ai-bot-send-invite', {
          body: {
            email: input.email.toLowerCase(),
            workspaceName: currentWorkspace.name,
            inviterName: inviterName,
            role: input.role,
          },
        });

        if (emailError) {
          console.error('Failed to send invitation email:', emailError);
          // Don't throw - the member was added, just email failed
          toast.warning('Member added but invitation email could not be sent');
        }
      } catch (emailErr) {
        console.error('Error calling send-invite function:', emailErr);
        toast.warning('Member added but invitation email could not be sent');
      }

      return data as AbWorkspaceMember;
    },
    onSuccess: (_, variables) => {
      toast.success(`Invitation sent to ${variables.email}`);
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
