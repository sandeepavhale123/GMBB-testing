import { useCallback } from 'react';
import { useKeywords } from './useKeywords';
import { useKeywordDetails } from './useKeywordDetails';
import { useKeywordPolling } from './useKeywordPolling';
import { useKeywordRefresh } from './useKeywordRefresh';

export const useGeoRanking = (listingId: number) => {
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

  // Keyword details management
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
    handleKeywordChange: onKeywordChange,
    handleDateChange: onDateChange
  } = useKeywordDetails(listingId, selectedKeyword);

  // Refresh functionality with proper parameter handling
  const keywordsUpdateCallback = useCallback(async (selectKeywordId?: string) => {
    return await fetchKeywords(true, selectKeywordId);
  }, [fetchKeywords]);

  const { refreshing, refreshError, isPollingActive, handleRefreshKeyword } = useKeywordRefresh({
    listingId,
    selectedKeyword,
    onKeywordsUpdate: keywordsUpdateCallback,
    onKeywordDetailsUpdate: setKeywordDetails,
    onDateUpdate: setSelectedDate
  });

  // Polling for keyword status - only poll when refresh is active
  const { processingKeywords, isPolling, startPolling, stopPolling } = useKeywordPolling(
    listingId,
    useCallback(() => fetchKeywords(true), [fetchKeywords]),
    isPollingActive
  );

  // Combined error state
  const error = keywordsError || keywordDetailsError;

  // Enhanced keyword change handler
  const handleKeywordChange = (keywordId: string) => {
    setSelectedKeyword(keywordId);
    onKeywordChange(keywordId);
  };

  // Enhanced date change handler
  const handleDateChange = (dateId: string) => {
    onDateChange(dateId);
  };

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
    fetchPositionDetails,
    handleKeywordChange,
    handleDateChange,
    handleRefreshKeyword
  };
};
