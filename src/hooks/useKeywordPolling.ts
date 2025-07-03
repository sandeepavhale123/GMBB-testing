import { useState, useEffect } from 'react';
import { checkKeywordStatus } from '../api/geoRankingApi';

export const useKeywordPolling = (listingId: number, onKeywordsUpdate: () => Promise<void>) => {
  const [processingKeywords, setProcessingKeywords] = useState<string[]>([]);
  const [isPolling, setIsPolling] = useState(false);

  // Keyword status polling effect
  useEffect(() => {
    if (!listingId) return;

    let interval: NodeJS.Timeout | null = null;

    const pollKeywordStatus = async () => {
      try {
        const response = await checkKeywordStatus(listingId);
        if (response.code === 200 && response.data.keywords.length > 0) {
          const keywordNames = response.data.keywords.map(k => k.keyword);
          setProcessingKeywords(keywordNames);
          setIsPolling(true);
        } else {
          // Stop polling when keywords array is empty and refresh keywords
          setProcessingKeywords([]);
          setIsPolling(false);
          if (interval) {
            clearInterval(interval);
            interval = null;
          }
          // Refresh keywords after polling stops
          await onKeywordsUpdate();
        }
      } catch (error) {
        console.error('Error checking keyword status:', error);
        setProcessingKeywords([]);
        setIsPolling(false);
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      }
    };

    // Initial check
    pollKeywordStatus();

    // Set up polling interval
    interval = setInterval(pollKeywordStatus, 5000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [listingId, onKeywordsUpdate]);

  return {
    processingKeywords,
    isPolling
  };
};