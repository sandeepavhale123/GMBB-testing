import { useState, useCallback } from 'react';
import { getKeywordPositionDetailsPublic, GetKeywordPositionDetailsResponse } from '@/api/leadPublicApi';

export interface Competitor {
  position: number;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  selected?: boolean;
}

interface UseLeadKeywordPositionDetailsReturn {
  data: { competitors: Competitor[]; coordinates: string } | null;
  loading: boolean;
  error: string | null;
  fetchPositionDetails: (positionId: number) => Promise<void>;
}

export const useLeadKeywordPositionDetails = (): UseLeadKeywordPositionDetailsReturn => {
  const [data, setData] = useState<{ competitors: Competitor[]; coordinates: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPositionDetails = useCallback(async (positionId: number) => {
    if (!positionId) {
      setError('Position ID is required');
      return;
    }

    // Clear previous data before starting new fetch
    setData(null);
    setLoading(true);
    setError(null);

    try {
      const response = await getKeywordPositionDetailsPublic({ positionId });
      
      // Transform API response to match modal interface
      const competitors: Competitor[] = response.data.keywordDetails.map(competitor => ({
        position: competitor.position,
        name: competitor.name,
        address: competitor.address,
        rating: competitor.rating ? parseFloat(competitor.rating) : 0,
        reviewCount: competitor.review ? parseInt(competitor.review) : 0,
        selected: competitor.selected
      }));

      setData({
        competitors,
        coordinates: response.data.coordinate
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch keyword position details');
      console.error('Error fetching lead keyword position details:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    fetchPositionDetails
  };
};

export type { GetKeywordPositionDetailsResponse };