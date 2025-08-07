import { useEffect, useState, useCallback } from 'react';
import { getBulkMediaDetails, deleteMediaFromBulk } from '@/api/mediaApi';
import type { BulkMediaDetailsResponse } from '@/api/mediaApi';

export const useBulkMediaDetails = (bulkId: string) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [bulkMediaDetails, setBulkMediaDetails] = useState<BulkMediaDetailsResponse['data'] | null>(null);
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

  // Transform API data to match component expectations
  const transformedData = bulkMediaDetails ? {
    bulkMedia: bulkMediaDetails.MediaSummary?.[0] ? {
      id: bulkId,
      title: '', // Not provided in API
      description: '', // Not provided in API
      category: bulkMediaDetails.MediaSummary[0].category,
      mediaType: bulkMediaDetails.MediaSummary[0].mediaType,
      publishDate: bulkMediaDetails.MediaSummary[0].publishDate,
      tags: bulkMediaDetails.MediaSummary[0].tags ? [bulkMediaDetails.MediaSummary[0].tags] : [],
      status: 'live', // Default status
      media: {
        image: bulkMediaDetails.MediaSummary[0].image,
        video: '' // Not provided in API
      }
    } : null,
    medias: bulkMediaDetails.bulkMediaDetails?.map(media => ({
      id: media.id,
      listingName: media.locationName,
      business: media.locationName,
      status: media.state,
      zipcode: media.zipCode,
      searchUrl: '', // Not provided in current API
      image: media.image
    })) || [],
    pagination: bulkMediaDetails.pagination
  } : null;

  return {
    bulkMedia: transformedData?.bulkMedia,
    medias: transformedData?.medias || [],
    pagination: transformedData?.pagination,
    loading,
    error,
    refresh,
    deleteMedia,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    search,
    setSearch,
    status,
    setStatus,
  };
};