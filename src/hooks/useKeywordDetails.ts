import { useState, useEffect } from 'react';
import { getKeywordDetails, getKeywordPositionDetails, KeywordDetailsResponse, KeywordPositionResponse } from '../api/geoRankingApi';
import { useToast } from './use-toast';

export const useKeywordDetails = (listingId: number, selectedKeyword: string) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [keywordDetails, setKeywordDetails] = useState<KeywordDetailsResponse['data'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [keywordChanging, setKeywordChanging] = useState(false);
  const [dateChanging, setDateChanging] = useState(false);
  const [positionDetailsLoading, setPositionDetailsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

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
    setSelectedDate(''); // Reset date when keyword changes
  };

  const handleDateChange = (dateId: string) => {
    setDateChanging(true);
    setSelectedDate(dateId);
  };

  return {
    selectedDate,
    setSelectedDate,
    keywordDetails,
    setKeywordDetails,
    loading,
    keywordChanging,
    dateChanging,
    positionDetailsLoading,
    error,
    fetchPositionDetails,
    handleKeywordChange,
    handleDateChange
  };
};