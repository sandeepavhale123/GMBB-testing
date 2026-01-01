import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, UserPlus, Crown, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAbWorkspaceContext } from '../context/AbWorkspaceContext';
import { useAbWorkspaceMembers } from '../hooks/useAbWorkspaceMembers';
import { AbInviteMemberDialog } from '../components/workspace/AbInviteMemberDialog';
import { AbMemberRoleSelect } from '../components/workspace/AbMemberRoleSelect';
import { canManageTeam, AbWorkspaceRole } from '../types/workspace';
import { formatDistanceToNow } from 'date-fns';

const AbTeamMembers: React.FC = () => {
  const navigate = useNavigate();
  const { currentWorkspace, currentRole } = useAbWorkspaceContext();
  const { members, isLoading, updateMemberRole, removeMember } = useAbWorkspaceMembers();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const canManage = currentRole ? canManageTeam(currentRole) : false;

  const handleRoleChange = async (memberId: string, role: AbWorkspaceRole) => {
    await updateMemberRole.mutateAsync({ memberId, role });
  };

  const handleRemoveMember = async (memberId: string) => {
    await removeMember.mutateAsync(memberId);
  };

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No workspace selected</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Team Members</h1>
              <p className="text-muted-foreground">
                Manage who has access to {currentWorkspace.name}
              </p>
            </div>
          </div>
          {canManage && (
            <Button onClick={() => setInviteDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          )}
        </div>

        {/* Owner Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Workspace Owner
            </CardTitle>
            <CardDescription>
              The owner has full control over this workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  O
                </div>
                <div>
                  <p className="font-medium">Owner</p>
                  <p className="text-sm text-muted-foreground">{currentWorkspace.owner_id}</p>
                </div>
              </div>
              <Badge variant="secondary">Owner</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Team Members Table */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              {members.length === 0
                ? 'No team members yet. Invite someone to get started.'
                : `${members.length} team member${members.length === 1 ? '' : 's'}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : members.length === 0 ? (
              <div className="text-center py-8">
                <UserPlus className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No team members yet</p>
                {canManage && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setInviteDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Invite your first member
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Invited</TableHead>
                    {canManage && <TableHead className="w-[100px]">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.email}</TableCell>
                      <TableCell>
                        <AbMemberRoleSelect
                          value={member.role}
                          onChange={(role) => handleRoleChange(member.id, role)}
                          disabled={!canManage || updateMemberRole.isPending}
                        />
                      </TableCell>
                      <TableCell>
                        {member.status === 'pending' ? (
                          <Badge variant="outline" className="gap-1">
                            <Clock className="h-3 w-3" />
                            Pending
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Active</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDistanceToNow(new Date(member.invited_at), { addSuffix: true })}
                      </TableCell>
                      {canManage && (
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove Member?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will revoke {member.email}'s access to this workspace.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRemoveMember(member.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <AbInviteMemberDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
      />
    </div>
  );
};

export default AbTeamMembers;
