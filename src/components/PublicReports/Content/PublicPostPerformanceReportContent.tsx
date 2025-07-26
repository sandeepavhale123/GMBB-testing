import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, MessageSquare, Share2, ArrowUp, ArrowDown } from "lucide-react";
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

export const PublicPostPerformanceReportContent: React.FC = () => {
  const { token } = useParams();
  const reportId = token || "";

  const {
    data: postData,
    isLoading,
    error,
  } = usePerformancePostsReport(reportId);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading post performance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div>Error loading post performance report</div>
      </div>
    );
  }

  const reportType = postData?.data?.reportType?.toLowerCase() || "individual";
  const periodOne = postData?.data?.periodOne;
  const periodTwo = postData?.data?.periodTwo;

  const renderChangeIndicator = (current: number, previous: number) => {
    if (previous === 0) return null;
    
    const change = ((current - previous) / previous) * 100;
    const isPositive = change >= 0;
    
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
        <span>{Math.abs(change).toFixed(1)}% vs previous</span>
      </div>
    );
  };

  const prepareChartData = () => {
    const data: any[] = [];
    
    if (periodOne?.trend_data) {
      periodOne.trend_data.forEach((item: any) => {
        data.push({
          date: item.post_date,
          currentPosts: item.total_posts || 0,
        });
      });
    }

    if (reportType === "compare" && periodTwo?.trend_data) {
      periodTwo.trend_data.forEach((item: any) => {
        const existingItem = data.find(d => d.date === item.post_date);
        if (existingItem) {
          existingItem.previousPosts = item.total_posts || 0;
        } else {
          data.push({
            date: item.post_date,
            previousPosts: item.total_posts || 0,
          });
        }
      });
    }

    return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const chartData = prepareChartData();

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg mx-auto mb-2">
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold">
              {periodOne?.summary?.total_posts || 0}
            </div>
            {reportType === "compare" && periodTwo?.summary && (
              <div className="mt-1">
                {renderChangeIndicator(
                  periodOne?.summary?.total_posts || 0,
                  periodTwo?.summary?.total_posts || 0
                )}
              </div>
            )}
            <div className="text-sm text-muted-foreground">Total Posts</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-green-50 rounded-lg mx-auto mb-2">
              <Heart className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold">
              {periodOne?.summary?.total_likes || 0}
            </div>
            {reportType === "compare" && periodTwo?.summary && (
              <div className="mt-1">
                {renderChangeIndicator(
                  periodOne?.summary?.total_likes || 0,
                  periodTwo?.summary?.total_likes || 0
                )}
              </div>
            )}
            <div className="text-sm text-muted-foreground">Total Likes</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-yellow-50 rounded-lg mx-auto mb-2">
              <MessageSquare className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold">
              {periodOne?.summary?.total_comments || 0}
            </div>
            {reportType === "compare" && periodTwo?.summary && (
              <div className="mt-1">
                {renderChangeIndicator(
                  periodOne?.summary?.total_comments || 0,
                  periodTwo?.summary?.total_comments || 0
                )}
              </div>
            )}
            <div className="text-sm text-muted-foreground">Total Comments</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-50 rounded-lg mx-auto mb-2">
              <Share2 className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold">
              {periodOne?.summary?.total_shares || 0}
            </div>
            {reportType === "compare" && periodTwo?.summary && (
              <div className="mt-1">
                {renderChangeIndicator(
                  periodOne?.summary?.total_shares || 0,
                  periodTwo?.summary?.total_shares || 0
                )}
              </div>
            )}
            <div className="text-sm text-muted-foreground">Total Shares</div>
          </CardContent>
        </Card>
      </div>

      {/* Post Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Post Performance Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {chartData.length === 0 ? (
              <div className="flex justify-center flex-col gap-4">
                <img src="/nodata.svg" alt="No Data" className="h-64" />
                <p className="text-center">No data available</p>
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
                    dataKey="currentPosts"
                    stroke="#2563eb"
                    strokeWidth={2}
                    name="Current Period Posts"
                  />
                  {reportType === "compare" && (
                    <Line
                      type="monotone"
                      dataKey="previousPosts"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Previous Period Posts"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {!periodOne?.recent_posts || periodOne.recent_posts.length === 0 ? (
            <div className="flex justify-center flex-col gap-4">
              <img src="/nodata.svg" alt="No Data" className="h-64" />
              <p className="text-center">No posts available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {periodOne.recent_posts.slice(0, 10).map((post: any, index: number) => (
                <div
                  key={post.id || index}
                  className="flex items-start gap-4 p-4 rounded-lg border"
                >
                  {post.media_url && (
                    <div className="w-16 h-16 bg-muted/50 rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={post.media_url}
                        alt={`Post ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{post.post_type || "Update"}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {post.publish_date || "Unknown date"}
                      </span>
                    </div>
                    <p className="text-sm mb-2">
                      {post.summary || post.text || "No content available"}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {post.views || 0} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {post.likes || 0} likes
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {post.comments || 0} comments
                      </span>
                    </div>
                  </div>
                  {post.url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(post.url, "_blank")}
                    >
                      View
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};