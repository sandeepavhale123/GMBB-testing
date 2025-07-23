
import { useState, useEffect, useCallback } from 'react';
import { Keyword } from '../types/keywords';
import { getKeywordsList, addKeywords, checkKeywordRanks, exportKeywords } from '../api/keywordsApi';
import { useToast } from './use-toast';

export const useKeywordsPage = (listingId: string) => {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchKeywords = useCallback(async (page: number = 1) => {
    if (!listingId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getKeywordsList(listingId, page);
      if (response.code === 200) {
        setKeywords(response.data.keywords);
        setTotalPages(Math.ceil(response.data.total / 10));
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
      setLoading(false);
    }
  }, [listingId, toast]);

  const handleAddKeywords = async (keywordsList: string[]) => {
    if (!listingId || keywordsList.length === 0) return;
    
    try {
      const response = await addKeywords({
        listingId,
        keywords: keywordsList
      });
      
      if (response.code === 200) {
        toast({
          title: "Success",
          description: `${keywordsList.length} keyword(s) added successfully`
        });
        fetchKeywords(currentPage);
      } else {
        throw new Error(response.message || 'Failed to add keywords');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add keywords';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleCheckRanks = async (keywordIds: string[]) => {
    if (!listingId || keywordIds.length === 0) return;
    
    try {
      const response = await checkKeywordRanks({
        listingId,
        keywordIds
      });
      
      if (response.code === 200) {
        toast({
          title: "Success",
          description: "Keyword rank checking initiated"
        });
        fetchKeywords(currentPage);
      } else {
        throw new Error(response.message || 'Failed to check ranks');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check ranks';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleExport = async (format: 'csv' | 'json') => {
    if (!listingId) return;
    
    try {
      const blob = await exportKeywords(listingId, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `keywords.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: `Keywords exported as ${format.toUpperCase()}`
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export keywords';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchKeywords(page);
  };

  useEffect(() => {
    fetchKeywords(1);
  }, [fetchKeywords]);

  return {
    keywords,
    loading,
    error,
    currentPage,
    totalPages,
    fetchKeywords,
    handleAddKeywords,
    handleCheckRanks,
    handleExport,
    handlePageChange
  };
};
