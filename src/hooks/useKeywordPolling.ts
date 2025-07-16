import { useState, useEffect, useRef, useCallback } from 'react';
import { checkKeywordStatus } from '../api/geoRankingApi';

export const useKeywordPolling = (
  listingId: number, 
  onKeywordsUpdate: () => Promise<void>,
  enableInitialCheck: boolean = true
) => {
  const [processingKeywords, setProcessingKeywords] = useState<string[]>([]);
  const [isPolling, setIsPolling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const errorCountRef = useRef(0);
  const processingKeywordsRef = useRef<string[]>([]);
  const lastRequestTimeRef = useRef<number>(0);
  const isRequestingRef = useRef<boolean>(false);
  const maxErrors = 3;
  const MIN_REQUEST_INTERVAL = 3000; // 3 seconds minimum between requests

  // Keep ref in sync with state
  useEffect(() => {
    processingKeywordsRef.current = processingKeywords;
  }, [processingKeywords]);

  // Stop polling function
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  // Check if we can make a request (prevent rapid successive calls)
  const canMakeRequest = useCallback(() => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTimeRef.current;
    return timeSinceLastRequest >= MIN_REQUEST_INTERVAL && !isRequestingRef.current;
  }, []);

  // Start polling function
  const startPolling = useCallback(() => {
    if (!listingId || intervalRef.current) return;

    setIsPolling(true);
    errorCountRef.current = 0;

    const pollKeywordStatus = async () => {
      // Check if page is visible and we can make a request
      if (document.hidden || !canMakeRequest()) {
        console.log('🚫 Skipping request - page hidden or too soon since last request');
        return;
      }

      isRequestingRef.current = true;
      lastRequestTimeRef.current = Date.now();

      try {
        console.log(`🔄 [${new Date().toISOString()}] Checking keyword status for listing:`, listingId);
        const response = await checkKeywordStatus(listingId);
        errorCountRef.current = 0; // Reset error count on success

        if (response.code === 200 && response.data.keywords.length > 0) {
          const keywordNames = response.data.keywords.map(k => k.keyword);
          console.log(`⏳ [${new Date().toISOString()}] Processing keywords found:`, keywordNames);
          setProcessingKeywords(keywordNames);
        } else {
          // No more processing keywords - check if we had processing keywords before
          console.log(`✅ [${new Date().toISOString()}] No processing keywords found - checking if we should refresh data...`);
          const hadProcessingKeywords = processingKeywordsRef.current.length > 0;
          
          setProcessingKeywords([]);
          stopPolling();
          
          // Only call the refresh callback if we previously had processing keywords
          if (hadProcessingKeywords) {
            console.log(`🔄 [${new Date().toISOString()}] Calling onKeywordsUpdate after processing completion - refreshing /get-keywords`);
            try {
              await onKeywordsUpdate();
              console.log(`✅ [${new Date().toISOString()}] Keywords refreshed successfully via /get-keywords API`);
            } catch (error) {
              console.error(`❌ [${new Date().toISOString()}] Error refreshing keywords after polling:`, error);
            }
          } else {
            console.log(`ℹ️ [${new Date().toISOString()}] No previous processing keywords, skipping refresh`);
          }
        }
      } catch (error) {
        console.error(`❌ [${new Date().toISOString()}] Error checking keyword status:`, error);
        errorCountRef.current++;
        
        // Stop polling after too many consecutive errors
        if (errorCountRef.current >= maxErrors) {
          console.warn(`⚠️ [${new Date().toISOString()}] Too many polling errors (${maxErrors}), stopping polling`);
          setProcessingKeywords([]);
          stopPolling();
        }
      } finally {
        isRequestingRef.current = false;
      }
    };

    // Add delay before starting initial check to prevent immediate rapid calls
    console.log(`🚀 [${new Date().toISOString()}] Starting keyword polling with 2-second delay...`);
    setTimeout(() => {
      if (intervalRef.current) { // Only proceed if polling wasn't cancelled
        console.log(`⏰ [${new Date().toISOString()}] Starting initial check and setting up 8-second polling interval`);
        pollKeywordStatus();
        intervalRef.current = setInterval(pollKeywordStatus, 8000); // Increased to 8 seconds
      }
    }, 2000);

  }, [listingId, onKeywordsUpdate, stopPolling, canMakeRequest]);

  // Initial check function to see if there are processing keywords
  const checkInitialStatus = useCallback(async () => {
    if (!listingId || !enableInitialCheck || !canMakeRequest()) return;

    isRequestingRef.current = true;
    lastRequestTimeRef.current = Date.now();

    try {
      console.log(`🔍 [${new Date().toISOString()}] Initial check for processing keywords`);
      const response = await checkKeywordStatus(listingId);
      
      if (response.code === 200 && response.data.keywords.length > 0) {
        const keywordNames = response.data.keywords.map(k => k.keyword);
        console.log(`⏳ [${new Date().toISOString()}] Initial processing keywords found, starting polling:`, keywordNames);
        setProcessingKeywords(keywordNames);
        startPolling();
      } else {
        console.log(`ℹ️ [${new Date().toISOString()}] No initial processing keywords found`);
      }
    } catch (error) {
      console.error(`❌ [${new Date().toISOString()}] Error during initial check:`, error);
    } finally {
      isRequestingRef.current = false;
    }
  }, [listingId, enableInitialCheck, startPolling, canMakeRequest]);

  // Effect to perform initial check when component mounts with delay
  useEffect(() => {
    if (listingId && enableInitialCheck) {
      // Add a small delay to prevent immediate check on mount
      const timer = setTimeout(() => {
        checkInitialStatus();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [listingId, enableInitialCheck, checkInitialStatus]);

  // Cleanup on unmount and handle page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log(`📱 [${new Date().toISOString()}] Page hidden, stopping polling`);
        stopPolling();
      } else if (listingId && processingKeywordsRef.current.length > 0) {
        console.log(`📱 [${new Date().toISOString()}] Page visible, restarting polling with delay...`);
        // Add delay when restarting after page becomes visible
        setTimeout(() => {
          if (!document.hidden) { // Double check page is still visible
            startPolling();
          }
        }, 2000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopPolling();
    };
  }, [listingId, startPolling, stopPolling]);

  return {
    processingKeywords,
    isPolling,
    startPolling,
    stopPolling
  };
};