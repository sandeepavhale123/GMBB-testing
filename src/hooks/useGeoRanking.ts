
import { useCallback, useState, useEffect } from 'react';
import { useKeywords } from './useKeywords';
import { useKeywordDetails } from './useKeywordDetails';
import { useKeywordPolling } from './useKeywordPolling';
import { useKeywordRefresh } from './useKeywordRefresh';
import { usePollingProgress } from './usePollingProgress';

export const useGeoRanking = (listingId: number) => {
  // Progress tracking states - isolated to prevent re-renders
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
    keywordsVersion,
    fetchKeywords
  } = useKeywords(listingId);

  // Refresh functionality with proper parameter handling
  const keywordsUpdateCallback = useCallback(async (selectKeywordId?: string) => {
    console.log(`🔄 [${new Date().toISOString()}] keywordsUpdateCallback called - calling /get-keywords API`);
    try {
      await fetchKeywords(true, selectKeywordId);
      console.log(`✅ [${new Date().toISOString()}] /get-keywords API call completed successfully`);
    } catch (error) {
      console.error(`❌ [${new Date().toISOString()}] /get-keywords API call failed:`, error);
      throw error;
    }
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
  } = useKeywordDetails(listingId, selectedKeyword, false);

  const { refreshing, refreshError, refreshProgress, isPollingActive: refreshPollingActive, handleRefreshKeyword } = useKeywordRefresh({
    listingId,
    selectedKeyword,
    onKeywordsUpdate: keywordsUpdateCallback,
    fetchKeywordDetailsManually
  });

  // Optimized keywords callback for polling - simpler version
  const optimizedKeywordsCallback = useCallback(async () => {
    console.log(`🔄 [${new Date().toISOString()}] optimizedKeywordsCallback called - calling /get-keywords API`);
    try {
      await fetchKeywords(true);
      console.log(`✅ [${new Date().toISOString()}] /get-keywords API call completed successfully from polling`);
    } catch (error) {
      console.error(`❌ [${new Date().toISOString()}] /get-keywords API call failed from polling:`, error);
      throw error;
    }
  }, [fetchKeywords]);

  // Polling for keyword status - enable initial check to detect processing keywords
  const { processingKeywords, isPolling, startPolling, stopPolling } = useKeywordPolling(
    listingId,
    optimizedKeywordsCallback,
    true
  );

  // Use separate hook for progress tracking to isolate re-renders
  const pollingProgress = usePollingProgress(
    processingKeywords.length > 0 && !refreshPollingActive,
    3000
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
    setIsCompleting(false);
  }, []);

  // Stop custom polling and complete progress
  const completePolling = useCallback(() => {
    setIsCompleting(true);
    
    // Show completion for 2 seconds then reset
    setTimeout(() => {
      setIsPollingActive(false);
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
    pollingProgress: refreshPollingActive ? refreshProgress : pollingProgress,
    isPollingActive: isPolling || refreshPollingActive,
    keywordsVersion,
    fetchPositionDetails,
    handleKeywordChange,
    handleDateChange,
    handleRefreshKeyword,
    startCustomPolling,
    completePolling
  };
};
