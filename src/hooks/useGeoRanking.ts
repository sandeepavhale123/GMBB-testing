
import { useState, useEffect } from 'react';
import { getKeywords, getKeywordDetails, KeywordData, KeywordDetailsResponse } from '../api/geoRankingApi';
import { useToast } from './use-toast';

export const useGeoRanking = (listingId: number) => {
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [keywordDetails, setKeywordDetails] = useState<KeywordDetailsResponse['data'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [keywordsLoading, setKeywordsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [keywordChanging, setKeywordChanging] = useState(false);
  const [dateChanging, setDateChanging] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
          // Set first keyword as default and its date
          if (response.data.keywords.length > 0) {
            const firstKeyword = response.data.keywords[0];
            setSelectedKeyword(firstKeyword.id);
            if (firstKeyword.date) {
              setSelectedDate(firstKeyword.date);
            }
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

  // Fetch keyword details when selected keyword or date changes
  useEffect(() => {
    const fetchKeywordDetails = async () => {
      if (!listingId || !selectedKeyword) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await getKeywordDetails(listingId, selectedKeyword);
        if (response.code === 200) {
          setKeywordDetails(response.data);
          // Set previous reports date on initial page load if available
          if (!selectedDate && response.data.dates && response.data.dates.length > 1) {
            // Find the second most recent date (previous report)
            const sortedDates = response.data.dates
              .filter(d => d.date)
              .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());
            
            if (sortedDates.length > 1) {
              setSelectedDate(sortedDates[1].id);
            } else if (sortedDates.length > 0) {
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
  }, [listingId, selectedKeyword, selectedDate, toast]);

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
    loading,
    keywordsLoading,
    pageLoading,
    keywordChanging,
    dateChanging,
    error,
    handleKeywordChange,
    handleDateChange
  };
};
