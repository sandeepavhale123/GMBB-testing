import React, { useState } from "react";
import { PublicReportDashboardLayout } from "./PublicReportDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image, Play, Eye, Video, ArrowUp, ArrowDown } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { usePerformanceMediaReport } from "@/hooks/useReports";
import { applyStoredTheme } from "@/utils/themeUtils";
import { usePublicI18n } from "@/hooks/usePublicI18n";

export const namespaces = ["PublicReports/publicMediaReport"];

const PublicMediaReport: React.FC = () => {
  // Extract reportId from URL
  const reportId = window.location.pathname.split("/").pop() || "";
  const { t, loaded, languageFullName } = usePublicI18n(namespaces);
  // Load theme for public report
  React.useEffect(() => {
    applyStoredTheme();
  }, []);

  const {
    data: mediaReport,
    isLoading,
    isError,
  } = usePerformanceMediaReport(reportId, languageFullName);
  // Handle loading state
  if (isLoading || !loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">
            {t("publicMediaReport.loading.message")}
          </p>
        </div>
      </div>
    );
  }
  if (isError) return <p>{t("publicMediaReport.error.title")}</p>;

  // data from api
  const reportType = mediaReport?.data?.reportType.toLowerCase(); // 'individual' or 'compare'
  const periodOne = mediaReport?.data?.periodOne?.summary;
  const periodTwo = mediaReport?.data?.periodTwo?.summary;
  const changeSummary = mediaReport?.data?.changeSummary;

  // Extract visible sections from API response
  const visibleSections = Object.entries(mediaReport?.data.visibleSection || {})
    .filter(([_, value]) => value === "1")
    .map(([key]) => key);

  const renderChangeIndicator = (value: string) => {
    const numericValue = Number(value);
    const isPositive = numericValue >= 0;

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
        <span>{Math.abs(numericValue).toFixed(1)}% vs previous</span>
      </div>
    );
  };

  const prepareChartData = (
    periodOneData: any[] = [],
    periodTwoData: any[] = [],
    reportType: string
  ) => {
    const merged: Record<string, any> = {};

    periodOneData.forEach((item) => {
      const date = item.upload_date;
      merged[date] = {
        date,
        currentUploads: Number(item.total_uploads) || 0,
      };
    });

    if (reportType === "compare") {
      periodTwoData.forEach((item) => {
        const date = item.upload_date;
        if (!merged[date]) merged[date] = { date };
        merged[date].previousUploads = Number(item.total_uploads) || 0;
      });
    }

    return Object.values(merged).sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  const trendOne = mediaReport?.data?.periodOne?.trend_data || [];
  const trendTwo = mediaReport?.data?.periodTwo?.trend_data || [];
  const chartData = prepareChartData(trendOne, trendTwo, reportType);

  // for recent media section
  const recentMediaPeriodOne = mediaReport?.data?.periodOne?.recent_media || [];
  const recentMediaPeriodTwo = mediaReport?.data?.periodTwo?.recent_media || [];

  const combinedMedia =
    reportType === "compare"
      ? [...recentMediaPeriodOne, ...recentMediaPeriodTwo]
      : recentMediaPeriodOne;

  return (
    <PublicReportDashboardLayout
      title={t("publicMediaReport.title")}
      listingName={mediaReport?.data.locationName}
      logo={mediaReport?.data.companyLogo}
      address={mediaReport?.data.address}
      date={mediaReport?.data?.reportDate}
      visibleSections={visibleSections}
      token={reportId}
      compareDate={mediaReport?.data?.compareDate}
    >
      <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg mx-auto mb-2">
                <Image className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">{periodOne?.total || 0}</div>
              <div className="text-sm text-muted-foreground">
                {t("publicMediaReport.overviewStats.totalMedia")}
              </div>
              {reportType === "compare" &&
                renderChangeIndicator(changeSummary?.total_media || 0)}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-green-50 rounded-lg mx-auto mb-2">
                <Image className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold">{periodOne?.photos || 0}</div>
              <div className="text-sm text-muted-foreground">
                {t("publicMediaReport.overviewStats.totalPhotos")}
              </div>
              {reportType === "compare" &&
                renderChangeIndicator(changeSummary?.total_photos || 0)}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-50 rounded-lg mx-auto mb-2">
                <Video className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold">{periodOne?.videos || 0}</div>
              <div className="text-sm text-muted-foreground">
                {t("publicMediaReport.overviewStats.totalVideos")}
              </div>
              {reportType === "compare" &&
                renderChangeIndicator(changeSummary?.total_videos || 0)}
            </CardContent>
          </Card>

          {/* <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-50 rounded-lg mx-auto mb-2">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold">
                {isComparison
                  ? comparisonData.current.topPerforming
                  : currentData.overview.topPerforming}
              </div>
              <div className="text-sm text-muted-foreground">
                Top Performing
              </div>
              {isComparison &&
                renderChangeIndicator(
                  comparisonData.current.topPerforming,
                  comparisonData.previous.topPerforming
                )}
            </CardContent>
          </Card> */}
        </div>

        {/* Media Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t("publicMediaReport.charts.mediaPerformance")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {chartData.length === 0 ? (
                <div className="flex justify-center flex-col gap-4">
                  <img src="/nodata.svg" alt="No Data" className="h-64" />
                  <p className="text-center">
                    {t("publicMediaReport.recentMedia.noData")}
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="currentUploads"
                      stroke="#2563eb"
                      strokeWidth={2}
                      name={t("publicMediaReport.chartLabels.currentUploads")}
                    />
                    {reportType === "compare" && (
                      <Line
                        type="monotone"
                        dataKey="previousUploads"
                        stroke="#f97316"
                        strokeWidth={2}
                        name={t(
                          "publicMediaReport.chartLabels.previousUploads"
                        )}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Media */}
        <Card>
          <CardHeader>
            <CardTitle>{t("publicMediaReport.recentMedia.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            {combinedMedia.length === 0 ? (
              <div className="flex justify-center flex-col gap-4">
                <img src="/nodata.svg" alt="No Data" className="h-64" />
                <p className="text-center">
                  {t("publicMediaReport.recentMedia.noData")}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {combinedMedia.slice(0, 10).map((media, index) => (
                  <div
                    key={media.id}
                    className="flex items-center gap-4 p-4 rounded-lg border"
                  >
                    <div className="w-12 h-12 bg-muted/50 rounded-lg flex items-center justify-center overflow-hidden">
                      {media.googleUrl ? (
                        <img
                          src={media.googleUrl}
                          alt={`Media ${media.id}`}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      ) : (
                        <span className="text-sm text-gray-500">
                          {t("publicMediaReport.recentMedia.noImage")}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium capitalize">
                        {t(
                          `publicMediaReport.mediaType.${
                            media.media_type || "default"
                          }`
                        )}
                        {/* {media.media_type || "media"} */}
                      </h4>
                      <div className="text-sm text-muted-foreground mt-1">
                        {t("publicMediaReport.recentMedia.publishedOn", {
                          date: media.publishDate || "N/A",
                        })}
                        {/* Published on {media.publishDate || "N/A"} */}
                      </div>
                    </div>
                    {media.googleUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(media.googleUrl, "_blank")}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {t("publicMediaReport.recentMedia.view")}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PublicReportDashboardLayout>
  );
};

export default PublicMediaReport;
