
import { useState, useEffect, useRef, useCallback } from 'react';
import { checkKeywordStatus } from '../api/geoRankingApi';

export const useKeywordPolling = (
  listingId: number, 
  onKeywordsUpdate: () => Promise<void>,
  enableInitialCheck: boolean = true,
  keywords: any[] = [] // Add keywords parameter
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

  // Stop polling function - simplified and more reliable
  const stopPolling = useCallback(() => {
    console.log(`🛑 [${new Date().toISOString()}] Stopping polling`);
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

    console.log(`🚀 [${new Date().toISOString()}] Starting polling`);
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

        if (response.code === 200) {
          // Check if keywords array is empty - this means processing is complete
          if (response.data.keywords.length === 0) {
            console.log(`✅ [${new Date().toISOString()}] Empty keywords array received - processing complete`);
            const hadProcessingKeywords = processingKeywordsRef.current.length > 0;
            
            // Update state and stop polling immediately
            setProcessingKeywords([]);
            processingKeywordsRef.current = [];
            stopPolling();
            
            // Only call the refresh callback if we previously had processing keywords
            if (hadProcessingKeywords) {
              console.log(`🔄 [${new Date().toISOString()}] Calling onKeywordsUpdate after processing completion`);
              try {
                await onKeywordsUpdate();
                console.log(`✅ [${new Date().toISOString()}] Keywords refreshed successfully`);
              } catch (error) {
                console.error(`❌ [${new Date().toISOString()}] Error refreshing keywords:`, error);
              }
            }
            return; // Exit early to prevent further processing
          }

          // If we have keywords, update the processing list
          const keywordNames = response.data.keywords.map(k => k.keyword);
          console.log(`⏳ [${new Date().toISOString()}] Processing keywords found:`, keywordNames);
          setProcessingKeywords(keywordNames);
        } else {
          console.warn(`⚠️ [${new Date().toISOString()}] Unexpected response code:`, response.code);
        }
      } catch (error) {
        console.error(`❌ [${new Date().toISOString()}] Error checking keyword status:`, error);
        errorCountRef.current++;
        
        // Stop polling after too many consecutive errors
        if (errorCountRef.current >= maxErrors) {
          console.warn(`⚠️ [${new Date().toISOString()}] Too many polling errors (${maxErrors}), stopping polling`);
          setProcessingKeywords([]);
          processingKeywordsRef.current = [];
          stopPolling();
        }
      } finally {
        isRequestingRef.current = false;
      }
    };

    // Start polling with initial delay
    setTimeout(() => {
      if (intervalRef.current) { // Only proceed if polling wasn't cancelled
        console.log(`⏰ [${new Date().toISOString()}] Starting initial check and setting up polling interval`);
        pollKeywordStatus();
        intervalRef.current = setInterval(pollKeywordStatus, 8000);
      }
    }, 2000);

  }, [listingId, onKeywordsUpdate, stopPolling, canMakeRequest]);

  // Initial check function - only run if keywords exist
  const checkInitialStatus = useCallback(async () => {
    if (!listingId || !enableInitialCheck || !canMakeRequest()) return;

    // Skip initial check if no keywords exist
    if (keywords.length === 0) {
      console.log(`🚫 [${new Date().toISOString()}] Skipping initial check - no keywords available`);
      return;
    }

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
  }, [listingId, enableInitialCheck, startPolling, canMakeRequest, keywords.length]);

  // Effect to perform initial check when component mounts or keywords change
  useEffect(() => {
    if (listingId && enableInitialCheck) {
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
      } else if (processingKeywordsRef.current.length > 0) {
        console.log(`📱 [${new Date().toISOString()}] Page visible with processing keywords, restarting polling`);
        startPolling();
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
