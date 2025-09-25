import React, { useState, useEffect } from "react";
import { MainBody } from "@/multiDashboardLayout/components/MainBody";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { GroupsTable } from "@/components/Groups/GroupsTable";
import { CreateGroupModal } from "@/components/Groups/CreateGroupModal";
import { GroupsList } from "@/api/listingsGroupsApi";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/api/axiosInstance";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const ManageGroups: React.FC = () => {
  const { t } = useI18nNamespace("MultidashboardPages/manageGroups");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupsList | null>(null);
  const [groups, setGroups] = useState<GroupsList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<
    | {
        total: number;
        page: number;
        limit: number;
        pages: number;
      }
    | undefined
  >(undefined);

  const limit = 10;

  useEffect(() => {
    fetchGroups();
  }, [currentPage, searchTerm]);

  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/get-groups", {
        page: currentPage,
        limit,
        search: searchTerm,
      });

      if (response.data.code === 200) {
        setGroups(response.data.data.groupsLists);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      toast({
        title: t("toast.error"),
        description: t("toast.fetchError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGroup = () => {
    setEditingGroup(null);
    setIsModalOpen(true);
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      // Single delete is handled by GroupsTable component
      fetchGroups();
    } catch (error) {
      toast({
        title: t("toast.error"),
        description: t("toast.deleteError"),
        variant: "destructive",
      });
    }
  };

  const handleBulkDeleteGroup = async (groupIds: string[]) => {
    try {
      // Bulk delete is handled by GroupsTable component
      fetchGroups();
    } catch (error) {
      toast({
        title: t("toast.error"),
        description: t("toast.bulkDeleteError"),
        variant: "destructive",
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
          <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
          <Button onClick={handleCreateGroup} className="gap-2">
            <Plus className="h-4 w-4" />
            {t("createGroup")}
          </Button>
        </div>

        {/* Search Filter */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Groups Table */}
        <GroupsTable
          groups={groups}
          isLoading={isLoading}
          onDelete={handleDeleteGroup}
          onBulkDelete={handleBulkDeleteGroup}
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
