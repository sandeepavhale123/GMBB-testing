import { useState, useEffect, useCallback } from "react";
import {
  googleAccountApi,
  GoogleAccountRequest,
  GoogleAccountResponse,
  RefreshAccountResponse,
  UpdateAccountResponse,
} from "../api/googleAccountApi";

export interface UseGoogleAccountsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortOrder?: "asc" | "desc";
}

export const useGoogleAccounts = (params: UseGoogleAccountsParams = {}) => {
  const [data, setData] = useState<GoogleAccountResponse["data"] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { page = 1, limit = 10, search = "", sortOrder = "asc" } = params;

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const request: GoogleAccountRequest = {
        pagination: {
          page,
          limit,
          offset: (page - 1) * limit,
        },
        filters: { search },
        sorting: { sortOrder },
      };

      const response = await googleAccountApi.getAccounts(request);
      setData(response.data);
    } catch (err: any) {
      console.error("Error fetching Google accounts:", err);
      setError(
        err.response?.data?.message || "Failed to fetch Google accounts"
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, sortOrder]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const refetch = useCallback(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const deleteAccount = useCallback(
    async (accountId: string) => {
      setIsDeleting(true);
      try {
        const response = await googleAccountApi.deleteAccount(accountId);
        await fetchAccounts(); // Refresh list after deletion
        return response;
        // eslint-disable-next-line no-useless-catch
      } catch (error) {
        throw error;
      } finally {
        setIsDeleting(false);
      }
    },
    [fetchAccounts]
  );

  const refreshAccount = useCallback(
    async (accountId: string): Promise<RefreshAccountResponse> => {
      setIsRefreshing(true);
      try {
        const response = await googleAccountApi.refreshAccount(accountId);
        return response;
        // eslint-disable-next-line no-useless-catch
      } catch (error) {
        throw error;
      } finally {
        setIsRefreshing(false);
      }
    },
    []
  );

  const updateAccount = useCallback(
    async (
      accountId: string,
      accountGrpIds: [string, string][]
    ): Promise<UpdateAccountResponse> => {
      setIsUpdating(true);
      try {
        const response = await googleAccountApi.updateAccount(
          accountId,
          accountGrpIds
        );
        await fetchAccounts(); // Refresh list after update
        return response;
        // eslint-disable-next-line no-useless-catch
      } catch (error) {
        throw error;
      } finally {
        setIsUpdating(false);
      }
    },
    [fetchAccounts]
  );

  return {
    accounts: data?.accounts || [],
    totalActiveListings: data?.totalActiveListings || 0,
    totalAccounts: data?.totalAccounts || 0,
    allowedListing: data?.allowedListing || 0,
    pagination: data?.pagination,
    loading,
    error,
    refetch,
    deleteAccount,
    isDeleting,
    refreshAccount,
    isRefreshing,
    updateAccount,
    isUpdating,
  };
};
