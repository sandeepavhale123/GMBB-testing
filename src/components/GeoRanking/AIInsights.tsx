import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Sparkles } from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const AIInsights: React.FC = () => {
  const { t } = useI18nNamespace("GeoRanking/aiInsights");
  const navigate = useNavigate();
  const { listingId } = useParams();

  const handleGetInsights = () => {
    navigate(`/ai-chatbot/${listingId || "default"}`);
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
          {t("aiInsights.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <span className="text-xs sm:text-sm font-medium text-blue-900">
              {t("aiInsights.smartRecommendations")}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-blue-800 leading-relaxed mb-3">
            {t("aiInsights.description")}
          </p>
          <div className="text-xs text-blue-700 bg-blue-100 rounded px-2 py-1">
            {t("aiInsights.points.contentGaps")} <br />{" "}
            {t("aiInsights.points.competitorInsights")}
            <br />
            {t("aiInsights.points.actionPlan")}
          </div>
        </div>
        <Button
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm"
          onClick={handleGetInsights}
        >
          <Sparkles className="h-3 w-3 mr-1" />
          {t("aiInsights.button")}
        </Button>
      </CardContent>
    </Card>
  );
};
