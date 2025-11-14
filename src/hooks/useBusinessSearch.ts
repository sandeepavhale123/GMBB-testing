import { useState, useEffect, useCallback, useRef } from "react";
import { BusinessListing } from "@/components/Header/types";
import { businessListingsService } from "@/services/businessListingsService";

interface UseBusinessSearchReturn {
  searchResults: BusinessListing[];
  searching: boolean;
  searchError: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useBusinessSearch = (
  initialListings: BusinessListing[]
): UseBusinessSearchReturn => {
  const [searchResults, setSearchResults] = useState<BusinessListing[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Use ref to track abort controller and prevent duplicate searches
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastProcessedQueryRef = useRef<string>("");

  const performLocalSearch = useCallback(
    (query: string): BusinessListing[] => {
      const localResults = initialListings.filter((listing) => {
        const nameMatch = listing.name
          .toLowerCase()
          .includes(query.toLowerCase());
        const addressMatch = listing.address
          .toLowerCase()
          .includes(query.toLowerCase());
        const typeMatch = listing.type
          .toLowerCase()
          .includes(query.toLowerCase());

        return nameMatch || addressMatch || typeMatch;
      });

      return localResults;
    },
    [initialListings]
  );

  const checkInitialListForExactMatch = useCallback(
    (query: string): BusinessListing[] => {
      const exactMatches = initialListings.filter((listing) =>
        listing.name.toLowerCase().includes(query.toLowerCase().trim())
      );

      return exactMatches;
    },
    [initialListings]
  );

  const performApiSearch = useCallback(
    async (query: string) => {
      const trimmedQuery = query.trim();

      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();
      const currentController = abortControllerRef.current;

      try {
        setSearching(true);
        setSearchError(null);

        const apiResults = await businessListingsService.searchListings(
          trimmedQuery,
          20
        );

        // Only process results if this request wasn't aborted
        if (
          !currentController.signal.aborted &&
          abortControllerRef.current === currentController
        ) {
          if (apiResults.length > 0) {
            setSearchResults(apiResults);
          } else {
            const localResults = performLocalSearch(trimmedQuery);
            setSearchResults(localResults);
          }

          // Mark this query as processed
          lastProcessedQueryRef.current = trimmedQuery;
        } else {
          //
        }
      } catch (err: any) {
        // Only handle error if request wasn't aborted
        if (
          !currentController.signal.aborted &&
          abortControllerRef.current === currentController
        ) {
          console.error("🔍 useBusinessSearch: API search failed:", err);
          setSearchError("Search failed");

          // Fallback to local search on error

          const localResults = performLocalSearch(trimmedQuery);
          setSearchResults(localResults);
        } else {
          //
        }
      } finally {
        // Only update searching state if this is still the current request
        if (
          !currentController.signal.aborted &&
          abortControllerRef.current === currentController
        ) {
          setSearching(false);
          abortControllerRef.current = null;
        }
      }
    },
    [performLocalSearch]
  );

  const performSearch = useCallback(
    async (query: string) => {
      const trimmedQuery = query.trim();

      // Prevent duplicate searches for the same query
      if (trimmedQuery === lastProcessedQueryRef.current) {
        return;
      }

      // Clear results and error for empty query
      if (!trimmedQuery) {
        setSearchResults([]);
        setSearchError(null);
        setSearching(false);
        lastProcessedQueryRef.current = "";

        // Cancel any pending requests
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          abortControllerRef.current = null;
        }
        return;
      }

      // For very short queries (1-2 characters), use local search only
      if (trimmedQuery.length < 3) {
        setSearching(false);
        setSearchError(null);
        const localResults = performLocalSearch(trimmedQuery);
        setSearchResults(localResults);
        lastProcessedQueryRef.current = trimmedQuery;
        return;
      }

      // Check initial list first for exact matches
      const initialMatches = checkInitialListForExactMatch(trimmedQuery);
      if (initialMatches.length > 0) {
        setSearching(false);
        setSearchError(null);
        setSearchResults(initialMatches);
        lastProcessedQueryRef.current = trimmedQuery;
        return;
      }

      // For longer queries with no initial matches, use API search
      await performApiSearch(trimmedQuery);
    },
    [performLocalSearch, checkInitialListForExactMatch, performApiSearch]
  );

  // Debounced search with optimized delay
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 500);

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
    setSearchQuery,
  };
};
