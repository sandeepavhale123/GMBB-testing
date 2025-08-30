import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useProjectKeywords } from './useProjectKeywords';
import { useProjectKeywordDetails } from './useProjectKeywordDetails';
import { useProjectKeywordRefresh } from './useProjectKeywordRefresh';
import { useProjectKeywordPolling } from './useProjectKeywordPolling';
import { usePollingProgress } from './usePollingProgress';

export const useProjectGeoRanking = (projectId: number, initialKeywordId?: string) => {
  // Get projectId from URL params if not provided
  const params = useParams();
  const effectiveProjectId = projectId || parseInt(params.project_id || '0');

  // Keywords management for projects
  const {
    keywords,
    selectedKeyword,
    setSelectedKeyword,
    credits,
    keywordsLoading,
    pageLoading,
    keywordsError,
    fetchKeywords
  } = useProjectKeywords(effectiveProjectId, initialKeywordId);

  // Keyword details management for projects  
  const {
    selectedDate,
    keywordDetails,
    loading,
    keywordChanging,
    dateChanging,
    positionDetailsLoading,
    keywordDetailsError,
    fetchPositionDetails,
    fetchKeywordDetailsManually,
    onKeywordChange,
    onDateChange
  } = useProjectKeywordDetails(effectiveProjectId, selectedKeyword);

  // Keyword refresh functionality for projects
  const {
    refreshing,
    refreshError,
    refreshProgress,
    refreshPollingActive,
    handleRefreshKeyword
  } = useProjectKeywordRefresh({
    projectId: effectiveProjectId,
    selectedKeyword,
    onKeywordsUpdate: fetchKeywords,
    fetchKeywordDetailsManually,
    onDateSelect: onDateChange
  });

  // Polling functionality (adapted for project mode)
  const {
    processingKeywords,
    isPolling,
    startPolling,
    stopPolling
  } = useProjectKeywordPolling(effectiveProjectId, fetchKeywords);

  const pollingProgress = usePollingProgress(isPolling);

  // Combined error state
  const error = keywordsError || keywordDetailsError || refreshError;

  // Custom polling controls
  const [customPollingActive, setCustomPollingActive] = useState(false);
  const [pollingCompleted, setPollingCompleted] = useState(false);

  const startCustomPolling = useCallback(() => {
    setCustomPollingActive(true);
    setPollingCompleted(false);
    startPolling();
  }, [startPolling]);

  const completePolling = useCallback(() => {
    setPollingCompleted(true);
    setTimeout(() => {
      setCustomPollingActive(false);
      setPollingCompleted(false);
    }, 2000);
    stopPolling();
  }, [stopPolling]);

  // Stable handlers
  const handleKeywordChange = useCallback((keywordId: string, isRefresh = false) => {
    setSelectedKeyword(keywordId);
    onKeywordChange?.(keywordId, isRefresh);
  }, [setSelectedKeyword, onKeywordChange]);

  const handleDateChange = useCallback((dateId: string, isRefresh = false) => {
    onDateChange?.(dateId, isRefresh);
  }, [onDateChange]);

  return {
    // Keywords
    keywords,
    selectedKeyword,
    setSelectedKeyword,
    credits,
    keywordsLoading,
    pageLoading,
    keywordsError,
    fetchKeywords,

    // Keyword details
    selectedDate,
    keywordDetails,
    loading,
    keywordChanging,
    dateChanging,
    positionDetailsLoading,
    keywordDetailsError,
    fetchPositionDetails,
    fetchKeywordDetailsManually,
    onKeywordChange: handleKeywordChange,
    onDateChange: handleDateChange,

    // Refresh
    refreshing,
    refreshError,
    refreshProgress,
    refreshPollingActive,
    handleRefreshKeyword,

    // Polling
    processingKeywords,
    isPolling,
    startPolling,
    stopPolling,
    pollingProgress,

    // Combined state
    error,

    // Custom polling controls
    startCustomPolling,
    completePolling,
    customPollingActive,
    pollingCompleted
  };
};