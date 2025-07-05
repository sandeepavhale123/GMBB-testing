import { useQuery } from '@tanstack/react-query';
import axiosInstance from './axiosInstance';
import { ListingSetupResponse } from '../types/setupTypes';

export const fetchListingSetup = async (listingId: number): Promise<ListingSetupResponse> => {
  const response = await axiosInstance.post('/get-listing-setup', {
    listingId
  });
  return response.data;
};

export const useListingSetup = (listingId: number | null, enabled: boolean = true) => {
  const query = useQuery({
    queryKey: ['listingSetup', listingId],
    queryFn: () => fetchListingSetup(listingId!),
    enabled: enabled && !!listingId,
    refetchInterval: (query) => {
      // Stop polling if setup is complete (all values = 1)
      if (query.state.data?.data && Object.values(query.state.data.data).every(value => value === 1)) {
        return false; // Stop polling
      }
      return 30000; // Continue polling every 30 seconds
    },
    refetchIntervalInBackground: true,
    staleTime: 0, // Always fetch fresh data
  });

  // Calculate if setup is complete
  const isSetupComplete = query.data?.data && 
    Object.values(query.data.data).every(value => value === 1);

  return {
    ...query,
    isSetupComplete
  };
};