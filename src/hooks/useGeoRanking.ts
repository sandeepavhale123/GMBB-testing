
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
  const [keywordUpdateTrigger, setKeywordUpdateTrigger] = useState(0);

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

  // Enhanced keywords update callback with guaranteed refresh
  const keywordsUpdateCallback = useCallback(async (selectKeywordId?: string) => {
    console.log(`🔄 [${new Date().toISOString()}] keywordsUpdateCallback called - forcing keyword dropdown refresh`);
    try {
      // Force refresh with explicit flag
      await fetchKeywords(true, selectKeywordId);
      
      // Force state update trigger to ensure UI refresh
      setKeywordUpdateTrigger(prev => prev + 1);
      
      console.log(`✅ [${new Date().toISOString()}] Keyword dropdown refresh completed successfully`);
      
      // Add small delay to ensure state propagation
      setTimeout(() => {
        console.log(`🔄 [${new Date().toISOString()}] Post-refresh state update trigger fired`);
      }, 100);
      
    } catch (error) {
      console.error(`❌ [${new Date().toISOString()}] Error refreshing keyword dropdown:`, error);
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
  } = useKeywordDetails(listingId, selectedKeyword, false); // Initialize with false first

  const { refreshing, refreshError, refreshProgress, isPollingActive: refreshPollingActive, handleRefreshKeyword } = useKeywordRefresh({
    listingId,
    selectedKeyword,
    onKeywordsUpdate: keywordsUpdateCallback,
    fetchKeywordDetailsManually
  });

  // Simple keywords callback for polling with enhanced refresh logic
  const simpleKeywordsCallback = useCallback(async () => {
    console.log(`🔄 [${new Date().toISOString()}] simpleKeywordsCallback called - executing guaranteed refresh`);
    try {
      // Force refresh
      await fetchKeywords(true);
      
      // Trigger additional state updates
      setKeywordUpdateTrigger(prev => prev + 1);
      
      console.log(`✅ [${new Date().toISOString()}] Polling-triggered keyword refresh completed`);
    } catch (error) {
      console.error(`❌ [${new Date().toISOString()}] Error in polling keyword refresh:`, error);
      throw error;
    }
  }, [fetchKeywords]);

  // Polling for keyword status - enable initial check to detect processing keywords
  const { processingKeywords, isPolling, startPolling, stopPolling } = useKeywordPolling(
    listingId,
    simpleKeywordsCallback,
    true
  );

  // Use separate hook for progress tracking to isolate re-renders
  const pollingProgress = usePollingProgress(
    processingKeywords.length > 0 && !refreshPollingActive,
    3000
  );

  // Combined error state
  const error = keywordsError || keywordDetailsError;

  // Enhanced keyword change handler with logging
  const handleKeywordChange = useCallback((keywordId: string, isRefresh = false) => {
    console.log(`🔄 [${new Date().toISOString()}] handleKeywordChange called - keywordId: ${keywordId}, isRefresh: ${isRefresh}`);
    setSelectedKeyword(keywordId);
    onKeywordChange(keywordId, isRefresh);
  }, [setSelectedKeyword, onKeywordChange]);

  // Enhanced date change handler with logging
  const handleDateChange = useCallback((dateId: string, isRefresh = false) => {
    console.log(`🔄 [${new Date().toISOString()}] handleDateChange called - dateId: ${dateId}, isRefresh: ${isRefresh}`);
    onDateChange(dateId, isRefresh);
  }, [onDateChange]);

  // Start custom polling with progress tracking
  const startCustomPolling = useCallback(() => {
    console.log(`🚀 [${new Date().toISOString()}] Starting custom polling`);
    setIsPollingActive(true);
    setIsCompleting(false);
  }, []);

  // Stop custom polling and complete progress
  const completePolling = useCallback(() => {
    console.log(`🏁 [${new Date().toISOString()}] Completing polling`);
    setIsCompleting(true);
    
    // Show completion for 2 seconds then reset
    setTimeout(() => {
      setIsPollingActive(false);
      setIsCompleting(false);
      console.log(`✅ [${new Date().toISOString()}] Polling completion cycle finished`);
    }, 2000);
  }, []);

  // Effect to handle polling completion and force keyword refresh
  useEffect(() => {
    if (!isPolling && processingKeywords.length === 0 && keywordUpdateTrigger > 0) {
      console.log(`🔄 [${new Date().toISOString()}] Polling stopped - ensuring keyword dropdown is updated`);
      // Force a final refresh to ensure dropdown is current
      setTimeout(() => {
        fetchKeywords(true);
      }, 500);
    }
  }, [isPolling, processingKeywords.length, keywordUpdateTrigger, fetchKeywords]);

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
