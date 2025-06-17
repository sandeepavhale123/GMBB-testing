
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
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      setSearchError(null);

      // First, search locally in initial listings
      const localResults = initialListings.filter(listing =>
        listing.name.toLowerCase().includes(query.toLowerCase()) ||
        listing.address.toLowerCase().includes(query.toLowerCase()) ||
        listing.type.toLowerCase().includes(query.toLowerCase())
      );

      // If we have local results, show them immediately
      if (localResults.length > 0) {
        setSearchResults(localResults);
      }

      // Then search via API for more comprehensive results
      const apiResults = await businessListingsService.searchListings(query, 20);
      
      // Combine and deduplicate results
      const combinedResults = [...localResults];
      apiResults.forEach(apiListing => {
        if (!combinedResults.find(existing => existing.id === apiListing.id)) {
          combinedResults.push(apiListing);
        }
      });

      setSearchResults(combinedResults);
      console.log('Search results for query:', query, combinedResults);
    } catch (err) {
      console.error('Search failed:', err);
      setSearchError('Search failed');
      // Fallback to local search only
      const localResults = initialListings.filter(listing =>
        listing.name.toLowerCase().includes(query.toLowerCase()) ||
        listing.address.toLowerCase().includes(query.toLowerCase()) ||
        listing.type.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(localResults);
    } finally {
      setSearching(false);
    }
  }, [initialListings]);

  // Debounced search
  useEffect(() => {
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
