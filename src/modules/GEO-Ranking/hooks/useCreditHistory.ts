import { useState, useCallback, useMemo } from 'react';
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

  const fetchCreditHistory = useCallback(async () => {
    const response = await getGeoCreditHistory({
      page: 1,
      limit: 1000, // Fetch more records to filter locally
      search: '', // Empty search to get all records
    });
    return response.data.creditHistory.map(mapApiCreditHistoryItem);
  }, []);

  const query = useQuery({
    queryKey: ['credit-history'],
    queryFn: fetchCreditHistory,
  });

  // Filter credit history locally based on search term
  const filteredCreditHistory = useMemo(() => {
    if (!query.data) return [];
    
    if (!debouncedSearchTerm) return query.data;
    
    return query.data.filter(item => 
      item.keyword.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [query.data, debouncedSearchTerm]);

  // Paginate the filtered results
  const paginatedCreditHistory = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredCreditHistory.slice(startIndex, endIndex);
  }, [filteredCreditHistory, currentPage, pageSize]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSearchChange = useCallback((search: string) => {
    setSearchTerm(search);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  return {
    creditHistory: paginatedCreditHistory,
    isLoading: query.isLoading,
    error: query.error,
    currentPage,
    pageSize,
    searchTerm,
    totalResults: filteredCreditHistory.length,
    handlePageChange,
    handleSearchChange,
  };
};