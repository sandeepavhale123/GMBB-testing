import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AvailableGroupListingSelector } from './AvailableGroupListingSelector';
import { useUpdateGroupListingsMutation } from '@/api/listingsGroupsApi';
import { toast } from '@/hooks/use-toast';
import { Loader2, X } from 'lucide-react';

interface AddListingToGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: number;
  groupName: string;
  onSuccess: () => void;
}

export const AddListingToGroupModal: React.FC<AddListingToGroupModalProps> = ({
  isOpen,
  onClose,
  groupId,
  groupName,
  onSuccess
}) => {
  const [selectedListings, setSelectedListings] = useState<number[]>([]);
  const [updateGroupListings, { isLoading }] = useUpdateGroupListingsMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedListings.length === 0) {
      toast.error({
        title: 'No listings selected',
        description: 'Please select at least one listing to add to the group.',
      });
      return;
    }

    try {
      const response = await updateGroupListings({
        groupId,
        google_locid: selectedListings
      }).unwrap();

      if (response.code === 200) {
        toast.success({
          title: 'Success',
          description: `Successfully added ${selectedListings.length} listing${selectedListings.length !== 1 ? 's' : ''} to ${groupName}. Total listings: ${response.data.totalListings}`,
        });
        onSuccess();
        onClose();
        setSelectedListings([]);
      } else {
        throw new Error(response.message || 'Failed to update group listings');
      }
    } catch (error: any) {
      console.error('Error adding listings to group:', error);
      toast.error({
        title: 'Error',
        description: error.data?.message || error.message || 'Failed to add listings to group. Please try again.',
      });
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setSelectedListings([]);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] bg-background border shadow-xl z-50">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Add Listings to {groupName}</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <AvailableGroupListingSelector
            groupId={groupId}
            selectedListings={selectedListings}
            onListingsChange={setSelectedListings}
          />

          <div className="flex justify-end space-x-4 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || selectedListings.length === 0}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  Adding...
                </>
              ) : (
                `Add ${selectedListings.length} Listing${selectedListings.length !== 1 ? 's' : ''}`
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};