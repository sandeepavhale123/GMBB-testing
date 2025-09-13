import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { CheckCircle, Clock, MessageSquare } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
import { useListingContext } from "@/context/ListingContext";
import { useReviewSummaryWithQA } from "../../hooks/useReviewSummaryWithQA";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const QACard: React.FC = () => {
  const { selectedListing } = useListingContext();
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { t } = useI18nNamespace("Dashboard/qACard");

  const {
    totalQuestions,
    totalAnswers,
    pendingQuestions,
    responseRate,
    loading,
    error,
  } = useReviewSummaryWithQA(
    selectedListing?.id ? parseInt(selectedListing.id) : null
  );

  const handleViewQA = () => {
    if (listingId) {
      navigate(`/qa/${listingId}`);
    }
  };

  const handleAnswerQuestions = () => {
    if (listingId) {
      navigate(`/qa/${listingId}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {t("qaCardTitle")}
          </CardTitle>
          <span className="text-sm font-medium text-muted-foreground">
            {loading ? (
              <Skeleton className="h-4 w-16" />
            ) : (
              t("qaCardResponseRate", { rate: responseRate })

              // `${responseRate}% response rate`
            )}
          </span>
        </div>
        {selectedListing && (
          <p className="text-sm text-gray-500">
            {t("qaCardFor", { listingName: selectedListing.name })}
            {/* For {selectedListing.name} */}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 rounded-lg bg-green-50">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-gray-900">
                {t("answeredTitle")}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("answeredSubtitle")}
              </p>
            </div>
            {loading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <span className="text-2xl font-bold text-green-600">
                {totalAnswers}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 p-3 rounded-lg bg-yellow-50">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-gray-900">
                {t("pendingTitle")}{" "}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("pendingSubtitle")}
              </p>
            </div>
            {loading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <span className="text-2xl font-bold text-yellow-600">
                {pendingQuestions}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            className="w-full bg-gray-900 hover:bg-gray-800"
            onClick={handleAnswerQuestions}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {t("answerPendingBtn")}
          </Button>
          <Button variant="outline" className="w-full" onClick={handleViewQA}>
            {t("viewAllBtn")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
