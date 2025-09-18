import React from "react";
import { Target, TrendingUp } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Credits } from "../../api/geoRankingApi";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface GeoRankingEmptyStateProps {
  onCheckRank: () => void;
  credits: Credits | null;
}

export const GeoRankingEmptyState: React.FC<GeoRankingEmptyStateProps> = ({
  onCheckRank,
  credits,
}) => {
  const { t } = useI18nNamespace("GeoRanking/geoRankingEmptyState");
  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-8 sm:p-12">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center">
            <Target className="w-8 h-8 text-primary" />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              {t("geoRankingEmptyState.heading")}
            </h2>
            <p className="text-gray-600 max-w-md">
              {t("geoRankingEmptyState.description")}
            </p>
          </div>

          {/* Benefits */}
          <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span>
                {t("geoRankingEmptyState.benefits.monitorLocalPerformance")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <span>
                {t("geoRankingEmptyState.benefits.trackCompetitorRankings")}
              </span>
            </div>
          </div>

          {/* Credits Info */}
          {credits && (
            <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
              {t("geoRankingEmptyState.creditsP1")}
              <span className="font-semibold text-primary">
                {credits.remainingCredit}
              </span>{" "}
              {t("geoRankingEmptyState.creditsP2")}
            </div>
          )}

          {/* Action Button */}
          <Button
            onClick={onCheckRank}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
          >
            <Target className="w-5 h-5 mr-2" />
            {t("geoRankingEmptyState.button.checkRank")}
          </Button>

          {/* Additional Info */}
          <p className="text-xs text-gray-500 max-w-sm">
            {t("geoRankingEmptyState.additionalInfo")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
