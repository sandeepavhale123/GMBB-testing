import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Search, MapPin, TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface VisibilitySummaryCardProps {
  isLoadingSummary: boolean;
  isLoadingVisibility: boolean;
  summary: any;
  visibilityTrends: any;
}

export const VisibilitySummaryCard: React.FC<VisibilitySummaryCardProps> = ({
  isLoadingSummary,
  isLoadingVisibility,
  summary,
  visibilityTrends,
}) => {
  const { t } = useI18nNamespace("Insights/visibilitySummaryCard");
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {t("visibilitySummaryTitle")}
        </CardTitle>
        <p className="text-sm text-gray-600">
          {t("visibilitySummarySubtitle")}
        </p>
      </CardHeader>
      <CardContent>
        {isLoadingSummary ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
            <Skeleton className="h-48" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-gray-700">
                    {t("googleSearchViews")}
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {summary?.visibility_summary.google_search_views
                    .current_period || 0}
                </p>
                <p
                  className={`text-sm flex items-center gap-1 ${
                    summary?.visibility_summary.google_search_views.trend ===
                    "up"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {summary?.visibility_summary.google_search_views.trend ===
                  "up" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {summary?.visibility_summary.google_search_views
                    .percentage_change > 0
                    ? "+"
                    : ""}
                  {t("percentageChange", {
                    value:
                      summary?.visibility_summary.google_search_views
                        .percentage_change || 0,
                  })}
                  {/* {summary?.visibility_summary.google_search_views
                    .percentage_change || 0}
                  % from last period */}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {t("googleMapsViews")}
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {summary?.visibility_summary.google_maps_views
                    .current_period || 0}
                </p>
                <p
                  className={`text-sm flex items-center gap-1 ${
                    summary?.visibility_summary.google_maps_views.trend === "up"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {summary?.visibility_summary.google_maps_views.trend ===
                  "up" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {summary?.visibility_summary.google_maps_views
                    .percentage_change > 0
                    ? "+"
                    : ""}
                  {t("percentageChange", {
                    value:
                      summary?.visibility_summary.google_search_views
                        .percentage_change || 0,
                  })}
                </p>
              </div>
            </div>

            <div className="h-48">
              {isLoadingVisibility ? (
                <Skeleton className="h-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={visibilityTrends?.chart_data || []}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Bar
                      dataKey="search"
                      fill="hsl(var(--primary))"
                      name="Search"
                    />
                    <Bar dataKey="maps" fill="#ef4444" name="Maps" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="flex justify-center mt-4">
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded"></div>
                  <span>{t("searchViewsLegend")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-600 rounded"></div>
                  <span>{t("mapsViewsLegend")}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
