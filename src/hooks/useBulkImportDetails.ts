import { useState, useEffect, useCallback } from 'react';
import { csvApi, type BulkListing, type BulkImportPost } from '@/api/csvApi';
import { useToast } from '@/hooks/use-toast';

interface UseBulkImportDetailsResult {
  // Listings data
  listings: BulkListing[];
  listingsLoading: boolean;
  listingsError: string | null;
  noListingsFound: boolean;
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
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
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
  deletePost: (postId: string) => Promise<void>;
  isDeletingPost: boolean;
}

export const useBulkImportDetails = (historyId: number): UseBulkImportDetailsResult => {
  const { toast } = useToast();
  // Listings state
  const [listings, setListings] = useState<BulkListing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [listingsError, setListingsError] = useState<string | null>(null);
  const [noListingsFound, setNoListingsFound] = useState(false);
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
  const [isDeletingPost, setIsDeletingPost] = useState(false);

  // Fetch listings
  const fetchListings = useCallback(async () => {
    if (!historyId) return;
    
    setListingsLoading(true);
    setListingsError(null);
    setNoListingsFound(false);
    
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
      const errorMessage = error?.response?.data?.message || 'Failed to fetch listings';
      
      // Check if this is the specific "No listings found" error
      if (error?.response?.status === 401 && errorMessage === 'No listings found for this history ID.') {
        setNoListingsFound(true);
        setListings([]);
      } else {
        setListingsError(errorMessage);
      }
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

  // Delete post function
  const deletePost = useCallback(async (postId: string) => {
    setIsDeletingPost(true);
    
    try {
      const response = await csvApi.deleteBulkListingPosts({
        historyId,
        postIds: [parseInt(postId)],
        isDelete: 'confirm'
      });

      // Re-fetch posts from server to get updated list
      await fetchPosts();
      
      toast({
        title: "Success",
        description: response.message,
      });
    } catch (error: any) {
      console.error('Failed to delete post:', error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || 'Failed to delete post',
        variant: "destructive",
      });
    } finally {
      setIsDeletingPost(false);
    }
  }, [historyId, toast, fetchPosts]);

  const postsTotal = postsPagination.total;
  const postsTotalPages = Math.ceil(postsTotal / postsPagination.limit);

  return {
    // Listings data
    listings,
    listingsLoading,
    listingsError,
    noListingsFound,
    listingsPagination,
    
    // Posts data
    posts,
    postsLoading,
    postsError,
    postsPagination: {
      ...postsPagination,
      totalPages: postsTotalPages,
      hasNext: postsPagination.page < postsTotalPages,
      hasPrev: postsPagination.page > 1
    },
    
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
    refreshPosts: fetchPosts,
    deletePost,
    isDeletingPost
  };
};