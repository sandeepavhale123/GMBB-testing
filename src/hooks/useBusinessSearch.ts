
import { useState, useEffect, useCallback, useRef } from 'react';
import { BusinessListing } from '@/components/Header/types';
import { businessListingsService } from '@/services/businessListingsService';

interface UseBusinessSearchReturn {
  searchResults: BusinessListing[];
  searching: boolean;
  searchError: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useBusinessSearch = (initialListings: BusinessListing[]): UseBusinessSearchReturn => {
  const [searchResults, setSearchResults] = useState<BusinessListing[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use ref to track abort controller for cancelling requests
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastSearchQueryRef = useRef<string>('');

  const performLocalSearch = useCallback((query: string): BusinessListing[] => {
    console.log('🔍 useBusinessSearch: Performing local search for:', query);
    
    const localResults = initialListings.filter(listing => {
      const nameMatch = listing.name.toLowerCase().includes(query.toLowerCase());
      const addressMatch = listing.address.toLowerCase().includes(query.toLowerCase());
      const typeMatch = listing.type.toLowerCase().includes(query.toLowerCase());
      
      return nameMatch || addressMatch || typeMatch;
    });

    console.log('🔍 useBusinessSearch: Local search results:', localResults.length);
    return localResults;
  }, [initialListings]);

  const performApiSearch = useCallback(async (query: string) => {
    console.log('🔍 useBusinessSearch: Starting API search for query:', query);

    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      setSearching(true);
      setSearchError(null);

      console.log('🔍 useBusinessSearch: Performing API search...');
      const apiResults = await businessListingsService.searchListings(query, 20);
      
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        console.log('🔍 useBusinessSearch: Request was aborted');
        return;
      }

      console.log('🔍 useBusinessSearch: API search results:', apiResults);
      console.log('🔍 useBusinessSearch: API results count:', apiResults.length);
      
      if (apiResults.length > 0) {
        console.log('🔍 useBusinessSearch: Using API results as primary');
        setSearchResults(apiResults);
      } else {
        console.log('🔍 useBusinessSearch: API returned no results, using local fallback');
        const localResults = performLocalSearch(query);
        setSearchResults(localResults);
      }

    } catch (err: any) {
      // Don't show error if request was aborted
      if (err.name === 'AbortError' || abortControllerRef.current?.signal.aborted) {
        console.log('🔍 useBusinessSearch: Request was cancelled');
        return;
      }

      console.error('🔍 useBusinessSearch: API search failed:', err);
      setSearchError('Search failed');
      
      // Fallback to local search
      console.log('🔍 useBusinessSearch: Falling back to local search due to API error');
      const localResults = performLocalSearch(query);
      setSearchResults(localResults);
    } finally {
      setSearching(false);
      abortControllerRef.current = null;
    }
  }, [performLocalSearch]);

  const performSearch = useCallback(async (query: string) => {
    console.log('🔍 useBusinessSearch: performSearch called with query:', query);

    // Prevent duplicate searches
    if (query === lastSearchQueryRef.current) {
      console.log('🔍 useBusinessSearch: Skipping duplicate search for:', query);
      return;
    }
    
    lastSearchQueryRef.current = query;

    // Clear results for empty query
    if (!query.trim()) {
      console.log('🔍 useBusinessSearch: Empty query, clearing results');
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    // For very short queries (1-2 characters), use local search only
    if (query.trim().length < 3) {
      console.log('🔍 useBusinessSearch: Short query, using local search only');
      setSearching(false);
      setSearchError(null);
      const localResults = performLocalSearch(query);
      setSearchResults(localResults);
      return;
    }

    // For longer queries, use API search
    await performApiSearch(query);
  }, [performLocalSearch, performApiSearch]);

  // Debounced search with increased delay
  useEffect(() => {
    console.log('🔍 useBusinessSearch: Search query changed to:', searchQuery);
    
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 600); // Increased from 300ms to 600ms

    return () => {
      clearTimeout(timeoutId);
      // Cancel any pending API request when component unmounts or query changes
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [searchQuery, performSearch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    searchResults,
    searching,
    searchError,
    searchQuery,
    setSearchQuery
  };
};
