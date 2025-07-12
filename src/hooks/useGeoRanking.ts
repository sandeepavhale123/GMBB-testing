import { useCallback, useState } from 'react';
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

  // Enhanced polling callback with progress tracking
  const enhancedKeywordsCallback = useCallback(async () => {
    if (isPollingActive) {
      setPollingProgress(prev => {
        const newProgress = Math.min(prev + 5, 85); // Cap at 85%
        return newProgress;
      });
    }
    return await fetchKeywords(true);
  }, [fetchKeywords, isPollingActive]);

  // Polling for keyword status - only poll when refresh is active or custom polling is active
  const { processingKeywords, isPolling, startPolling, stopPolling } = useKeywordPolling(
    listingId,
    enhancedKeywordsCallback,
    refreshPollingActive || isPollingActive
  );

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
    pollingProgress,
    isPollingActive,
    fetchPositionDetails,
    handleKeywordChange,
    handleDateChange,
    handleRefreshKeyword,
    startCustomPolling,
    completePolling
  };
};
