
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getKeywordDetails, getKeywordPositionDetails, KeywordDetailsResponse, KeywordPositionResponse } from '../api/geoRankingApi';
import { useToast } from './use-toast';

export const useKeywordDetails = (listingId: number, selectedKeyword: string, refreshMode = false) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [keywordDetails, setKeywordDetails] = useState<KeywordDetailsResponse['data'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [keywordChanging, setKeywordChanging] = useState(false);
  const [dateChanging, setDateChanging] = useState(false);
  const [positionDetailsLoading, setPositionDetailsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Track initialization and current keyword for debugging
  const isInitializedRef = useRef(false);
  const currentKeywordRef = useRef<string>('');

  // Enhanced setSelectedDate to update URL params (now using 'id' parameter)
  const setSelectedDateWithURL = (dateId: string) => {
    console.log('🔄 setSelectedDateWithURL - Setting date:', dateId);
    setSelectedDate(dateId);
    
    // Update URL params - changed from 'date' to 'id'
    const newParams = new URLSearchParams(searchParams);
    if (dateId) {
      newParams.set('id', dateId);
    } else {
      newParams.delete('id');
    }
    setSearchParams(newParams);
  };

  // Function to manually fetch keyword details (used during refresh)
  const fetchKeywordDetailsManually = useCallback(async (keywordId: string, dateId?: string) => {
    if (!listingId || !keywordId) return;
    
    try {
      console.log('🗺️ fetchKeywordDetailsManually - Called with:', {
        listingId,
        keywordId,
        dateId
      });
      
      const response = await getKeywordDetails(listingId, keywordId, dateId);
      console.log('🗺️ fetchKeywordDetailsManually - API Response:', {
        code: response.code,
        rankDetailsCount: response.data?.rankDetails?.length || 0,
        keywordId,
        dateId
      });
      
      if (response.code === 200) {
        setKeywordDetails(response.data);
      }
    } catch (err) {
      console.error('Error fetching keyword details manually:', err);
    }
  }, [listingId]);

  // Reset states when keyword changes
  const resetKeywordStates = useCallback(() => {
    console.log('🔄 resetKeywordStates - Resetting states for new keyword');
    setSelectedDateWithURL('');
    setError(null);
    isInitializedRef.current = false;
  }, []);

  // Fetch keyword details when selected keyword changes (initial load)
  useEffect(() => {
    console.log('🗺️ useKeywordDetails - useEffect triggered:', {
      refreshMode,
      selectedKeyword,
      listingId,
      currentKeyword: currentKeywordRef.current,
      keywordChanging
    });

    // Skip if in refresh mode
    if (refreshMode) {
      console.log('🗺️ useKeywordDetails - Skipping due to refresh mode');
      return;
    }

    // Skip if no keyword or listingId
    if (!selectedKeyword || !listingId) {
      console.log('🗺️ useKeywordDetails - Skipping due to missing keyword or listingId');
      return;
    }

    // Check if this is actually a new keyword
    const isNewKeyword = currentKeywordRef.current !== selectedKeyword;
    console.log('🗺️ useKeywordDetails - Keyword comparison:', {
      currentKeyword: currentKeywordRef.current,
      selectedKeyword,
      isNewKeyword
    });

    if (!isNewKeyword) {
      console.log('🗺️ useKeywordDetails - Skipping due to same keyword');
      return;
    }

    // Update current keyword reference
    currentKeywordRef.current = selectedKeyword;

    const fetchKeywordDetails = async () => {
      console.log('🗺️ useKeywordDetails - Starting keyword fetch, setting keywordChanging to true');
      setKeywordChanging(true);
      setLoading(true);
      setError(null);
      
      try {
        // For initial load, don't pass dateId to get all dates
        const response = await getKeywordDetails(listingId, selectedKeyword);
        console.log('🗺️ useKeywordDetails - API Response:', {
          code: response.code,
          hasData: !!response.data,
          rankDetailsCount: response.data?.rankDetails?.length || 0,
          availableDates: response.data?.dates?.length || 0,
          selectedKeyword
        });
        
        if (response.code === 200) {
          setKeywordDetails(response.data);
          
          // Handle date selection with URL persistence
          if (response.data.dates && response.data.dates.length > 0 && !isInitializedRef.current) {
            // Check URL params first - changed from 'date' to 'id'
            const urlDate = searchParams.get('id');
            
            if (urlDate && response.data.dates.some(d => d.id === urlDate)) {
              // Use date from URL if it exists in the list
              setSelectedDate(urlDate);
            } else {
              // Fall back to most recent date
              const sortedDates = response.data.dates
                .filter(d => d.date)
                .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());
              
              if (sortedDates.length > 0) {
                console.log('🗺️ useKeywordDetails - Setting default date:', sortedDates[0]);
                setSelectedDateWithURL(sortedDates[0].id);
              }
            }
          }
          isInitializedRef.current = true;
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
        console.log('🗺️ useKeywordDetails - Keyword fetch completed, setting keywordChanging to false');
        setKeywordChanging(false);
        setLoading(false);
      }
    };

    fetchKeywordDetails();
  }, [listingId, selectedKeyword, toast, refreshMode, searchParams]);

  // Fetch keyword details when selectedDate changes (user selection)
  useEffect(() => {
    const fetchKeywordDetailsByDate = async () => {
      if (!listingId || !selectedKeyword || !selectedDate || refreshMode) return;
      
      // Skip if this is the initial date setting
      if (!isInitializedRef.current) return;
      
      console.log('🗺️ useKeywordDetails - Fetching for date change:', {
        listingId,
        selectedKeyword,
        selectedDate,
        isInitialized: isInitializedRef.current
      });
      
      setDateChanging(true);
      setError(null);
      
      try {
        // When date is selected, use dateId as keywordId (no dateId parameter)
        const response = await getKeywordDetails(listingId, selectedDate);
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
        console.log('🗺️ useKeywordDetails - Date loading completed');
        setDateChanging(false);
      }
    };

    fetchKeywordDetailsByDate();
  }, [selectedDate, listingId, selectedKeyword, toast, refreshMode]);

  // Safety timeout to reset keywordChanging if it gets stuck
  useEffect(() => {
    if (keywordChanging) {
      console.log('🔄 Starting safety timeout for keywordChanging');
      const timeout = setTimeout(() => {
        console.log('⚠️ Safety timeout - Resetting keywordChanging state');
        setKeywordChanging(false);
      }, 10000); // 10 second safety timeout

      return () => clearTimeout(timeout);
    }
  }, [keywordChanging]);

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
    console.log('🔄 handleKeywordChange - Called with:', { 
      keywordId, 
      isRefresh, 
      currentKeywordChanging: keywordChanging,
      currentKeyword: currentKeywordRef.current 
    });
    
    // Reset states for new keyword
    resetKeywordStates();
    
    // Set keywordChanging to true immediately for better UX
    console.log('🔄 handleKeywordChange - Setting keywordChanging to true');
    setKeywordChanging(true);
    
    // Update the current keyword reference immediately
    currentKeywordRef.current = keywordId;
  };

  const handleDateChange = (dateId: string, isRefresh = false) => {
    console.log('🔄 handleDateChange - Called with:', { dateId, isRefresh });
    
    // Only show changing state for user-initiated changes, not refresh
    if (!isRefresh) {
      setDateChanging(true);
    }
    setSelectedDateWithURL(dateId);
  };

  return {
    selectedDate,
    setSelectedDate: setSelectedDateWithURL,
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
