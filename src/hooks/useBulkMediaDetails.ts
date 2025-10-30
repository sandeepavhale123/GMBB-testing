import { useEffect, useState, useCallback, useMemo } from 'react';
import { getBulkMediaDetails, deleteMediaFromBulk } from '@/api/mediaApi';
import type { BulkMediaDetailsResponse } from '@/api/mediaApi';

export const useBulkMediaDetails = (bulkId: string) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [bulkMediaDetails, setBulkMediaDetails] = useState<BulkMediaDetailsResponse['data'] | null>(null);
  const [stableBulkMedia, setStableBulkMedia] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!bulkId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getBulkMediaDetails({ 
        bulkId: parseInt(bulkId),
        search,
        status,
        page: currentPage, 
        limit: itemsPerPage 
      });
      
      if (response.code === 200) {
        setBulkMediaDetails(response.data);
        
        // Only update stable media data if MediaSummary exists (not empty)
        if (response.data.MediaSummary && response.data.MediaSummary.length > 0 && !stableBulkMedia) {
          const mediaData = response.data.MediaSummary[0];
          setStableBulkMedia({
            id: bulkId,
            title: '',
            description: '',
            category: mediaData.category,
            mediaType: mediaData.mediaType,
            publishDate: mediaData.publishDate,
            tags: mediaData.tags ? [mediaData.tags] : [],
            status: 'live',
            media: {
              image: mediaData.image,
              video: ''
            }
          });
        }
      } else {
        setError(response.message || 'Failed to fetch media details');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch media details');
    } finally {
      setLoading(false);
    }
  }, [bulkId, currentPage, itemsPerPage, search, status]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const deleteMedia = useCallback(async (mediaId: string) => {
    try {
      const response = await deleteMediaFromBulk({ mediaId: [parseInt(mediaId)] });
      if (response.code === 200) {
        return { type: 'fulfilled', payload: { mediaId } };
      } else {
        throw new Error(response.message || 'Failed to delete media');
      }
    } catch (error) {
      throw error;
    }
  }, []);

  // Transform dynamic media data (for table)
  const medias = useMemo(() => 
    bulkMediaDetails?.bulkMediaDetails?.map(media => ({
      id: media.id,
      listingName: media.locationName,
      business: media.locationName,
      status: media.state,
      zipcode: media.zipCode,
      searchUrl: '',
      image: media.image,
      reason: media.reason
    })) || []
  , [bulkMediaDetails?.bulkMediaDetails]);

  const pagination = useMemo(() => bulkMediaDetails?.pagination, [bulkMediaDetails?.pagination]);

  // Stable callbacks to prevent re-renders
  const stableDeleteMedia = useCallback(deleteMedia, []);
  const stableRefresh = useCallback(refresh, [refresh]);
  const stableSetCurrentPage = useCallback(setCurrentPage, []);
  const stableSetSearch = useCallback(setSearch, []);
  const stableSetStatus = useCallback(setStatus, []);

  return {
    bulkMedia: stableBulkMedia,
    medias,
    pagination,
    loading,
    error,
    refresh: stableRefresh,
    deleteMedia: stableDeleteMedia,
    currentPage,
    setCurrentPage: stableSetCurrentPage,
    itemsPerPage,
    search,
    setSearch: stableSetSearch,
    status,
    setStatus: stableSetStatus,
  };
};