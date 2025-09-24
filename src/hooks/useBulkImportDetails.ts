import { useState, useEffect, useCallback } from 'react';
import { csvApi, type BulkListing, type BulkImportPost } from '@/api/csvApi';

interface UseBulkImportDetailsResult {
  // Listings data
  listings: BulkListing[];
  listingsLoading: boolean;
  listingsError: string | null;
  listingsPagination: {
    page: number;
    limit: number;
    total: number;
  };
  
  // Posts data
  posts: BulkImportPost[];
  postsLoading: boolean;
  postsError: string | null;
  postsPagination: {
    page: number;
    limit: number;
    total: number;
  };
  
  // Search and filters
  listingSearch: string;
  postSearch: string;
  selectedListingId: string | null;
  
  // Actions
  setListingSearch: (search: string) => void;
  setPostSearch: (search: string) => void;
  setSelectedListingId: (id: string) => void;
  setListingsPage: (page: number) => void;
  setPostsPage: (page: number) => void;
  refreshListings: () => void;
  refreshPosts: () => void;
}

export const useBulkImportDetails = (historyId: number): UseBulkImportDetailsResult => {
  // Listings state
  const [listings, setListings] = useState<BulkListing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [listingsError, setListingsError] = useState<string | null>(null);
  const [listingsPagination, setListingsPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  const [listingSearch, setListingSearch] = useState('');

  // Posts state
  const [posts, setPosts] = useState<BulkImportPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [postsPagination, setPostsPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  const [postSearch, setPostSearch] = useState('');
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);

  // Fetch listings
  const fetchListings = useCallback(async () => {
    if (!historyId) return;
    
    setListingsLoading(true);
    setListingsError(null);
    
    try {
      const response = await csvApi.getBulkCSVListing({
        historyId,
        page: listingsPagination.page,
        limit: listingsPagination.limit,
        search: listingSearch
      });
      
      setListings(response.data.listings);
      setListingsPagination(prev => ({
        ...prev,
        total: response.data.pagination.total
      }));
      
      // Auto-select first listing if none selected
      if (!selectedListingId && response.data.listings.length > 0) {
        setSelectedListingId(response.data.listings[0].id);
      }
    } catch (error: any) {
      console.error('Failed to fetch listings:', error);
      setListingsError(error?.response?.data?.message || 'Failed to fetch listings');
    } finally {
      setListingsLoading(false);
    }
  }, [historyId, listingsPagination.page, listingsPagination.limit, listingSearch, selectedListingId]);

  // Fetch posts for selected listing
  const fetchPosts = useCallback(async () => {
    if (!historyId || !selectedListingId) {
      setPosts([]);
      return;
    }
    
    setPostsLoading(true);
    setPostsError(null);
    
    try {
      const response = await csvApi.getListingPostDetails({
        historyId,
        listingId: selectedListingId,
        page: postsPagination.page,
        limit: postsPagination.limit,
        search: postSearch
      });
      
      setPosts(response.data.posts);
      setPostsPagination(prev => ({
        ...prev,
        total: response.data.pagination.total
      }));
    } catch (error: any) {
      console.error('Failed to fetch posts:', error);
      setPostsError(error?.response?.data?.message || 'Failed to fetch posts');
    } finally {
      setPostsLoading(false);
    }
  }, [historyId, selectedListingId, postsPagination.page, postsPagination.limit, postSearch]);

  // Effects
  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Actions
  const handleSetListingSearch = useCallback((search: string) => {
    setListingSearch(search);
    setListingsPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleSetPostSearch = useCallback((search: string) => {
    setPostSearch(search);
    setPostsPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleSetSelectedListingId = useCallback((id: string) => {
    setSelectedListingId(id);
    setPostsPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleSetListingsPage = useCallback((page: number) => {
    setListingsPagination(prev => ({ ...prev, page }));
  }, []);

  const handleSetPostsPage = useCallback((page: number) => {
    setPostsPagination(prev => ({ ...prev, page }));
  }, []);

  return {
    // Listings data
    listings,
    listingsLoading,
    listingsError,
    listingsPagination,
    
    // Posts data
    posts,
    postsLoading,
    postsError,
    postsPagination,
    
    // Search and filters
    listingSearch,
    postSearch,
    selectedListingId,
    
    // Actions
    setListingSearch: handleSetListingSearch,
    setPostSearch: handleSetPostSearch,
    setSelectedListingId: handleSetSelectedListingId,
    setListingsPage: handleSetListingsPage,
    setPostsPage: handleSetPostsPage,
    refreshListings: fetchListings,
    refreshPosts: fetchPosts
  };
};