
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { enableDisableListings, EnableDisableListingsPayload } from '../api/listingApi';

export const useListingStatusToggle = () => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const toggleListingStatus = async (
    listingId: string,
    accountId: number,
    isActive: boolean,
    onSuccess?: (data: any) => void
  ) => {
    // Set loading state for this specific listing
    setLoadingStates(prev => ({ ...prev, [listingId]: true }));

    try {
      const payload: EnableDisableListingsPayload = {
        listingIds: [parseInt(listingId)],
        accountId,
        isActive: isActive ? 1 : 0,
      };

      const response = await enableDisableListings(payload);

      if (response.code === 200) {
        toast({
          title: isActive ? "Listing Enabled" : "Listing Disabled",
          description: response.message,
        });

        // Call success callback with updated data
        onSuccess?.(response.data);
      } else {
        throw new Error(response.message || 'Failed to update listing status');
      }
    } catch (error: any) {
      console.error('Error toggling listing status:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || 'Failed to update listing status',
        variant: "destructive",
      });
      throw error; // Re-throw to handle optimistic updates
    } finally {
      // Clear loading state
      setLoadingStates(prev => ({ ...prev, [listingId]: false }));
    }
  };

  const isLoading = (listingId: string) => !!loadingStates[listingId];

  return {
    toggleListingStatus,
    isLoading,
  };
};
