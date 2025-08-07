import { useEffect, useState, useCallback } from 'react';
import { getBulkMediaDetails, deleteMediaFromBulk } from '@/api/mediaApi';
import type { BulkMediaDetailsResponse } from '@/api/mediaApi';

export const useBulkMediaDetails = (bulkId: string) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [bulkMediaDetails, setBulkMediaDetails] = useState<BulkMediaDetailsResponse['data'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!bulkId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getBulkMediaDetails({ 
        bulkId, 
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
  }, [bulkId, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const deleteMedia = useCallback(async (mediaId: string) => {
    try {
      const response = await deleteMediaFromBulk({ mediaId });
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
    bulkMedia: bulkMediaDetails.mediaSummary?.[0] ? {
      id: bulkId,
      title: bulkMediaDetails.mediaSummary[0].title,
      description: bulkMediaDetails.mediaSummary[0].description,
      category: bulkMediaDetails.mediaSummary[0].category,
      mediaType: bulkMediaDetails.mediaSummary[0].mediaType,
      publishDate: bulkMediaDetails.mediaSummary[0].publishDate,
      tags: bulkMediaDetails.mediaSummary[0].tags,
      status: bulkMediaDetails.mediaSummary[0].status,
      media: {
        image: bulkMediaDetails.mediaSummary[0].image,
        video: bulkMediaDetails.mediaSummary[0].video
      }
    } : null,
    medias: bulkMediaDetails.bulkMediaDetails?.map(media => ({
      id: media.id,
      listingName: media.locationName,
      business: media.locationName,
      status: media.state,
      zipcode: media.zipCode,
      searchUrl: media.search_url
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
  };
};