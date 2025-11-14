import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { PublicReportDashboardLayout } from "./PublicReportDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  TrendingUp,
  MessageSquare,
  Heart,
  ArrowUp,
  ArrowDown,
  Bot,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { usePerformanceReviewReport } from "@/hooks/useReports";
import { formatToDayMonthYear } from "@/utils/dateUtils";
import { applyStoredTheme } from "@/utils/themeUtils";
import { usePublicI18n } from "@/hooks/usePublicI18n";

export const namespaces = ["PublicReports/publicReviewsReport"];

export const PublicReviewsReport: React.FC = () => {
  // Extract reportId from URL
  const reportId = window.location.pathname.split("/").pop() || "";
  const { t, loaded, languageFullName } = usePublicI18n(namespaces);
  // Load theme for public report
  React.useEffect(() => {
    applyStoredTheme();
  }, []);

  // Fetch review report
  const {
    data: reviewsData,
    isLoading,
    error,
  } = usePerformanceReviewReport(reportId, languageFullName);

  const reportType = reviewsData?.data?.reportType.toLowerCase();

  // Handle loading state
  if (isLoading || !loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    );
  }
  if (error) return <div>{t("error")}</div>;

  // Extract visible sections from API response
  const visibleSections = Object.entries(reviewsData?.data.visibleSection || {})
    .filter(([_, value]) => value === "1")
    .map(([key]) => key);

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) {
      // Handle edge case: No previous data
      return {
        value: current === 0 ? 0 : 100, // or any default logic (like null)
        isPositive: current >= 0,
      };
    }

    const change = ((current - previous) / previous) * 100;

    return {
      value: isNaN(change) ? 0 : change,
      isPositive: change >= 0,
    };
  };

  const renderChangeIndicator = (current: number, previous: number) => {
    const { value, isPositive } = calculateChange(current, previous);
    return (
      <div
        className={`flex items-center justify-center gap-1 text-xs ${
          isPositive ? "text-green-600" : "text-red-600"
        }`}
      >
        {isPositive ? (
          <ArrowUp className="h-3 w-3" />
        ) : (
          <ArrowDown className="h-3 w-3" />
        )}
        <span>{Math.abs(value).toFixed(1)}% vs previous</span>
      </div>
    );
  };

  const getCurrentOverview = () => {
    return reportType === "individual"
      ? reviewsData?.data.periodOne.summary
      : reviewsData?.data.periodOne.summary;
  };

  const getPreviousOverview = () => {
    return reportType === "compare"
      ? reviewsData?.data.periodTwo.summary
      : null;
  };

  const transformRatingSummary = (ratingSummary: Record<string, number>) => {
    const total = Object.values(ratingSummary).reduce(
      (sum, count) => sum + count,
      0
    );

    return [5, 4, 3, 2, 1].map((star) => {
      const count = ratingSummary?.[star.toString()] || 0;
      const percentage = total === 0 ? 0 : Math.round((count / total) * 100);
      return {
        stars: star,
        count,
        percentage,
      };
    });
  };

  const getCurrentSentiment = () => {
    const summary = reviewsData?.data?.periodOne?.summary?.rating_summary;
    return transformRatingSummary(summary || {});
  };

  const getPreviousSentiment = () => {
    if (reportType !== "compare") return null;
    const summary = reviewsData?.data?.periodTwo?.summary?.rating_summary;
    return transformRatingSummary(summary || {});
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const transformSentimentData = (sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  }) => {
    return [
      {
        name: "Positive",
        value: sentiment?.positive || 0,
        fill: "#22c55e",
      },
      {
        name: "Neutral",
        value: sentiment?.neutral || 0,
        fill: "#f59e0b",
      },
      {
        name: "Negative",
        value: sentiment?.negative || 0,
        fill: "#ef4444",
      },
    ];
  };

  const transformTrendData = (trendData: any[]) => {
    return trendData.map((entry) => ({
      date: entry.review_date,
      totalReviews: parseInt(entry.total),
      star5: parseInt(entry.star_5),
      star4: parseInt(entry.star_4),
      star3: parseInt(entry.star_3),
      star2: parseInt(entry.star_2),
      star1: parseInt(entry.star_1),
    }));
  };

  const mapStarTextToNumber = (rating: string): number => {
    switch (rating.toUpperCase()) {
      case "FIVE":
        return 5;
      case "FOUR":
        return 4;
      case "THREE":
        return 3;
      case "TWO":
        return 2;
      case "ONE":
        return 1;
      default:
        return 0;
    }
  };

  const renderCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <p className="font-medium mb-1">{formatToDayMonthYear(label)}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span>
                {t(`chart.${entry.dataKey}`)}: {entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // condition for checking piechart data is present or not
  const sentiment1 = reviewsData?.data?.periodOne?.summary?.sentiment;
  const sentiment2 = reviewsData?.data?.periodTwo?.summary?.sentiment;

  const isSentimentEmpty1 =
    !sentiment1 ||
    (sentiment1.positive === 0 &&
      sentiment1.neutral === 0 &&
      sentiment1.negative === 0);

  const isSentimentEmpty2 =
    !sentiment2 ||
    (sentiment2.positive === 0 &&
      sentiment2.neutral === 0 &&
      sentiment2.negative === 0);

  // condition for review line graph data is present or not
  const trend1 = reviewsData?.data?.periodOne?.trend_data || [];
  const trend2 = reviewsData?.data?.periodTwo?.trend_data || [];

  // condition for recent review data is present or not
  const recentReviews1 = reviewsData?.data?.periodOne?.recent_reviews || [];
  const recentReviews2 = reviewsData?.data?.periodTwo?.recent_reviews || [];
  return (
    <PublicReportDashboardLayout
      title={t("title")}
      listingName={reviewsData?.data.locationName}
      address={reviewsData?.data.address}
      date={reviewsData?.data?.reportDate}
      logo={reviewsData?.data?.companyLogo}
      visibleSections={visibleSections}
      token={reportId}
      compareDate={reviewsData?.data?.compareDate}
    >
      <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-50 rounded-lg mx-auto mb-2">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold">
                {getCurrentOverview().average_rating}
              </div>
              {reportType === "compare" && getPreviousOverview() && (
                <div className="mt-1">
                  {renderChangeIndicator(
                    getCurrentOverview().average_rating,
                    getPreviousOverview()!.average_rating
                  )}
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                {t("overview.averageRating")}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg mx-auto mb-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">
                {getCurrentOverview().total_reviews}
              </div>
              {reportType === "compare" && getPreviousOverview() && (
                <div className="mt-1">
                  {renderChangeIndicator(
                    getCurrentOverview().total_reviews,
                    getPreviousOverview()!.total_reviews
                  )}
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                {" "}
                {t("overview.totalReviews")}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-green-50 rounded-lg mx-auto mb-2">
                <Heart className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold">
                {getCurrentOverview().manual_reply}
              </div>
              {reportType === "compare" && getPreviousOverview() && (
                <div className="mt-1">
                  {renderChangeIndicator(
                    getCurrentOverview().manual_reply,
                    getPreviousOverview()!.manual_reply
                  )}
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                {t("overview.manualReply")}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-50 rounded-lg mx-auto mb-2">
                <Bot className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold">
                {getCurrentOverview().ai_reply}
              </div>
              {reportType === "compare" && getPreviousOverview() && (
                <div className="mt-1">
                  {renderChangeIndicator(
                    getCurrentOverview().ai_reply,
                    getPreviousOverview()!.ai_reply
                  )}
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                {" "}
                {t("overview.aiReply")}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rating Distribution and Rating Summary */}
        {reportType === "compare" ? (
          <div className="space-y-6">
            {/* Rating Count Summaries */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Period 1 */}
              <Card>
                <CardHeader>
                  <CardTitle> {t("sections.ratingSummary")} </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {formatToDayMonthYear(
                      reviewsData?.data.periodOne.date.from_date
                    )}{" "}
                    -
                    {formatToDayMonthYear(
                      reviewsData?.data.periodOne.date.to_date
                    )}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getCurrentSentiment().map((item) => (
                      <div
                        key={item.stars}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {Array.from({ length: item.stars }, (_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 text-yellow-400 fill-current"
                              />
                            ))}
                          </div>
                          <span className="font-medium">
                            {item.stars} {t("labels.star")}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{item.count}</div>
                          <div className="text-xs text-muted-foreground">
                            {t("labels.reviews")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Period 2 */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("sections.ratingSummary")}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {formatToDayMonthYear(
                      reviewsData?.data.periodTwo.date.from_date
                    )}{" "}
                    -
                    {formatToDayMonthYear(
                      reviewsData?.data.periodTwo.date.to_date
                    )}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getPreviousSentiment()?.map((item) => (
                      <div
                        key={item.stars}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {Array.from({ length: item.stars }, (_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 text-yellow-400 fill-current"
                              />
                            ))}
                          </div>
                          <span className="font-medium">
                            {item.stars} {t("labels.star")}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{item.count}</div>
                          <div className="text-xs text-muted-foreground">
                            {t("labels.reviews")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sentiment Analysis - compare */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Period 1 Sentiment Analysis */}
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white h-full flex flex-col">
                <CardHeader className="pb-4">
                  <CardTitle className="text-white text-lg">
                    {t("sections.sentimentAnalysis")} -{" "}
                    {formatToDayMonthYear(
                      reviewsData?.data.periodOne.date.from_date
                    )}{" "}
                    -
                    {formatToDayMonthYear(
                      reviewsData?.data.periodOne.date.to_date
                    )}
                  </CardTitle>
                </CardHeader>

                <CardContent className="bg-white rounded-lg mx-4 mb-4 p-4">
                  <div className="h-52 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      {isSentimentEmpty1 ? (
                        <div className="flex justify-center flex-col gap-4">
                          <img
                            src="/nodata.svg"
                            alt="No Data"
                            className="h-48"
                          />
                          <p className="text-center text-black">
                            {t("labels.noData")}
                          </p>
                        </div>
                      ) : (
                        <PieChart>
                          <Pie
                            data={transformSentimentData(
                              reviewsData?.data?.periodOne?.summary
                                ?.sentiment || {}
                            )}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            dataKey="value"
                            startAngle={90}
                            endAngle={450}
                          >
                            {transformSentimentData(
                              reviewsData?.data?.periodOne?.summary
                                ?.sentiment || {}
                            ).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [`${value}%`, ""]}
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                          />
                        </PieChart>
                      )}
                    </ResponsiveContainer>
                  </div>

                  {!isSentimentEmpty1 && (
                    <div className="flex justify-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700">
                          Positive{" "}
                          {reviewsData?.data?.periodOne?.summary?.sentiment
                            ?.positive || 0}
                          %
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-gray-700">
                          {t("labels.neutral")}
                          {reviewsData?.data?.periodOne?.summary?.sentiment
                            ?.neutral || 0}
                          %
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-gray-700">
                          {t("labels.negative")}
                          {reviewsData?.data?.periodOne?.summary?.sentiment
                            ?.negative || 0}
                          %
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Period 2 Sentiment Analysis */}
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white h-full flex flex-col">
                <CardHeader className="pb-4">
                  <CardTitle className="text-white text-lg">
                    {t("sections.sentimentAnalysis")} -{" "}
                    {formatToDayMonthYear(
                      reviewsData?.data.periodTwo.date.from_date
                    )}{" "}
                    -
                    {formatToDayMonthYear(
                      reviewsData?.data.periodTwo.date.to_date
                    )}
                  </CardTitle>
                </CardHeader>

                <CardContent className="bg-white rounded-lg mx-4 mb-4 p-4">
                  <div className="h-52 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      {isSentimentEmpty2 ? (
                        <div className="flex justify-center flex-col gap-4">
                          <img
                            src="/nodata.svg"
                            alt="No Data"
                            className="h-48"
                          />
                          <p className="text-center text-black">
                            {t("labels.noData")}
                          </p>
                        </div>
                      ) : (
                        <PieChart>
                          <Pie
                            data={transformSentimentData(
                              reviewsData?.data?.periodTwo?.summary
                                ?.sentiment || {}
                            )}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            dataKey="value"
                            startAngle={90}
                            endAngle={450}
                          >
                            {transformSentimentData(
                              reviewsData?.data?.periodTwo?.summary
                                ?.sentiment || {}
                            ).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [`${value}%`, ""]}
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                          />
                        </PieChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                  {!isSentimentEmpty2 && (
                    <div className="flex justify-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700">
                          Positive{" "}
                          {reviewsData?.data?.periodTwo?.summary?.sentiment
                            ?.positive || 0}
                          %
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-gray-700">
                          {t("labels.neutral")}
                          {reviewsData?.data?.periodTwo?.summary?.sentiment
                            ?.neutral || 0}
                          %
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-gray-700">
                          {t("labels.negative")}
                          {reviewsData?.data?.periodTwo?.summary?.sentiment
                            ?.negative || 0}
                          %
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            {/* Rating Count Summary - 70% width */}
            <div className="lg:col-span-7">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{t("sections.ratingSummary")}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {formatToDayMonthYear(
                      reviewsData?.data.periodOne.date.from_date
                    )}{" "}
                    -
                    {formatToDayMonthYear(
                      reviewsData?.data.periodOne.date.to_date
                    )}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getCurrentSentiment().map((item) => (
                      <div
                        key={item.stars}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {Array.from({ length: item.stars }, (_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 text-yellow-400 fill-current"
                              />
                            ))}
                          </div>
                          <span className="font-medium">
                            {item.stars} {t("labels.star")}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{item.count}</div>
                          <div className="text-xs text-muted-foreground">
                            {t("labels.reviews")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Rating Distribution - 30% width */}
            <div className="lg:col-span-3">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white h-full flex flex-col">
                <CardHeader className="pb-4">
                  <CardTitle className="text-white text-lg">
                    {t("sections.sentimentAnalysis")}
                  </CardTitle>
                </CardHeader>

                {/* Sentiment Analysis Donut Chart */}
                <CardContent className="bg-white rounded-lg mx-4 mb-4 p-4">
                  <div className="h-52 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      {isSentimentEmpty1 ? (
                        <div className="flex justify-center flex-col gap-4">
                          <img
                            src="/nodata.svg"
                            alt="No Data"
                            className="h-64"
                          />
                          <p className="text-center"> {t("labels.noData")}</p>
                        </div>
                      ) : (
                        <PieChart>
                          <Pie
                            data={transformSentimentData(
                              reviewsData?.data?.periodOne?.summary
                                ?.sentiment || {}
                            )}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            dataKey="value"
                            startAngle={90}
                            endAngle={450}
                          >
                            {transformSentimentData(
                              reviewsData?.data?.periodOne?.summary
                                ?.sentiment || {}
                            ).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [`${value}%`, ""]}
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                          />
                        </PieChart>
                      )}
                    </ResponsiveContainer>
                  </div>

                  {/* Legend */}
                  {!isSentimentEmpty1 && (
                    <div className="flex justify-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700">
                          Positive{" "}
                          {reviewsData?.data?.periodOne?.summary?.sentiment
                            ?.positive || 0}
                          %
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-gray-700">
                          {t("labels.neutral")}
                          {reviewsData?.data?.periodOne?.summary?.sentiment
                            ?.neutral || 0}
                          %
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-gray-700">
                          {t("labels.negative")}
                          {reviewsData?.data?.periodOne?.summary?.sentiment
                            ?.negative || 0}
                          %
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardContent className="bg-white rounded-lg mx-4 mb-4 p-4">
                  <div className="space-y-3">
                    {getCurrentSentiment().map((item) => (
                      <div key={item.stars} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-8">
                          <span className="text-sm font-medium text-gray-700">
                            {item.stars}
                          </span>
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        </div>
                        <div className="flex-1">
                          <Progress value={item.percentage} className="h-2" />
                        </div>
                        <div className="text-sm text-gray-600 w-12 text-right">
                          {item.percentage}%
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Review Line Chart */}
        {reportType === "compare" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Period 1 Chart */}
            <Card>
              <CardHeader>
                <CardTitle>{t("sections.reviewTrends")} </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {formatToDayMonthYear(
                    reviewsData?.data.periodOne.date.from_date
                  )}{" "}
                  -
                  {formatToDayMonthYear(
                    reviewsData?.data.periodOne.date.to_date
                  )}
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    {trend1.length === 0 ? (
                      <div className="flex justify-center flex-col gap-4">
                        <img src="/nodata.svg" alt="No Data" className="h-64" />
                        <p className="text-center"> {t("labels.noData")}</p>
                      </div>
                    ) : (
                      <LineChart
                        data={transformTrendData(
                          reviewsData?.data?.periodOne?.trend_data || []
                        )}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip content={renderCustomTooltip} />
                        <Line
                          type="monotone"
                          dataKey="totalReviews"
                          stroke="#8884d8"
                          strokeWidth={2}
                          name="Total Reviews"
                        />
                        <Line
                          type="monotone"
                          dataKey="star5"
                          stroke="#22c55e"
                          strokeWidth={2}
                          name="5 Star"
                        />
                        <Line
                          type="monotone"
                          dataKey="star4"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          name="4 Star"
                        />
                        <Line
                          type="monotone"
                          dataKey="star3"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          name="3 Star"
                        />
                        <Line
                          type="monotone"
                          dataKey="star2"
                          stroke="#f97316"
                          strokeWidth={2}
                          name="2 Star"
                        />
                        <Line
                          type="monotone"
                          dataKey="star1"
                          stroke="#ef4444"
                          strokeWidth={2}
                          name="1 Star"
                        />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Period 2 Chart */}
            <Card>
              <CardHeader>
                <CardTitle>{t("sections.reviewTrends")} </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {formatToDayMonthYear(
                    reviewsData?.data.periodTwo.date.from_date
                  )}{" "}
                  -
                  {formatToDayMonthYear(
                    reviewsData?.data.periodTwo.date.to_date
                  )}
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    {trend2.length === 0 ? (
                      <div className="flex justify-center flex-col gap-4">
                        <img src="/nodata.svg" alt="No Data" className="h-64" />
                        <p className="text-center"> {t("labels.noData")}</p>
                      </div>
                    ) : (
                      <LineChart
                        data={transformTrendData(
                          reviewsData?.data?.periodTwo?.trend_data || []
                        )}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip content={renderCustomTooltip} />
                        <Line
                          type="monotone"
                          dataKey="totalReviews"
                          stroke="#8884d8"
                          strokeWidth={2}
                          name="Total Reviews"
                        />
                        <Line
                          type="monotone"
                          dataKey="star5"
                          stroke="#22c55e"
                          strokeWidth={2}
                          name="5 Star"
                        />
                        <Line
                          type="monotone"
                          dataKey="star4"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          name="4 Star"
                        />
                        <Line
                          type="monotone"
                          dataKey="star3"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          name="3 Star"
                        />
                        <Line
                          type="monotone"
                          dataKey="star2"
                          stroke="#f97316"
                          strokeWidth={2}
                          name="2 Star"
                        />
                        <Line
                          type="monotone"
                          dataKey="star1"
                          stroke="#ef4444"
                          strokeWidth={2}
                          name="1 Star"
                        />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{t("sections.reviewTrends")}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {formatToDayMonthYear(
                  reviewsData?.data.periodOne.date.from_date
                )}{" "}
                -
                {formatToDayMonthYear(reviewsData?.data.periodOne.date.to_date)}
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={transformTrendData(
                      reviewsData?.data?.periodOne?.trend_data || []
                    )}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={renderCustomTooltip} />
                    <Line
                      type="monotone"
                      dataKey="totalReviews"
                      stroke="#8884d8"
                      strokeWidth={2}
                      name="Total Reviews"
                    />
                    <Line
                      type="monotone"
                      dataKey="star5"
                      stroke="#22c55e"
                      strokeWidth={2}
                      name="5 Star"
                    />
                    <Line
                      type="monotone"
                      dataKey="star4"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="4 Star"
                    />
                    <Line
                      type="monotone"
                      dataKey="star3"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      name="3 Star"
                    />
                    <Line
                      type="monotone"
                      dataKey="star2"
                      stroke="#f97316"
                      strokeWidth={2}
                      name="2 Star"
                    />
                    <Line
                      type="monotone"
                      dataKey="star1"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="1 Star"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Review Data Table */}
        {reportType === "compare" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* period 1 table*/}
            <Card>
              <CardHeader>
                <CardTitle>{t("sections.reviewDataSummary")}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {formatToDayMonthYear(
                    reviewsData?.data.periodOne.date.from_date
                  )}{" "}
                  -
                  {formatToDayMonthYear(
                    reviewsData?.data.periodOne.date.to_date
                  )}
                </p>
              </CardHeader>
              <CardContent>
                {trend1.length === 0 ? (
                  <div className="flex justify-center flex-col gap-4">
                    <img src="/nodata.svg" alt="No Data" className="h-64" />
                    <p className="text-center"> {t("labels.noData")}</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead> {t("labels.reviewDate")}</TableHead>
                        <TableHead> {t("labels.totalReview")}</TableHead>
                        <TableHead> {t("labels.fiveStar")}</TableHead>
                        <TableHead>{t("labels.fourStar")}</TableHead>
                        <TableHead>{t("labels.threeStar")}</TableHead>
                        <TableHead>{t("labels.twoStar")}</TableHead>
                        <TableHead>{t("labels.oneStar")}</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {transformTrendData(
                        reviewsData?.data?.periodOne?.trend_data || []
                      ).map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {formatToDayMonthYear(row.date)}
                          </TableCell>
                          <TableCell>{row.totalReviews}</TableCell>
                          <TableCell>{row.star5}</TableCell>
                          <TableCell>{row.star4}</TableCell>
                          <TableCell>{row.star3}</TableCell>
                          <TableCell>{row.star2}</TableCell>
                          <TableCell>{row.star1}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* period 2 table*/}
            <Card>
              <CardHeader>
                <CardTitle>{t("sections.reviewDataSummary")}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {formatToDayMonthYear(
                    reviewsData?.data.periodTwo.date.from_date
                  )}{" "}
                  -
                  {formatToDayMonthYear(
                    reviewsData?.data.periodTwo.date.to_date
                  )}
                </p>
              </CardHeader>
              <CardContent>
                {trend2.length === 0 ? (
                  <div className="flex justify-center flex-col gap-4">
                    <img src="/nodata.svg" alt="No Data" className="h-64" />
                    <p className="text-center">{t("labels.noData")}</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("labels.reviewDate")}</TableHead>
                        <TableHead>{t("labels.totalReview")}</TableHead>
                        <TableHead>{t("labels.fiveStar")}</TableHead>
                        <TableHead>{t("labels.fourStar")}</TableHead>
                        <TableHead>{t("labels.threeStar")}</TableHead>
                        <TableHead>{t("labels.twoStar")}</TableHead>
                        <TableHead>{t("labels.oneStar")}</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {transformTrendData(
                        reviewsData?.data?.periodTwo?.trend_data || []
                      ).map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {formatToDayMonthYear(row.date)}
                          </TableCell>
                          <TableCell>{row.totalReviews}</TableCell>
                          <TableCell>{row.star5}</TableCell>
                          <TableCell>{row.star4}</TableCell>
                          <TableCell>{row.star3}</TableCell>
                          <TableCell>{row.star2}</TableCell>
                          <TableCell>{row.star1}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{t("sections.reviewDataSummary")}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {formatToDayMonthYear(
                  reviewsData?.data.periodOne.date.from_date
                )}{" "}
                -
                {formatToDayMonthYear(reviewsData?.data.periodOne.date.to_date)}
              </p>
            </CardHeader>
            <CardContent>
              {trend1.length === 0 ? (
                <div className="flex justify-center flex-col gap-4">
                  <img src="/nodata.svg" alt="No Data" className="h-64" />
                  <p className="text-center">{t("labels.noData")}</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("labels.reviewDate")}</TableHead>
                      <TableHead>{t("labels.totalReview")}</TableHead>
                      <TableHead>{t("labels.fiveStar")}</TableHead>
                      <TableHead>{t("labels.fourStar")}</TableHead>
                      <TableHead>{t("labels.threeStar")}</TableHead>
                      <TableHead>{t("labels.twoStar")}</TableHead>
                      <TableHead>{t("labels.oneStar")}</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {transformTrendData(
                      reviewsData?.data?.periodOne?.trend_data || []
                    ).map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{formatToDayMonthYear(row.date)}</TableCell>
                        <TableCell>{row.totalReviews}</TableCell>
                        <TableCell>{row.star5}</TableCell>
                        <TableCell>{row.star4}</TableCell>
                        <TableCell>{row.star3}</TableCell>
                        <TableCell>{row.star2}</TableCell>
                        <TableCell>{row.star1}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* Recent Reviews */}
        {reportType === "compare" ? (
          <div className="grid grid-cols-1 gap-6">
            {/* Period 1 Review */}
            <Card>
              <CardHeader>
                <CardTitle> {t("sections.reviews")}</CardTitle>
              </CardHeader>
              <CardContent>
                {recentReviews1.length === 0 && recentReviews2.length === 0 && (
                  <div className="flex justify-center flex-col gap-4">
                    <img src="/nodata.svg" alt="No Data" className="h-64" />
                    <p className="text-center">{t("labels.noData")}</p>
                  </div>
                )}
                <div className="space-y-6">
                  {reviewsData?.data?.periodOne?.recent_reviews?.map(
                    (review, index) => {
                      const numericRating = mapStarTextToNumber(
                        review.star_rating
                      );
                      const reviewDate = new Date(
                        review.review_cdate
                      ).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      });

                      return (
                        <div
                          key={index}
                          className="flex items-start space-x-4 p-4 border border-border rounded-lg"
                        >
                          <Avatar>
                            <AvatarFallback>
                              {review.display_name?.[0] || "R"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-sm">
                                  {review.display_name}
                                </span>
                                <div className="flex">
                                  {renderStars(numericRating)}
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {reviewDate}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {review.comment}
                            </p>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant={
                                  review.responce_status === "1"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {review.response_status_label?.includes(
                                  "No Response"
                                )
                                  ? t("noresponse")
                                  : review.response_status_label}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
                <div className="space-y-6">
                  {reviewsData?.data?.periodTwo?.recent_reviews?.map(
                    (review, index) => {
                      const numericRating = mapStarTextToNumber(
                        review.star_rating
                      );
                      const reviewDate = new Date(
                        review.review_cdate
                      ).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      });

                      return (
                        <div
                          key={index}
                          className="flex items-start space-x-4 p-4 border border-border rounded-lg"
                        >
                          <Avatar>
                            <AvatarFallback>
                              {review.display_name?.[0] || "R"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-sm">
                                  {review.display_name}
                                </span>
                                <div className="flex">
                                  {renderStars(numericRating)}
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {reviewDate}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {review.comment}
                            </p>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant={
                                  review.responce_status === "1"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {review.response_status_label?.includes(
                                  "No Response"
                                )
                                  ? t("noresponse")
                                  : review.response_status_label}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{t("sections.recentReviews")}</CardTitle>
            </CardHeader>
            <CardContent>
              {recentReviews1.length === 0 ? (
                <div className="flex justify-center flex-col gap-4">
                  <img src="/nodata.svg" alt="No Data" className="h-64" />
                  <p className="text-center">{t("labels.noData")}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviewsData?.data?.periodOne?.recent_reviews?.map(
                    (review, index) => {
                      const numericRating = mapStarTextToNumber(
                        review.star_rating
                      );
                      const reviewDate = new Date(
                        review.review_cdate
                      ).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      });

                      return (
                        <div
                          key={index}
                          className="flex items-start space-x-4 p-4 border border-border rounded-lg"
                        >
                          <Avatar>
                            <AvatarFallback>
                              {review.display_name?.[0] || "R"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-sm">
                                  {review.display_name}
                                </span>
                                <div className="flex">
                                  {renderStars(numericRating)}
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {reviewDate}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {review.comment}
                            </p>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant={
                                  review.responce_status === "1"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {review.response_status_label?.includes(
                                  "No Response"
                                )
                                  ? t("noresponse")
                                  : review.response_status_label}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </PublicReportDashboardLayout>
  );
};
