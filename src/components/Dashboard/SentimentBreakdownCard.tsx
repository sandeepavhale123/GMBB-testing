import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { useListingContext } from "../../context/ListingContext";
import {
  fetchReviewSummary,
  clearSummaryError,
} from "../../store/slices/reviews";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const SentimentBreakdownCard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedListing } = useListingContext();
  const { sentimentAnalysis, summaryLoading, summaryError } = useAppSelector(
    (state) => state.reviews
  );
  const { t } = useI18nNamespace("Dashboard/sentimentBreakdownCard");
  // Fetch review summary when listing changes
  useEffect(() => {
    if (selectedListing?.id) {
      dispatch(fetchReviewSummary(selectedListing.id));
    }
  }, [dispatch, selectedListing?.id]);

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
            <RefreshCw className="w-4 h-4 mr-1" />
            {t("tryAgain")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (summaryLoading || !sentimentAnalysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {t("sentimentBreakdownTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="flex items-center justify-center mb-4">
              <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                    <div className="w-12 h-3 bg-gray-200 rounded"></div>
                  </div>
                  <div className="w-8 h-4 bg-gray-200 rounded mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sentimentData = [
    {
      name: t("positiveLabel"),
      value: sentimentAnalysis.positive.percentage,
      fill: "#10b981",
    },
    {
      name: t("neutralLabel"),
      value: sentimentAnalysis.neutral.percentage,
      fill: "#6b7280",
    },
    {
      name: t("negativeLabel"),
      value: sentimentAnalysis.negative.percentage,
      fill: "#ef4444",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {t("sentimentBreakdownTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center mb-4">
          <div className="w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={60}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                {t("positiveLabel")}
              </span>
            </div>
            <div className="font-semibold">
              {sentimentAnalysis.positive.percentage}%
            </div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span className="text-sm text-gray-600">{t("neutralLabel")}</span>
            </div>
            <div className="font-semibold">
              {sentimentAnalysis.neutral.percentage}%
            </div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                {t("negativeLabel")}
              </span>
            </div>
            <div className="font-semibold">
              {sentimentAnalysis.negative.percentage}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
