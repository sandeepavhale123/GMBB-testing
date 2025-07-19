
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
  const [keywordsVersion, setKeywordsVersion] = useState(0); // Add version counter for reactivity
  const { toast } = useToast();

  // Reusable function to fetch keywords
  const fetchKeywords = async (isRefresh = false, selectKeywordId?: string): Promise<void> => {
    if (!listingId) return;
    
    setKeywordsLoading(true);
    if (!isRefresh) setPageLoading(true);
    setError(null);
    
    try {
      console.log(`🔄 [${new Date().toISOString()}] Fetching keywords from API for listing:`, listingId);
      const response = await getKeywords(listingId);
      if (response.code === 200) {
        const newKeywords = response.data.keywords;
        console.log(`✅ [${new Date().toISOString()}] Keywords fetched successfully:`, newKeywords.length, 'keywords');
        
        setKeywords(newKeywords);
        setCredits(response.data.credits);
        
        // Increment version to force reactivity
        setKeywordsVersion(prev => prev + 1);
        
        // Set first keyword as default only on initial load
        if (!isRefresh && newKeywords.length > 0) {
          const firstKeyword = newKeywords[0];
          console.log(`🎯 [${new Date().toISOString()}] Setting first keyword as default:`, firstKeyword.keyword);
          setSelectedKeyword(firstKeyword.id);
        }
        
        // Set specific keyword if provided (used after refresh)
        if (selectKeywordId && newKeywords.some(k => k.id === selectKeywordId)) {
          console.log(`🎯 [${new Date().toISOString()}] Setting specific keyword:`, selectKeywordId);
          setSelectedKeyword(selectKeywordId);
        }
        
        console.log(`🔄 [${new Date().toISOString()}] Keywords state updated, version:`, keywordsVersion + 1);
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
      
      console.log(`🏁 [${new Date().toISOString()}] Keywords fetch completed`);
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
    keywordsVersion, // Expose version for reactivity
    fetchKeywords
  };
};
