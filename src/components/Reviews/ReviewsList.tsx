import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { useListingContext } from "../../context/ListingContext";
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
  clearRefreshError,
} from "../../store/slices/reviews";
import { ReviewsFilters } from "./ReviewsFilters";
import { ReviewCard } from "./ReviewCard";
import { ReviewsPagination } from "./ReviewsPagination";
import { ReviewsEmptyState } from "./ReviewsEmptyState";
import { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";
import { useToast } from "../../hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const ReviewsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { selectedListing } = useListingContext();
  const { t } = useI18nNamespace("Reviews/reviewsList");
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
    sentimentFilter,
    dateRange,
    currentPage,
    pageSize,
  } = useAppSelector((state) => state.reviews);

  const [editingReply, setEditingReply] = useState<string | null>(null);
  const [showingAIGenerator, setShowingAIGenerator] = useState<string | null>(
    null
  );
  const [localDateRange, setLocalDateRange] = useState<DateRange | undefined>();
  const [isInitialized, setIsInitialized] = useState(false);

  // Reset to show last 10 reviews by default on component mount and page load
  useEffect(() => {
    // Clear date range to show all reviews, but limit to 10 with pagination
    setLocalDateRange(undefined);
    dispatch(clearDateRange());

    setIsInitialized(true);
  }, [dispatch, selectedListing?.id]); // Reset when listing changes too

  // Function to fetch reviews with current filters
  const fetchReviewsWithFilters = () => {
    if (selectedListing?.id && isInitialized) {
      // Determine the correct sortOrder based on sortBy
      let apiSortOrder: "desc" | "asc" = "desc";
      if (sortBy === "oldest" || sortBy === "rating-low") {
        apiSortOrder = "asc";
      }

      const params = {
        pagination: {
          page: currentPage,
          limit: 10, // Set default limit to 10 for last 10 reviews
          offset: (currentPage - 1) * 10,
        },
        filters: {
          search: searchQuery,
          status: filter,
          dateRange: {
            startDate: dateRange.startDate || "",
            endDate: dateRange.endDate || "",
          },
          rating: {
            min: 1,
            max: 5,
          },
          sentiment: sentimentFilter === "all" ? "All" : sentimentFilter,
          listingId: selectedListing.id,
        },
        sorting: {
          sortBy:
            sortBy === "newest"
              ? "date"
              : sortBy === "oldest"
              ? "date"
              : sortBy === "rating-high"
              ? "rating"
              : sortBy === "rating-low"
              ? "rating"
              : "date",
          sortOrder: apiSortOrder,
        },
      };

      return dispatch(fetchReviews(params));
    }
    return Promise.resolve();
  };

  // Fetch reviews when listing or filters change (only after initialization)
  useEffect(() => {
    if (isInitialized) {
      fetchReviewsWithFilters();
    }
  }, [
    dispatch,
    selectedListing?.id,
    currentPage,
    searchQuery,
    filter,
    sentimentFilter,
    dateRange,
    sortBy,
    isInitialized,
  ]);

  // Handle refresh button click with new API
  const handleRefresh = async () => {
    if (!selectedListing?.id) return;

    // Determine the correct sortOrder based on sortBy
    let apiSortOrder: "asc" | "desc" = "desc";
    if (sortBy === "oldest") {
      apiSortOrder = "asc";
    } else if (sortBy === "rating-low") {
      apiSortOrder = "desc";
    }

    const reviewParams = {
      pagination: {
        page: currentPage,
        limit: 10, // Use 10 as default limit
        offset: (currentPage - 1) * 10,
      },
      filters: {
        search: searchQuery,
        status: filter,
        dateRange: {
          startDate: dateRange.startDate || "",
          endDate: dateRange.endDate || "",
        },
        rating: {
          min: 1,
          max: 5,
        },
        sentiment: sentimentFilter === "all" ? "All" : sentimentFilter,
        listingId: selectedListing.id,
      },
      sorting: {
        sortBy:
          sortBy === "newest"
            ? "date"
            : sortBy === "oldest"
            ? "date"
            : sortBy === "rating-high"
            ? "rating"
            : sortBy === "rating-low"
            ? "rating"
            : "date",
        sortOrder: apiSortOrder,
      },
    };
    try {
      await dispatch(
        refreshReviewData({
          locationId: selectedListing.id,
          reviewParams,
        })
      ).unwrap();

      toast({
        title: t("reviewsList.success.title"),
        description: t("reviewsList.success.refresh"),
      });
    } catch (error) {
      // Error will be handled by the useEffect below
      // console.error("Failed to refresh review data:", error);
    }
  };

  // Show toast for refresh errors
  useEffect(() => {
    if (refreshError) {
      toast({
        title: t("reviewsList.errors.refreshError"),
        description: refreshError,
        variant: "destructive",
      });

      // Clear error after showing toast
      const timer = setTimeout(() => {
        dispatch(clearRefreshError());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [refreshError, toast, dispatch]);

  // Show toast for reply errors
  useEffect(() => {
    if (replyError) {
      toast({
        title: t("reviewsList.errors.replyError"),
        description: replyError,
        variant: "destructive",
      });

      // Clear error after showing toast
      const timer = setTimeout(() => {
        dispatch(clearReplyError());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [replyError, toast, dispatch]);

  // Show toast for delete reply errors
  useEffect(() => {
    if (deleteReplyError) {
      toast({
        title: t("reviewsList.errors.deleteReplyError"),
        description: deleteReplyError,
        variant: "destructive",
      });

      // Clear error after showing toast
      const timer = setTimeout(() => {
        dispatch(clearDeleteReplyError());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [deleteReplyError, toast, dispatch]);

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
        title: t("reviewsList.errors.title"),
        description: t("reviewsList.errors.emptyReply"),
        variant: "destructive",
      });
      return;
    }

    if (!selectedListing?.id) return;

    try {
      await dispatch(
        sendReviewReply({
          reviewId: parseInt(reviewId),
          replyText: finalReplyText,
          replyType: showingAIGenerator === reviewId ? "AI" : "manual",
          listingId: selectedListing.id,
        })
      ).unwrap();

      setEditingReply(null);
      setShowingAIGenerator(null);

      toast({
        title: t("reviewsList.success.title"),
        description: t("reviewsList.success.replySent"),
      });
    } catch (error) {
      // Error will be handled by the useEffect above
      // console.error("Failed to send reply:", error);
    }
  };

  const handleDeleteReply = async (reviewId: string) => {
    if (!selectedListing?.id) return;

    try {
      await dispatch(
        deleteReviewReply({
          reviewId,
          listingId: selectedListing.id,
        })
      ).unwrap();

      toast({
        title: t("reviewsList.success.replyTitle"),
        description: t("reviewsList.success.replyDeleted"),
      });
    } catch (error) {
      // Error will be handled by the useEffect above
      // console.error("Failed to delete reply:", error);
    }
  };

  const handleCancelAIGenerator = () => {
    setShowingAIGenerator(null);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setLocalDateRange(range);
    if (range?.from && range?.to) {
      dispatch(
        setDateRange({
          startDate: format(range.from, "yyyy-MM-dd"),
          endDate: format(range.to, "yyyy-MM-dd"),
        })
      );
    } else if (!range?.from && !range?.to) {
      dispatch(clearDateRange());
    }
  };

  const handleClearDateRange = () => {
    // Clear date range completely to show last 10 reviews
    setLocalDateRange(undefined);
    dispatch(clearDateRange());
  };

  // Check if there are active filters
  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    filter !== "all" ||
    sentimentFilter !== "all" ||
    Boolean(dateRange.startDate && dateRange.endDate);

  if (reviewsError) {
    return (
      <Card className="bg-white border border-red-200">
        <CardContent className="p-6 text-center">
          <p className="text-red-600 mb-4">{reviewsError}</p>
          <Button
            onClick={() => dispatch(clearReviewsError())}
            variant="outline"
          >
            {t("reviewsList.buttons.tryAgain")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">
          {t("reviewsList.title")}
        </CardTitle>

        <ReviewsFilters
          searchQuery={searchQuery}
          filter={filter}
          sentimentFilter={sentimentFilter}
          sortBy={sortBy}
          localDateRange={localDateRange}
          hasDateRange={Boolean(dateRange.startDate || dateRange.endDate)}
          isRefreshing={refreshLoading || reviewsLoading}
          onSearchChange={(value) => dispatch(setSearchQuery(value))}
          onFilterChange={(value) => dispatch(setFilter(value))}
          onSentimentFilterChange={(value) =>
            dispatch(setSentimentFilter(value))
          }
          onSortChange={(value) => dispatch(setSortBy(value))}
          onDateRangeChange={handleDateRangeChange}
          onClearDateRange={handleClearDateRange}
          onRefresh={handleRefresh}
        />
      </CardHeader>

      <CardContent className="pt-0">
        {reviewsLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-white shadow-sm animate-pulse"
              >
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
                <ReviewCard
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

            {pagination && (
              <ReviewsPagination
                pagination={pagination}
                onPageChange={(page) => dispatch(setCurrentPage(page))}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
