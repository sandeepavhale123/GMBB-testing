
import { useState, useEffect, useCallback } from 'react';
import { googleAccountApi, GoogleAccountRequest, GoogleAccountResponse } from '../api/googleAccountApi';

export interface UseGoogleAccountsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortOrder?: 'asc' | 'desc';
}

export const useGoogleAccounts = (params: UseGoogleAccountsParams = {}) => {
  const [data, setData] = useState<GoogleAccountResponse['data'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    page = 1,
    limit = 10,
    search = '',
    sortOrder = 'asc'
  } = params;

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
        filters: {
          search,
        },
        sorting: {
          sortOrder,
        },
      };

      const response = await googleAccountApi.getAccounts(request);
      setData(response.data);
    } catch (err: any) {
      console.error('Error fetching Google accounts:', err);
      setError(err.response?.data?.message || 'Failed to fetch Google accounts');
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

  return {
    accounts: data?.accounts || [],
    totalActiveListings: data?.totalActiveListings || 0,
    totalAccounts: data?.totalAccounts || 0,
    pagination: data?.pagination,
    loading,
    error,
    refetch,
  };
};
