import React, { useState, useEffect, useCallback } from "react";
import { MessageCircle, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BulkReviewSummary } from "@/components/BulkReview/BulkReviewSummary";
import { BulkReviewFilters } from "@/components/BulkReview/BulkReviewFilters";
import { BulkReviewCard } from "@/components/BulkReview/BulkReviewCard";
import { ExportReviewsModal } from "@/components/BulkReview/ExportReviewsModal";
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
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const BulkReview: React.FC = () => {
  const { t } = useI18nNamespace("MultidashboardPages/bulkReview");
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
  const [exportModalOpen, setExportModalOpen] = useState(false);
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
          startDate: dateRange.startDate || "",
          endDate: dateRange.endDate || "",
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
        title: t("toast.successTitle"),
        description: t("toast.replySuccess"),
      });
    } catch (error) {
      toast({
        title: t("error.title"),
        description: t("toast.replyError"),
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
        title: t("toast.successTitle"),
        description: t("toast.deleteSuccess"),
      });
    } catch (error) {
      toast({
        title: t("error.title"),
        description: t("toast.deleteError"),
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => setExportModalOpen(true)}
            className="self-start sm:self-auto"
          >
            <Download className="w-4 h-4 mr-1" />
            {t("export")}
          </Button>
          <Button
            onClick={() => navigate("/main-dashboard/bulk-auto-reply")}
            className="self-start sm:self-auto"
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            {t("configureAutoReply")}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Summary Cards */}
        <BulkReviewSummary />

        {/* Customer Reviews */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">{t("summary.reviews")}</h3>
            <Button className="hidden ">
              <MessageCircle className="w-4 h-4 mr-1" />
              {t("configureAutoReply")}
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
              <div className="text-muted-foreground">
                {t("summary.loading")}
              </div>
            </div>
          )}

          {/* Error State */}
          {reviewsError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">
                {t("error.title")}: {reviewsError}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={loadBulkReviews}
                className="mt-2"
              >
                {t("error.retry")}
              </Button>
            </div>
          )}

          {/* Reviews List */}
          {!reviewsLoading && !reviewsError && (
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {t("summary.noReviews")}
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
                {t("pagination.showing", {
                  from: (pagination.page - 1) * pagination.limit + 1,
                  to: Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  ),
                  total: pagination.total,
                })}
                {/* Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} reviews */}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.has_prev}
                >
                  {t("pagination.previous")}
                </Button>
                <span className="px-3 py-1 text-sm bg-muted rounded">
                  {t("pagination.page", {
                    current: pagination.page,
                    pages: pagination.total_pages,
                  })}
                  {/* Page {pagination.page} of {pagination.total_pages} */}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.has_next}
                >
                  {t("pagination.next")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export Reviews Modal */}
      <ExportReviewsModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
      />
    </div>
  );
};
