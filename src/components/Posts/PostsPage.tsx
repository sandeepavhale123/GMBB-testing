import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import {
  fetchPosts,
  setFilter,
  setSearchQuery,
} from '../../store/slices/postsSlice';
import { useListingContext } from '../../context/ListingContext';
import { DateRange } from 'react-day-picker';
import { toast } from '@/hooks/use-toast';
import { CreatePostModal } from './CreatePostModal';
import { PostsHeader } from './PostsHeader';
import { PostsControls } from './PostsControls';
import { PostsLoadingState } from './PostsLoadingState';
import { PostsEmptyState } from './PostsEmptyState';
import { PostsContent } from './PostsContent';
import {
  transformPostForCloning,
  CreatePostFormData,
} from '../../utils/postCloneUtils';
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
  const [isPolling, setIsPolling] = useState(true);

  const { posts, loading, error, filter, searchQuery, pagination } =
    useAppSelector((state) => state.posts);

  const getValidListingId = (): string | null => {
    if (selectedListing?.id) return selectedListing.id;
    if (urlListingId && urlListingId !== 'default') {
      const exists = listings.some((listing) => listing.id === urlListingId);
      if (exists) return urlListingId;
    }
    return null;
  };

  const validListingId = getValidListingId();

  // Polling logic with stop condition
  useEffect(() => {
    if (!validListingId || isInitialLoading || !isPolling) return;

    const interval = setInterval(async () => {
      const res = await dispatch(
        fetchPosts({
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
        })
      );

      // Stop polling if keywords are empty
      const responseData = res.payload?.data;
      if (responseData?.keywords?.length === 0) {
        setIsPolling(false);
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [validListingId, isInitialLoading, isPolling, dispatch, filter, searchQuery, dateRange, pagination.currentPage]);

  // Debounced search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(setSearchQuery(localSearchQuery));
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [localSearchQuery, dispatch]);

  // Error toast
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error]);

  const handleFilterChange = (newFilter: string) => {
    dispatch(setFilter(newFilter));
    setIsPolling(true);
  };

  const resetAllFilters = () => {
    dispatch(setFilter('all'));
    setLocalSearchQuery('');
    dispatch(setSearchQuery(''));
    setDateRange(undefined);
    setIsPolling(true);
  };

  const hasActiveFilters =
    filter !== 'all' ||
    searchQuery !== '' ||
    !!dateRange?.from ||
    !!dateRange?.to;

  const handlePageChange = (page: number) => {
    if (!validListingId) return;
    dispatch(
      fetchPosts({
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
      })
    );
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

  if (isInitialLoading) {
    return <PostsLoadingState />;
  }

  if (!validListingId) {
    return (
      <div className="space-y-6">
        <PostsHeader onCreatePost={handleCreatePost} />
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            No Business Listing Selected
          </h3>
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

