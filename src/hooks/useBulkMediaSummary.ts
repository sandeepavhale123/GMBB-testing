import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { fetchBulkMediaSummary } from '@/store/slices/mediaSlice';

export const useBulkMediaSummary = (bulkId: string) => {
  const dispatch = useAppDispatch();
  
  const {
    bulkMediaSummary,
    bulkMediaSummaryLoading,
    bulkMediaSummaryError
  } = useAppSelector(state => state.media);

  // Fetch data when bulkId changes
  useEffect(() => {
    if (bulkId) {
      dispatch(fetchBulkMediaSummary({ bulkId: parseInt(bulkId) }));
    }
  }, [bulkId, dispatch]);

  // Transform the API response to match component expectations
  const transformedBulkMedia = useMemo(() => {
    if (!bulkMediaSummary) return null;

    return {
      id: bulkMediaSummary.bulkId,
      title: `${bulkMediaSummary.category} Media`,
      description: bulkMediaSummary.tags || 'No description available',
      category: bulkMediaSummary.category,
      mediaType: bulkMediaSummary.mediaType,
      publishDate: bulkMediaSummary.publishDate,
      tags: bulkMediaSummary.tags ? [bulkMediaSummary.tags] : [],
      status: 'published', // Default status since it's not in the API response
      media: {
        image: bulkMediaSummary.image,
        video: bulkMediaSummary.mediaType === 'video' ? bulkMediaSummary.image : ''
      }
    };
  }, [bulkMediaSummary]);

  return {
    bulkMedia: transformedBulkMedia,
    loading: bulkMediaSummaryLoading,
    error: bulkMediaSummaryError
  };
};