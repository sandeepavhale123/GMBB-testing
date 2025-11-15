import { useCallback, useState, useEffect } from "react";
import { useKeywords } from "./useKeywords";
import { useKeywordDetails } from "./useKeywordDetails";
import { useKeywordPolling } from "./useKeywordPolling";
import { useKeywordRefresh } from "./useKeywordRefresh";
import { usePollingProgress } from "./usePollingProgress";

export const useGeoRanking = (listingId: number) => {
  // Progress tracking states - isolated to prevent re-renders
  const [isCompleting, setIsCompleting] = useState(false);
  const [isPollingActive, setIsPollingActive] = useState(false);

  // Keywords management with URL persistence
  const {
    keywords,
    selectedKeyword,
    setSelectedKeyword,
    credits,
    keywordsLoading,
    pageLoading,
    error: keywordsError,
    fetchKeywords,
  } = useKeywords(listingId);

  // Enhanced refresh functionality with proper keyword selection
  const keywordsUpdateCallback = useCallback(
    async (selectKeywordId?: string) => {
      try {
        await fetchKeywords(true, selectKeywordId);

        // If no specific keyword to select, ensure we have a selected keyword
        if (!selectKeywordId && keywords.length > 0 && !selectedKeyword) {
          setSelectedKeyword(keywords[0].id);
        }
      } catch (error) {
        console.error(
          `❌ [${new Date().toISOString()}] /get-keywords API call failed:`,
          error
        );
        throw error;
      }
    },
    [fetchKeywords, keywords, selectedKeyword, setSelectedKeyword]
  );

  // Keyword details management with URL persistence
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
    handleDateChange: onDateChange,
  } = useKeywordDetails(listingId, selectedKeyword, false);

  // Enhanced date change handler for refresh auto-selection
  const handleDateSelectAfterRefresh = useCallback(
    (dateId: string) => {
      onDateChange(dateId, true); // Pass isRefresh = true to avoid loading states
    },
    [onDateChange]
  );

  const {
    refreshing,
    refreshError,
    refreshProgress,
    isPollingActive: refreshPollingActive,
    handleRefreshKeyword,
  } = useKeywordRefresh({
    listingId,
    selectedKeyword,
    onKeywordsUpdate: keywordsUpdateCallback,
    fetchKeywordDetailsManually,
    onDateSelect: handleDateSelectAfterRefresh,
  });

  // Stable polling callback that doesn't cause re-renders
  const stablePollingCallback = useCallback(async () => {
    try {
      await fetchKeywords(true);
    } catch (error) {
      console.error(
        `❌ [${new Date().toISOString()}] Keywords refresh failed from polling:`,
        error
      );
      throw error;
    }
  }, [fetchKeywords]);

  // Polling for keyword status - pass keywords array to prevent unnecessary API calls
  const { processingKeywords, isPolling, startPolling, stopPolling } =
    useKeywordPolling(
      listingId,
      stablePollingCallback,
      true,
      keywords // Pass keywords array to polling hook
    );

  // Use separate hook for progress tracking
  const pollingProgress = usePollingProgress(
    processingKeywords.length > 0 && !refreshPollingActive,
    3000
  );

  // Combined error state
  const error = keywordsError || keywordDetailsError;

  // Enhanced keyword change handler with stable reference
  const handleKeywordChange = useCallback(
    (keywordId: string, isRefresh = false) => {
      setSelectedKeyword(keywordId);
      onKeywordChange(keywordId, isRefresh);
    },
    [setSelectedKeyword, onKeywordChange]
  );

  // Enhanced date change handler with stable reference
  const handleDateChange = useCallback(
    (dateId: string, isRefresh = false) => {
      onDateChange(dateId, isRefresh);
    },
    [onDateChange]
  );

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
    fetchPositionDetails,
    fetchKeywords,
    handleKeywordChange,
    handleDateChange,
    handleRefreshKeyword,
    startCustomPolling,
    completePolling,
  };
};
