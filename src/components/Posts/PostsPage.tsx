
import React, { useState } from 'react';
import { Plus, Grid2x2, List, Search, Filter, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DateRangePicker } from '../ui/date-range-picker';
import { PostCard } from './PostCard';
import { PostListItem } from './PostListItem';
import { CreatePostModal } from './CreatePostModal';
import { useAppSelector } from '../../hooks/useRedux';
import { DateRange } from 'react-day-picker';

export const PostsPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const {
    posts
  } = useAppSelector(state => state.posts);

  const filteredPosts = posts.filter(post => {
    const matchesFilter = filter === 'all' || filter === 'scheduled' && post.status === 'scheduled' || filter === 'live' && post.status === 'published';
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Date range filter
    let matchesDateRange = true;
    if (dateRange?.from && dateRange?.to) {
      const postDate = new Date(post.publishDate);
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      matchesDateRange = postDate >= fromDate && postDate <= toDate;
    }
    
    return matchesFilter && matchesSearch && matchesDateRange;
  });

  const resetAllFilters = () => {
    setFilter('all');
    setSearchQuery('');
    setDateRange(undefined);
  };

  const hasActiveFilters = filter !== 'all' || searchQuery !== '' || dateRange?.from || dateRange?.to;

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
              <Input placeholder="Search posts..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 w-full" />
            </div>

            {/* Filter */}
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="scheduled">Scheduled Posts</SelectItem>
                <SelectItem value="live">Live Posts</SelectItem>
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

      {/* Posts Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border divide-y">
          {filteredPosts.map(post => (
            <PostListItem key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first post</p>
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
