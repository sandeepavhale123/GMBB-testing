import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GroupListingSelector } from './GroupListingSelector';
import { GroupsList, useCreateGroupMutation, useUpdateGroupMutation } from '@/api/listingsGroupsApi';
import { toast } from '@/hooks/use-toast';
import { useFormValidation } from '@/hooks/useFormValidation';
import { z } from 'zod';

const createGroupSchema = z.object({
  groupName: z.string().min(2, 'Group name must be at least 2 characters').max(50, 'Group name must be less than 50 characters'),
  selectedListings: z.array(z.string()).min(1, 'Please select at least one listing')
});

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingGroup?: GroupsList | null;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingGroup
}) => {
  const [groupName, setGroupName] = useState('');
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  
  const [createGroup, { isLoading: isCreating }] = useCreateGroupMutation();
  const [updateGroup, { isLoading: isUpdating }] = useUpdateGroupMutation();

  const { validate, getFieldError, hasFieldError, clearErrors } = useFormValidation(createGroupSchema);

  useEffect(() => {
    if (editingGroup) {
      setGroupName(editingGroup.groupName);
      // TODO: Load existing group's listings
      setSelectedListings([]);
    } else {
      setGroupName('');
      setSelectedListings([]);
    }
    clearErrors();
  }, [editingGroup, isOpen, clearErrors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = {
      groupName,
      selectedListings
    };

    const validation = validate(formData);
    if (!validation.isValid) {
      return;
    }

    try {
      if (editingGroup) {
        // Update existing group
        await updateGroup({
          groupId: editingGroup.id,
          groupName,
          locationIds: selectedListings
        }).unwrap();
        toast({
          title: "Success",
          description: "Group updated successfully"
        });
      } else {
        // Create new group
        await createGroup({
          groupName,
          locationIds: selectedListings
        }).unwrap();
        toast({
          title: "Success", 
          description: "Group created successfully"
        });
      }
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.message || `Failed to ${editingGroup ? 'update' : 'create'} group`,
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    setGroupName('');
    setSelectedListings([]);
    clearErrors();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {editingGroup ? 'Edit Group' : 'Create New Group'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Group Name Field */}
          <div className="space-y-2">
            <Label htmlFor="groupName" className="text-sm font-medium">
              Group Name *
            </Label>
            <Input
              id="groupName"
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className={hasFieldError('groupName') ? 'border-destructive' : ''}
            />
            {hasFieldError('groupName') && (
              <p className="text-xs text-destructive font-medium">
                {getFieldError('groupName')}
              </p>
            )}
          </div>

          {/* Listing Selector */}
          <div className="space-y-2">
            <GroupListingSelector
              selectedListings={selectedListings}
              onListingsChange={setSelectedListings}
              error={getFieldError('selectedListings')}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isCreating || isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating || isUpdating}
            >
              {(isCreating || isUpdating)
                ? (editingGroup ? 'Updating...' : 'Creating...') 
                : (editingGroup ? 'Update Group' : 'Create Group')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};