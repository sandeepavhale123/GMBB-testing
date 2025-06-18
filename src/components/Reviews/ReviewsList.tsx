
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { useDebounce } from '../../hooks/useDebounce';
import { useListingContext } from '../../context/ListingContext';
import { 
  setFilter, 
  setSearchQuery,
  setSortBy,
  setSentimentFilter,
  setDateRange, 
  clearDateRange, 
  setCurrentPage,
  replyToReview,
  fetchReviews,
  clearReviewsError
} from '../../store/slices/reviewsSlice';
import { AIReplyGenerator } from './AIReplyGenerator';
import { ReviewsEmptyState } from './ReviewsEmptyState';
import { ReviewsFilters } from './ReviewsFilters';
import { ReviewCard } from './ReviewCard';
import { ReviewsPagination } from './ReviewsPagination';
import { ReviewsLoadingState } from './ReviewsLoadingState';
import { DateRange } from 'react-day-picker';
import { format, subDays } from 'date-fns';

export const ReviewsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedListing } = useListingContext();
  const {
    reviews,
    pagination,
    reviewsLoading,
    reviewsError,
    filter,
    searchQuery,
    sortBy,
    sentimentFilter,
    dateRange,
    currentPage,
    pageSize
  } = useAppSelector(state => state.reviews);

  const [editingReply, setEditingReply] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showingAIGenerator, setShowingAIGenerator] = useState<string | null>(null);
  const [localDateRange, setLocalDateRange] = useState<DateRange | undefined>();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Debounce search query with 3 seconds delay
  const debouncedSearchQuery = useDebounce(localSearchQuery, 3000);

  // Update Redux state when debounced value changes
  useEffect(() => {
    if (debouncedSearchQuery !== searchQuery) {
      dispatch(setSearchQuery(debouncedSearchQuery));
    }
  }, [debouncedSearchQuery, searchQuery, dispatch]);

  // Set default 90-day date range on component mount
  useEffect(() => {
    const today = new Date();
    const ninetyDaysAgo = subDays(today, 90);
    
    const defaultDateRange = {
      from: ninetyDaysAgo,
      to: today
    };
    
    setLocalDateRange(defaultDateRange);
    dispatch(setDateRange({
      startDate: format(ninetyDaysAgo, 'yyyy-MM-dd'),
      endDate: format(today, 'yyyy-MM-dd')
    }));
  }, [dispatch]);

  // Fetch reviews when listing or filters change
  useEffect(() => {
    if (selectedListing?.id) {
      let apiSortOrder: 'asc' | 'desc' = 'desc';
      if (sortBy === 'oldest' || sortBy === 'rating-low') {
        apiSortOrder = 'asc';
      }

      const params = {
        pagination: {
          page: currentPage,
          limit: pageSize,
          offset: (currentPage - 1) * pageSize
        },
        filters: {
          search: searchQuery,
          status: filter,
          dateRange: {
            startDate: dateRange.startDate || '2018-01-01',
            endDate: dateRange.endDate || '2025-12-31'
          },
          rating: {
            min: 1,
            max: 5
          },
          sentiment: sentimentFilter === 'all' ? 'All' : sentimentFilter,
          listingId: selectedListing.id
        },
        sorting: {
          sortBy: sortBy === 'newest' ? 'date' : sortBy === 'oldest' ? 'date' : sortBy === 'rating-high' ? 'rating' : sortBy === 'rating-low' ? 'rating' : 'date',
          sortOrder: apiSortOrder
        }
      };
      
      dispatch(fetchReviews(params));
    }
  }, [dispatch, selectedListing?.id, currentPage, pageSize, searchQuery, filter, sentimentFilter, dateRange, sortBy]);

  // Event handlers
  const handleGenerateReply = (reviewId: string) => {
    setShowingAIGenerator(reviewId);
    setEditingReply(null);
  };

  const handleManualReply = (reviewId: string) => {
    const review = reviews.find(r => r.id === reviewId);
    setEditingReply(reviewId);
    setShowingAIGenerator(null);
    setReplyText(review?.reply_text || '');
  };

  const handleSaveReply = (reviewId: string, reply?: string) => {
    dispatch(replyToReview({ 
      reviewId, 
      replyText: reply || replyText 
    }));
    setEditingReply(null);
    setShowingAIGenerator(null);
    setReplyText('');
  };

  const handleCancelAIGenerator = () => {
    setShowingAIGenerator(null);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setLocalDateRange(range);
    if (range?.from && range?.to) {
      dispatch(setDateRange({
        startDate: format(range.from, 'yyyy-MM-dd'),
        endDate: format(range.to, 'yyyy-MM-dd')
      }));
    } else if (!range?.from && !range?.to) {
      dispatch(clearDateRange());
    }
  };

  const handleClearDateRange = () => {
    setLocalDateRange(undefined);
    dispatch(clearDateRange());
  };

  const handleSearchChange = (value: string) => {
    setLocalSearchQuery(value);
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  // Check if there are active filters
  const hasActiveFilters = searchQuery.trim() !== '' || 
                          filter !== 'all' || 
                          sentimentFilter !== 'all' ||
                          Boolean(dateRange.startDate && dateRange.endDate);

  if (reviewsError) {
    return (
      <Card className="bg-white border border-red-200">
        <CardContent className="p-6 text-center">
          <p className="text-red-600 mb-4">{reviewsError}</p>
          <Button onClick={() => dispatch(clearReviewsError())} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Customer Reviews</CardTitle>
        
        <ReviewsFilters
          searchQuery={localSearchQuery}
          filter={filter}
          sentimentFilter={sentimentFilter}
          sortBy={sortBy}
          dateRange={localDateRange}
          onSearchChange={handleSearchChange}
          onFilterChange={(value) => dispatch(setFilter(value))}
          onSentimentFilterChange={(value) => dispatch(setSentimentFilter(value))}
          onSortChange={(value) => dispatch(setSortBy(value))}
          onDateRangeChange={handleDateRangeChange}
          onClearDateRange={handleClearDateRange}
          hasDateRange={Boolean(dateRange.startDate && dateRange.endDate)}
        />
      </CardHeader>

      <CardContent className="pt-0">
        {reviewsLoading ? (
          <ReviewsLoadingState />
        ) : reviews.length === 0 ? (
          <ReviewsEmptyState 
            hasFilters={hasActiveFilters}
            totalReviewsCount={pagination?.total || 0}
          />
        ) : (
          <>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id}>
                  <ReviewCard
                    review={review}
                    editingReply={editingReply}
                    replyText={replyText}
                    showingAIGenerator={showingAIGenerator}
                    onGenerateReply={handleGenerateReply}
                    onManualReply={handleManualReply}
                    onSaveReply={handleSaveReply}
                    onCancelEdit={() => setEditingReply(null)}
                    onReplyTextChange={setReplyText}
                  />

                  {/* AI Reply Generator */}
                  {showingAIGenerator === review.id && (
                    <AIReplyGenerator 
                      reviewId={review.id}
                      customerName={review.customer_name}
                      rating={review.rating}
                      comment={review.comment}
                      sentiment={review.rating >= 4 ? 'positive' : review.rating <= 2 ? 'negative' : 'neutral'}
                      onSave={handleSaveReply}
                      onCancel={handleCancelAIGenerator}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && (
              <ReviewsPagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
