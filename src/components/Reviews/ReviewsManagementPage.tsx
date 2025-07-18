import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { useListingContext } from '../../context/ListingContext';
import { fetchReviewSummary, fetchReviews } from '../../store/slices/reviews/thunks';
import { ReviewSummary } from './ReviewSummary';
import { ReviewsFilters } from './ReviewsFilters';
import { ReviewsList } from './ReviewsList';
import { ReviewsPagination } from './ReviewsPagination';
import { ReviewsEmptyState } from './ReviewsEmptyState';
import { Loader2 } from 'lucide-react';
import { NoListingSelected } from '../ui/no-listing-selected';

export const ReviewsManagementPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedListing, isInitialLoading } = useListingContext();

  const {
    reviews,
    summaryCards,
    starDistribution,
    sentimentAnalysis,
    pagination,
    reviewsLoading,
    summaryLoading,
    reviewsError,
    summaryError,
    filter,
    searchQuery,
    sortBy,
    sortOrder,
    sentimentFilter,
    dateRange,
    currentPage,
  } = useAppSelector(state => state.reviews);

  useEffect(() => {
    if (selectedListing?.id) {
      dispatch(fetchReviewSummary({ listingId: selectedListing.id }));
      dispatch(fetchReviews({
        listingId: selectedListing.id,
        filter,
        searchQuery,
        sortBy,
        sortOrder,
        sentimentFilter,
        dateRange,
        currentPage,
      }));
    }
  }, [dispatch, selectedListing?.id, filter, searchQuery, sortBy, sortOrder, sentimentFilter, dateRange, currentPage]);

  // Show loading state during initial load
  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  // Show no listing state
  if (!selectedListing && !isInitialLoading) {
    return <NoListingSelected />;
  }

  return (
    <div className="space-y-6">
      <ReviewSummary
        summaryCards={summaryCards}
        starDistribution={starDistribution}
        sentimentAnalysis={sentimentAnalysis}
        isLoading={summaryLoading}
        error={summaryError}
      />
      <ReviewsFilters />
      {reviewsLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <ReviewsEmptyState />
      ) : (
        <>
          <ReviewsList reviews={reviews} />
          <ReviewsPagination pagination={pagination} />
        </>
      )}
    </div>
  );
};
