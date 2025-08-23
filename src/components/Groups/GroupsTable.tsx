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
import { Edit2, Trash2 } from 'lucide-react';
import { GroupsList, useDeleteGroupMutation } from '@/api/listingsGroupsApi';
import { toast } from '@/hooks/use-toast';

interface GroupsTableProps {
  groups: GroupsList[];
  isLoading: boolean;
  onEdit: (group: GroupsList) => void;
  onDelete: (groupId: string) => void;
}

export const GroupsTable: React.FC<GroupsTableProps> = ({
  groups,
  isLoading,
  onEdit,
  onDelete
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<GroupsList | null>(null);
  
  const [deleteGroup, { isLoading: isDeleting }] = useDeleteGroupMutation();

  const handleDeleteClick = (group: GroupsList) => {
    setGroupToDelete(group);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (groupToDelete) {
      try {
        await deleteGroup({ groupId: groupToDelete.id }).unwrap();
        toast({
          title: "Success",
          description: "Group deleted successfully"
        });
        onDelete(groupToDelete.id);
        setDeleteDialogOpen(false);
        setGroupToDelete(null);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error?.data?.message || "Failed to delete group",
          variant: "destructive"
        });
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setGroupToDelete(null);
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
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Groups</TableHead>
              <TableHead className="font-semibold">No. of Locations</TableHead>
              <TableHead className="font-semibold w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((group) => (
              <TableRow key={group.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  {group.labelName}
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
                      className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the group "{groupToDelete?.labelName}"? 
              This action cannot be undone and will remove the group from all associated listings.
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
              {isDeleting ? 'Deleting...' : 'Delete Group'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};