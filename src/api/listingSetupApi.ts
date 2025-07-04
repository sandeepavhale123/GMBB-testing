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
  return useQuery({
    queryKey: ['listingSetup', listingId],
    queryFn: () => fetchListingSetup(listingId!),
    enabled: enabled && !!listingId,
    refetchInterval: 30000, // Poll every 30 seconds
    refetchIntervalInBackground: true,
    staleTime: 0, // Always fetch fresh data
  });
};