
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DateRangePicker } from '../ui/date-range-picker';
import { Search, Star, Bot, MessageSquare, Edit3, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { useListingContext } from '../../context/ListingContext';
import { 
  setFilter, 
  setSearchQuery,
  setSortBy,
  setSortOrder,
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
    sortOrder,
    sentimentFilter,
    dateRange,
    currentPage,
    pageSize
  } = useAppSelector(state => state.reviews);

  const [editingReply, setEditingReply] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showingAIGenerator, setShowingAIGenerator] = useState<string | null>(null);
  const [localDateRange, setLocalDateRange] = useState<DateRange | undefined>();

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
      // Determine the correct sortOrder based on sortBy
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
          sortBy: sortBy === 'newest' ? 'date' : sortBy === 'oldest' ? 'date' : sortBy === 'rating-high' ? 'rating' : sortBy === 'rating-low' ? 'rating' : '',
          sortOrder: apiSortOrder
        }
      };
      
      dispatch(fetchReviews(params));
    }
  }, [dispatch, selectedListing?.id, currentPage, pageSize, searchQuery, filter, sentimentFilter, dateRange, sortBy]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star 
        key={index} 
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getCustomerInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getSentimentFromRating = (rating: number) => {
    if (rating >= 4) return 'positive';
    if (rating <= 2) return 'negative';
    return 'neutral';
  };

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
    console.log('Saving reply for review:', reviewId, reply || replyText);
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
    dispatch(setSearchQuery(value));
  };

  const handleSortChange = (value: string) => {
    dispatch(setSortBy(value));
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
        
        {/* Single Row Filters */}
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search reviews..." 
              value={searchQuery} 
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10" 
            />
          </div>
          
          <Select value={filter} onValueChange={(value) => dispatch(setFilter(value))}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Reviews" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="pending">Pending Reply</SelectItem>
              <SelectItem value="replied">Replied</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sentimentFilter} onValueChange={(value) => dispatch(setSentimentFilter(value))}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All Sentiment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sentiment</SelectItem>
              <SelectItem value="positive">Positive</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="negative">Negative</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Newest First" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="rating-high">Highest Rating</SelectItem>
              <SelectItem value="rating-low">Lowest Rating</SelectItem>
            </SelectContent>
          </Select>

          <DateRangePicker
            date={localDateRange}
            onDateChange={handleDateRangeChange}
            placeholder="Select date range"
            className="w-[200px]"
          />
          
          {(dateRange.startDate || dateRange.endDate) && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearDateRange}
              className="px-2"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {reviewsLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-white shadow-sm animate-pulse">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <ReviewsEmptyState 
            hasFilters={hasActiveFilters}
            totalReviewsCount={pagination?.total || 0}
          />
        ) : (
          <>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-white shadow-sm">
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Customer Avatar */}
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {review.profile_image_url ? (
                        <img 
                          src={review.profile_image_url} 
                          alt={review.customer_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        getCustomerInitials(review.customer_name)
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{review.customer_name}</h4>
                          <Badge variant="outline" className="text-xs">{review.platform}</Badge>
                          <Badge className={`text-xs ${getSentimentColor(getSentimentFromRating(review.rating))}`}>
                            {getSentimentFromRating(review.rating)}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500 flex-shrink-0">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm text-gray-600">({review.rating}/5)</span>
                      </div>

                      {/* Review Text */}
                      {review.comment && (
                        <p className="text-gray-700 mb-4 text-sm sm:text-base leading-relaxed">{review.comment}</p>
                      )}

                      {/* Reply Section */}
                      {review.replied && review.reply_text && editingReply !== review.id && (
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4 rounded-r-md">
                          <p className="text-sm text-gray-700">{review.reply_text}</p>
                          {review.reply_date && (
                            <p className="text-xs text-gray-500 mt-2">
                              Replied on {new Date(review.reply_date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Edit Reply Form */}
                      {editingReply === review.id && (
                        <div className="mb-4">
                          <textarea 
                            value={replyText} 
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write your reply..." 
                            className="w-full p-3 border border-gray-300 rounded-md text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            rows={3} 
                          />
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Button size="sm" onClick={() => handleSaveReply(review.id)}>
                              Save Reply
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingReply(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* AI Reply Generator */}
                      {showingAIGenerator === review.id && (
                        <AIReplyGenerator 
                          reviewId={review.id}
                          customerName={review.customer_name}
                          rating={review.rating}
                          comment={review.comment}
                          sentiment={getSentimentFromRating(review.rating)}
                          onSave={handleSaveReply}
                          onCancel={handleCancelAIGenerator}
                        />
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        {!review.replied && showingAIGenerator !== review.id && editingReply !== review.id && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleGenerateReply(review.id)} className="flex items-center gap-1 text-xs sm:text-sm">
                              <Bot className="w-4 h-4" />
                              <span className="hidden sm:inline">Generate using Genie</span>
                              <span className="sm:hidden">AI Reply</span>
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleManualReply(review.id)} className="flex items-center gap-1 text-xs sm:text-sm">
                              <MessageSquare className="w-4 h-4" />
                              <span className="hidden sm:inline">Reply Manually</span>
                              <span className="sm:hidden">Reply</span>
                            </Button>
                          </>
                        )}
                        {review.replied && editingReply !== review.id && showingAIGenerator !== review.id && (
                          <Button size="sm" variant="outline" onClick={() => handleManualReply(review.id)} className="flex items-center gap-1 text-xs sm:text-sm">
                            <Edit3 className="w-4 h-4" />
                            Edit Reply
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.total_pages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-gray-200 gap-4">
                <p className="text-sm text-gray-600 order-2 sm:order-1">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} reviews
                </p>
                <div className="flex items-center gap-2 order-1 sm:order-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.has_prev}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>
                  <span className="text-sm text-gray-600 px-2">
                    Page {pagination.page} of {pagination.total_pages}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.has_next}
                    className="flex items-center gap-1"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
