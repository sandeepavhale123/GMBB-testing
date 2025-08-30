import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getKeywordsForProject } from '../api/geoRankingApi';
import { useToast } from './use-toast';
import type { KeywordData, Credits } from '../api/geoRankingApi';

export const useProjectKeywords = (projectId: number, initialKeywordId?: string) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [selectedKeyword, setSelectedKeywordState] = useState<string>('');
  const [credits, setCredits] = useState<Credits | null>(null);
  const [keywordsLoading, setKeywordsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const setSelectedKeywordWithURL = (keywordId: string) => {
    setSelectedKeywordState(keywordId);
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (keywordId) {
      newParams.set('keyword', keywordId);
    } else {
      newParams.delete('keyword');
    }
    setSearchParams(newParams);
  };

  const fetchKeywords = async (selectKeywordId?: string) => {
    if (!projectId) return;
    
    setKeywordsLoading(true);
    setError(null);

    try {
      const response = await getKeywordsForProject(projectId);
      
      if (response.code === 200) {
        setKeywords(response.data.keywords);
        setCredits(response.data.credits);
        
        // Determine which keyword to select
        let keywordToSelect = '';
        
        if (selectKeywordId && response.data.keywords.some(k => k.id === selectKeywordId)) {
          keywordToSelect = selectKeywordId;
        } else if (initialKeywordId && response.data.keywords.some(k => k.id === initialKeywordId)) {
          keywordToSelect = initialKeywordId;
        } else {
          // Check URL params
          const urlKeyword = searchParams.get('keyword');
          if (urlKeyword && response.data.keywords.some(k => k.id === urlKeyword)) {
            keywordToSelect = urlKeyword;
          } else if (response.data.keywords.length > 0) {
            keywordToSelect = response.data.keywords[0].id;
          }
        }
        
        if (keywordToSelect) {
          setSelectedKeywordWithURL(keywordToSelect);
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
    } finally {
      setKeywordsLoading(false);
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchKeywords();
  }, [projectId]);

  return {
    keywords,
    selectedKeyword,
    setSelectedKeyword: setSelectedKeywordWithURL,
    credits,
    keywordsLoading,
    pageLoading,
    keywordsError: error,
    fetchKeywords
  };
};