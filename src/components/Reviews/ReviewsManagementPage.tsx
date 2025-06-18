
import React, { useEffect } from 'react';
import { ReviewSummary } from './ReviewSummary';
import { ReviewsList } from './ReviewsList';
import { useToast } from '../../hooks/use-toast';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { clearSummaryError, clearReviewsError, clearReplyError } from '../../store/slices/reviews';

export const ReviewsManagementPage: React.FC = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { summaryError, reviewsError, replyError } = useAppSelector(state => state.reviews);

  // Show toast for API errors
  useEffect(() => {
    if (summaryError) {
      toast.error({
        title: "Error Loading Review Summary",
        description: summaryError,
      });
      
      // Clear error after showing toast
      const timer = setTimeout(() => {
        dispatch(clearSummaryError());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [summaryError, toast, dispatch]);

  useEffect(() => {
    if (reviewsError) {
      toast.error({
        title: "Error Loading Reviews",
        description: reviewsError,
      });
      
      // Clear error after showing toast
      const timer = setTimeout(() => {
        dispatch(clearReviewsError());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [reviewsError, toast, dispatch]);

  useEffect(() => {
    if (replyError) {
      toast.error({
        title: "Error Sending Reply",
        description: replyError,
      });
      
      // Clear error after showing toast
      const timer = setTimeout(() => {
        dispatch(clearReplyError());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [replyError, toast, dispatch]);

  return (
    <div className="space-y-6">
      <ReviewSummary />
      <ReviewsList />
    </div>
  );
};
