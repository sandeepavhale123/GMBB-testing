import { useEffect, useState, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { fetchBulkPostDetails, deletePostFromBulk } from '@/store/slices/postsSlice';

export const useBulkPostDetails = (bulkId: string) => {
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stableBulkPost, setStableBulkPost] = useState<any>(null);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  
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

  // Store stable bulk post data on first successful load - never update after this
  useEffect(() => {
    if (bulkPostDetails?.postSummary?.[0] && !isInitialLoadComplete) {
      const stablePost = {
        id: bulkId,
        title: bulkPostDetails.postSummary[0].event_title || bulkPostDetails.postSummary[0].posttype,
        content: bulkPostDetails.postSummary[0].posttext,
        status: bulkPostDetails.postSummary[0].state,
        publishDate: bulkPostDetails.postSummary[0].publishDate,
        tags: bulkPostDetails.postSummary[0].tags,
        media: {
          images: bulkPostDetails.postSummary[0].image
        },
        actionType: bulkPostDetails.postSummary[0].action_type,
        ctaUrl: bulkPostDetails.postSummary[0].CTA_url
      };
      setStableBulkPost(stablePost);
      setIsInitialLoadComplete(true);
    }
  }, [bulkPostDetails, bulkId, isInitialLoadComplete]);

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

  // Transform table data only (posts and pagination) - this is what changes on API calls
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
    // Stable data - never changes after initial load
    bulkPost: stableBulkPost,
    
    // Dynamic table data - changes on API calls
    posts: tableData.posts,
    pagination: tableData.pagination,
    
    // State and actions
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