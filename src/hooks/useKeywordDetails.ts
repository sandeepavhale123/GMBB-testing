import { useState, useEffect, useRef, useCallback } from 'react';
import { getKeywordDetails, getKeywordPositionDetails, KeywordDetailsResponse, KeywordPositionResponse } from '../api/geoRankingApi';
import { useToast } from './use-toast';

export const useKeywordDetails = (listingId: number, selectedKeyword: string, refreshMode = false) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [keywordDetails, setKeywordDetails] = useState<KeywordDetailsResponse['data'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [keywordChanging, setKeywordChanging] = useState(false);
  const [dateChanging, setDateChanging] = useState(false);
  const [positionDetailsLoading, setPositionDetailsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Add a ref to track if we should skip the next effect
  const skipNextEffect = useRef(false);

  // Function to manually fetch keyword details (used during refresh)
  const fetchKeywordDetailsManually = useCallback(async (keywordId: string, dateId?: string) => {
    if (!listingId || !keywordId) return;
    
    try {
      const response = await getKeywordDetails(listingId, keywordId, dateId);
      console.log('🗺️ fetchKeywordDetailsManually - API Response:', {
        code: response.code,
        rankDetailsCount: response.data?.rankDetails?.length || 0,
        keywordId,
        dateId
      });
      
      if (response.code === 200) {
        setKeywordDetails(response.data);
        // Set the most recent date as default only if no date was specified
        if (!dateId && response.data.dates && response.data.dates.length > 0) {
          const sortedDates = response.data.dates
            .filter(d => d.date)
            .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());
          
          if (sortedDates.length > 0) {
            setSelectedDate(sortedDates[0].id);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching keyword details manually:', err);
    }
  }, [listingId]);

  // Fetch keyword details when selected keyword changes
  useEffect(() => {
    // Skip the effect during refresh mode to prevent blinking
    if (refreshMode || skipNextEffect.current) {
      skipNextEffect.current = false;
      return;
    }
    
    const fetchKeywordDetails = async () => {
      if (!listingId || !selectedKeyword) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await getKeywordDetails(listingId, selectedKeyword, selectedDate);
        console.log('🗺️ useKeywordDetails - API Response:', {
          code: response.code,
          hasData: !!response.data,
          rankDetailsCount: response.data?.rankDetails?.length || 0,
          rankDetails: response.data?.rankDetails,
          projectDetails: response.data?.projectDetails,
          selectedKeyword,
          selectedDate
        });
        
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
  }, [listingId, selectedKeyword, toast, refreshMode]);

  // Fetch keyword details when selectedDate changes
  useEffect(() => {
    const fetchKeywordDetailsByDate = async () => {
      if (!listingId || !selectedKeyword || !selectedDate || refreshMode) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await getKeywordDetails(listingId, selectedKeyword, selectedDate);
        console.log('🗺️ useKeywordDetails - Date Change API Response:', {
          code: response.code,
          hasData: !!response.data,
          rankDetailsCount: response.data?.rankDetails?.length || 0,
          selectedDate,
          selectedKeyword
        });
        
        if (response.code === 200) {
          setKeywordDetails(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch keyword details by date');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch keyword details by date';
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
        setDateChanging(false);
      }
    };

    fetchKeywordDetailsByDate();
  }, [listingId, selectedKeyword, selectedDate, toast, refreshMode]);

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

  const handleKeywordChange = (keywordId: string, isRefresh = false) => {
    // Only show changing state for user-initiated changes, not refresh
    if (!isRefresh) {
      setKeywordChanging(true);
    }
    setSelectedDate(''); // Reset date when keyword changes
  };

  const handleDateChange = (dateId: string, isRefresh = false) => {
    // Only show changing state for user-initiated changes, not refresh
    if (!isRefresh) {
      setDateChanging(true);
    }
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
    fetchKeywordDetailsManually,
    handleKeywordChange,
    handleDateChange
  };
};