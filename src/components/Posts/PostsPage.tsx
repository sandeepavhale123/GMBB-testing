
import React, { useState, useEffect } from 'react';
import { Plus, Grid2x2, List, Search, Filter, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DateRangePicker } from '../ui/date-range-picker';
import { PostCard } from './PostCard';
import { PostListItem } from './PostListItem';
import { CreatePostModal } from './CreatePostModal';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { fetchPosts, setFilter, setSearchQuery } from '../../store/slices/postsSlice';
import { useListingContext } from '../../context/ListingContext';
import { DateRange } from 'react-day-picker';
import { toast } from '@/hooks/use-toast';

export const PostsPage = () => {
  const dispatch = useAppDispatch();
  const { selectedListing } = useListingContext();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const {
    posts,
    loading,
    error,
    filter,
    searchQuery,
    pagination
  } = useAppSelector(state => state.posts);

  // Get listingId from URL or context
  const listingId = selectedListing?.id || parseInt(window.location.pathname.split('/')[2]) || 176832;

  // Fetch posts when component mounts or dependencies change
  useEffect(() => {
    if (listingId) {
      dispatch(fetchPosts({
        listingId: parseInt(listingId.toString()),
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
          limit: 10,
        },
      }));
    }
  }, [dispatch, listingId, filter, searchQuery, dateRange, pagination.currentPage]);

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

  const hasActiveFilters = filter !== 'all' || searchQuery !== '' || dateRange?.from || dateRange?.to;

  const handlePageChange = (page: number) => {
    dispatch(fetchPosts({
      listingId: parseInt(listingId.toString()),
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
        limit: 10,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Create Post</span>
        </Button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 sm:max-w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search posts..." 
                value={localSearchQuery} 
                onChange={e => setLocalSearchQuery(e.target.value)} 
                className="pl-10 w-full" 
              />
            </div>

            {/* Filter */}
            <Select value={filter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="scheduled">Scheduled Posts</SelectItem>
                <SelectItem value="live">Live Posts</SelectItem>
                <SelectItem value="failed">Failed Posts</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Range Filter */}
            <div className="w-full sm:w-60">
              <DateRangePicker
                date={dateRange}
                onDateChange={setDateRange}
                placeholder="Filter by date range"
                className="w-full"
              />
            </div>

            {/* Reset Filters Button */}
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetAllFilters}
                className="whitespace-nowrap"
              >
                <X className="w-4 h-4 mr-2" />
                Reset Filters
              </Button>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 self-center">
            <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('grid')} className="h-8">
              <Grid2x2 className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('list')} className="h-8">
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading posts...</p>
        </div>
      )}

      {/* Posts Display */}
      {!loading && (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border divide-y">
              {posts.map(post => (
                <PostListItem key={post.id} post={post} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevious}
              >
                Previous
              </Button>
              
              <span className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && posts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
          <p className="text-gray-500 mb-4">
            {hasActiveFilters ? 'Try adjusting your filters' : 'Get started by creating your first post'}
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        </div>
      )}

      {/* Create Post Modal */}
      <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
};
