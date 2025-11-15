import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { PublicReportDashboardLayout } from "./PublicReportDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Eye,
} from "lucide-react";
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
import { usePerformancePostsReport } from "@/hooks/useReports";
import { PostImage } from "./PostImage";
import { applyStoredTheme } from "@/utils/themeUtils";
import { formatToDDMMYY } from "@/utils/dateUtils";
import { usePublicI18n } from "@/hooks/usePublicI18n";

export const namespaces = ["PublicReports/publicPostPerformanceReport"];

export const PublicPostPerformanceReport: React.FC = () => {
  const [isComparison, setIsComparison] = useState(false);
  // Extract reportId from URL
  const reportId = window.location.pathname.split("/").pop() || "";
  const { t, loaded, languageFullName } = usePublicI18n(namespaces);
  // Load theme for public report
  React.useEffect(() => {
    applyStoredTheme();
  }, []);

  // Fetch review report
  const {
    data: postData,
    isLoading,
    error,
  } = usePerformancePostsReport(reportId, languageFullName);
  const reportType = postData?.data?.reportType.toLowerCase();

  // Extract visible sections from API response
  const visibleSections = Object.entries(postData?.data.visibleSection || {})
    .filter(([_, value]) => value === "1")
    .map(([key]) => key);

  // Handle loading state
  if (isLoading || !loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">
            {t("publicPostReport.loading")}
          </p>
        </div>
      </div>
    );
  }
  if (error) return <div>{t("publicPostReport.error")}</div>;

  const defaultImage =
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=200&q=80";

  const getPostIcon = (type: string) => {
    switch (type) {
      case "event":
        return <Calendar className="h-4 w-4" />;
      case "offer":
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Published":
        return t("publicPostReport.status.published");
      case "Scheduled":
        return t("publicPostReport.status.scheduled");
      case "Failed":
        return t("publicPostReport.status.failed");
      default:
        return status;
    }
  };

  const CustomTooltip = ({ active, payload, label, hasPeriodTwo }: any) => {
    if (active && payload && payload.length) {
      // Filter out Period Two if no data exists
      const filteredPayload = payload.filter(
        (entry: any) => !(entry.name === "Period Two" && !hasPeriodTwo)
      );

      if (filteredPayload.length === 0) return null;

      return (
        <div className="bg-white shadow-md rounded p-2 border text-sm">
          <p className="font-medium">{label}</p>
          {filteredPayload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) {
      // No previous data to compare with
      return {
        value: 0,
        isPositive: current >= 0,
      };
    }
    const change = ((current - previous) / previous) * 100;
    return {
      value: change,
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

  // data for summary stats
  const summary1 = postData?.data?.periodOne?.summary;
  const summary2 = postData?.data?.periodTwo?.summary;

  const prepareChartData = (
    periodOneData: any[] = [],
    periodTwoData: any[] = [],
    reportType: string
  ) => {
    const merged: Record<string, any> = {};

    periodOneData.forEach((item) => {
      const date = item.post_date;
      merged[date] = {
        date,
        currentUploads: Number(item.total_posts) || 0,
      };
    });

    if (reportType === "compare") {
      periodTwoData.forEach((item) => {
        const date = item.post_date;
        if (!merged[date]) merged[date] = { date };
        merged[date].previousUploads = Number(item.total_posts) || 0;
      });
    }

    return Object.values(merged).sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  // data for line graph
  const trendDataOne = postData?.data?.periodOne?.trend_data || [];
  const trendDataTwo = postData?.data?.periodTwo?.trend_data || [];
  const chartData = prepareChartData(trendDataOne, trendDataTwo, reportType);

  const formatTrendData = (data: any[]) =>
    data.map((item) => ({
      date: item.post_date,
      totalPosts: Number(item.total_posts),
    }));

  // data for recent post
  const recentPostsOne = postData?.data?.periodOne?.recent_posts || [];
  const recentPostsTwo = postData?.data?.periodTwo?.recent_posts || [];
  const renderPostCard = (post: any, index: number) => (
    <div
      key={post.id || index}
      className="border rounded-lg p-4 bg-white shadow-sm mb-6"
    >
      <div className="flex gap-4">
        <PostImage src={post.image} />

        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-md font-bold">
              {getStatusBadge(post.status_label)}
            </h3>
            <span className="text-xs text-muted-foreground">
              {formatToDDMMYY(post.postdate)} {post.posttime}
            </span>
          </div>
          <p className="text-sm text-gray-700">
            {post.posttext
              ? post.posttext.length > 150
                ? `${post.posttext.slice(0, 150)}...`
                : post.posttext
              : t("publicPostReport.recentPosts.noContent")}
          </p>

          {post.search_url && (
            <a
              href={post.search_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-sm mt-2 inline-block"
            >
              {t("publicPostReport.recentPosts.viewOnGoogle")}
            </a>
          )}
        </div>
      </div>
    </div>
  );
  return (
    <PublicReportDashboardLayout
      title={t("publicPostReport.title")}
      listingName={postData?.data.locationName}
      address={postData?.data.address}
      date={postData?.data?.reportDate}
      logo={postData?.data?.companyLogo}
      visibleSections={visibleSections}
      token={reportId}
      compareDate={postData?.data?.compareDate}
    >
      <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg mx-auto mb-2">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">
                {summary1?.total_posts ?? 0}
              </div>
              <div className="text-sm text-muted-foreground">
                {t("publicPostReport.stats.totalPosts")}
              </div>
              {reportType === "compare" &&
                summary2?.total_posts !== undefined &&
                renderChangeIndicator(
                  summary1?.total_posts,
                  summary2?.total_posts
                )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-50 rounded-lg mx-auto mb-2">
                <Calendar className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold">
                {summary1?.total_scheduled ?? 0}
              </div>
              <div className="text-sm text-muted-foreground">
                {t("publicPostReport.stats.totalScheduled")}
              </div>
              {reportType === "compare" &&
                summary2?.total_scheduled !== undefined &&
                renderChangeIndicator(
                  summary1?.total_scheduled,
                  summary2?.total_scheduled
                )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-green-50 rounded-lg mx-auto mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold">
                {summary1?.published_posts ?? 0}
              </div>
              <div className="text-sm text-muted-foreground">
                {t("publicPostReport.stats.publishedPosts")}
              </div>
              {reportType === "compare" &&
                summary2?.published_posts !== undefined &&
                renderChangeIndicator(
                  summary1?.published_posts,
                  summary2?.published_posts
                )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-red-50 rounded-lg mx-auto mb-2">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="text-2xl font-bold">
                {summary1?.failed_posts ?? 0}
              </div>
              <div className="text-sm text-muted-foreground">
                {t("publicPostReport.stats.failedPosts")}
              </div>
              {reportType === "compare" &&
                summary2?.failed_posts !== undefined &&
                renderChangeIndicator(
                  summary1?.failed_posts,
                  summary2?.failed_posts
                )}
            </CardContent>
          </Card>
        </div>

        {/* Post Performance Chart */}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {t("publicPostReport.chart.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <div className="flex justify-center flex-col gap-4">
                <img src="/nodata.svg" alt="No Data" className="h-64" />
                <p className="text-center">
                  {t("publicPostReport.chart.noData")}
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip
                    content={
                      <CustomTooltip hasPeriodTwo={trendDataTwo.length > 0} />
                    }
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="currentUploads"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name={t("publicPostReport.chart.currentPeriod")}
                  />
                  {reportType === "compare" && (
                    <Line
                      type="monotone"
                      dataKey="previousUploads"
                      stroke="#f97316"
                      strokeWidth={2}
                      name={t("publicPostReport.chart.previousPeriod")}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Recent Posts */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentData.recentPosts.slice(0, 10).map((post, index) => (
                <div
                  key={post.id}
                  className="flex items-center gap-4 p-4 rounded-lg border"
                >
                  <div className="w-12 h-12 bg-muted/50 rounded-lg flex items-center justify-center">
                    {getPostIcon(post.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{post.title}</h4>
                    <div className="text-sm text-muted-foreground mt-1">
                      {post.publishedAt} • {post.type} post
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(post.status)}
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
         </Card> */}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {t("publicPostReport.recentPosts.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="">
            {reportType === "compare" ? (
              <>
                <div>
                  {recentPostsOne.length > 0 ? (
                    recentPostsOne.map((post, index) =>
                      renderPostCard(post, index)
                    )
                  ) : (
                    <div className="flex justify-center flex-col gap-4">
                      <img src="/nodata.svg" alt="No Data" className="h-64" />
                      <p className="text-center">
                        {t("publicPostReport.chart.noData")}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  {recentPostsTwo.length > 0 ? (
                    recentPostsTwo.map((post, index) =>
                      renderPostCard(post, index)
                    )
                  ) : (
                    <div className="flex justify-center flex-col gap-4">
                      <img src="/nodata.svg" alt="No Data" className="h-64" />
                      <p className="text-center">
                        {" "}
                        {t("publicPostReport.chart.noData")}
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {recentPostsOne.length > 0 ? (
                  recentPostsOne.map((post, index) =>
                    renderPostCard(post, index)
                  )
                ) : (
                  <div className="flex justify-center flex-col gap-4">
                    <img src="/nodata.svg" alt="No Data" className="h-64" />
                    <p className="text-center">
                      {" "}
                      {t("publicPostReport.chart.noData")}
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </PublicReportDashboardLayout>
  );
};
