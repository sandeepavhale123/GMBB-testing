import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface VisibilityTrendsCardProps {
  isLoadingVisibility: boolean;
  visibilityTrends: any;
  summary: any;
}

export const VisibilityTrendsCard = React.memo(
  ({
    isLoadingVisibility,
    visibilityTrends,
    summary,
  }: VisibilityTrendsCardProps) => {
    const { t } = useI18nNamespace("Insights/visibilityTrendsCard");

    // 🟢 Memoized derived values
    const {
      totalSearchViews,
      searchTrend,
      totalMapsViews,
      mapsTrend,
      totalViews,
    } = useMemo(() => {
      return {
        totalSearchViews: visibilityTrends?.summary?.total_search_views || 0,
        searchTrend: visibilityTrends?.summary?.search_trend || "stable",

        totalMapsViews: visibilityTrends?.summary?.total_maps_views || 0,
        mapsTrend: visibilityTrends?.summary?.maps_trend || "stable",

        totalViews: summary?.visibility_summary?.total_views || 0,
      };
    }, [visibilityTrends, summary]);

    // 🟢 Memoized translated labels
    const labels = useMemo(
      () => ({
        title: t("visibilityTrendsCard.title"),
        totalSearchViews: t("visibilityTrendsCard.totalSearchViews"),
        searchTrendLabel: t("visibilityTrendsCard.searchTrendLabel", {
          trend: searchTrend,
        }),
        totalMapsViews: t("visibilityTrendsCard.totalMapsViews"),
        mapsTrendLabel: t("visibilityTrendsCard.mapsTrendLabel", {
          trend: mapsTrend,
        }),
        totalViews: t("visibilityTrendsCard.totalViews"),
        totalViewsDescription: t("visibilityTrendsCard.totalViewsDescription"),
      }),
      [t, searchTrend, mapsTrend]
    );

    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {labels.title}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isLoadingVisibility ? (
            <LoadingSkeleton />
          ) : (
            <div className="space-y-4">
              <TrendItem
                title={labels.totalSearchViews}
                value={totalSearchViews}
                description={labels.searchTrendLabel}
                valueClass="text-primary"
              />

              <TrendItem
                title={labels.totalMapsViews}
                value={totalMapsViews}
                description={labels.mapsTrendLabel}
                valueClass="text-red-600"
              />

              <TrendItem
                title={labels.totalViews}
                value={totalViews}
                description={labels.totalViewsDescription}
                valueClass="text-gray-900"
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

// 🟢 Memoized subcomponents

const TrendItem = React.memo(({ title, value, description, valueClass }) => (
  <div className="p-4 rounded-lg bg-gray-50">
    <div className="flex items-center justify-between">
      <span className="font-medium text-gray-900">{title}</span>
      <span className={`text-2xl font-bold ${valueClass}`}>{value}</span>
    </div>
    <p className="text-sm text-gray-600 mt-1">{description}</p>
  </div>
));

const LoadingSkeleton = React.memo(() => (
  <div className="space-y-4">
    <Skeleton className="h-16" />
    <Skeleton className="h-16" />
    <Skeleton className="h-16" />
  </div>
));
