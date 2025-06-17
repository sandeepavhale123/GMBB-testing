
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
  
  // Use ref to track abort controller and prevent duplicate searches
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastProcessedQueryRef = useRef<string>('');

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
    const trimmedQuery = query.trim();
    console.log('🔍 useBusinessSearch: Starting API search for query:', `"${trimmedQuery}"`);

    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      console.log('🔍 useBusinessSearch: Canceling previous request');
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    const currentController = abortControllerRef.current;

    try {
      setSearching(true);
      setSearchError(null);

      console.log('🔍 useBusinessSearch: Making API call for:', `"${trimmedQuery}"`);
      const apiResults = await businessListingsService.searchListings(trimmedQuery, 20);
      
      // Only process results if this request wasn't aborted
      if (!currentController.signal.aborted && abortControllerRef.current === currentController) {
        console.log('🔍 useBusinessSearch: API search completed successfully');
        console.log('🔍 useBusinessSearch: API results count:', apiResults.length);
        console.log('🔍 useBusinessSearch: API result names:', apiResults.map(r => r.name));
        
        if (apiResults.length > 0) {
          console.log('🔍 useBusinessSearch: Using API results as primary');
          setSearchResults(apiResults);
        } else {
          console.log('🔍 useBusinessSearch: API returned no results, using local fallback');
          const localResults = performLocalSearch(trimmedQuery);
          setSearchResults(localResults);
        }
        
        // Mark this query as processed
        lastProcessedQueryRef.current = trimmedQuery;
      } else {
        console.log('🔍 useBusinessSearch: Request was aborted or superseded, ignoring results');
      }

    } catch (err: any) {
      // Only handle error if request wasn't aborted
      if (!currentController.signal.aborted && abortControllerRef.current === currentController) {
        console.error('🔍 useBusinessSearch: API search failed:', err);
        setSearchError('Search failed');
        
        // Fallback to local search on error
        console.log('🔍 useBusinessSearch: Falling back to local search due to API error');
        const localResults = performLocalSearch(trimmedQuery);
        setSearchResults(localResults);
      } else {
        console.log('🔍 useBusinessSearch: Error ignored due to aborted request');
      }
    } finally {
      // Only update searching state if this is still the current request
      if (!currentController.signal.aborted && abortControllerRef.current === currentController) {
        setSearching(false);
        abortControllerRef.current = null;
      }
    }
  }, [performLocalSearch]);

  const performSearch = useCallback(async (query: string) => {
    const trimmedQuery = query.trim();
    console.log('🔍 useBusinessSearch: performSearch called with query:', `"${trimmedQuery}"`);

    // Prevent duplicate searches for the same query
    if (trimmedQuery === lastProcessedQueryRef.current) {
      console.log('🔍 useBusinessSearch: Skipping duplicate search for:', `"${trimmedQuery}"`);
      return;
    }

    // Clear results and error for empty query
    if (!trimmedQuery) {
      console.log('🔍 useBusinessSearch: Empty query, clearing results');
      setSearchResults([]);
      setSearchError(null);
      setSearching(false);
      lastProcessedQueryRef.current = '';
      
      // Cancel any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      return;
    }

    // For very short queries (1-2 characters), use local search only
    if (trimmedQuery.length < 3) {
      console.log('🔍 useBusinessSearch: Short query, using local search only');
      setSearching(false);
      setSearchError(null);
      const localResults = performLocalSearch(trimmedQuery);
      setSearchResults(localResults);
      lastProcessedQueryRef.current = trimmedQuery;
      return;
    }

    // For longer queries, use API search
    await performApiSearch(trimmedQuery);
  }, [performLocalSearch, performApiSearch]);

  // Debounced search with optimized delay
  useEffect(() => {
    console.log('🔍 useBusinessSearch: Search query changed to:', `"${searchQuery}"`);
    
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 500); // Reduced from 600ms to 500ms for better responsiveness

    return () => {
      clearTimeout(timeoutId);
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
