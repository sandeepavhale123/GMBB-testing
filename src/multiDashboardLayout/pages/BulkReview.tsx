import React, { useState, useEffect, useCallback } from "react";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BulkReviewSummary } from "@/components/BulkReview/BulkReviewSummary";
import { BulkReviewFilters } from "@/components/BulkReview/BulkReviewFilters";
import { BulkReviewCard } from "@/components/BulkReview/BulkReviewCard";
import { DateRange } from "react-day-picker";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  fetchBulkReviews,
  fetchBulkReviewStats,
  sendReviewReply,
  deleteReviewReply,
  generateAIReply,
} from "@/store/slices/reviews/thunks";
import {
  setFilter,
  setSearchQuery,
  setSentimentFilter,
  setSortBy,
  setDateRange,
  clearDateRange,
  setCurrentPage,
} from "@/store/slices/reviews/reviewsSlice";
import { useToast } from "@/hooks/use-toast";
import { formatDateForBackend } from "@/utils/dateUtils";
export const BulkReview: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    reviews,
    pagination,
    reviewsLoading,
    reviewsError,
    replyLoading,
    deleteReplyLoading,
    aiGenerationLoading,
    filter,
    searchQuery,
    sortBy,
    sentimentFilter,
    dateRange,
    currentPage,
    pageSize,
  } = useAppSelector((state) => state.reviews);
  const [localDateRange, setLocalDateRange] = useState<DateRange | undefined>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingReply, setEditingReply] = useState<string | null>(null);
  const [showingAIGenerator, setShowingAIGenerator] = useState<string | null>(
    null
  );
  const hasDateRange = localDateRange?.from || localDateRange?.to;

  // Debounced search effect
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(setSearchQuery(searchTerm));
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, dispatch]);

  // Load initial data
  useEffect(() => {
    dispatch(fetchBulkReviewStats());
    // loadBulkReviews();
  }, []);

  // Reload when filters change
  useEffect(() => {
    loadBulkReviews();
  }, [filter, searchQuery, sortBy, sentimentFilter, dateRange, currentPage]);

  const loadBulkReviews = useCallback(() => {
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
          startDate: dateRange.startDate || "2018-01-01",
          endDate: dateRange.endDate || "2025-12-31",
        },
        sentiment: sentimentFilter === "all" ? "All" : sentimentFilter,
      },
      sorting: {
        sortBy: sortBy === "newest" ? "date" : sortBy,
        sortOrder: sortBy === "newest" ? ("desc" as const) : ("asc" as const),
      },
    };
    dispatch(fetchBulkReviews(params));
  }, [
    dispatch,
    currentPage,
    pageSize,
    searchQuery,
    filter,
    dateRange,
    sentimentFilter,
    sortBy,
  ]);
  const handleRefresh = () => {
    setIsRefreshing(true);
    loadBulkReviews();
    dispatch(fetchBulkReviewStats());
    setTimeout(() => setIsRefreshing(false), 1000);
  };
  const handleClearDateRange = () => {
    setLocalDateRange(undefined);
    dispatch(clearDateRange());
  };
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setLocalDateRange(range);
    if (range?.from && range?.to) {
        dispatch(
          setDateRange({
            startDate: formatDateForBackend(range.from),
            endDate: formatDateForBackend(range.to),
          })
        );
    }
  };
  const handleGenerateReply = (reviewId: string) => {
    setShowingAIGenerator(reviewId);
    setEditingReply(null);
  };
  const handleManualReply = (reviewId: string) => {
    setEditingReply(reviewId);
    setShowingAIGenerator(null);
  };
  const handleSaveReply = async (reviewId: string, reply?: string) => {
    if (!reply?.trim()) return;
    try {
      await dispatch(
        sendReviewReply({
          reviewId: parseInt(reviewId),
          replyText: reply,
          replyType: "manual",
          listingId: "bulk", // For bulk operations
        })
      ).unwrap();
      setEditingReply(null);
      setShowingAIGenerator(null);
      toast({
        title: "Success",
        description: "Reply sent successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive",
      });
    }
  };
  const handleDeleteReply = async (reviewId: string) => {
    try {
      await dispatch(
        deleteReviewReply({
          reviewId,
          listingId: "bulk",
        })
      ).unwrap();
      toast({
        title: "Success",
        description: "Reply deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete reply",
        variant: "destructive",
      });
    }
  };
  const handleCancelAIGenerator = () => {
    setShowingAIGenerator(null);
    setEditingReply(null);
  };
  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Bulk Review Management
          </h1>
          <p className="text-muted-foreground">
            Manage reviews across all your listings.
          </p>
        </div>
        <Button
          onClick={() => navigate("/main-dashboard/bulk-auto-reply")}
          className="self-start sm:self-auto"
        >
          <MessageCircle className="w-4 h-4 mr-1" />
          Configure Auto Reply
        </Button>
      </div>

      <div className="space-y-6">
        {/* Summary Cards */}
        <BulkReviewSummary />

        {/* Customer Reviews */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Customer Reviews</h3>
            <Button className="hidden ">
              <MessageCircle className="w-4 h-4 mr-1" />
              Configure Auto Reply
            </Button>
          </div>

          {/* Search and Filters */}
          <BulkReviewFilters
            searchQuery={searchTerm}
            filter={filter}
            sentimentFilter={sentimentFilter}
            sortBy={sortBy}
            localDateRange={localDateRange}
            hasDateRange={!!hasDateRange}
            isRefreshing={isRefreshing}
            onSearchChange={setSearchTerm}
            onFilterChange={(value) => dispatch(setFilter(value))}
            onSentimentFilterChange={(value) =>
              dispatch(setSentimentFilter(value))
            }
            onSortChange={(value) => dispatch(setSortBy(value))}
            onDateRangeChange={handleDateRangeChange}
            onClearDateRange={handleClearDateRange}
            onRefresh={handleRefresh}
          />

          {/* Loading State */}
          {reviewsLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading reviews...</div>
            </div>
          )}

          {/* Error State */}
          {reviewsError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">Error: {reviewsError}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={loadBulkReviews}
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          )}

          {/* Reviews List */}
          {!reviewsLoading && !reviewsError && (
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No reviews found matching your criteria.
                </div>
              ) : (
                reviews.map((review) => (
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
                ))
              )}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.total_pages > 1 && (
            <div className="flex items-center justify-between mt-6 flex-col gap-4 sm:flex-row sm:gap-0">
              <p className="text-sm text-muted-foreground">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} reviews
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.has_prev}
                >
                  Previous
                </Button>
                <span className="px-3 py-1 text-sm bg-muted rounded">
                  Page {pagination.page} of {pagination.total_pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.has_next}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
