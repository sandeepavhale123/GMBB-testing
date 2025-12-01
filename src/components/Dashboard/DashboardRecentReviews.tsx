import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { MessageSquare, AlertCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { useListingContext } from "../../context/ListingContext";
import {
  fetchReviews,
  clearReviewsError,
  sendReviewReply,
} from "../../store/slices/reviews";
import { useNavigate } from "react-router-dom";
import { DashboardReviewCard } from "./DashboardReviewCard";
import { useToast } from "../../hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const DashboardRecentReviews: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedListing } = useListingContext();
  const { reviews, reviewsLoading, reviewsError, replyLoading } =
    useAppSelector((state) => state.reviews);

  const { t } = useI18nNamespace("Dashboard/dashboardRecentReviews");

  // Local state for reply interactions
  const [editingReply, setEditingReply] = useState<string | null>(null);
  const [showingAIGenerator, setShowingAIGenerator] = useState<string | null>(
    null
  );

  // Fetch recent reviews when listing changes
  useEffect(() => {
    if (selectedListing?.id) {
      const params = {
        pagination: {
          page: 1,
          limit: 10,
          offset: 0,
        },
        filters: {
          search: "",
          status: "all",
          dateRange: {
            startDate: "",
            endDate: "",
          },
          rating: {
            min: 1,
            max: 5,
          },
          sentiment: "All",
          listingId: selectedListing.id,
        },
        sorting: {
          sortBy: "date",
          sortOrder: "desc" as const,
        },
      };

      dispatch(fetchReviews(params));
    }
  }, [dispatch, selectedListing?.id]);

  const handleViewAll = () => {
    if (selectedListing?.id) {
      navigate(`/reviews/${selectedListing.id}`);
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

  const handleSaveReply = async (reviewId: string, replyText?: string) => {
    if (!replyText || !selectedListing?.id) return;

    try {
      const result = await dispatch(
        sendReviewReply({
          reviewId: parseInt(reviewId),
          replyText,
          replyType: showingAIGenerator === reviewId ? "AI" : "manual",
          listingId: selectedListing.id,
        })
      );

      if (sendReviewReply.fulfilled.match(result)) {
        toast({
          title: t("replySentTitle"),
          description: t("replySentDescription"),
        });
        setEditingReply(null);
        setShowingAIGenerator(null);
      } else {
        toast({
          title: t("replyErrorTitle"),
          description: t("replyErrorDescription"),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t("replyErrorTitle"),
        description: t("replyErrorDescription"),
        variant: "destructive",
      });
    }
  };

  const handleCancelAIGenerator = () => {
    setShowingAIGenerator(null);
  };

  if (reviewsError) {
    return (
      <Card className="bg-white border border-red-200">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 mb-2 text-sm">{reviewsError}</p>
          <Button
            onClick={() => dispatch(clearReviewsError())}
            variant="outline"
            size="sm"
          >
            {t("tryAgainButton")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {t("recentReviewsTitle")}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewAll}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            {t("viewAllButton")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {reviewsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-6">
            <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 text-sm"> {t("noReviews")} </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {reviews.slice(0, 10).map((review) => (
              <DashboardReviewCard
                key={review.id}
                review={review}
                editingReply={editingReply}
                showingAIGenerator={showingAIGenerator}
                replyLoading={replyLoading}
                onGenerateReply={handleGenerateReply}
                onManualReply={handleManualReply}
                onSaveReply={handleSaveReply}
                onCancelAIGenerator={handleCancelAIGenerator}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
