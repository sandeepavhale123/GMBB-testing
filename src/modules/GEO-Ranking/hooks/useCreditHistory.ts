import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { getGeoCreditHistory } from '@/api/geoRankingApi';
import type { CreditHistoryItem, CreditHistoryRequest } from '../types';
import { useDebounce } from '@/hooks/useDebounce';

const mapApiCreditHistoryItem = (item: any, index: number): CreditHistoryItem => ({
  id: `${index + 1}`,
  keyword: item.keyword,
  credit: parseInt(item.credit, 10),
  date: format(new Date(item.created_at), 'MMM dd, yyyy'),
  type: item.type,
});

export const useCreditHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize] = useState(10);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchCreditHistory = useCallback(async (params: CreditHistoryRequest) => {
    const response = await getGeoCreditHistory(params);
    return response.data.creditHistory.map(mapApiCreditHistoryItem);
  }, []);

  const query = useQuery({
    queryKey: ['credit-history', currentPage, debouncedSearchTerm, pageSize],
    queryFn: () => fetchCreditHistory({
      page: currentPage,
      limit: pageSize,
      search: debouncedSearchTerm,
    }),
  });

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSearchChange = useCallback((search: string) => {
    setSearchTerm(search);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  return {
    creditHistory: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    currentPage,
    pageSize,
    searchTerm,
    handlePageChange,
    handleSearchChange,
  };
};