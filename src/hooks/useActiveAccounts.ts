import { useState, useEffect, useCallback } from 'react';
import { getActiveAccounts, GetActiveAccountsRequest, GetActiveAccountsResponse, Account, Listing } from '../api/teamApi';

export interface UseActiveAccountsParams {
  employeeId: number;
  page?: number;
  limit?: number;
}

export const useActiveAccounts = (params: UseActiveAccountsParams) => {
  const [data, setData] = useState<GetActiveAccountsResponse['data'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    employeeId,
    page = 1,
    limit = 10
  } = params;

  const fetchActiveAccounts = useCallback(async () => {
    if (!employeeId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const request: GetActiveAccountsRequest = {
        id: employeeId,
        page,
        limit,
      };

      const response = await getActiveAccounts(request);
      setData(response.data);
    } catch (err: any) {
      console.error('Error fetching active accounts:', err);
      setError(err.response?.data?.message || 'Failed to fetch active accounts');
    } finally {
      setLoading(false);
    }
  }, [employeeId, page, limit]);

  useEffect(() => {
    fetchActiveAccounts();
  }, [fetchActiveAccounts]);

  const refetch = useCallback(() => {
    fetchActiveAccounts();
  }, [fetchActiveAccounts]);

  // Helper function to toggle listing assignment
  const toggleListingAssignment = useCallback((listingId: string) => {
    if (!data) return;

    const isCurrentlyAssigned = data.assignListingIds.includes(parseInt(listingId));
    
    setData(prevData => {
      if (!prevData) return null;
      
      const updatedAssignListingIds = isCurrentlyAssigned
        ? prevData.assignListingIds.filter(id => id !== parseInt(listingId))
        : [...prevData.assignListingIds, parseInt(listingId)];

      const updatedListings = prevData.listings.map(listing =>
        listing.id === listingId
          ? { ...listing, allocated: !isCurrentlyAssigned }
          : listing
      );

      return {
        ...prevData,
        totalAssignListings: updatedAssignListingIds.length,
        assignListingIds: updatedAssignListingIds,
        listings: updatedListings,
      };
    });
  }, [data]);

  // Helper function to check if listing is assigned
  const isListingAssigned = useCallback((listingId: string) => {
    return data?.assignListingIds.includes(parseInt(listingId)) || false;
  }, [data]);

  // Helper function to get accounts with "All" option
  const getAccountsWithAll = useCallback((): (Account & { accountId: string })[] => {
    const allOption = {
      accountId: 'All',
      accountName: 'All',
      totalListings: data?.totalListings || 0,
      activeListings: data?.accounts.reduce((sum, acc) => sum + acc.activeListings, 0) || 0,
      inActiveListings: data?.accounts.reduce((sum, acc) => sum + acc.inActiveListings, 0) || 0,
    };
    
    return [allOption, ...(data?.accounts || [])];
  }, [data]);

  return {
    data,
    accounts: data?.accounts || [],
    accountsWithAll: getAccountsWithAll(),
    listings: data?.listings || [],
    totalAssignListings: data?.totalAssignListings || 0,
    assignListingIds: data?.assignListingIds || [],
    totalListings: data?.totalListings || 0,
    pagination: {
      page: data?.page || 1,
      limit: data?.limit || limit,
      hasMore: data?.hasMore || false,
      nextPageToken: data?.nextPageToken || null,
      prevPageToken: data?.prevPageToken || null,
    },
    loading,
    error,
    refetch,
    toggleListingAssignment,
    isListingAssigned,
  };
};