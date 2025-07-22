import { useState, useEffect, useCallback, useRef } from "react";
import { checkKeywordStatus } from "../api/geoRankingApi";

export const useKeywordPolling = (
  listingId: number,
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
    console.log(
      `🔄 [${new Date().toISOString()}] handleEmptyKeywords - Processing completed, refreshing keywords list`
    );

    // Stop polling first
    setIsPolling(false);
    clearPollingInterval();

    // Clear processing keywords (hides progress bar)
    setProcessingKeywords([]);

    try {
      // Refresh keywords list to show newly completed keywords
      await onKeywordsUpdate();
      console.log(
        `✅ [${new Date().toISOString()}] Keywords list refreshed successfully after processing completion`
      );
    } catch (error) {
      console.error(
        `❌ [${new Date().toISOString()}] Failed to refresh keywords after processing completion:`,
        error
      );
    }
  }, [onKeywordsUpdate, clearPollingInterval]);

  // Check keyword status
  const checkStatus = useCallback(async () => {
    if (!listingId || !mountedRef.current) return;

    try {
      console.log(
        `🔄 [${new Date().toISOString()}] checkStatus - Calling /check-keyword-status API for listingId: ${listingId}`
      );
      const response = await checkKeywordStatus(listingId);

      if (!mountedRef.current) return;

      console.log(
        `📊 [${new Date().toISOString()}] checkStatus - API Response:`,
        {
          code: response.code,
          keywordCount: response.data?.keywords?.length || 0,
          keywords: response.data?.keywords || [],
        }
      );

      if (response.code === 200) {
        const keywords = response.data?.keywords || [];

        if (keywords.length === 0) {
          console.log(
            `✅ [${new Date().toISOString()}] No processing keywords found - calling handleEmptyKeywords`
          );
          await handleEmptyKeywords();
        } else {
          console.log(
            `🔄 [${new Date().toISOString()}] Found ${
              keywords.length
            } processing keywords - updating state and continuing polling`
          );
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
  }, [listingId, handleEmptyKeywords, isPolling]);

  // Initial check for processing keywords - ALWAYS runs on page load
  const checkInitialStatus = useCallback(async () => {
    if (!listingId || !enableInitialCheck) return;

    console.log(
      `🚀 [${new Date().toISOString()}] checkInitialStatus - Making initial /check-keyword-status request (listingId: ${listingId})`
    );

    try {
      const response = await checkKeywordStatus(listingId);

      if (!mountedRef.current) return;

      console.log(
        `📊 [${new Date().toISOString()}] checkInitialStatus - Initial API Response:`,
        {
          code: response.code,
          keywordCount: response.data?.keywords?.length || 0,
          keywords: response.data?.keywords || [],
        }
      );

      if (response.code === 200) {
        const keywords = response.data?.keywords || [];

        if (keywords.length === 0) {
          console.log(
            `✅ [${new Date().toISOString()}] Initial check: No processing keywords - progress bar will be hidden`
          );
          setProcessingKeywords([]);
          setIsPolling(false);
        } else {
          console.log(
            `🔄 [${new Date().toISOString()}] Initial check: Found ${
              keywords.length
            } processing keywords - starting polling`
          );
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
  }, [listingId, enableInitialCheck]);

  // Start polling
  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) return; // Already polling

    console.log(
      `🔄 [${new Date().toISOString()}] startPolling - Starting 5-second polling interval`
    );
    setIsPolling(true);

    pollingIntervalRef.current = setInterval(async () => {
      console.log(
        `⏰ [${new Date().toISOString()}] Polling interval - checking keyword status`
      );
      await checkStatus();
    }, 5000);
  }, [checkStatus]);

  // Stop polling
  const stopPolling = useCallback(() => {
    console.log(
      `🛑 [${new Date().toISOString()}] stopPolling - Stopping polling interval`
    );
    setIsPolling(false);
    clearPollingInterval();
  }, [clearPollingInterval]);

  // Initial check when component mounts - ALWAYS runs regardless of keywords
  useEffect(() => {
    checkInitialStatus();
  }, [listingId, enableInitialCheck]);

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
