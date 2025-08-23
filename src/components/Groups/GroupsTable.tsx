import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Edit2, Trash2 } from 'lucide-react';
import { GroupsList, useDeleteGroupMutation, useDeleteGroupsMutation } from '@/api/listingsGroupsApi';
import { toast } from '@/hooks/use-toast';

interface PaginationProps {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface GroupsTableProps {
  groups: GroupsList[];
  isLoading: boolean;
  onEdit: (group: GroupsList) => void;
  onDelete: (groupId: string) => void;
  onBulkDelete?: (groupIds: string[]) => void;
  pagination?: PaginationProps;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export const GroupsTable: React.FC<GroupsTableProps> = ({
  groups,
  isLoading,
  onEdit,
  onDelete,
  onBulkDelete,
  pagination,
  currentPage = 1,
  onPageChange
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<GroupsList | null>(null);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  
  const [deleteGroups, { isLoading: isDeleting }] = useDeleteGroupsMutation();

  const handleSelectGroup = (groupId: string, checked: boolean) => {
    setSelectedGroups(prev => 
      checked 
        ? [...prev, groupId]
        : prev.filter(id => id !== groupId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedGroups(checked ? groups.map(group => group.id) : []);
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
        const groupIds = selectedGroups.map(id => parseInt(id));
        const response = await deleteGroups({ groupIds }).unwrap();
        toast({
          title: "Success",
          description: `${response.data.deletedCount} group${response.data.deletedCount > 1 ? 's' : ''} deleted successfully`
        });
        onBulkDelete?.(selectedGroups);
        setSelectedGroups([]);
      } else if (groupToDelete) {
        // Use the same array format for individual delete
        const groupIds = [parseInt(groupToDelete.id)];
        const response = await deleteGroups({ groupIds }).unwrap();
        toast({
          title: "Success",
          description: "Group deleted successfully"
        });
        onDelete(groupToDelete.id);
        setGroupToDelete(null);
      }
      setDeleteDialogOpen(false);
      setIsBulkDelete(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to delete group(s)",
        variant: "destructive"
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
          <p className="mt-2 text-sm text-muted-foreground">Loading groups...</p>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No groups found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get started by creating your first group to organize your listings.
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
            {selectedGroups.length} group{selectedGroups.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedGroups([])}
            >
              Clear Selection
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDeleteClick}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected ({selectedGroups.length})
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
                  checked={selectedGroups.length === groups.length && groups.length > 0}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all groups"
                />
              </TableHead>
              <TableHead className="font-semibold">Groups</TableHead>
              <TableHead className="font-semibold">No. of Locations</TableHead>
              <TableHead className="font-semibold w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((group) => (
              <TableRow key={group.id} className="hover:bg-muted/50">
                <TableCell>
                  <Checkbox
                    checked={selectedGroups.includes(group.id)}
                    onCheckedChange={(checked) => handleSelectGroup(group.id, checked as boolean)}
                    aria-label={`Select ${group.groupName}`}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {group.groupName}
                </TableCell>
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
                      onClick={() => onEdit(group)}
                      className="h-8 w-8 hover:bg-accent"
                    >
                      <Edit2 className="h-4 w-4" />
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
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => onPageChange?.(page)}
                    isActive={page === currentPage}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => onPageChange?.(Math.min(pagination.pages, currentPage + 1))}
                  className={currentPage >= pagination.pages ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
              {isBulkDelete ? 'Delete Groups' : 'Delete Group'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isBulkDelete 
                ? `Are you sure you want to delete ${selectedGroups.length} selected group${selectedGroups.length > 1 ? 's' : ''}? This action cannot be undone and will remove the group${selectedGroups.length > 1 ? 's' : ''} from all associated listings.`
                : `Are you sure you want to delete the group "${groupToDelete?.groupName}"? This action cannot be undone and will remove the group from all associated listings.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting 
                ? 'Deleting...' 
                : isBulkDelete 
                  ? `Delete ${selectedGroups.length} Group${selectedGroups.length > 1 ? 's' : ''}` 
                  : 'Delete Group'
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};