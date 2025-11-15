import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAppSelector, useAppDispatch } from "../../hooks/useRedux";
import { useListingContext } from "@/context/ListingContext";
import { fetchInsightsComparison } from "../../store/slices/insightsSlice";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { Link } from "react-router-dom";

export const InsightsComparisonChart: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedListing } = useListingContext();
  const { t } = useI18nNamespace("Dashboard/insightsComparisonChart");
  const {
    comparisonData,
    isLoadingComparison,
    comparisonError,
    summary,
    visibilityTrends,
    isLoadingSummary,
    isLoadingVisibility,
  } = useAppSelector((state) => state.insights);

  // Fetch comparison data when component mounts
  React.useEffect(() => {
    if (selectedListing?.id) {
      const params = {
        listingId: parseInt(selectedListing.id, 10),
        dateRange: "180", // 6 months
        startDate: "",
        endDate: "",
      };

      dispatch(fetchInsightsComparison(params));
    }
  }, [selectedListing?.id, dispatch]);

  // Transform fallback data when comparison data is not available
  const getFallbackData = () => {
    if (!visibilityTrends?.chart_data || !summary) return null;

    return visibilityTrends.chart_data.map((item) => ({
      month: item.name,
      searchViews: item.search,
      mapsViews: item.maps,
      websiteClicks: Math.round(
        summary.customer_actions.website_clicks.value /
          visibilityTrends.chart_data.length
      ),
      phoneCalls: Math.round(
        summary.customer_actions.phone_calls.value /
          visibilityTrends.chart_data.length
      ),
    }));
  };

  // Determine what data to use and chart configuration
  const chartData = comparisonData || getFallbackData();
  const isUsingFallback = !comparisonData && !!getFallbackData();
  const chartTitle = isUsingFallback
    ? t("insightsComparisonChart.title.fallback")
    : t("insightsComparisonChart.title.comparison");
  const chartDescription = isUsingFallback
    ? t("insightsComparisonChart.description.fallback")
    : t("insightsComparisonChart.description.comparison");

  // Loading state
  const isLoading =
    isLoadingComparison ||
    (isUsingFallback && (isLoadingSummary || isLoadingVisibility));

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Show error only if no fallback data is available
  if (comparisonError && !isUsingFallback) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {t("insightsComparisonChart.error.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-2">
              {t("insightsComparisonChart.error.failed")}
            </p>
            <p className="text-sm text-gray-500">{comparisonError}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              {chartTitle}
            </CardTitle>
            <p className="text-sm text-gray-600">{chartDescription}</p>
          </div>
          <Link
            to={`/insights/${selectedListing?.id || "default"}`}
            className="text-sm text-primary hover:underline"
          >
            {t("insightsComparisonChart.view")}
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-64 w-full" />
            <div className="flex justify-center gap-8">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ) : (
          <>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData || []}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#666" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} />
                  <Line
                    type="monotone"
                    dataKey="searchViews"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name={t("insightsComparisonChart.metrics.searchViews")}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mapsViews"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name={t("insightsComparisonChart.metrics.mapsViews")}
                    dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="websiteClicks"
                    stroke="#10b981"
                    strokeWidth={2}
                    name={t("insightsComparisonChart.metrics.websiteClicks")}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="phoneCalls"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name={t("insightsComparisonChart.metrics.phoneCalls")}
                    dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Legend for mobile devices */}
            <div className="flex flex-wrap justify-center gap-4 mt-4 sm:hidden">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded"></div>
                <span className="text-xs">
                  {t("insightsComparisonChart.mobileLegend.searchViews")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-600 rounded"></div>
                <span className="text-xs">
                  {t("insightsComparisonChart.mobileLegend.mapsViews")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded"></div>
                <span className="text-xs">
                  {t("insightsComparisonChart.mobileLegend.websiteClicks")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-600 rounded"></div>
                <span className="text-xs">
                  {t("insightsComparisonChart.mobileLegend.phoneCalls")}
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
