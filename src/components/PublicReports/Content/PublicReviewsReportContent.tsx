import React, { useState } from "react";
import { useParams } from "react-router-dom";
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

export const PublicReviewsReportContent: React.FC = () => {
  const { token } = useParams();
  const reportId = token || "";

  // Fetch review report
  const {
    data: reviewsData,
    isLoading,
    error,
  } = usePerformanceReviewReport(reportId);

  const reportType = reviewsData?.data?.reportType.toLowerCase();

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">
            Loading Review report...
          </p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div>Error loading review report</div>
      </div>
    );
  }

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) {
      return {
        value: current === 0 ? 0 : 100,
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

  return (
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
              Average Rating
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
            <div className="text-sm text-muted-foreground">Total Reviews</div>
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
              Manually Reply
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
            <div className="text-sm text-muted-foreground">AI Reply</div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getCurrentSentiment().map((item) => (
              <div key={item.stars} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium">{item.stars}</span>
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1">
                  <Progress value={item.percentage} className="h-2" />
                </div>
                <div className="text-sm text-muted-foreground w-16 text-right">
                  {item.count} ({item.percentage}%)
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sentiment Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={transformSentimentData(
                    getCurrentOverview().sentiment_summary
                  )}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reviewsData?.data?.periodOne?.reviews
              ?.slice(0, 10)
              .map((review: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review.profile_photo_url} />
                      <AvatarFallback>
                        {review.author_name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{review.author_name}</h4>
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatToDayMonthYear(review.time)}
                        </span>
                      </div>
                      {review.text && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {review.text}
                        </p>
                      )}
                      {review.reply && (
                        <div className="bg-muted p-3 rounded-md mt-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">
                              Business Response
                            </span>
                            {review.reply_type === "ai" && (
                              <Badge variant="secondary" className="text-xs">
                                AI Reply
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm">{review.reply}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
