import React, { lazy, Suspense, useEffect, useState } from "react";
import { ReviewSummary } from "./ReviewSummary";
import { ReviewsList } from "./ReviewsList";
// import { AutoResponseTab } from "./AutoResponse/AutoResponseTab";
const AutoResponseTab = lazy(() =>
  import("./AutoResponse/AutoResponseTab").then((module) => ({
    default: module.AutoResponseTab, // pick named export
  }))
);
import { ReviewsSubHeader } from "./ReviewsSubHeader";
import { useToast } from "../../hooks/use-toast";
import { useAppSelector, useAppDispatch } from "../../hooks/useRedux";
import {
  clearSummaryError,
  clearReviewsError,
  clearReplyError,
} from "../../store/slices/reviews";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const ReviewsManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const { t } = useI18nNamespace("Reviews/reviewsManagementPage");
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { summaryError, reviewsError, replyError } = useAppSelector(
    (state) => state.reviews
  );

  // Show toast for API errors
  useEffect(() => {
    if (summaryError) {
      toast({
        title: t("reviewsManagementPage.errors.summaryError.title"),
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
        title: t("reviewsManagementPage.errors.reviewsError.title"),
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
        title: t("reviewsManagementPage.errors.replyError.title"),
        description: replyError,
        variant: "destructive",
      });
      const timer = setTimeout(() => {
        dispatch(clearReplyError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [replyError, toast, dispatch]);
  const renderTabContent = () => {
    switch (activeTab) {
      case "summary":
        return (
          <div className="space-y-6">
            <ReviewSummary />
            <ReviewsList />
          </div>
        );
      case "auto-response":
        return (
          <div className="space-y-6">
            <Suspense fallback={<div>Loading...</div>}>
              <AutoResponseTab />
            </Suspense>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <ReviewSummary />
            <ReviewsList />
          </div>
        );
    }
  };
  return (
    <div className="flex flex-col min-h-full">
      <ReviewsSubHeader activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 p-0\n">{renderTabContent()}</div>
    </div>
  );
};
