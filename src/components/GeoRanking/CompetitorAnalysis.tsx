import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Users } from "lucide-react";
import { Progress } from "../ui/progress";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

const competitorData = [
  {
    name: "Competitor A",
    rank: 3,
    visibility: 45,
  },
  {
    name: "Competitor B",
    rank: 7,
    visibility: 38,
  },
  {
    name: "Competitor C",
    rank: 12,
    visibility: 25,
  },
];

export const CompetitorAnalysis: React.FC = () => {
  const { t } = useI18nNamespace("GeoRanking/competitorAnalysis");
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
          {t("competitorAnalysis.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {competitorData.map((competitor, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border border-gray-200 rounded-lg gap-3"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                    {competitor.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {t("competitorAnalysis.labels.averageRank")}: #
                    {competitor.rank}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="text-right">
                  <p className="text-xs sm:text-sm text-gray-600">
                    {t("competitorAnalysis.labels.visibility")}
                  </p>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">
                    {competitor.visibility}%
                  </p>
                </div>
                <div className="w-16 sm:w-20">
                  <Progress value={competitor.visibility} className="h-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
