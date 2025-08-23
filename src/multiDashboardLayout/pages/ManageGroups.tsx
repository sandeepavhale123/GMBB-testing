import React, { useState, useEffect } from 'react';
import { MainBody } from '@/multiDashboardLayout/components/MainBody';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { GroupsTable } from '@/components/Groups/GroupsTable';
import { CreateGroupModal } from '@/components/Groups/CreateGroupModal';
import { useGetAllListingsMutation, GroupsList } from '@/api/listingsGroupsApi';
import { toast } from '@/hooks/use-toast';

export const ManageGroups: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [groups, setGroups] = useState<GroupsList[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupsList | null>(null);
  const [getAllListings, { isLoading }] = useGetAllListingsMutation();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await getAllListings().unwrap();
      setGroups(response.data.groupsLists);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch groups",
        variant: "destructive"
      });
    }
  };

  const handleCreateGroup = () => {
    setEditingGroup(null);
    setIsModalOpen(true);
  };

  const handleEditGroup = (group: GroupsList) => {
    setEditingGroup(group);
    setIsModalOpen(true);
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      // TODO: Add delete API call
      toast({
        title: "Success",
        description: "Group deleted successfully"
      });
      fetchGroups();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete group",
        variant: "destructive"
      });
    }
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    setEditingGroup(null);
    fetchGroups();
  };

  const filteredGroups = groups.filter(group =>
    group.labelName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainBody>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Manage Groups</h1>
          <Button onClick={handleCreateGroup} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Group
          </Button>
        </div>

        {/* Search Filter */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Groups Table */}
        <GroupsTable
          groups={filteredGroups}
          isLoading={isLoading}
          onEdit={handleEditGroup}
          onDelete={handleDeleteGroup}
        />

        {/* Create/Edit Group Modal */}
        <CreateGroupModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleModalSuccess}
          editingGroup={editingGroup}
        />
      </div>
    </MainBody>
  );
};