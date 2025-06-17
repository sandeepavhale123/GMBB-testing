
import { useState, useEffect, useCallback } from 'react';
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

  const performSearch = useCallback(async (query: string) => {
    console.log('🔍 useBusinessSearch: Starting search for query:', query);

    if (!query.trim()) {
      console.log('🔍 useBusinessSearch: Empty query, clearing results');
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      setSearchError(null);

      // Prioritize API search - this is the primary data source
      console.log('🔍 useBusinessSearch: Performing API search...');
      const apiResults = await businessListingsService.searchListings(query, 20);
      console.log('🔍 useBusinessSearch: API search results:', apiResults);
      console.log('🔍 useBusinessSearch: API results count:', apiResults.length);
      console.log('🔍 useBusinessSearch: API results names:', apiResults.map(listing => listing.name));
      
      // If API returns results, use them as primary results
      if (apiResults.length > 0) {
        console.log('🔍 useBusinessSearch: Using API results as primary');
        setSearchResults(apiResults);
      } else {
        // Only fallback to local search if API returns no results
        console.log('🔍 useBusinessSearch: API returned no results, trying local fallback');
        console.log('🔍 useBusinessSearch: Local fallback data:', initialListings);
        
        const localResults = initialListings.filter(listing => {
          const nameMatch = listing.name.toLowerCase().includes(query.toLowerCase());
          const addressMatch = listing.address.toLowerCase().includes(query.toLowerCase());
          const typeMatch = listing.type.toLowerCase().includes(query.toLowerCase());
          
          return nameMatch || addressMatch || typeMatch;
        });

        console.log('🔍 useBusinessSearch: Local fallback results:', localResults);
        setSearchResults(localResults);
      }

    } catch (err) {
      console.error('🔍 useBusinessSearch: API search failed:', err);
      setSearchError('Search failed');
      
      // Fallback to local search only when API fails
      console.log('🔍 useBusinessSearch: Falling back to local search due to API error');
      const localResults = initialListings.filter(listing =>
        listing.name.toLowerCase().includes(query.toLowerCase()) ||
        listing.address.toLowerCase().includes(query.toLowerCase()) ||
        listing.type.toLowerCase().includes(query.toLowerCase())
      );
      console.log('🔍 useBusinessSearch: Error fallback results:', localResults);
      setSearchResults(localResults);
    } finally {
      setSearching(false);
    }
  }, [initialListings]);

  // Debounced search
  useEffect(() => {
    console.log('🔍 useBusinessSearch: Search query changed to:', searchQuery);
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, performSearch]);

  return {
    searchResults,
    searching,
    searchError,
    searchQuery,
    setSearchQuery
  };
};
