
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import { useListingContext } from '../../../context/ListingContext';
import { useToast } from '../../../hooks/use-toast';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { 
  setFilter, 
  setSearchQuery,
  setSortBy,
  setSentimentFilter,
  setDateRange, 
  clearDateRange, 
  setCurrentPage,
  fetchReviews,
  clearReviewsError,
  sendReviewReply,
  deleteReviewReply,
  clearReplyError,
  clearDeleteReplyError,
  refreshReviewData,
  clearRefreshError
} from '../../../store/slices/reviews';

export const useReviewsList = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { selectedListing } = useListingContext();
  
  const reviewsState = useAppSelector(state => state.reviews);
  
  const [editingReply, setEditingReply] = useState<string | null>(null);
  const [showingAIGenerator, setShowingAIGenerator] = useState<string | null>(null);
  const [localDateRange, setLocalDateRange] = useState<DateRange | undefined>();

  // Clear date range filter on component mount (reset to default)
  useEffect(() => {
    setLocalDateRange(undefined);
    dispatch(clearDateRange());
  }, [dispatch]);

  // Function to fetch reviews with current filters
  const fetchReviewsWithFilters = () => {
    if (selectedListing?.id) {
      // Determine the correct sortOrder based on sortBy
      let apiSortOrder: 'asc' | 'desc' = 'desc';
      if (reviewsState.sortBy === 'oldest' || reviewsState.sortBy === 'rating-low') {
        apiSortOrder = 'asc';
      }

      const params = {
        pagination: {
          page: reviewsState.currentPage,
          limit: reviewsState.pageSize,
          offset: (reviewsState.currentPage - 1) * reviewsState.pageSize
        },
        filters: {
          search: reviewsState.searchQuery,
          status: reviewsState.filter,
          dateRange: {
            startDate: reviewsState.dateRange.startDate || '2018-01-01',
            endDate: reviewsState.dateRange.endDate || '2025-12-31'
          },
          rating: {
            min: 1,
            max: 5
          },
          sentiment: reviewsState.sentimentFilter === 'all' ? 'All' : reviewsState.sentimentFilter,
          listingId: selectedListing.id
        },
        sorting: {
          sortBy: reviewsState.sortBy === 'newest' ? 'date' : reviewsState.sortBy === 'oldest' ? 'date' : reviewsState.sortBy === 'rating-high' ? 'rating' : reviewsState.sortBy === 'rating-low' ? 'rating' : 'date',
          sortOrder: apiSortOrder
        }
      };
      
      return dispatch(fetchReviews(params));
    }
    return Promise.resolve();
  };

  // Fetch reviews when listing or filters change
  useEffect(() => {
    fetchReviewsWithFilters();
  }, [dispatch, selectedListing?.id, reviewsState.currentPage, reviewsState.pageSize, reviewsState.searchQuery, reviewsState.filter, reviewsState.sentimentFilter, reviewsState.dateRange, reviewsState.sortBy]);

  // Handle refresh button click with new API
  const handleRefresh = async () => {
    if (!selectedListing?.id) return;

    // Determine the correct sortOrder based on sortBy
    let apiSortOrder: 'asc' | 'desc' = 'desc';
    if (reviewsState.sortBy === 'oldest' || reviewsState.sortBy === 'rating-low') {
      apiSortOrder = 'asc';
    }

    const reviewParams = {
      pagination: {
        page: reviewsState.currentPage,
        limit: reviewsState.pageSize,
        offset: (reviewsState.currentPage - 1) * reviewsState.pageSize
      },
      filters: {
        search: reviewsState.searchQuery,
        status: reviewsState.filter,
        dateRange: {
          startDate: reviewsState.dateRange.startDate || '2018-01-01',
          endDate: reviewsState.dateRange.endDate || '2025-12-31'
        },
        rating: {
          min: 1,
          max: 5
        },
        sentiment: reviewsState.sentimentFilter === 'all' ? 'All' : reviewsState.sentimentFilter,
        listingId: selectedListing.id
      },
      sorting: {
        sortBy: reviewsState.sortBy === 'newest' ? 'date' : reviewsState.sortBy === 'oldest' ? 'date' : reviewsState.sortBy === 'rating-high' ? 'rating' : reviewsState.sortBy === 'rating-low' ? 'rating' : 'date',
        sortOrder: apiSortOrder
      }
    };

    try {
      await dispatch(refreshReviewData({
        locationId: selectedListing.id,
        reviewParams
      })).unwrap();
      
      toast({
        title: "Success",
        description: "Review data refreshed successfully"
      });
    } catch (error) {
      console.error('Failed to refresh review data:', error);
    }
  };

  // Error handling effects
  useEffect(() => {
    if (reviewsState.refreshError) {
      toast({
        title: "Error Refreshing Data",
        description: reviewsState.refreshError,
        variant: "destructive"
      });
      
      const timer = setTimeout(() => {
        dispatch(clearRefreshError());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [reviewsState.refreshError, toast, dispatch]);

  useEffect(() => {
    if (reviewsState.replyError) {
      toast({
        title: "Error Sending Reply",
        description: reviewsState.replyError,
        variant: "destructive"
      });
      
      const timer = setTimeout(() => {
        dispatch(clearReplyError());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [reviewsState.replyError, toast, dispatch]);

  useEffect(() => {
    if (reviewsState.deleteReplyError) {
      toast({
        title: "Error Deleting Reply",
        description: reviewsState.deleteReplyError,
        variant: "destructive"
      });
      
      const timer = setTimeout(() => {
        dispatch(clearDeleteReplyError());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [reviewsState.deleteReplyError, toast, dispatch]);

  // Reply handlers
  const handleGenerateReply = (reviewId: string) => {
    setShowingAIGenerator(reviewId);
    setEditingReply(null);
  };

  const handleManualReply = (reviewId: string) => {
    setEditingReply(reviewId);
    setShowingAIGenerator(null);
  };

  const handleSaveReply = async (reviewId: string, reply?: string) => {
    const finalReplyText = reply;
    
    if (!finalReplyText?.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reply message",
        variant: "destructive"
      });
      return;
    }

    if (!selectedListing?.id) return;

    try {
      await dispatch(sendReviewReply({
        reviewId: parseInt(reviewId),
        replyText: finalReplyText,
        replyType: showingAIGenerator === reviewId ? 'AI' : 'manual',
        listingId: selectedListing.id
      })).unwrap();
      
      setEditingReply(null);
      setShowingAIGenerator(null);
      
      toast({
        title: "Success",
        description: "Reply sent successfully",
      });
    } catch (error) {
      console.error('Failed to send reply:', error);
    }
  };

  const handleDeleteReply = async (reviewId: string) => {
    if (!selectedListing?.id) return;

    try {
      await dispatch(deleteReviewReply({ 
        reviewId, 
        listingId: selectedListing.id 
      })).unwrap();
      
      toast({
        title: "Reply Deleted",
        description: "The reply has been deleted successfully",
      });
    } catch (error) {
      console.error('Failed to delete reply:', error);
    }
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

  // Check if there are active filters
  const hasActiveFilters = reviewsState.searchQuery.trim() !== '' || 
                          reviewsState.filter !== 'all' || 
                          reviewsState.sentimentFilter !== 'all' ||
                          Boolean(reviewsState.dateRange.startDate && reviewsState.dateRange.endDate);

  return {
    reviewsState,
    localDateRange,
    editingReply,
    showingAIGenerator,
    hasActiveFilters,
    handlers: {
      handleRefresh,
      handleGenerateReply,
      handleManualReply,
      handleSaveReply,
      handleDeleteReply,
      handleCancelAIGenerator,
      handleDateRangeChange,
      handleClearDateRange
    },
    actions: {
      setSearchQuery: (value: string) => dispatch(setSearchQuery(value)),
      setFilter: (value: string) => dispatch(setFilter(value)),
      setSentimentFilter: (value: string) => dispatch(setSentimentFilter(value)),
      setSortBy: (value: string) => dispatch(setSortBy(value)),
      setCurrentPage: (page: number) => dispatch(setCurrentPage(page)),
      clearReviewsError: () => dispatch(clearReviewsError())
    }
  };
};
