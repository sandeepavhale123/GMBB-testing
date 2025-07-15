import { useState, useEffect, useRef, useCallback } from 'react';
import { checkKeywordStatus } from '../api/geoRankingApi';

export const useKeywordPolling = (
  listingId: number, 
  onKeywordsUpdate: () => Promise<void>,
  shouldPoll: boolean = false
) => {
  const [processingKeywords, setProcessingKeywords] = useState<string[]>([]);
  const [isPolling, setIsPolling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const errorCountRef = useRef(0);
  const processingKeywordsRef = useRef<string[]>([]);
  const maxErrors = 3;

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

  // Start polling function
  const startPolling = useCallback(() => {
    if (!listingId || !shouldPoll || intervalRef.current) return;

    setIsPolling(true);
    errorCountRef.current = 0;

    const pollKeywordStatus = async () => {
      // Check if page is visible
      if (document.hidden) return;

      try {
        console.log('🔄 Checking keyword status for listing:', listingId);
        const response = await checkKeywordStatus(listingId);
        errorCountRef.current = 0; // Reset error count on success

        if (response.code === 200 && response.data.keywords.length > 0) {
          const keywordNames = response.data.keywords.map(k => k.keyword);
          console.log('⏳ Processing keywords found:', keywordNames);
          setProcessingKeywords(keywordNames);
        } else {
          // No more processing keywords - check if we had processing keywords before
          console.log('✅ No processing keywords found - checking if we should refresh data...');
          const hadProcessingKeywords = processingKeywordsRef.current.length > 0;
          
          setProcessingKeywords([]);
          stopPolling();
          
          // Only call the refresh callback if we previously had processing keywords
          if (hadProcessingKeywords) {
            console.log('🔄 Calling onKeywordsUpdate after processing completion');
            try {
              await onKeywordsUpdate();
              console.log('✅ Keywords refreshed successfully');
            } catch (error) {
              console.error('❌ Error refreshing keywords after polling:', error);
            }
          } else {
            console.log('ℹ️ No previous processing keywords, skipping refresh');
          }
        }
      } catch (error) {
        console.error('❌ Error checking keyword status:', error);
        errorCountRef.current++;
        
        // Stop polling after too many consecutive errors
        if (errorCountRef.current >= maxErrors) {
          console.warn('⚠️ Too many polling errors, stopping polling');
          setProcessingKeywords([]);
          stopPolling();
        }
      }
    };

    // Initial check
    console.log('🚀 Starting keyword polling with initial check');
    pollKeywordStatus();

    // Set up polling interval (5 seconds)
    console.log('⏰ Setting up 5-second polling interval');
    intervalRef.current = setInterval(pollKeywordStatus, 5000);
  }, [listingId, shouldPoll, onKeywordsUpdate, stopPolling]);

  // Effect to handle polling state changes
  useEffect(() => {
    if (shouldPoll && listingId && !isPolling) {
      startPolling();
    } else if (!shouldPoll && isPolling) {
      stopPolling();
      setProcessingKeywords([]);
    }

    return stopPolling;
  }, [shouldPoll, listingId, isPolling, startPolling, stopPolling]);

  // Cleanup on unmount and handle page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('📱 Page hidden, stopping polling');
        stopPolling();
      } else if (shouldPoll && listingId && processingKeywordsRef.current.length > 0) {
        console.log('📱 Page visible, restarting polling');
        startPolling();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopPolling();
    };
  }, [shouldPoll, listingId, processingKeywords.length, startPolling, stopPolling]);

  return {
    processingKeywords,
    isPolling,
    startPolling,
    stopPolling
  };
};