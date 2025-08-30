import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getKeywordDetailsForProject, getKeywordPositionDetailsForProject, KeywordDetailsResponse, KeywordPositionResponse } from '../api/geoRankingApi';
import { useToast } from './use-toast';

export const useProjectKeywordDetails = (projectId: number, selectedKeyword: string, refreshMode = false) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [keywordDetails, setKeywordDetails] = useState<KeywordDetailsResponse['data'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [keywordChanging, setKeywordChanging] = useState(false);
  const [dateChanging, setDateChanging] = useState(false);
  const [positionDetailsLoading, setPositionDetailsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const skipNextEffect = useRef(false);
  const isInitializedRef = useRef(false);

  const setSelectedDateWithURL = (dateId: string) => {
    console.log('🔄 setSelectedDateWithURL - Setting date:', dateId);
    setSelectedDate(dateId);
    
    const newParams = new URLSearchParams(searchParams);
    if (dateId) {
      newParams.set('id', dateId);
    } else {
      newParams.delete('id');
    }
    setSearchParams(newParams);
  };

  const fetchKeywordDetailsManually = useCallback(async (keywordId: string, dateId?: string) => {
    if (!projectId || !keywordId) return;
    
    try {
      console.log('🗺️ fetchKeywordDetailsManually - Called with:', {
        projectId,
        keywordId,
        dateId
      });
      
      const response = await getKeywordDetailsForProject(projectId, keywordId, dateId);
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
  }, [projectId]);

  // Fetch keyword details when selected keyword changes
  useEffect(() => {
    if (refreshMode || skipNextEffect.current) {
      skipNextEffect.current = false;
      return;
    }
    
    const fetchKeywordDetails = async () => {
      if (!projectId || !selectedKeyword) return;
      
      console.log('🗺️ useProjectKeywordDetails - Fetching for keyword change:', {
        projectId,
        selectedKeyword,
        selectedDate,
        isInitialized: isInitializedRef.current
      });
      
      setLoading(true);
      setKeywordChanging(true);
      setError(null);
      
      try {
        const response = await getKeywordDetailsForProject(projectId, selectedKeyword);
        console.log('🗺️ useProjectKeywordDetails - API Response:', {
          code: response.code,
          hasData: !!response.data,
          rankDetailsCount: response.data?.rankDetails?.length || 0,
          availableDates: response.data?.dates?.length || 0,
          selectedKeyword
        });
        
        if (response.code === 200) {
          setKeywordDetails(response.data);
          
          if (response.data.dates && response.data.dates.length > 0 && !isInitializedRef.current) {
            const urlDate = searchParams.get('id');
            
            if (urlDate && response.data.dates.some(d => d.id === urlDate)) {
              setSelectedDate(urlDate);
            } else {
              const sortedDates = response.data.dates
                .filter(d => d.date)
                .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());
              
              if (sortedDates.length > 0) {
                console.log('🗺️ useProjectKeywordDetails - Setting default date:', sortedDates[0]);
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
        setLoading(false);
        setKeywordChanging(false);
        console.log('🗺️ useProjectKeywordDetails - Keyword loading completed');
      }
    };

    fetchKeywordDetails();
  }, [projectId, selectedKeyword, toast, refreshMode]);

  // Fetch keyword details when selectedDate changes
  useEffect(() => {
    const fetchKeywordDetailsByDate = async () => {
      if (!projectId || !selectedKeyword || !selectedDate || refreshMode) return;
      
      if (!isInitializedRef.current) return;
      
      console.log('🗺️ useProjectKeywordDetails - Fetching for date change:', {
        projectId,
        selectedKeyword,
        selectedDate,
        isInitialized: isInitializedRef.current
      });
      
      setDateChanging(true);
      setError(null);
      
      try {
        const response = await getKeywordDetailsForProject(projectId, selectedDate);
        console.log('🗺️ useProjectKeywordDetails - Date Change API Response:', {
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
        setDateChanging(false);
        console.log('🗺️ useProjectKeywordDetails - Date loading completed');
      }
    };

    fetchKeywordDetailsByDate();
  }, [selectedDate, projectId, selectedKeyword, toast, refreshMode]);

  const fetchPositionDetails = async (keywordId: string, positionId: string): Promise<KeywordPositionResponse | null> => {
    if (!projectId) return null;
    
    setPositionDetailsLoading(true);
    
    try {
      const response = await getKeywordPositionDetailsForProject(projectId, keywordId, positionId);
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
    console.log('🗺️ handleKeywordChange - Called with:', { keywordId, isRefresh });
    
    setKeywordChanging(true);
    console.log('🗺️ handleKeywordChange - keywordChanging set to true');
    
    setSelectedDateWithURL('');
    isInitializedRef.current = false;
  };

  const handleDateChange = (dateId: string, isRefresh = false) => {
    console.log('🗺️ handleDateChange - Called with:', { dateId, isRefresh });
    
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
    keywordDetailsError: error,
    fetchPositionDetails,
    fetchKeywordDetailsManually,
    onKeywordChange: handleKeywordChange,
    onDateChange: handleDateChange
  };
};