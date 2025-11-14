import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Skeleton } from "../ui/skeleton";
import {
  Eye,
  MapPin,
  Search,
  TrendingUp,
  TrendingDown,
  MousePointer,
  Navigation,
  Phone,
  MessageSquare,
  BarChart3,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { fetchInsightsSummary } from "../../store/slices/insightsSlice";
import { useListingContext } from "../../context/ListingContext";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const InsightsCard: React.FC = () => {
  const [dateRange, setDateRange] = useState("30");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedListing } = useListingContext();
  const { t } = useI18nNamespace("Dashboard/insightsCard");

  const { summary, isLoadingSummary, summaryError } = useAppSelector(
    (state) => state.insights
  );

  // Fetch data when component mounts or parameters change
  useEffect(() => {
    if (selectedListing?.id && dateRange) {
      fetchData();
    }
  }, [selectedListing?.id, dateRange]);

  const fetchData = async () => {
    if (!selectedListing?.id) return;

    const params = {
      listingId: parseInt(selectedListing.id, 10),
      dateRange,
      startDate: "",
      endDate: "",
    };

    try {
      await dispatch(fetchInsightsSummary(params));
    } catch (error) {
      // console.error("Error fetching dashboard insights data:", error);
    }
  };

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
  };

  const handleViewInsights = () => {
    navigate("/insights");
  };

  // Top search queries mock data (since this data is not in the current API response)
  const topQueries = [
    { query: "restaurant near me", impressions: 2847, trend: "up" },
    { query: "best pizza delivery", impressions: 1923, trend: "up" },
    { query: "italian restaurant", impressions: 1456, trend: "down" },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          {t("insightsCard.title")}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue
                placeholder={t("insightsCard.dateRange.placeholder")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">
                {t("insightsCard.dateRange.last7Days")}
              </SelectItem>
              <SelectItem value="30">
                {t("insightsCard.dateRange.last30Days")}
              </SelectItem>
              <SelectItem value="90">
                {t("insightsCard.dateRange.last90Days")}
              </SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleViewInsights} variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-1" />
            {t("insightsCard.viewButton")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoadingSummary ? (
          <div className="space-y-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        ) : summaryError ? (
          <div className="text-center py-4">
            <p className="text-red-600 text-sm">{summaryError}</p>
          </div>
        ) : (
          <>
            {/* Visibility Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {t("insightsCard.visibility.searchViews")}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {summary?.visibility_summary.google_search_views
                    .current_period || 0}
                </p>
                <p
                  className={`text-xs flex items-center gap-1 ${
                    summary?.visibility_summary.google_search_views.trend ===
                    "up"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {summary?.visibility_summary.google_search_views.trend ===
                  "up" ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {summary?.visibility_summary.google_search_views
                    .percentage_change > 0
                    ? "+"
                    : ""}
                  {summary?.visibility_summary.google_search_views
                    .percentage_change || 0}
                  %
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {t("insightsCard.visibility.mapsViews")}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {summary?.visibility_summary.google_maps_views
                    .current_period || 0}
                </p>
                <p
                  className={`text-xs flex items-center gap-1 ${
                    summary?.visibility_summary.google_maps_views.trend === "up"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {summary?.visibility_summary.google_maps_views.trend ===
                  "up" ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {summary?.visibility_summary.google_maps_views
                    .percentage_change > 0
                    ? "+"
                    : ""}
                  {summary?.visibility_summary.google_maps_views
                    .percentage_change || 0}
                  %
                </p>
              </div>
            </div>

            {/* Customer Interactions */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                {t("insightsCard.customerActions.title")}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {summary?.customer_actions.phone_calls.value || 0}
                    </p>
                    <p className="text-xs text-gray-600">
                      {t("insightsCard.customerActions.calls")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <MousePointer className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {summary?.customer_actions.website_clicks.value || 0}
                    </p>
                    <p className="text-xs text-gray-600">
                      {t("insightsCard.customerActions.website")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Navigation className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {summary?.customer_actions.direction_requests.value || 0}
                    </p>
                    <p className="text-xs text-gray-600">
                      {t("insightsCard.customerActions.directions")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {summary?.customer_actions.messages.value || 0}
                    </p>
                    <p className="text-xs text-gray-600">
                      {t("insightsCard.customerActions.messages")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Search Queries */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                {t("insightsCard.topSearchQueries.title")}
              </h4>
              <div className="space-y-2">
                {topQueries.map((query, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500">
                        #{index + 1}
                      </span>
                      <span className="text-sm text-gray-900">
                        {query.query}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">
                        {query.impressions}
                      </span>
                      {query.trend === "up" ? (
                        <TrendingUp className="w-3 h-3 text-green-600" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
