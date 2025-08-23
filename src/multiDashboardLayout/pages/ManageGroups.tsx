import React, { useState, useEffect } from 'react';
import { MainBody } from '@/multiDashboardLayout/components/MainBody';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { GroupsTable } from '@/components/Groups/GroupsTable';
import { CreateGroupModal } from '@/components/Groups/CreateGroupModal';
import { GroupsList } from '@/api/listingsGroupsApi';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';

export const ManageGroups: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupsList | null>(null);
  const [groups, setGroups] = useState<GroupsList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<{
    total: number;
    page: number;
    limit: number;
    pages: number;
  } | undefined>(undefined);
  
  const limit = 10;

  useEffect(() => {
    fetchGroups();
  }, [currentPage, searchTerm]);

  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/get-groups', {
        page: currentPage,
        limit,
        search: searchTerm
      });
      
      if (response.data.code === 200) {
        setGroups(response.data.data.groupsLists);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch groups",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
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
          groups={groups}
          isLoading={isLoading}
          onEdit={handleEditGroup}
          onDelete={handleDeleteGroup}
          pagination={pagination}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />

        {/* Create/Edit Group Modal */}
        <CreateGroupModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleModalSuccess}
          editingGroup={editingGroup}
        />
      </div>
    </>
  );
};