import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Loader } from '../ui/loader';
import { Eye, EyeOff, Search, Plus, Grid3X3, List, Edit, Trash2, Share2, Copy, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { AddTeamMemberModal } from './AddTeamMemberModal';
import { EditTeamMemberModal } from './EditTeamMemberModal';
import { DeleteTeamMemberModal } from './DeleteTeamMemberModal';
import { ShareableLinkModal } from './ShareableLinkModal';
import { TeamMemberPagination } from './TeamMemberPagination';
import { toast } from '../../hooks/use-toast';
import { useTeam } from '../../hooks/useTeam';
import { TeamMember } from '../../api/teamApi';

// Role color mapping
const roleColors = {
  Admin: 'bg-red-100 text-red-800',
  Editor: 'bg-blue-100 text-blue-800',
  Viewer: 'bg-green-100 text-green-800',
  Staff: 'bg-purple-100 text-purple-800',
  Client: 'bg-orange-100 text-orange-800',
  Moderator: 'bg-teal-100 text-teal-800',
};

const TeamMembersPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [passwordVisibility, setPasswordVisibility] = useState<{ [key: string]: boolean }>({});

  const {
    members,
    pagination,
    summary,
    isLoading,
    error,
    searchTerm,
    roleFilter,
    updateSearchTerm,
    updateRoleFilter,
    updateCurrentPage,
    clearTeamError
  } = useTeam();

  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member);
    setShowEditModal(true);
  };

  const handleDeleteMember = (member: TeamMember) => {
    setSelectedMember(member);
    setShowDeleteModal(true);
  };

  const handleShareLink = (member: TeamMember) => {
    setSelectedMember(member);
    setShowShareModal(true);
  };

  const togglePasswordVisibility = (memberId: string) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };

  const getRoleBadgeClass = (role: string) => {
    return roleColors[role as keyof typeof roleColors] || 'bg-gray-100 text-gray-800';
  };

  const handleCopyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      toast({
        title: "Email copied",
        description: "Email address has been copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy email to clipboard.",
        variant: "destructive",
      });
    }
  };

  const getDisplayName = (member: TeamMember) => {
    return `${member.firstName} ${member.lastName}`.trim() || member.username;
  };

  const getInitials = (member: TeamMember) => {
    if (member.firstName || member.lastName) {
      return `${member.firstName?.[0] || ''}${member.lastName?.[0] || ''}`.toUpperCase();
    }
    return member.username.slice(0, 2).toUpperCase();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Team Members</h2>
              <p className="text-sm text-muted-foreground">
                Manage your team members and their access permissions
              </p>
              {summary && (
                <p className="text-sm text-muted-foreground mt-1">
                  Total: {summary.totalMembers} members, Active: {summary.activeMembers}
                </p>
              )}
            </div>
            <Button onClick={() => setShowAddModal(true)} className="w-fit">
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search members..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => updateSearchTerm(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={updateRoleFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Editor">Editor</SelectItem>
                <SelectItem value="Viewer">Viewer</SelectItem>
                <SelectItem value="Staff">Staff</SelectItem>
                <SelectItem value="Client">Client</SelectItem>
                <SelectItem value="Moderator">Moderator</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="p-8 text-center border-destructive">
            <div className="text-destructive mb-4">
              <h3 className="text-lg font-semibold mb-2">Error Loading Team Members</h3>
              <p className="text-sm">{error}</p>
            </div>
            <Button onClick={clearTeamError} variant="outline">
              Try Again
            </Button>
          </Card>
        )}

        {/* Team Members Display */}
        {!isLoading && !error && members.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-muted-foreground mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No team members found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || roleFilter 
                ? "Try adjusting your search criteria or filters"
                : "Get started by adding your first team member"
              }
            </p>
            {!searchTerm && !roleFilter && (
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            )}
          </Card>
        ) : !isLoading && !error && (
          <>
            {/* List View */}
            {viewMode === 'list' ? (
              <Card className="overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Member
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Listings
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {members.map((member) => (
                      <tr key={member.id} className="hover:bg-muted/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={member.profilePicture} alt={getDisplayName(member)} />
                              <AvatarFallback>{getInitials(member)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-foreground">{getDisplayName(member)}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-2">
                                {member.username}
                                <button
                                  onClick={() => handleCopyEmail(member.username)}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={getRoleBadgeClass(member.role)}>
                            {member.role}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-foreground">{member.listingsCount}</span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="default">
                            Active
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditMember(member)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleShareLink(member)}>
                                <Share2 className="w-4 h-4 mr-2" />
                                Share Link
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteMember(member)}
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            ) : (
              /* Grid View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((member) => (
                  <Card key={member.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.profilePicture} alt={getDisplayName(member)} />
                          <AvatarFallback>{getInitials(member)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-foreground">{getDisplayName(member)}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            {member.username}
                            <button
                              onClick={() => handleCopyEmail(member.username)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditMember(member)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShareLink(member)}>
                            <Share2 className="w-4 h-4 mr-2" />
                            Share Link
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteMember(member)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Role:</span>
                        <Badge className={getRoleBadgeClass(member.role)}>
                          {member.role}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Listings:</span>
                        <span className="text-sm text-foreground">{member.listingsCount}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <Badge variant="default">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {!isLoading && !error && pagination && (
          <TeamMemberPagination
            pagination={pagination}
            onPageChange={updateCurrentPage}
          />
        )}
      </div>

      {/* Modals */}
      <AddTeamMemberModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal} 
      />
      
      <EditTeamMemberModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        member={selectedMember}
      />
      
      <DeleteTeamMemberModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        member={selectedMember}
      />
      
      <ShareableLinkModal
        open={showShareModal}
        onOpenChange={setShowShareModal}
        member={selectedMember}
      />
    </div>
  );
};

export default TeamMembersPage;