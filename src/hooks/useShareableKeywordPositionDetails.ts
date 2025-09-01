import { useState, useCallback } from 'react';
import { getShareableKeywordPositionDetails, ShareableKeywordPositionDetailsResponse } from '@/api/geoRankingApi';

interface UseShareableKeywordPositionDetailsOptions {
  reportId: string;
  keywordId: number;
}

interface UseShareableKeywordPositionDetailsReturn {
  data: ShareableKeywordPositionDetailsResponse | null;
  loading: boolean;
  error: string | null;
  fetchPositionDetails: (positionId: number) => Promise<void>;
}

export const useShareableKeywordPositionDetails = ({ 
  reportId, 
  keywordId 
}: UseShareableKeywordPositionDetailsOptions): UseShareableKeywordPositionDetailsReturn => {
  const [data, setData] = useState<ShareableKeywordPositionDetailsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPositionDetails = useCallback(async (positionId: number) => {
    if (!reportId || !keywordId) {
      setError('Missing required parameters');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getShareableKeywordPositionDetails({
        reportId,
        keywordId,
        positionId
      });
      setData(response);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch keyword position details');
      console.error('Error fetching shareable keyword position details:', err);
    } finally {
      setLoading(false);
    }
  }, [reportId, keywordId]);

  return {
    data,
    loading,
    error,
    fetchPositionDetails
  };
};

export type { ShareableKeywordPositionDetailsResponse };