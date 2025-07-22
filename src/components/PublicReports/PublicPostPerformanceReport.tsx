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

export const PublicPostPerformanceReport: React.FC = () => {
  const [isComparison, setIsComparison] = useState(false);
  // Extract reportId from URL
  const reportId = window.location.pathname.split("/").pop() || "";

  // Fetch review report
  const {
    data: postData,
    isLoading,
    error,
  } = usePerformancePostsReport(reportId);

  const reportType = postData?.data?.reportType.toLowerCase();

  // Extract visible sections from API response
  const visibleSections = Object.entries(postData?.data.visibleSection || {})
    .filter(([_, value]) => value === "1")
    .map(([key]) => key);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">
            Loading Post report...
          </p>
        </div>
      </div>
    );
  }
  if (error) return <div>Error loading review report</div>;

  // console.log("post Report:", postData);

  const defaultImage =
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=200&q=80";

  // Sample data for individual mode
  const individualData = {
    companyName: "Demo Business",
    companyLogo: null,
    overview: {
      totalPosts: 156,
      totalScheduled: 23,
      publishedPosts: 142,
      failedPosts: 8,
    },
    chartData: [
      { date: "Jan 1", posts: 12 },
      { date: "Jan 8", posts: 18 },
      { date: "Jan 15", posts: 15 },
      { date: "Jan 22", posts: 22 },
      { date: "Jan 29", posts: 19 },
      { date: "Feb 5", posts: 25 },
      { date: "Feb 12", posts: 21 },
    ],
    recentPosts: [
      {
        id: 1,
        type: "standard",
        title: "New Menu Launch Announcement",
        status: "published",
        publishedAt: "2 hours ago",
        engagement: 94,
      },
      {
        id: 2,
        type: "event",
        title: "Weekend Special Event",
        status: "scheduled",
        publishedAt: "Tomorrow 9:00 AM",
        engagement: 0,
      },
      {
        id: 3,
        type: "offer",
        title: "Happy Hour 50% Off",
        status: "published",
        publishedAt: "1 day ago",
        engagement: 127,
      },
    ],
  };

  // Sample data for comparison mode
  const comparisonData = {
    ...individualData,
    current: {
      totalPosts: 156,
      totalScheduled: 23,
      publishedPosts: 142,
      failedPosts: 8,
    },
    previous: {
      totalPosts: 134,
      totalScheduled: 18,
      publishedPosts: 125,
      failedPosts: 5,
    },
    chartData: [
      { date: "Jan 1", currentPosts: 12, previousPosts: 8 },
      { date: "Jan 8", currentPosts: 18, previousPosts: 14 },
      { date: "Jan 15", currentPosts: 15, previousPosts: 12 },
      { date: "Jan 22", currentPosts: 22, previousPosts: 18 },
      { date: "Jan 29", currentPosts: 19, previousPosts: 15 },
      { date: "Feb 5", currentPosts: 25, previousPosts: 20 },
      { date: "Feb 12", currentPosts: 21, previousPosts: 17 },
    ],
  };

  const currentData = isComparison ? comparisonData : individualData;

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
      case "published":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Published
          </Badge>
        );
      case "scheduled":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Scheduled
          </Badge>
        );
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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

  // data for line graph
  const trendDataOne = postData?.data?.periodOne?.trend_data || [];
  const trendDataTwo = postData?.data?.periodTwo?.trend_data || [];

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
      className="border rounded-lg p-4 bg-white shadow-sm"
    >
      <div className="flex gap-4">
        <PostImage src={post.image} />

        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-md font-bold">{post.status_label}</h3>
            <span className="text-xs text-muted-foreground">
              {post.postdate} {post.posttime}
            </span>
          </div>
          <p className="text-sm text-gray-700">
            {post.posttext
              ? post.posttext.length > 150
                ? `${post.posttext.slice(0, 150)}...`
                : post.posttext
              : "No content"}
          </p>

          {post.search_url && (
            <a
              href={post.search_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-sm mt-2 inline-block"
            >
              View on Google
            </a>
          )}
        </div>
      </div>
    </div>
  );
  return (
    <PublicReportDashboardLayout
      title="Post Performance Report"
      listingName={postData?.data.locationName}
      address={postData?.data.address}
      date={postData?.data?.reportDate}
      logo={postData?.data?.companyLogo}
      visibleSections={visibleSections}
      token={reportId}
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
              <div className="text-sm text-muted-foreground">Total Posts</div>
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
                Total Scheduled
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
                Published Posts
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
              <div className="text-sm text-muted-foreground">Failed Posts</div>
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
        {/* <Card>
          <CardHeader>
            <CardTitle>Post Performance Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {isComparison ? (
                    <>
                      <Line
                        type="monotone"
                        dataKey="currentPosts"
                        stroke="#2563eb"
                        strokeWidth={2}
                        name="Current Period Posts"
                      />
                      <Line
                        type="monotone"
                        dataKey="previousPosts"
                        stroke="#94a3b8"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Previous Period Posts"
                      />
                    </>
                  ) : (
                    <Line
                      type="monotone"
                      dataKey="posts"
                      stroke="#2563eb"
                      strokeWidth={2}
                      name="Posts Published"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Post Activity Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            {reportType === "compare" ? (
              trendDataOne.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />

                    <Line
                      type="monotone"
                      data={formatTrendData(trendDataOne)}
                      dataKey="totalPosts"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Period One"
                    />

                    <Line
                      type="monotone"
                      data={formatTrendData(trendDataTwo)}
                      dataKey="totalPosts"
                      stroke="#f97316"
                      strokeWidth={2}
                      name="Period Two"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex justify-center text-sm">
                  <img src="/nodata.svg" alt="No Data" className="h-64" />
                </div>
              )
            ) : trendDataOne.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formatTrendData(trendDataOne)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="totalPosts"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Total Posts"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center text-sm">
                <img src="/nodata.svg" alt="No Data" className="h-64" />
              </div>
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
            <CardTitle className="text-lg">Recent Posts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reportType === "compare" ? (
              <>
                <div>
                  <h3 className="font-semibold text-md mb-2 text-blue-600">
                    Period One
                  </h3>
                  {recentPostsOne.length > 0 ? (
                    recentPostsOne.map((post, index) =>
                      renderPostCard(post, index)
                    )
                  ) : (
                    <div className="flex justify-center text-sm">
                      <img src="/nodata.svg" alt="No Data" className="h-64" />
                    </div>
                  )}
                </div>
                <div className="pt-6 border-t mt-6">
                  <h3 className="font-semibold text-md mb-2 text-orange-600">
                    Period Two
                  </h3>
                  {recentPostsTwo.length > 0 ? (
                    recentPostsTwo.map((post, index) =>
                      renderPostCard(post, index)
                    )
                  ) : (
                    <div className="flex justify-center text-sm">
                      <img src="/nodata.svg" alt="No Data" className="h-64" />
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
                  <div className="flex justify-center text-sm">
                    <img src="/nodata.svg" alt="No Data" className="h-64" />
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
