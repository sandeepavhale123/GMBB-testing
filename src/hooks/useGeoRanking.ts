import { useCallback, useState, useEffect } from 'react';
import { useKeywords } from './useKeywords';
import { useKeywordDetails } from './useKeywordDetails';
import { useKeywordPolling } from './useKeywordPolling';
import { useKeywordRefresh } from './useKeywordRefresh';

export const useGeoRanking = (listingId: number) => {
  // Progress tracking states
  const [pollingProgress, setPollingProgress] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isPollingActive, setIsPollingActive] = useState(false);

  // Keywords management
  const {
    keywords,
    selectedKeyword,
    setSelectedKeyword,
    credits,
    keywordsLoading,
    pageLoading,
    error: keywordsError,
    fetchKeywords
  } = useKeywords(listingId);

  // Refresh functionality with proper parameter handling
  const keywordsUpdateCallback = useCallback(async (selectKeywordId?: string) => {
    return await fetchKeywords(true, selectKeywordId);
  }, [fetchKeywords]);

  // Keyword details management (initialized without refresh mode first)
  const {
    selectedDate,
    setSelectedDate,
    keywordDetails,
    setKeywordDetails,
    loading,
    keywordChanging,
    dateChanging,
    positionDetailsLoading,
    error: keywordDetailsError,
    fetchPositionDetails,
    fetchKeywordDetailsManually,
    handleKeywordChange: onKeywordChange,
    handleDateChange: onDateChange
  } = useKeywordDetails(listingId, selectedKeyword, false); // Initialize with false first

  const { refreshing, refreshError, refreshProgress, isPollingActive: refreshPollingActive, handleRefreshKeyword } = useKeywordRefresh({
    listingId,
    selectedKeyword,
    onKeywordsUpdate: keywordsUpdateCallback,
    fetchKeywordDetailsManually
  });

  // First create a simple callback without dependency on processingKeywords
  const simpleKeywordsCallback = useCallback(async () => {
    return await fetchKeywords(true);
  }, [fetchKeywords]);

  // Polling for keyword status - always enable polling to check for processing keywords
  const { processingKeywords, isPolling, startPolling, stopPolling } = useKeywordPolling(
    listingId,
    simpleKeywordsCallback,
    true
  );

  // Effect to handle progress when processing keywords exist
  useEffect(() => {
    if (processingKeywords.length > 0 && !refreshPollingActive) {
      // Start progress tracking for processing keywords
      setPollingProgress(prev => prev === 0 ? 10 : prev); // Initialize if not started
      
      // Increment progress periodically
      const progressInterval = setInterval(() => {
        setPollingProgress(prev => {
          const newProgress = Math.min(prev + 5, 85); // Cap at 85%
          return newProgress;
        });
      }, 3000); // Update every 3 seconds
      
      return () => clearInterval(progressInterval);
    } else if (processingKeywords.length === 0 && !refreshPollingActive) {
      // Reset progress when no processing keywords
      setPollingProgress(0);
    }
  }, [processingKeywords.length, refreshPollingActive]);

  // Enhanced polling callback with progress tracking (now processingKeywords is available)
  const enhancedKeywordsCallback = useCallback(async () => {
    return await fetchKeywords(true);
  }, [fetchKeywords]);

  // Combined error state
  const error = keywordsError || keywordDetailsError;

  // Enhanced keyword change handler
  const handleKeywordChange = useCallback((keywordId: string, isRefresh = false) => {
    setSelectedKeyword(keywordId);
    onKeywordChange(keywordId, isRefresh);
  }, [setSelectedKeyword, onKeywordChange]);

  // Enhanced date change handler
  const handleDateChange = useCallback((dateId: string, isRefresh = false) => {
    onDateChange(dateId, isRefresh);
  }, [onDateChange]);

  // Start custom polling with progress tracking
  const startCustomPolling = useCallback(() => {
    setIsPollingActive(true);
    setPollingProgress(0);
    setIsCompleting(false);
  }, []);

  // Stop custom polling and complete progress
  const completePolling = useCallback(() => {
    setIsCompleting(true);
    setPollingProgress(100);
    
    // Show 100% for 2 seconds then reset
    setTimeout(() => {
      setIsPollingActive(false);
      setPollingProgress(0);
      setIsCompleting(false);
    }, 2000);
  }, []);

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
    refreshing,
    refreshError,
    refreshProgress,
    pollingProgress: refreshPollingActive ? refreshProgress : pollingProgress, // Use refresh progress when refreshing, otherwise use polling progress
    isPollingActive: isPolling || refreshPollingActive, // Show as active when either polling or refreshing
    fetchPositionDetails,
    handleKeywordChange,
    handleDateChange,
    handleRefreshKeyword,
    startCustomPolling,
    completePolling
  };
};
