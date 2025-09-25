import { useState, useEffect, useCallback } from 'react';
import { csvApi, GetBulkCSVHistoryRequest, BulkCSVHistoryRecord } from '@/api/csvApi';
import { useDebounce } from '@/hooks/useDebounce';

interface UseBulkCSVHistoryResult {
  data: BulkCSVHistoryRecord[];
  loading: boolean;
  searchLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
}

export const useBulkCSVHistory = (limit: number = 10): UseBulkCSVHistoryResult => {
  const [data, setData] = useState<BulkCSVHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit,
    total: 0
  });

  // Debounce search term by 3 seconds
  const debouncedSearchTerm = useDebounce(searchTerm, 3000);

  const fetchHistory = useCallback(async (currentPage: number, search: string, isSearch: boolean = false) => {
    try {
      if (isSearch) {
        setSearchLoading(true);
      } else {
        setLoading(true);
      }
      
      setError(null);

      const request: GetBulkCSVHistoryRequest = {
        page: currentPage,
        limit,
        search
      };

      const response = await csvApi.getBulkCSVHistory(request);
      
      if (response.code === 200) {
        setData(response.data.history);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || 'Failed to fetch CSV history');
      }
    } catch (err: any) {
      console.error('Error fetching CSV history:', err);
      setError(err.response?.data?.message || 'An error occurred while fetching CSV history');
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  }, [limit]);

  // Initial load
  useEffect(() => {
    fetchHistory(1, '', false);
  }, [fetchHistory]);

  // Handle debounced search
  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) return; // Only proceed when search is actually debounced
    
    setPage(1); // Reset to first page on search
    fetchHistory(1, debouncedSearchTerm, true);
  }, [debouncedSearchTerm, fetchHistory]);

  // Handle page changes
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    fetchHistory(newPage, debouncedSearchTerm, false);
  }, [debouncedSearchTerm, fetchHistory]);

  const refetch = useCallback(() => {
    return fetchHistory(page, debouncedSearchTerm, false);
  }, [fetchHistory, page, debouncedSearchTerm]);

  return {
    data,
    loading,
    searchLoading,
    error,
    pagination,
    searchTerm,
    setSearchTerm,
    setPage: handlePageChange,
    refetch
  };
};