import { useState, useEffect } from 'react';
import { getKeywords, getKeywordDetails, getKeywordPositionDetails, checkKeywordStatus, KeywordData, KeywordDetailsResponse, Credits, KeywordPositionResponse } from '../api/geoRankingApi';
import { useToast } from './use-toast';

export const useGeoRanking = (listingId: number) => {
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [keywordDetails, setKeywordDetails] = useState<KeywordDetailsResponse['data'] | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [loading, setLoading] = useState(false);
  const [keywordsLoading, setKeywordsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [keywordChanging, setKeywordChanging] = useState(false);
  const [dateChanging, setDateChanging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [positionDetailsLoading, setPositionDetailsLoading] = useState(false);
  const [processingKeywords, setProcessingKeywords] = useState<string[]>([]);
  const [isPolling, setIsPolling] = useState(false);
  const { toast } = useToast();

  // Fetch keywords on component mount
  useEffect(() => {
    const fetchKeywords = async () => {
      if (!listingId) return;
      
      setKeywordsLoading(true);
      setPageLoading(true);
      setError(null);
      
      try {
        const response = await getKeywords(listingId);
        if (response.code === 200) {
          setKeywords(response.data.keywords);
          setCredits(response.data.credits);
          // Set first keyword as default
          if (response.data.keywords.length > 0) {
            const firstKeyword = response.data.keywords[0];
            setSelectedKeyword(firstKeyword.id);
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
        setPageLoading(false);
      }
    };

    fetchKeywords();
  }, [listingId, toast]);

  // Keyword status polling effect
  useEffect(() => {
    if (!listingId) return;

    let interval: NodeJS.Timeout | null = null;

    const pollKeywordStatus = async () => {
      try {
        const response = await checkKeywordStatus(listingId);
        if (response.code === 200 && response.data.keywords.length > 0) {
          const keywordNames = response.data.keywords.map(k => k.keyword);
          setProcessingKeywords(keywordNames);
          setIsPolling(true);
        } else {
          // Stop polling when keywords array is empty
          setProcessingKeywords([]);
          setIsPolling(false);
          if (interval) {
            clearInterval(interval);
            interval = null;
          }
        }
      } catch (error) {
        console.error('Error checking keyword status:', error);
        setProcessingKeywords([]);
        setIsPolling(false);
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      }
    };

    // Initial check
    pollKeywordStatus();

    // Set up polling interval
    interval = setInterval(pollKeywordStatus, 5000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [listingId]);

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
          // Set the most recent date as default
          if (response.data.dates && response.data.dates.length > 0) {
            const sortedDates = response.data.dates
              .filter(d => d.date)
              .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());
            
            if (sortedDates.length > 0) {
              setSelectedDate(sortedDates[0].id);
            }
          }
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
        setKeywordChanging(false);
        setDateChanging(false);
      }
    };

    fetchKeywordDetails();
  }, [listingId, selectedKeyword, toast]);

  const fetchPositionDetails = async (keywordId: string, positionId: string): Promise<KeywordPositionResponse | null> => {
    if (!listingId) return null;
    
    setPositionDetailsLoading(true);
    
    try {
      const response = await getKeywordPositionDetails(listingId, keywordId, positionId);
      if (response.code === 200) {
        return response;
      } else {
        throw new Error(response.message || 'Failed to fetch position details');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch position details';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    } finally {
      setPositionDetailsLoading(false);
    }
  };

  const handleKeywordChange = (keywordId: string) => {
    setKeywordChanging(true);
    setSelectedKeyword(keywordId);
    setSelectedDate(''); // Reset date when keyword changes
  };

  const handleDateChange = (dateId: string) => {
    setDateChanging(true);
    setSelectedDate(dateId);
  };

  return {
    keywords,
    selectedKeyword,
    selectedDate,
    keywordDetails,
    credits,
    loading,
    keywordsLoading,
    pageLoading,
    keywordChanging,
    dateChanging,
    error,
    positionDetailsLoading,
    processingKeywords,
    isPolling,
    fetchPositionDetails,
    handleKeywordChange,
    handleDateChange
  };
};
