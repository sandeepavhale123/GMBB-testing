
import { useState, useEffect } from 'react';
import { getKeywords, getKeywordDetails, KeywordData, KeywordDetailsResponse } from '../api/geoRankingApi';
import { useToast } from './use-toast';

export const useGeoRanking = (listingId: number) => {
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<string>('');
  const [keywordDetails, setKeywordDetails] = useState<KeywordDetailsResponse['data'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [keywordsLoading, setKeywordsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch keywords on component mount
  useEffect(() => {
    const fetchKeywords = async () => {
      if (!listingId) return;
      
      setKeywordsLoading(true);
      setError(null);
      
      try {
        const response = await getKeywords(listingId);
        if (response.code === 200) {
          setKeywords(response.data.keywords);
          // Set first keyword as default
          if (response.data.keywords.length > 0) {
            setSelectedKeyword(response.data.keywords[0].id);
          }
        } else {
          throw new Error(response.message || 'Failed to fetch keywords');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch keywords';
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      } finally {
        setKeywordsLoading(false);
      }
    };

    fetchKeywords();
  }, [listingId, toast]);

  // Fetch keyword details when selected keyword changes
  useEffect(() => {
    const fetchKeywordDetails = async () => {
      if (!listingId || !selectedKeyword) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await getKeywordDetails(listingId, selectedKeyword);
        if (response.code === 200) {
          setKeywordDetails(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch keyword details');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch keyword details';
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchKeywordDetails();
  }, [listingId, selectedKeyword, toast]);

  const handleKeywordChange = (keywordId: string) => {
    setSelectedKeyword(keywordId);
  };

  return {
    keywords,
    selectedKeyword,
    keywordDetails,
    loading,
    keywordsLoading,
    error,
    handleKeywordChange
  };
};
