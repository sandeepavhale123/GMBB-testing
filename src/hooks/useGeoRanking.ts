
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
    fetchKeywords,
    keywordsVersion
  } = useKeywords(listingId);

  // Enhanced refresh functionality with proper parameter handling and state sync
  const keywordsUpdateCallback = useCallback(async (selectKeywordId?: string) => {
    console.log(`🔄 [${new Date().toISOString()}] keywordsUpdateCallback called - calling /get-keywords API`);
    try {
      await fetchKeywords(true, selectKeywordId);
      console.log(`✅ [${new Date().toISOString()}] /get-keywords API call completed successfully`);
      
      // Add a small delay to ensure state has fully updated before resolving
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log(`🔄 [${new Date().toISOString()}] Keywords state updated, triggering dropdown refresh`);
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
  } = useKeywordDetails(listingId, selectedKeyword, false); // Initialize with false first

  const { refreshing, refreshError, refreshProgress, isPollingActive: refreshPollingActive, handleRefreshKeyword } = useKeywordRefresh({
    listingId,
    selectedKeyword,
    onKeywordsUpdate: keywordsUpdateCallback,
    fetchKeywordDetailsManually
  });

  // Enhanced polling callback with forced state refresh
  const enhancedKeywordsCallback = useCallback(async () => {
    console.log(`🔄 [${new Date().toISOString()}] enhancedKeywordsCallback called from polling completion`);
    try {
      await fetchKeywords(true);
      console.log(`✅ [${new Date().toISOString()}] Keywords refreshed successfully via polling completion`);
      
      // Force a small delay to ensure UI updates
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`❌ [${new Date().toISOString()}] Error refreshing keywords from polling:`, error);
      throw error;
    }
  }, [fetchKeywords]);

  // Polling for keyword status - enable initial check to detect processing keywords
  const { processingKeywords, isPolling, startPolling, stopPolling } = useKeywordPolling(
    listingId,
    enhancedKeywordsCallback,
    true
  );

  // Use separate hook for progress tracking to isolate re-renders
  const pollingProgress = usePollingProgress(
    processingKeywords.length > 0 && !refreshPollingActive,
    3000
  );

  // Combined error state
  const error = keywordsError || keywordDetailsError;

  // Enhanced keyword change handler with forced update
  const handleKeywordChange = useCallback((keywordId: string, isRefresh = false) => {
    console.log(`🔄 [${new Date().toISOString()}] handleKeywordChange called with keywordId:`, keywordId);
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
    pollingProgress: refreshPollingActive ? refreshProgress : pollingProgress, // Use refresh progress when refreshing, otherwise use polling progress
    isPollingActive: isPolling || refreshPollingActive, // Show as active when either polling or refreshing
    keywordsVersion, // Add this to help with reactivity
    fetchPositionDetails,
    handleKeywordChange,
    handleDateChange,
    handleRefreshKeyword,
    startCustomPolling,
    completePolling
  };
};
