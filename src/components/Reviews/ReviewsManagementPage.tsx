import React, { useEffect, useState } from 'react';
import { ReviewSummary } from './ReviewSummary';
import { ReviewsList } from './ReviewsList';
import { AutoResponseTab } from './AutoResponse/AutoResponseTab';
import { useToast } from '../../hooks/use-toast';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { clearSummaryError, clearReviewsError, clearReplyError } from '../../store/slices/reviews';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export const ReviewsManagementPage: React.FC = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { summaryError, reviewsError, replyError } = useAppSelector(state => state.reviews);
  const [activeTab, setActiveTab] = useState('summary');

  // Show toast for API errors
  useEffect(() => {
    if (summaryError) {
      toast.error({
        title: "Error Loading Review Summary",
        description: summaryError,
      });
      
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
      
      const timer = setTimeout(() => {
        dispatch(clearReplyError());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [replyError, toast, dispatch]);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="summary" className="flex items-center gap-2">
            Review Summary
          </TabsTrigger>
          <TabsTrigger value="auto-response" className="flex items-center gap-2">
            Auto Response
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          <ReviewSummary />
          <ReviewsList />
        </TabsContent>

        <TabsContent value="auto-response" className="space-y-6">
          <AutoResponseTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
