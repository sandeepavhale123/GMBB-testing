import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GroupsList, useDeleteGroupsMutation } from "@/api/listingsGroupsApi";
import { toast } from "@/hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface PaginationProps {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface GroupsTableProps {
  groups: GroupsList[];
  isLoading: boolean;
  onDelete: (groupId: string) => void;
  onBulkDelete?: (groupIds: string[]) => void;
  pagination?: PaginationProps;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export const GroupsTable: React.FC<GroupsTableProps> = ({
  groups,
  isLoading,
  onDelete,
  onBulkDelete,
  pagination,
  currentPage = 1,
  onPageChange,
}) => {
  const { t } = useI18nNamespace("Groups/groupsTable");
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<GroupsList | null>(null);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  const [deleteGroups, { isLoading: isDeleting }] = useDeleteGroupsMutation();

  const handleSelectGroup = (groupId: string, checked: boolean) => {
    setSelectedGroups((prev) =>
      checked ? [...prev, groupId] : prev.filter((id) => id !== groupId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedGroups(checked ? groups.map((group) => group.id) : []);
  };

  const handleDeleteClick = (group: GroupsList) => {
    setGroupToDelete(group);
    setIsBulkDelete(false);
    setDeleteDialogOpen(true);
  };

  const handleBulkDeleteClick = () => {
    if (selectedGroups.length > 0) {
      setIsBulkDelete(true);
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (isBulkDelete && selectedGroups.length > 0) {
        const groupIds = selectedGroups.map((id) => parseInt(id));
        const response = await deleteGroups({ groupIds }).unwrap();
        toast({
          title: t("toast.successTitle"),
          description:
            response.data.deletedCount > 1
              ? t("toast.deleteSuccess_plural", {
                  count: response.data.deletedCount,
                })
              : t("toast.deleteSuccess_singal", {
                  count: response.data.deletedCount,
                }),
          //  `${response.data.deletedCount} group${
          //   response.data.deletedCount > 1 ? "s" : ""
          // } deleted successfully`,
        });
        onBulkDelete?.(selectedGroups);
        setSelectedGroups([]);
      } else if (groupToDelete) {
        // Use the same array format for individual delete
        const groupIds = [parseInt(groupToDelete.id)];
        const response = await deleteGroups({ groupIds }).unwrap();
        toast({
          title: t("toast.successTitle"),
          description: t("toast.deleteSuccess"),
        });
        onDelete(groupToDelete.id);
        setGroupToDelete(null);
      }
      setDeleteDialogOpen(false);
      setIsBulkDelete(false);
    } catch (error: any) {
      toast({
        title: t("toast.errorTitle"),
        description: error?.data?.message || t("toast.deleteFailed"),
        variant: "destructive",
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setGroupToDelete(null);
    setIsBulkDelete(false);
  };

  if (isLoading) {
    return (
      <div className="border rounded-lg">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("loadingGroups")}
          </p>
        </div>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="border rounded-lg">
        <div className="p-8 text-center">
          <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            {t("noGroupsTitle")}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t("noGroupsDescription")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Bulk Actions Bar */}
      {selectedGroups.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg mb-4">
          <span className="text-sm text-muted-foreground">
            {selectedGroups.length > 1
              ? t("toast.deleteSuccess_plural", {
                  count: selectedGroups.length,
                })
              : t("toast.deleteSuccess_singal", {
                  count: selectedGroups.length,
                })}
            {/* {selectedGroups.length} group{selectedGroups.length > 1 ? "s" : ""}{" "}
            selected */}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedGroups([])}
            >
              {t("clearSelection")}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDeleteClick}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t("deleteSelected", { count: selectedGroups.length })}
              {/* Delete Selected ({selectedGroups.length}) */}
            </Button>
          </div>
        </div>
      )}

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    selectedGroups.length === groups.length && groups.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all groups"
                />
              </TableHead>
              <TableHead className="font-semibold">
                {t("table.groups")}
              </TableHead>
              <TableHead className="font-semibold">
                {t("table.locations")}
              </TableHead>
              <TableHead className="font-semibold w-[100px]">
                {t("table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((group) => (
              <TableRow key={group.id} className="hover:bg-muted/50">
                <TableCell>
                  <Checkbox
                    checked={selectedGroups.includes(group.id)}
                    onCheckedChange={(checked) =>
                      handleSelectGroup(group.id, checked as boolean)
                    }
                    aria-label={`Select ${group.groupName}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{group.groupName}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                    {group.locCount}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        navigate(
                          `/main-dashboard/settings/manage-groups/${group.id}`
                        )
                      }
                      className="h-8 w-8 hover:bg-accent"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(group)}
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
                  className={
                    currentPage <= 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => onPageChange?.(page)}
                      isActive={page === currentPage}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    onPageChange?.(Math.min(pagination.pages, currentPage + 1))
                  }
                  className={
                    currentPage >= pagination.pages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isBulkDelete
                ? t("dialog.deleteGroupsTitle")
                : t("dialog.deleteGroupTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {
                isBulkDelete
                  ? selectedGroups.length > 1
                    ? t("dialog.deleteGroupsDescription_plural", {
                        count: selectedGroups.length,
                      })
                    : t("dialog.deleteGroupsDescription", {
                        count: selectedGroups.length,
                      })
                  : // `Are you sure you want to delete ${
                    //     selectedGroups.length
                    //   } selected group${
                    //     selectedGroups.length > 1 ? "s" : ""
                    //   }? This action cannot be undone and will remove the group${
                    //     selectedGroups.length > 1 ? "s" : ""
                    //   } from all associated listings.`
                    t("dialog.deleteGroupDescription", {
                      name: groupToDelete?.groupName,
                    })
                //  `Are you sure you want to delete the group "${groupToDelete?.groupName}"? This action cannot be undone and will remove the group from all associated listings.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              {t("dialog.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting
                ? t("dialog.deleting")
                : isBulkDelete
                ? t("dialog.delete_plural", { count: selectedGroups.length })
                : // `Delete ${selectedGroups.length} Group${
                  //     selectedGroups.length > 1 ? "s" : ""
                  //   }`
                  t("dialog.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
