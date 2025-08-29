
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getKeywords, KeywordData, Credits } from '../api/geoRankingApi';
import { useToast } from './use-toast';

export const useKeywords = (listingId: number) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<string>('');
  const [credits, setCredits] = useState<Credits | null>(null);
  const [keywordsLoading, setKeywordsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Enhanced setSelectedKeyword to update URL params
  const setSelectedKeywordWithURL = (keywordId: string) => {
    setSelectedKeyword(keywordId);
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (keywordId) {
      newParams.set('keyword', keywordId);
    } else {
      newParams.delete('keyword');
    }
    setSearchParams(newParams);
  };

  // Reusable function to fetch keywords
  const fetchKeywords = async (isRefresh = false, selectKeywordId?: string): Promise<void> => {
    if (!listingId) return;
    
    setKeywordsLoading(true);
    if (!isRefresh) setPageLoading(true);
    setError(null);
    
    try {
      const response = await getKeywords(listingId);
      if (response.code === 200) {
        setKeywords(response.data.keywords);
        setCredits(response.data.credits);
        
        // Handle keyword selection with URL persistence
        if (!isRefresh && response.data.keywords.length > 0) {
          // Check URL params first
          const urlKeyword = searchParams.get('keyword');
          
          if (urlKeyword && response.data.keywords.some(k => k.id === urlKeyword)) {
            // Use keyword from URL if it exists in the list
            setSelectedKeyword(urlKeyword);
          } else if (selectKeywordId && response.data.keywords.some(k => k.id === selectKeywordId)) {
            // Use provided selectKeywordId (for refresh scenarios)
            setSelectedKeywordWithURL(selectKeywordId);
          } else {
            // Fall back to first keyword
            const firstKeyword = response.data.keywords[0];
            setSelectedKeywordWithURL(firstKeyword.id);
          }
        }
        
        // Set specific keyword if provided (used after refresh)
        if (selectKeywordId && response.data.keywords.some(k => k.id === selectKeywordId)) {
          setSelectedKeywordWithURL(selectKeywordId);
        }
      } else {
        throw new Error(response.message || 'Failed to fetch keywords');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch keywords';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err; // Re-throw to handle in calling function
    } finally {
      setKeywordsLoading(false);
      if (!isRefresh) setPageLoading(false);
    }
  };

  // Fetch keywords on component mount
  useEffect(() => {
    fetchKeywords();
  }, [listingId]);

  return {
    keywords,
    selectedKeyword,
    setSelectedKeyword: setSelectedKeywordWithURL,
    credits,
    keywordsLoading,
    pageLoading,
    error,
    fetchKeywords
  };
};
