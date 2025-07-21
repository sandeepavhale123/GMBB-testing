
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
  const shouldStopPollingRef = useRef<boolean>(false);
  const pollingCompletedTimeRef = useRef<number>(0);
  const maxErrors = 3;
  const MIN_REQUEST_INTERVAL = 3000; // 3 seconds minimum between requests
  const RESTART_COOLDOWN = 10000; // 10 seconds cooldown after completion

  // Keep ref in sync with state
  useEffect(() => {
    processingKeywordsRef.current = processingKeywords;
  }, [processingKeywords]);

  // Enhanced stop polling function with immediate cleanup
  const stopPolling = useCallback(() => {
    console.log(`🛑 [${new Date().toISOString()}] Stopping polling - immediate cleanup`);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
    shouldStopPollingRef.current = true;
    pollingCompletedTimeRef.current = Date.now();
    
    // Immediate state cleanup
    if (processingKeywordsRef.current.length > 0) {
      console.log(`🧹 [${new Date().toISOString()}] Clearing processing keywords state immediately`);
      setProcessingKeywords([]);
      processingKeywordsRef.current = [];
    }
  }, []);

  // Check if we can make a request (prevent rapid successive calls)
  const canMakeRequest = useCallback(() => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTimeRef.current;
    return timeSinceLastRequest >= MIN_REQUEST_INTERVAL && !isRequestingRef.current;
  }, []);

  // Enhanced keyword status check with robust empty array detection
  const checkKeywordStatusWithLogging = useCallback(async () => {
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

      // Enhanced empty array detection with immediate stop
      if (response.code === 200) {
        const keywords = response.data.keywords || [];
        console.log(`📊 [${new Date().toISOString()}] API Response - Keywords count: ${keywords.length}`, keywords);
        
        if (keywords.length === 0) {
          // IMMEDIATE STOP when keywords array is empty
          console.log(`🏁 [${new Date().toISOString()}] Empty keywords array detected - stopping polling immediately`);
          const hadProcessingKeywords = processingKeywordsRef.current.length > 0;
          
          // Stop polling first
          stopPolling();
          
          // Only call refresh if we previously had processing keywords
          if (hadProcessingKeywords) {
            console.log(`🔄 [${new Date().toISOString()}] Calling onKeywordsUpdate after empty array detection`);
            try {
              await onKeywordsUpdate();
              console.log(`✅ [${new Date().toISOString()}] Keywords refreshed successfully after polling completion`);
            } catch (error) {
              console.error(`❌ [${new Date().toISOString()}] Error refreshing keywords after polling:`, error);
            }
          }
          return; // Exit early
        }
        
        // Update processing keywords if we have them
        const keywordNames = keywords.map(k => k.keyword);
        console.log(`⏳ [${new Date().toISOString()}] Processing keywords found:`, keywordNames);
        setProcessingKeywords(keywordNames);
      } else {
        console.warn(`⚠️ [${new Date().toISOString()}] Unexpected API response code: ${response.code}`);
        stopPolling();
      }
    } catch (error) {
      console.error(`❌ [${new Date().toISOString()}] Error checking keyword status:`, error);
      errorCountRef.current++;
      
      // Stop polling after too many consecutive errors
      if (errorCountRef.current >= maxErrors) {
        console.warn(`⚠️ [${new Date().toISOString()}] Too many polling errors (${maxErrors}), stopping polling`);
        stopPolling();
      }
    } finally {
      isRequestingRef.current = false;
    }
  }, [listingId, onKeywordsUpdate, stopPolling, canMakeRequest]);

  // Start polling function with enhanced initialization
  const startPolling = useCallback(() => {
    if (!listingId || intervalRef.current) return;

    console.log(`🚀 [${new Date().toISOString()}] Starting polling - shouldStopPolling: ${shouldStopPollingRef.current}`);
    setIsPolling(true);
    errorCountRef.current = 0;
    shouldStopPollingRef.current = false;

    // Add delay before starting initial check to prevent immediate rapid calls
    console.log(`🚀 [${new Date().toISOString()}] Starting keyword polling with 2-second delay...`);
    setTimeout(() => {
      if (!shouldStopPollingRef.current) { // Only proceed if polling wasn't cancelled
        console.log(`⏰ [${new Date().toISOString()}] Starting initial check and setting up 8-second polling interval`);
        checkKeywordStatusWithLogging();
        intervalRef.current = setInterval(checkKeywordStatusWithLogging, 8000);
      }
    }, 2000);

  }, [listingId, checkKeywordStatusWithLogging]);

  // Initial check function with enhanced logging
  const checkInitialStatus = useCallback(async () => {
    if (!listingId || !enableInitialCheck || !canMakeRequest()) return;

    console.log(`🔍 [${new Date().toISOString()}] Performing initial keyword status check`);
    await checkKeywordStatusWithLogging();
    
    // Start polling if we found processing keywords
    if (processingKeywordsRef.current.length > 0) {
      console.log(`🚀 [${new Date().toISOString()}] Initial processing keywords detected, starting polling`);
      startPolling();
    }
  }, [listingId, enableInitialCheck, checkKeywordStatusWithLogging, startPolling]);

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
      } else {
        const now = Date.now();
        const timeSinceCompletion = now - pollingCompletedTimeRef.current;
        const hasProcessingKeywords = processingKeywordsRef.current.length > 0;
        const shouldRestart = listingId && 
                             hasProcessingKeywords && 
                             !shouldStopPollingRef.current && 
                             timeSinceCompletion > RESTART_COOLDOWN;
        
        console.log(`📱 [${new Date().toISOString()}] Page visible - shouldRestart: ${shouldRestart}, hasProcessingKeywords: ${hasProcessingKeywords}, shouldStopPolling: ${shouldStopPollingRef.current}, timeSinceCompletion: ${timeSinceCompletion}ms`);
        
        if (shouldRestart) {
          console.log(`📱 [${new Date().toISOString()}] Restarting polling with delay...`);
          // Add delay when restarting after page becomes visible
          setTimeout(() => {
            if (!document.hidden && !shouldStopPollingRef.current) { // Double check conditions
              startPolling();
            }
          }, 2000);
        }
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
