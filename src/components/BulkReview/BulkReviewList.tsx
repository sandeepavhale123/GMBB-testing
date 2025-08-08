import React, { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { 
  fetchBulkReviews,
  generateAIReply,
  sendReviewReply,
  deleteReviewReply,
  clearReplyError,
  clearDeleteReplyError,
  refreshReviewData,
  clearRefreshError,
  setSearchQuery,
  setFilter,
  setSentimentFilter,
  setSortBy,
  setSortOrder,
  setDateRange,
  setCurrentPage
} from '../../store/slices/reviews';
import { BulkReviewCard } from './BulkReviewCard';
import { BulkReviewFilters } from './BulkReviewFilters';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination';
import { Skeleton } from '../ui/skeleton';
import { Card, CardContent } from '../ui/card';
import { MessageSquare, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { useToast } from '../../hooks/use-toast';
import { GetReviewsRequest } from '../../services/reviewService';

export const BulkReviewList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  const {
    reviews,
    pagination,
    reviewsLoading,
    reviewsError,
    replyLoading,
    replyError,
    deleteReplyLoading,
    deleteReplyError,
    refreshLoading,
    refreshError,
    filter,
    searchQuery,
    sortBy,
    sortOrder,
    sentimentFilter,
    dateRange,
    currentPage,
    pageSize
  } = useAppSelector((state) => state.reviews);

  const [editingReply, setEditingReply] = useState<string | null>(null);
  const [showingAIGenerator, setShowingAIGenerator] = useState<string | null>(null);
  const [localDateRange, setLocalDateRange] = useState<DateRange | undefined>(
    dateRange.startDate && dateRange.endDate
      ? { from: new Date(dateRange.startDate), to: new Date(dateRange.endDate) }
      : undefined
  );

  // Debounced search
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchQuery(debouncedSearchQuery));
    }, 300);

    return () => clearTimeout(timer);
  }, [debouncedSearchQuery, dispatch]);

  // Fetch reviews when filters change
  const fetchReviewsWithFilters = useCallback(() => {
    const params: GetReviewsRequest = {
      pagination: {
        page: currentPage,
        limit: pageSize,
        offset: (currentPage - 1) * pageSize
      },
        filters: {
          search: searchQuery,
          status: filter === 'all' ? 'all' : filter,
          dateRange: {
            startDate: dateRange.startDate || '2018-01-01',
            endDate: dateRange.endDate || '2025-12-31'
          },
          rating: {
            min: 1,
            max: 5
          },
          sentiment: sentimentFilter
        },
      sorting: {
        sortBy,
        sortOrder
      }
    };

    dispatch(fetchBulkReviews(params));
  }, [dispatch, currentPage, pageSize, searchQuery, filter, dateRange, sentimentFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchReviewsWithFilters();
  }, [fetchReviewsWithFilters]);

  // Handle error toasts
  useEffect(() => {
    if (refreshError) {
      toast({
        title: 'Refresh Failed',
        description: refreshError,
        variant: 'destructive',
      });
      const timer = setTimeout(() => dispatch(clearRefreshError()), 5000);
      return () => clearTimeout(timer);
    }
  }, [refreshError, toast, dispatch]);

  useEffect(() => {
    if (replyError) {
      toast({
        title: 'Reply Failed',
        description: replyError,
        variant: 'destructive',
      });
      const timer = setTimeout(() => dispatch(clearReplyError()), 5000);
      return () => clearTimeout(timer);
    }
  }, [replyError, toast, dispatch]);

  useEffect(() => {
    if (deleteReplyError) {
      toast({
        title: 'Delete Failed',
        description: deleteReplyError,
        variant: 'destructive',
      });
      const timer = setTimeout(() => dispatch(clearDeleteReplyError()), 5000);
      return () => clearTimeout(timer);
    }
  }, [deleteReplyError, toast, dispatch]);

  // Event handlers
  const handleGenerateReply = (reviewId: string) => {
    dispatch(generateAIReply({ reviewId: parseInt(reviewId), listingId: '' }));
    setShowingAIGenerator(reviewId);
  };

  const handleManualReply = (reviewId: string) => {
    setEditingReply(reviewId);
    setShowingAIGenerator(null);
  };

  const handleSaveReply = async (reviewId: string, reply?: string) => {
    if (reply) {
      await dispatch(sendReviewReply({
        reviewId: parseInt(reviewId),
        reply_text: reply,
        listingId: ''
      }));
    }
    setEditingReply(null);
    setShowingAIGenerator(null);
  };

  const handleDeleteReply = async (reviewId: string) => {
    await dispatch(deleteReviewReply({ reviewId, listingId: '' }));
  };

  const handleCancelAIGenerator = () => {
    setShowingAIGenerator(null);
  };

  const handleRefresh = async () => {
    await dispatch(refreshReviewData({
      locationId: '',
      reviewParams: {
        pagination: {
          page: currentPage,
          limit: pageSize,
          offset: (currentPage - 1) * pageSize
        },
        filters: {
          search: searchQuery,
          status: filter === 'all' ? 'all' : filter,
          dateRange: {
            startDate: dateRange.startDate || '2018-01-01',
            endDate: dateRange.endDate || '2025-12-31'
          },
          rating: { min: 1, max: 5 },
          sentiment: sentimentFilter
        },
        sorting: { sortBy, sortOrder }
      }
    }));
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setLocalDateRange(range);
    dispatch(setDateRange({
      startDate: range?.from ? format(range.from, 'yyyy-MM-dd') : undefined,
      endDate: range?.to ? format(range.to, 'yyyy-MM-dd') : undefined
    }));
  };

  const handleClearDateRange = () => {
    setLocalDateRange(undefined);
    dispatch(setDateRange({ startDate: undefined, endDate: undefined }));
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  // Error state
  if (reviewsError) {
    return (
      <Card className="bg-card border border-border">
        <CardContent className="p-6">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load reviews</h3>
            <p className="text-muted-foreground mb-4">{reviewsError}</p>
            <Button onClick={fetchReviewsWithFilters}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (reviewsLoading && !reviews.length) {
    return (
      <div>
        <BulkReviewFilters
          searchQuery={debouncedSearchQuery}
          filter={filter}
          sentimentFilter={sentimentFilter}
          sortBy={sortBy}
          sortOrder={sortOrder}
          dateRange={localDateRange}
          refreshLoading={refreshLoading}
          onSearchChange={setDebouncedSearchQuery}
          onFilterChange={(value) => dispatch(setFilter(value))}
          onSentimentFilterChange={(value) => dispatch(setSentimentFilter(value))}
          onSortChange={(sortBy, sortOrder) => {
            dispatch(setSortBy(sortBy));
            dispatch(setSortOrder(sortOrder));
          }}
          onDateRangeChange={handleDateRangeChange}
          onClearDateRange={handleClearDateRange}
          onRefresh={handleRefresh}
        />
        
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-card border border-border">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-20 w-full mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!reviewsLoading && !reviews.length) {
    return (
      <div>
        <BulkReviewFilters
          searchQuery={debouncedSearchQuery}
          filter={filter}
          sentimentFilter={sentimentFilter}
          sortBy={sortBy}
          sortOrder={sortOrder}
          dateRange={localDateRange}
          refreshLoading={refreshLoading}
          onSearchChange={setDebouncedSearchQuery}
          onFilterChange={(value) => dispatch(setFilter(value))}
          onSentimentFilterChange={(value) => dispatch(setSentimentFilter(value))}
          onSortChange={(sortBy, sortOrder) => {
            dispatch(setSortBy(sortBy));
            dispatch(setSortOrder(sortOrder));
          }}
          onDateRangeChange={handleDateRangeChange}
          onClearDateRange={handleClearDateRange}
          onRefresh={handleRefresh}
        />
        
        <Card className="bg-card border border-border">
          <CardContent className="p-12">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No reviews found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or check back later for new reviews.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BulkReviewFilters
        searchQuery={debouncedSearchQuery}
        filter={filter}
        sentimentFilter={sentimentFilter}
        sortBy={sortBy}
        sortOrder={sortOrder}
        dateRange={localDateRange}
        refreshLoading={refreshLoading}
        onSearchChange={setDebouncedSearchQuery}
        onFilterChange={(value) => dispatch(setFilter(value))}
        onSentimentFilterChange={(value) => dispatch(setSentimentFilter(value))}
        onSortChange={(sortBy, sortOrder) => {
          dispatch(setSortBy(sortBy));
          dispatch(setSortOrder(sortOrder));
        }}
        onDateRangeChange={handleDateRangeChange}
        onClearDateRange={handleClearDateRange}
        onRefresh={handleRefresh}
      />

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <BulkReviewCard
            key={review.id}
            review={review}
            editingReply={editingReply}
            showingAIGenerator={showingAIGenerator}
            replyLoading={replyLoading}
            deleteLoading={deleteReplyLoading}
            onGenerateReply={handleGenerateReply}
            onManualReply={handleManualReply}
            onSaveReply={handleSaveReply}
            onDeleteReply={handleDeleteReply}
            onCancelAIGenerator={handleCancelAIGenerator}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            {pagination.has_prev && (
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="cursor-pointer"
                />
              </PaginationItem>
            )}
            
            {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
              const page = i + 1;
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={page === currentPage}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            
            {pagination.has_next && (
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="cursor-pointer"
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};