import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Star, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { useListingContext } from "../../context/ListingContext";
import {
  fetchReviewSummary,
  clearSummaryError,
} from "../../store/slices/reviews";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const ReviewSummaryCard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedListing } = useListingContext();
  const { summaryCards, starDistribution, summaryLoading, summaryError } =
    useAppSelector((state) => state.reviews);

  const { t } = useI18nNamespace("Dashboard/reviewSummaryCard");

  // Fetch review summary when listing changes
  useEffect(() => {
    if (selectedListing?.id) {
      dispatch(fetchReviewSummary(selectedListing.id));
    }
  }, [dispatch, selectedListing?.id]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  if (summaryError) {
    return (
      <Card className="bg-white border border-red-200">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 mb-2 text-sm">{summaryError}</p>
          <Button
            onClick={() => dispatch(clearSummaryError())}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t("tryAgainButton")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (summaryLoading || !summaryCards || !starDistribution) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {t("reviewSummaryTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="flex items-center gap-6 mb-6">
              <div className="text-center">
                <div className="w-16 h-8 bg-gray-200 rounded mb-2"></div>
                <div className="w-20 h-4 bg-gray-200 rounded mb-1"></div>
                <div className="w-16 h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-4 bg-gray-200 rounded"></div>
                  <div className="flex-1 h-2 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Convert star distribution to array for rendering
  const starDistributionArray = Object.entries(starDistribution)
    .map(([stars, data]) => ({
      stars: parseInt(stars),
      count: data.count,
      percentage: data.percentage,
    }))
    .sort((a, b) => b.stars - a.stars);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {t("reviewSummaryTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6 mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">
              {summaryCards.overall_rating.toFixed(1)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {renderStars(summaryCards.overall_rating)}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {t("reviewsLabel", { count: summaryCards.total_reviews })}
            </div>
          </div>
        </div>

        {/* Rating Breakdown with Stars */}
        <div className="space-y-2">
          {starDistributionArray.map((item) => (
            <div key={item.stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">{item.stars}</span>
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gray-600 h-2 rounded-full"
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
