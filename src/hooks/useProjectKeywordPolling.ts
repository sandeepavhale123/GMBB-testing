import { useState, useEffect, useCallback, useRef } from "react";
import { checkKeywordStatusForProject } from "../api/geoRankingApi";

export const useProjectKeywordPolling = (
  projectId: number,
  onKeywordsUpdate: () => Promise<void>,
  enableInitialCheck: boolean = true,
  keywords: any[] = []
) => {
  const [processingKeywords, setProcessingKeywords] = useState<string[]>([]);
  const [isPolling, setIsPolling] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Clear polling interval
  const clearPollingInterval = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // Handle empty keywords response - hide progress bar and refresh keywords
  const handleEmptyKeywords = useCallback(async () => {
    // Stop polling first
    setIsPolling(false);
    clearPollingInterval();

    // Clear processing keywords (hides progress bar)
    setProcessingKeywords([]);

    try {
      // Refresh keywords list to show newly completed keywords
      await onKeywordsUpdate();
    } catch (error) {
      console.error(
        `❌ [${new Date().toISOString()}] Failed to refresh keywords after processing completion:`,
        error
      );
    }
  }, [onKeywordsUpdate, clearPollingInterval]);

  // Check keyword status
  const checkStatus = useCallback(async () => {
    if (!projectId || !mountedRef.current) return;

    try {
      const response = await checkKeywordStatusForProject(projectId);

      if (!mountedRef.current) return;

      if (response.code === 200) {
        const keywords = response.data?.keywords || [];

        if (keywords.length === 0) {
          await handleEmptyKeywords();
        } else {
          setProcessingKeywords(keywords.map((k) => k.keyword));

          // Continue polling if we have processing keywords
          if (!isPolling) {
            startPolling();
          }
        }
      } else {
        console.error(
          `❌ [${new Date().toISOString()}] checkStatus - API error:`,
          response.message
        );
      }
    } catch (error) {
      console.error(
        `❌ [${new Date().toISOString()}] checkStatus - Network/API error:`,
        error
      );
    }
  }, [projectId, handleEmptyKeywords, isPolling]);

  // Initial check for processing keywords - ALWAYS runs on page load
  const checkInitialStatus = useCallback(async () => {
    if (!projectId || !enableInitialCheck) return;

    try {
      const response = await checkKeywordStatusForProject(projectId);

      if (!mountedRef.current) return;

      if (response.code === 200) {
        const keywords = response.data?.keywords || [];

        if (keywords.length === 0) {
          setProcessingKeywords([]);
          setIsPolling(false);
        } else {
          setProcessingKeywords(keywords.map((k) => k.keyword));
          startPolling();
        }
      } else {
        console.error(
          `❌ [${new Date().toISOString()}] checkInitialStatus - API error:`,
          response.message
        );
      }
    } catch (error) {
      console.error(
        `❌ [${new Date().toISOString()}] checkInitialStatus - Network/API error:`,
        error
      );
    }
  }, [projectId, enableInitialCheck]);

  // Start polling
  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) return; // Already polling

    setIsPolling(true);

    pollingIntervalRef.current = setInterval(async () => {
      await checkStatus();
    }, 5000);
  }, [checkStatus]);

  // Stop polling
  const stopPolling = useCallback(() => {
    setIsPolling(false);
    clearPollingInterval();
  }, [clearPollingInterval]);

  // Initial check when component mounts - ALWAYS runs regardless of keywords
  useEffect(() => {
    checkInitialStatus();
  }, [projectId, enableInitialCheck]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      clearPollingInterval();
    };
  }, [clearPollingInterval]);

  return {
    processingKeywords,
    isPolling,
    startPolling,
    stopPolling,
    checkStatus,
  };
};
