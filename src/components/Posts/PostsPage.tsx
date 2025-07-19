
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { fetchPosts, setFilter, setSearchQuery } from '../../store/slices/postsSlice';
import { useListingContext } from '../../context/ListingContext';
import { DateRange } from 'react-day-picker';
import { toast } from '@/hooks/use-toast';
import { CreatePostModal } from './CreatePostModal';
import { PostsHeader } from './PostsHeader';
import { PostsControls } from './PostsControls';
import { PostsLoadingState } from './PostsLoadingState';
import { PostsEmptyState } from './PostsEmptyState';
import { PostsContent } from './PostsContent';
import { transformPostForCloning, CreatePostFormData } from '../../utils/postCloneUtils';
import { Post } from '../../types/postTypes';

export const PostsPage = () => {
  const dispatch = useAppDispatch();
  const { listingId: urlListingId } = useParams<{ listingId?: string }>();
  const { selectedListing, isInitialLoading, listings } = useListingContext();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [cloneData, setCloneData] = useState<CreatePostFormData | null>(null);
  const [isCloning, setIsCloning] = useState(false);
  
  const {
    posts,
    loading,
    error,
    filter,
    searchQuery,
    pagination
  } = useAppSelector(state => state.posts);

  // Resolve listing ID with proper validation
  const getValidListingId = (): string | null => {
    // Priority 1: Selected listing from context
    if (selectedListing?.id) {
      return selectedListing.id;
    }
    
    // Priority 2: URL parameter if it exists in user's listings
    if (urlListingId && urlListingId !== 'default') {
      const existsInListings = listings.some(listing => listing.id === urlListingId);
      if (existsInListings) {
        return urlListingId;
      }
    }
    
    return null;
  };

  const validListingId = getValidListingId();

  // Fetch posts when component mounts or dependencies change
  useEffect(() => {
    // Only fetch if we have a valid listing ID and context is initialized
    if (validListingId && !isInitialLoading) {
      console.log('📝 PostsPage: Fetching posts for listing:', validListingId);
      dispatch(fetchPosts({
        listingId: parseInt(validListingId),
        filters: {
          status: filter === 'all' ? 'all' : filter,
          search: searchQuery,
          dateRange: {
            startDate: dateRange?.from ? dateRange.from.toISOString().split('T')[0] : '',
            endDate: dateRange?.to ? dateRange.to.toISOString().split('T')[0] : '',
          },
        },
        pagination: {
          page: pagination.currentPage,
          limit: 12,
        },
      }));
    } else if (!isInitialLoading && !validListingId) {
      console.log('📝 PostsPage: No valid listing ID available, skipping fetch');
    }
  }, [dispatch, validListingId, filter, searchQuery, dateRange, pagination.currentPage, isInitialLoading]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(setSearchQuery(localSearchQuery));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localSearchQuery, dispatch]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);

  const handleFilterChange = (newFilter: string) => {
    dispatch(setFilter(newFilter));
  };

  const resetAllFilters = () => {
    dispatch(setFilter('all'));
    setLocalSearchQuery('');
    dispatch(setSearchQuery(''));
    setDateRange(undefined);
  };

  const hasActiveFilters = filter !== 'all' || searchQuery !== '' || !!(dateRange?.from) || !!(dateRange?.to);

  const handlePageChange = (page: number) => {
    if (!validListingId) return;
    
    dispatch(fetchPosts({
      listingId: parseInt(validListingId),
      filters: {
        status: filter === 'all' ? 'all' : filter,
        search: searchQuery,
        dateRange: {
          startDate: dateRange?.from ? dateRange.from.toISOString().split('T')[0] : '',
          endDate: dateRange?.to ? dateRange.to.toISOString().split('T')[0] : '',
        },
      },
      pagination: {
        page,
        limit: 12,
      },
    }));
  };

  const handleCreatePost = () => {
    setCloneData(null);
    setIsCloning(false);
    setIsCreateModalOpen(true);
  };

  const handleClonePost = (post: Post) => {
    const clonedData = transformPostForCloning(post);
    setCloneData(clonedData);
    setIsCloning(true);
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setCloneData(null);
    setIsCloning(false);
  };

  // Show loading state while context is initializing
  if (isInitialLoading) {
    return <PostsLoadingState />;
  }

  // Show error state if no valid listing is available
  if (!validListingId) {
    return (
      <div className="space-y-6">
        <PostsHeader onCreatePost={handleCreatePost} />
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Business Listing Selected</h3>
          <p className="text-yellow-700">
            Please select a valid business listing to view and manage posts.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PostsHeader onCreatePost={handleCreatePost} />

      <PostsControls
        loading={loading}
        totalPosts={pagination.totalPosts}
        hasActiveFilters={hasActiveFilters}
        localSearchQuery={localSearchQuery}
        onSearchChange={setLocalSearchQuery}
        filter={filter}
        onFilterChange={handleFilterChange}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onResetFilters={resetAllFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {loading && <PostsLoadingState />}

      {!loading && (
        <>
          {posts.length === 0 ? (
            <PostsEmptyState 
              hasActiveFilters={hasActiveFilters}
              onCreatePost={handleCreatePost}
            />
          ) : (
            <PostsContent
              posts={posts}
              viewMode={viewMode}
              pagination={pagination}
              hasActiveFilters={hasActiveFilters}
              onPageChange={handlePageChange}
              onClonePost={handleClonePost}
            />
          )}
        </>
      )}

      <CreatePostModal 
        isOpen={isCreateModalOpen} 
        onClose={handleCloseModal}
        initialData={cloneData}
        isCloning={isCloning}
      />
    </div>
  );
};
