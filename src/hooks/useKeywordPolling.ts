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
  const maxErrors = 3;

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

    console.log('🚀 Starting keyword polling for listingId:', listingId, 'shouldPoll:', shouldPoll);
    setIsPolling(true);
    errorCountRef.current = 0;

    const pollKeywordStatus = async () => {
      // Check if page is visible
      if (document.hidden) return;

      console.log('🔄 Polling keyword status for listingId:', listingId);

      try {
        const response = await checkKeywordStatus(listingId);
        console.log('🔄 Keyword status response:', {
          code: response.code,
          keywordCount: response.data?.keywords?.length || 0,
          keywords: response.data?.keywords?.map(k => k.keyword) || []
        });
        
        errorCountRef.current = 0; // Reset error count on success

        if (response.code === 200 && response.data.keywords.length > 0) {
          const keywordNames = response.data.keywords.map(k => k.keyword);
          console.log('📊 Processing keywords found:', keywordNames);
          setProcessingKeywords(keywordNames);
        } else {
          // No more processing keywords - stop polling and refresh
          console.log('✅ No processing keywords found, stopping polling and refreshing data');
          setProcessingKeywords([]);
          stopPolling();
          try {
            await onKeywordsUpdate();
          } catch (error) {
            console.error('Error refreshing keywords after polling:', error);
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
    pollKeywordStatus();

    // Set up polling interval
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
        stopPolling();
      } else if (shouldPoll && listingId && processingKeywords.length > 0) {
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