
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
      toast({
        title: "Error Loading Review Summary",
        description: summaryError,
        variant: "destructive",
      });
      
      const timer = setTimeout(() => {
        dispatch(clearSummaryError());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [summaryError, toast, dispatch]);

  useEffect(() => {
    if (reviewsError) {
      toast({
        title: "Error Loading Reviews",
        description: reviewsError,
        variant: "destructive",
      });
      
      const timer = setTimeout(() => {
        dispatch(clearReviewsError());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [reviewsError, toast, dispatch]);

  useEffect(() => {
    if (replyError) {
      toast({
        title: "Error Sending Reply",
        description: replyError,
        variant: "destructive",
      });
      
      const timer = setTimeout(() => {
        dispatch(clearReplyError());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [replyError, toast, dispatch]);

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 p-6">
        <div className="space-y-6">
          <ReviewSummary />
          <ReviewsList />
        </div>
      </div>
    </div>
  );
};
