import { useEffect, useState, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { fetchBulkPostDetails, deletePostFromBulk } from '@/store/slices/postsSlice';

export const useBulkPostTable = (bulkId: string) => {
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const { 
    bulkPostDetails, 
    bulkPostDetailsLoading: loading, 
    bulkPostDetailsError: error
  } = useAppSelector((state) => state.posts);

  const fetchData = useCallback(() => {
    if (bulkId) {
      dispatch(fetchBulkPostDetails({ 
        bulkId, 
        search: searchQuery,
        status: statusFilter,
        page: currentPage, 
        limit: itemsPerPage 
      }));
    }
  }, [dispatch, bulkId, searchQuery, statusFilter, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const deletePost = useCallback(async (postId: string) => {
    try {
      await dispatch(deletePostFromBulk({ postId })).unwrap();
      return { type: 'fulfilled', payload: { postId } };
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const updateSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  const updateStatusFilter = useCallback((status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  // Transform table data
  const tableData = useMemo(() => ({
    posts: bulkPostDetails?.bulkPostDetails?.map(post => ({
      id: post.id,
      listingName: post.locationName,
      business: post.locationName,
      status: post.state,
      zipcode: post.zipCode,
      searchUrl: post.search_url
    })) || [],
    pagination: bulkPostDetails?.pagination
  }), [bulkPostDetails?.bulkPostDetails, bulkPostDetails?.pagination]);

  return {
    posts: tableData.posts,
    pagination: tableData.pagination,
    loading,
    error,
    refresh,
    deletePost,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    searchQuery,
    updateSearchQuery,
    statusFilter,
    updateStatusFilter,
  };
};