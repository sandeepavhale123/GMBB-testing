import React, { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { useListingContext } from '../../context/ListingContext';
import { useToast } from '../../hooks/use-toast';
import {
  fetchReviews,
  sendReviewReply,
  deleteReviewReply,
  generateAIReply,
  refreshReviewData,
  setFilter,
  setSearchQuery,
  setSortBy,
  setSortOrder,
  setSentimentFilter,
  setDateRange,
  clearReplyError,
  clearDeleteReplyError,
  clearRefreshError,
} from '../../store/slices/reviews';
import { BulkReviewCard } from './BulkReviewCard';
import { BulkReviewFilters } from './BulkReviewFilters';
import { Button } from '../ui/button';
import { AlertTriangle } from 'lucide-react';

export const BulkReviewList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { selectedListing } = useListingContext();

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
    pageSize,
  } = useAppSelector((state) => state.reviews);

  const [editingReply, setEditingReply] = useState<string | null>(null);
  const [showingAIGenerator, setShowingAIGenerator] = useState<string | null>(null);

  // Fetch reviews when component mounts or dependencies change
  const fetchReviewsWithFilters = useCallback(() => {
    if (!selectedListing?.id) return;

    const params = {
      pagination: {
        page: currentPage,
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
      },
      filters: {
        search: searchQuery,
        status: filter,
        dateRange: {
          startDate: dateRange.startDate || '',
          endDate: dateRange.endDate || '',
        },
        rating: {
          min: 1,
          max: 5,
        },
        sentiment: sentimentFilter,
        listingId: selectedListing.id,
      },
      sorting: {
        sortBy,
        sortOrder,
      },
    };

    dispatch(fetchReviews(params));
  }, [
    dispatch,
    selectedListing?.id,
    currentPage,
    pageSize,
    filter,
    searchQuery,
    sortBy,
    sortOrder,
    sentimentFilter,
    dateRange.startDate,
    dateRange.endDate,
  ]);

  useEffect(() => {
    fetchReviewsWithFilters();
  }, [fetchReviewsWithFilters]);

  // Handle refresh
  const handleRefresh = async () => {
    if (!selectedListing?.id) return;

    const reviewParams = {
      pagination: {
        page: currentPage,
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
      },
      filters: {
        search: searchQuery,
        status: filter,
        dateRange: {
          startDate: dateRange.startDate || '',
          endDate: dateRange.endDate || '',
        },
        rating: {
          min: 1,
          max: 5,
        },
        sentiment: sentimentFilter,
        listingId: selectedListing.id,
      },
      sorting: {
        sortBy,
        sortOrder,
      },
    };

    await dispatch(refreshReviewData({
      locationId: selectedListing.id,
      reviewParams,
    }));
  };

  // Error handling
  useEffect(() => {
    if (refreshError) {
      toast({
        title: "Refresh Failed",
        description: refreshError,
        variant: "destructive",
      });
      
      const timer = setTimeout(() => {
        dispatch(clearRefreshError());
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [refreshError, toast, dispatch]);

  useEffect(() => {
    if (replyError) {
      toast({
        title: "Reply Failed",
        description: replyError,
        variant: "destructive",
      });
      
      const timer = setTimeout(() => {
        dispatch(clearReplyError());
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [replyError, toast, dispatch]);

  useEffect(() => {
    if (deleteReplyError) {
      toast({
        title: "Delete Failed",
        description: deleteReplyError,
        variant: "destructive",
      });
      
      const timer = setTimeout(() => {
        dispatch(clearDeleteReplyError());
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [deleteReplyError, toast, dispatch]);

  // Handle reply actions
  const handleGenerateReply = (reviewId: string) => {
    setShowingAIGenerator(reviewId);
    setEditingReply(null);
  };

  const handleManualReply = (reviewId: string) => {
    if (reviewId === '') {
      setEditingReply(null);
    } else {
      setEditingReply(reviewId);
      setShowingAIGenerator(null);
    }
  };

  const handleSaveReply = async (reviewId: string, reply?: string) => {
    if (!selectedListing?.id || !reply) return;

    await dispatch(sendReviewReply({
      reviewId: Number(reviewId),
      replyText: reply,
      replyType: "manual",
      listingId: selectedListing.id,
    }));

    setEditingReply(null);
    setShowingAIGenerator(null);
  };

  const handleDeleteReply = async (reviewId: string) => {
    if (!selectedListing?.id) return;

    await dispatch(deleteReviewReply({
      reviewId,
      listingId: selectedListing.id,
    }));
  };

  const handleCancelAIGenerator = () => {
    setShowingAIGenerator(null);
  };

  // Filter handlers
  const handleDateRangeChange = (startDate?: string, endDate?: string) => {
    dispatch(setDateRange({ startDate, endDate }));
  };

  const handleClearDateRange = () => {
    dispatch(setDateRange({ startDate: undefined, endDate: undefined }));
  };

  if (reviewsError) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Failed to load reviews</h3>
        <p className="text-muted-foreground mb-4">{reviewsError}</p>
        <Button onClick={fetchReviewsWithFilters}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <BulkReviewFilters
        searchQuery={searchQuery}
        filter={filter}
        sentimentFilter={sentimentFilter}
        sortBy={sortBy}
        sortOrder={sortOrder}
        dateRange={dateRange}
        onSearchChange={(query) => dispatch(setSearchQuery(query))}
        onFilterChange={(filter) => dispatch(setFilter(filter))}
        onSentimentFilterChange={(sentiment) => dispatch(setSentimentFilter(sentiment))}
        onSortChange={(sortBy, sortOrder) => {
          dispatch(setSortBy(sortBy));
          dispatch(setSortOrder(sortOrder));
        }}
        onDateRangeChange={handleDateRangeChange}
        onRefresh={handleRefresh}
        refreshLoading={refreshLoading}
      />

      {/* Reviews List */}
      {reviewsLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((index) => (
            <div key={index} className="border border-border rounded-lg p-6 bg-card animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-foreground mb-2">No reviews found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or check back later.</p>
        </div>
      ) : (
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
      )}
    </div>
  );
};