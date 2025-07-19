
import { useState, useEffect } from 'react';
import { getKeywords, KeywordData, Credits } from '../api/geoRankingApi';
import { useToast } from './use-toast';

export const useKeywords = (listingId: number) => {
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<string>('');
  const [credits, setCredits] = useState<Credits | null>(null);
  const [keywordsLoading, setKeywordsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [keywordsVersion, setKeywordsVersion] = useState(0); // Add version counter
  const { toast } = useToast();

  // Reusable function to fetch keywords
  const fetchKeywords = async (isRefresh = false, selectKeywordId?: string): Promise<void> => {
    if (!listingId) return;
    
    setKeywordsLoading(true);
    if (!isRefresh) setPageLoading(true);
    setError(null);
    
    try {
      console.log(`🔄 useKeywords: Fetching keywords (isRefresh: ${isRefresh})`);
      const response = await getKeywords(listingId);
      if (response.code === 200) {
        console.log(`✅ useKeywords: Received ${response.data.keywords.length} keywords`);
        setKeywords(response.data.keywords);
        setCredits(response.data.credits);
        
        // Increment version to trigger UI updates
        setKeywordsVersion(prev => {
          const newVersion = prev + 1;
          console.log(`🔄 useKeywords: Keywords version updated to ${newVersion}`);
          return newVersion;
        });
        
        // Set first keyword as default only on initial load
        if (!isRefresh && response.data.keywords.length > 0) {
          const firstKeyword = response.data.keywords[0];
          setSelectedKeyword(firstKeyword.id);
        }
        
        // Set specific keyword if provided (used after refresh)
        if (selectKeywordId && response.data.keywords.some(k => k.id === selectKeywordId)) {
          setSelectedKeyword(selectKeywordId);
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
    setSelectedKeyword,
    credits,
    keywordsLoading,
    pageLoading,
    error,
    keywordsVersion, // Export version counter
    fetchKeywords
  };
};
