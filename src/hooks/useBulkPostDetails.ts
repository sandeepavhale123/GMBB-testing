import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { fetchBulkPostDetails, deletePostFromBulk } from '@/store/slices/postsSlice';

export const useBulkPostDetails = (bulkId: string) => {
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [initialBulkPost, setInitialBulkPost] = useState<any>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
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

  // Store initial bulk post data on first load
  useEffect(() => {
    if (bulkPostDetails?.postSummary?.[0] && isInitialLoad) {
      const initialPost = {
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
      setInitialBulkPost(initialPost);
      setIsInitialLoad(false);
    }
  }, [bulkPostDetails, bulkId, isInitialLoad]);

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

  // Transform API data to match component expectations
  const transformedData = bulkPostDetails ? {
    bulkPost: bulkPostDetails.postSummary?.[0] ? {
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
    } : null,
    posts: bulkPostDetails.bulkPostDetails?.map(post => ({
      id: post.id,
      listingName: post.locationName,
      business: post.locationName,
      status: post.state,
      zipcode: post.zipCode,
      searchUrl: post.search_url
    })) || [],
    pagination: bulkPostDetails.pagination
  } : null;

  return {
    bulkPost: initialBulkPost || transformedData?.bulkPost,
    posts: transformedData?.posts || [],
    pagination: transformedData?.pagination,
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