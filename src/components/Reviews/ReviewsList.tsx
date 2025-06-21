
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ReviewsFilters } from './ReviewsFilters';
import { ReviewCard } from './ReviewCard';
import { ReviewsPagination } from './ReviewsPagination';
import { ReviewsEmptyState } from './ReviewsEmptyState';
import { ReviewsErrorState } from './ReviewsErrorState';
import { ReviewsLoadingState } from './ReviewsLoadingState';
import { useReviewsList } from './hooks/useReviewsList';

export const ReviewsList: React.FC = () => {
  const {
    reviewsState,
    localDateRange,
    editingReply,
    showingAIGenerator,
    hasActiveFilters,
    handlers,
    actions
  } = useReviewsList();

  const {
    reviews,
    pagination,
    reviewsLoading,
    reviewsError,
    replyLoading,
    deleteReplyLoading,
    refreshLoading,
    filter,
    searchQuery,
    sortBy,
    sentimentFilter,
    dateRange
  } = reviewsState;

  if (reviewsError) {
    return (
      <ReviewsErrorState 
        error={reviewsError}
        onRetry={actions.clearReviewsError}
      />
    );
  }

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Customer Reviews</CardTitle>
        
        <ReviewsFilters
          searchQuery={searchQuery}
          filter={filter}
          sentimentFilter={sentimentFilter}
          sortBy={sortBy}
          localDateRange={localDateRange}
          hasDateRange={Boolean(dateRange.startDate || dateRange.endDate)}
          isRefreshing={refreshLoading || reviewsLoading}
          onSearchChange={actions.setSearchQuery}
          onFilterChange={actions.setFilter}
          onSentimentFilterChange={actions.setSentimentFilter}
          onSortChange={actions.setSortBy}
          onDateRangeChange={handlers.handleDateRangeChange}
          onClearDateRange={handlers.handleClearDateRange}
          onRefresh={handlers.handleRefresh}
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
                <ReviewCard
                  key={review.id}
                  review={review}
                  editingReply={editingReply}
                  showingAIGenerator={showingAIGenerator}
                  replyLoading={replyLoading}
                  deleteLoading={deleteReplyLoading}
                  onGenerateReply={handlers.handleGenerateReply}
                  onManualReply={handlers.handleManualReply}
                  onSaveReply={handlers.handleSaveReply}
                  onDeleteReply={handlers.handleDeleteReply}
                  onCancelAIGenerator={handlers.handleCancelAIGenerator}
                />
              ))}
            </div>

            {pagination && (
              <ReviewsPagination
                pagination={pagination}
                onPageChange={actions.setCurrentPage}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
