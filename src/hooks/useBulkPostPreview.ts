import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { fetchBulkPostDetails } from '@/store/slices/postsSlice';

export const useBulkPostPreview = (bulkId: string) => {
  const dispatch = useAppDispatch();
  
  const { 
    stableBulkPostData, 
    stableBulkPostDataLoading: loading, 
    stableBulkPostDataError: error
  } = useAppSelector((state) => state.posts);

  const fetchStableData = useCallback(() => {
    if (bulkId && !stableBulkPostData) {
      // Only fetch if we don't have stable data yet
      dispatch(fetchBulkPostDetails({ 
        bulkId, 
        search: '',
        status: 'all',
        page: 1, 
        limit: 10 
      }));
    }
  }, [dispatch, bulkId, stableBulkPostData]);

  useEffect(() => {
    fetchStableData();
  }, [fetchStableData]);

  // Transform stable data to the expected format
  const bulkPost = stableBulkPostData?.postSummary?.[0] ? {
    id: bulkId,
    title: stableBulkPostData.postSummary[0].event_title || stableBulkPostData.postSummary[0].posttype,
    content: stableBulkPostData.postSummary[0].posttext,
    status: stableBulkPostData.postSummary[0].state,
    publishDate: stableBulkPostData.postSummary[0].publishDate,
    tags: stableBulkPostData.postSummary[0].tags,
    media: {
      images: stableBulkPostData.postSummary[0].image
    },
    actionType: stableBulkPostData.postSummary[0].action_type,
    ctaUrl: stableBulkPostData.postSummary[0].CTA_url
  } : null;

  return {
    bulkPost,
    loading,
    error,
  };
};