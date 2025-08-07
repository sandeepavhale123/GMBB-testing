import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { fetchBulkMediaOverview, clearBulkMediaOverviewError } from '@/store/slices/mediaSlice';

export const useBulkMediaOverview = (initialPage = 1, initialLimit = 10) => {
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialLimit);
  
  const { 
    bulkMediaOverview, 
    bulkMediaOverviewLoading: loading, 
    bulkMediaOverviewError: error,
    bulkMediaOverviewPagination: pagination
  } = useAppSelector((state) => state.media);

  const fetchData = useCallback((page: number, limit: number) => {
    dispatch(fetchBulkMediaOverview({ page, limit }));
  }, [dispatch]);

  useEffect(() => {
    fetchData(currentPage, itemsPerPage);
  }, [fetchData, currentPage, itemsPerPage]);

  const refresh = useCallback(() => {
    fetchData(currentPage, itemsPerPage);
  }, [fetchData, currentPage, itemsPerPage]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const nextPage = useCallback(() => {
    if (pagination.hasNext) {
      setCurrentPage(prev => prev + 1);
    }
  }, [pagination.hasNext]);

  const prevPage = useCallback(() => {
    if (pagination.hasPrevious) {
      setCurrentPage(prev => prev - 1);
    }
  }, [pagination.hasPrevious]);

  const clearError = useCallback(() => {
    dispatch(clearBulkMediaOverviewError());
  }, [dispatch]);

  return {
    bulkMedia: bulkMediaOverview,
    loading,
    error,
    pagination,
    currentPage,
    itemsPerPage,
    refresh,
    goToPage,
    nextPage,
    prevPage,
    clearError,
  };
};