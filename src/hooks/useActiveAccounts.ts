import { useState, useEffect, useCallback } from "react";
import {
  getActiveAccounts,
  getActiveAccountList,
  saveAssignListings,
  GetActiveAccountsRequest,
  GetActiveAccountsResponse,
  GetActiveAccountListRequest,
  GetActiveAccountListResponse,
  Account,
  Listing,
} from "../api/teamApi";

export interface UseActiveAccountsParams {
  employeeId: number;
  page?: number;
  limit?: number;
}

export const useActiveAccounts = (params: UseActiveAccountsParams) => {
  const [data, setData] = useState<GetActiveAccountsResponse["data"] | null>(
    null
  );
  const [accountData, setAccountData] = useState<
    GetActiveAccountListResponse["data"] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [accountLoading, setAccountLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null
  );
  const [originalAssignedIds, setOriginalAssignedIds] = useState<string[]>([]);
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { employeeId, page = 1, limit = 10 } = params;

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
      console.error("Error fetching active accounts:", err);
      setError(
        err.response?.data?.message || "Failed to fetch active accounts"
      );
    } finally {
      setLoading(false);
    }
  }, [employeeId, page, limit]);

  useEffect(() => {
    fetchActiveAccounts();
  }, [fetchActiveAccounts]);

  // Track original assigned listings when data is loaded for the first time only
  useEffect(() => {
    if (data?.assignListingIds && !hasLoadedInitialData) {
      setOriginalAssignedIds(data.assignListingIds.map((id) => id.toString()));
      setHasLoadedInitialData(true);
    }
  }, [data?.assignListingIds, hasLoadedInitialData]);

  const fetchAccountListings = useCallback(
    async (accountId: number) => {
      if (!employeeId) return;

      setAccountLoading(true);
      setError(null);

      try {
        const request: GetActiveAccountListRequest = {
          id: employeeId,
          accountId,
        };

        const response = await getActiveAccountList(request);
        setAccountData(response.data);
        setSelectedAccountId(accountId);
      } catch (err: any) {
        console.error("Error fetching account listings:", err);
        setError(
          err.response?.data?.message || "Failed to fetch account listings"
        );
      } finally {
        setAccountLoading(false);
      }
    },
    [employeeId]
  );

  const refetch = useCallback(() => {
    fetchActiveAccounts();
  }, [fetchActiveAccounts]);

  const searchByAccount = useCallback(
    (accountId: number) => {
      fetchAccountListings(accountId);
    },
    [fetchAccountListings]
  );

  // Helper function to toggle listing assignment
  // const toggleListingAssignment = useCallback(
  //   (listingId: string): number[] | null => {
  //     const currentData = selectedAccountId ? accountData : data;
  //     if (!currentData) return;

  //     let newAssignedIds: number[] = [];

  //     if (selectedAccountId && accountData) {
  //       // Update account-specific data
  //       const updatedListings = accountData.listings.map((listing) =>
  //         listing.id === listingId
  //           ? { ...listing, allocated: !listing.allocated }
  //           : listing
  //       );

  //       // Calculate new assigned IDs for account-specific data
  //       newAssignedIds = updatedListings
  //         .filter((listing) => listing.allocated)
  //         .map((listing) => parseInt(listing.id, 10));

  //       setAccountData((prevData) => {
  //         if (!prevData) return null;
  //         return {
  //           ...prevData,
  //           listings: updatedListings,
  //         };
  //       });
  //     } else if (data) {
  //       // Update general data
  //       const isCurrentlyAssigned = data.assignListingIds.includes(
  //         parseInt(listingId)
  //       );

  //       const updatedAssignListingIds = isCurrentlyAssigned
  //         ? data.assignListingIds.filter((id) => id !== parseInt(listingId))
  //         : [...data.assignListingIds, parseInt(listingId)];

  //       newAssignedIds = updatedAssignListingIds;

  //       const updatedListings = data.listings.map((listing) =>
  //         listing.id === listingId
  //           ? { ...listing, allocated: !isCurrentlyAssigned }
  //           : listing
  //       );

  //       setData((prevData) => {
  //         if (!prevData) return null;
  //         return {
  //           ...prevData,
  //           totalAssignListings: updatedAssignListingIds.length,
  //           assignListingIds: updatedAssignListingIds,
  //           listings: updatedListings,
  //         };
  //       });
  //     }
  //     return newAssignedIds;
  //   },
  //   [data, accountData, selectedAccountId]
  // );

  const toggleListingAssignment = useCallback(
    (listingId: string): { id: string; isActive: number } | null => {
      const currentData = selectedAccountId ? accountData : data;
      if (!currentData) return null;

      let isActive = 0;

      if (selectedAccountId && accountData) {
        const updatedListings = accountData.listings.map((listing) => {
          if (listing.id === listingId) {
            const newAllocated = !listing.allocated;
            isActive = newAllocated ? 1 : 0;
            return { ...listing, allocated: newAllocated };
          }
          return listing;
        });

        setAccountData((prevData) =>
          prevData ? { ...prevData, listings: updatedListings } : null
        );
      } else if (data) {
        const isCurrentlyAssigned = data.assignListingIds.includes(
          parseInt(listingId)
        );
        isActive = isCurrentlyAssigned ? 0 : 1;

        const updatedAssignListingIds = isCurrentlyAssigned
          ? data.assignListingIds.filter((id) => id !== parseInt(listingId))
          : [...data.assignListingIds, parseInt(listingId)];

        const updatedListings = data.listings.map((listing) =>
          listing.id === listingId
            ? { ...listing, allocated: !isCurrentlyAssigned }
            : listing
        );

        setData((prevData) =>
          prevData
            ? {
                ...prevData,
                totalAssignListings: updatedAssignListingIds.length,
                assignListingIds: updatedAssignListingIds,
                listings: updatedListings,
              }
            : null
        );
      }

      return { id: listingId, isActive };
    },
    [data, accountData, selectedAccountId]
  );

  // Helper function to check if listing is assigned
  const isListingAssigned = useCallback(
    (listingId: string) => {
      if (selectedAccountId && accountData) {
        return (
          accountData.listings.find((listing) => listing.id === listingId)
            ?.allocated || false
        );
      }
      return data?.assignListingIds.includes(parseInt(listingId)) || false;
    },
    [data, accountData, selectedAccountId]
  );

  // Helper function to get accounts with "All" option
  const getAccountsWithAll = useCallback((): (Account & {
    accountId: string;
  })[] => {
    const allOption = {
      accountId: "All",
      accountName: "All",
      totalListings: data?.totalListings || 0,
      activeListings:
        data?.accounts.reduce((sum, acc) => sum + acc.activeListings, 0) || 0,
      inActiveListings:
        data?.accounts.reduce((sum, acc) => sum + acc.inActiveListings, 0) || 0,
    };

    return [allOption, ...(data?.accounts || [])];
  }, [data]);

  // Get current listings based on selected account
  const getCurrentListings = useCallback(() => {
    return selectedAccountId && accountData
      ? accountData.listings
      : data?.listings || [];
  }, [selectedAccountId, accountData, data]);

  // Get current pagination based on selected account
  const getCurrentPagination = useCallback(() => {
    if (selectedAccountId && accountData) {
      return {
        page: accountData.page || 1,
        limit: accountData.limit || limit,
        hasMore: accountData.hasMore || false,
        nextPageToken: accountData.nextPageToken || null,
        prevPageToken: accountData.prevPageToken || null,
      };
    }
    return {
      page: data?.page || 1,
      limit: data?.limit || limit,
      hasMore: data?.hasMore || false,
      nextPageToken: data?.nextPageToken || null,
      prevPageToken: data?.prevPageToken || null,
    };
  }, [selectedAccountId, accountData, data, limit]);

  const getAssignedListingIds = useCallback((): number[] => {
    const currentListings = getCurrentListings();
    return currentListings
      .filter((listing: any) => listing.allocated)
      .map((listing: any) => parseInt(listing.id, 10));
  }, [getCurrentListings]);

  // const saveAssignments = useCallback(
  //   async (specificListingIds?: number[]): Promise<void> => {
  //     if (!employeeId) {
  //       throw new Error("Employee ID is required");
  //     }

  //     setSaveLoading(true);
  //     setSaveError(null);

  //     try {
  //       // Use provided IDs or get current assigned IDs
  //       const assignedIds = specificListingIds || getAssignedListingIds();

  //       const payload = {
  //         id: employeeId,
  //         listId: assignedIds,
  //       };

  //       await saveAssignListings(payload);

  //       // Update original assigned IDs after successful save
  //       setOriginalAssignedIds(assignedIds.map((id) => id.toString()));

  //       // Refresh data to reflect server state
  //       // await fetchActiveAccounts();
  //     } catch (error: any) {
  //       setSaveError(error.message || "Failed to save listing assignments");
  //       throw error;
  //     } finally {
  //       setSaveLoading(false);
  //     }
  //   },
  //   [employeeId, getAssignedListingIds, fetchActiveAccounts]
  // );

  const saveAssignments = useCallback(
    async (listingUpdate?: { id: string; isActive: number }): Promise<void> => {
      if (!employeeId) throw new Error("Employee ID is required");

      setSaveLoading(true);
      setSaveError(null);

      try {
        let payload;
        if (listingUpdate) {
          payload = {
            id: employeeId,
            listId: [parseInt(listingUpdate.id, 10)],
            isActive: listingUpdate.isActive,
          };
        } else {
          // fallback: full save (not used on toggle, but safe for manual Save button)
          payload = {
            id: employeeId,
            listId: getAssignedListingIds(),
          };
        }

        await saveAssignListings(payload);
      } catch (error: any) {
        setSaveError(error.message || "Failed to save listing assignments");
        throw error;
      } finally {
        setSaveLoading(false);
      }
    },
    [employeeId, getAssignedListingIds]
  );

  const hasUnsavedChanges = useCallback((): boolean => {
    const currentAssignedIds = getAssignedListingIds()
      .map((id) => id.toString())
      .sort();
    const originalIds = [...originalAssignedIds].sort();

    return JSON.stringify(currentAssignedIds) !== JSON.stringify(originalIds);
  }, [getAssignedListingIds, originalAssignedIds]);

  return {
    data,
    accountData,
    accounts: data?.accounts || [],
    accountsWithAll: getAccountsWithAll(),
    listings: getCurrentListings(),
    totalAssignListings: data?.totalAssignListings || 0,
    assignListingIds: data?.assignListingIds || [],
    totalListings:
      selectedAccountId && accountData
        ? accountData.totalListings
        : data?.totalListings || 0,
    pagination: getCurrentPagination(),
    loading: loading || accountLoading,
    error,
    refetch,
    searchByAccount,
    toggleListingAssignment,
    isListingAssigned,
    selectedAccountId,
    clearAccountSearch: useCallback(() => {
      setSelectedAccountId(null);
      setAccountData(null);
    }, []),
    getAssignedListingIds,
    saveAssignments,
    hasUnsavedChanges,
    saveLoading,
    saveError,
  };
};
