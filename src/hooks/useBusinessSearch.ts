
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
    console.log('🔍 useBusinessSearch: initialListings received:', initialListings);
    console.log('🔍 useBusinessSearch: initialListings count:', initialListings.length);
    console.log('🔍 useBusinessSearch: initialListings names:', initialListings.map(listing => listing.name));

    if (!query.trim()) {
      console.log('🔍 useBusinessSearch: Empty query, clearing results');
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      setSearchError(null);

      // First, search locally in initial listings
      console.log('🔍 useBusinessSearch: Performing local search...');
      const localResults = initialListings.filter(listing => {
        const nameMatch = listing.name.toLowerCase().includes(query.toLowerCase());
        const addressMatch = listing.address.toLowerCase().includes(query.toLowerCase());
        const typeMatch = listing.type.toLowerCase().includes(query.toLowerCase());
        
        console.log(`🔍 useBusinessSearch: Checking "${listing.name}":`, {
          nameMatch,
          addressMatch,
          typeMatch,
          listingName: listing.name,
          queryLower: query.toLowerCase(),
          nameIncludes: listing.name.toLowerCase().includes(query.toLowerCase())
        });
        
        return nameMatch || addressMatch || typeMatch;
      });

      console.log('🔍 useBusinessSearch: Local search results:', localResults);
      console.log('🔍 useBusinessSearch: Local results count:', localResults.length);

      // If we have local results, show them immediately
      if (localResults.length > 0) {
        console.log('🔍 useBusinessSearch: Setting local results immediately');
        setSearchResults(localResults);
      }

      // Then search via API for more comprehensive results
      console.log('🔍 useBusinessSearch: Performing API search...');
      const apiResults = await businessListingsService.searchListings(query, 20);
      console.log('🔍 useBusinessSearch: API search results:', apiResults);
      console.log('🔍 useBusinessSearch: API results count:', apiResults.length);
      console.log('🔍 useBusinessSearch: API results names:', apiResults.map(listing => listing.name));
      
      // Combine and deduplicate results - prioritize API results
      const combinedResults = [...apiResults];
      localResults.forEach(localListing => {
        if (!combinedResults.find(existing => existing.id === localListing.id)) {
          combinedResults.push(localListing);
        }
      });

      console.log('🔍 useBusinessSearch: Combined results:', combinedResults);
      console.log('🔍 useBusinessSearch: Final results count:', combinedResults.length);
      setSearchResults(combinedResults);
    } catch (err) {
      console.error('🔍 useBusinessSearch: Search failed:', err);
      setSearchError('Search failed');
      // Fallback to local search only
      console.log('🔍 useBusinessSearch: Falling back to local search only');
      const localResults = initialListings.filter(listing =>
        listing.name.toLowerCase().includes(query.toLowerCase()) ||
        listing.address.toLowerCase().includes(query.toLowerCase()) ||
        listing.type.toLowerCase().includes(query.toLowerCase())
      );
      console.log('🔍 useBusinessSearch: Fallback local results:', localResults);
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
