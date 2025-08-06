import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { fetchBulkPostsOverview, clearBulkPostsOverviewError, deleteBulkPost } from '@/store/slices/postsSlice';

export const useBulkPostsOverview = (initialPage = 1, initialLimit = 10) => {
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialLimit);
  
  const { 
    bulkPostsOverview, 
    bulkPostsOverviewLoading: loading, 
    bulkPostsOverviewError: error,
    bulkPostsOverviewPagination: pagination
  } = useAppSelector((state) => state.posts);

  const fetchData = useCallback((page: number, limit: number) => {
    dispatch(fetchBulkPostsOverview({ page, limit }));
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
    dispatch(clearBulkPostsOverviewError());
  }, [dispatch]);

  const deleteBulk = useCallback(async (bulkId: number) => {
    const result = await dispatch(deleteBulkPost({ bulkId }));
    return result;
  }, [dispatch]);

  return {
    bulkPosts: bulkPostsOverview,
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
    deleteBulk,
  };
};