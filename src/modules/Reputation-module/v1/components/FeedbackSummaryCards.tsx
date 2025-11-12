import React from "react";
import { Card } from "@/components/ui/card";
import { Star, MessageSquare, TrendingUp, Smile, Meh, Frown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
interface FeedbackSummaryCardsProps {
  totalResponses: number;
  avgRating: number;
  positiveThreshold: number;
  sentiment: {
    total: number;
    positive: {
      count: number;
      percent: number;
    };
    neutral: {
      count: number;
      percent: number;
    };
    negative: {
      count: number;
      percent: number;
    };
  };
  isLoading?: boolean;
}
export const FeedbackSummaryCards: React.FC<FeedbackSummaryCardsProps> = ({
  totalResponses,
  avgRating,
  positiveThreshold,
  sentiment,
  isLoading
}) => {
  const stats = [{
    title: "Total Responses",
    value: totalResponses,
    icon: MessageSquare,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  }, {
    title: "Average Rating",
    value: avgRating.toFixed(1),
    suffix: "/5",
    icon: Star,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50"
  }, {
    title: "Positive Threshold",
    value: positiveThreshold,
    suffix: "+ stars",
    icon: TrendingUp,
    color: "text-green-600",
    bgColor: "bg-green-50"
  }];
  const sentimentStats = [{
    label: "Positive",
    count: sentiment.positive.count,
    percent: sentiment.positive.percent,
    icon: Smile,
    color: "text-green-600",
    bgColor: "bg-green-50"
  }, {
    label: "Neutral",
    count: sentiment.neutral.count,
    percent: sentiment.neutral.percent,
    icon: Meh,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50"
  }, {
    label: "Negative",
    count: sentiment.negative.count,
    percent: sentiment.negative.percent,
    icon: Frown,
    color: "text-red-600",
    bgColor: "bg-red-50"
  }];
  const chartData = [
    { name: "Positive", value: sentiment.positive.percent, color: "#22c55e" },
    { name: "Neutral", value: sentiment.neutral.percent, color: "#eab308" },
    { name: "Negative", value: sentiment.negative.percent, color: "#ef4444" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      {/* Left Column - Stats Cards Stacked */}
      <div className="space-y-4">
        {/* Total Responses Card */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">Total Responses</p>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-3xl font-bold">{totalResponses}</p>
              )}
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>

        {/* Average Rating Card */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">Average Rating</p>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <p className="text-3xl font-bold">
                  {avgRating.toFixed(1)}
                  <span className="text-sm text-muted-foreground ml-1">/5</span>
                </p>
              )}
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </Card>

        {/* Positive Threshold Card */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">Positive Threshold</p>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-3xl font-bold">
                  {positiveThreshold}
                  <span className="text-sm text-muted-foreground ml-1">+ stars</span>
                </p>
              )}
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>

        {/* Positive Count Card */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">Positive</p>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-3xl font-bold">{sentiment.positive.count}</p>
              )}
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <Smile className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Right Column - Large Sentiment Analysis Card with Doughnut Chart */}
      <Card className="p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold mb-6">Sentiment Analysis</h3>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Skeleton className="h-48 w-48 rounded-full" />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Doughnut Chart */}
            <div className="flex-shrink-0">
              <ResponsiveContainer width={240} height={240}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend with Counts */}
            <div className="flex-1 space-y-4 w-full">
              {/* Positive */}
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-green-900">Positive</p>
                    <p className="text-sm text-green-700">{sentiment.positive.count} responses</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-green-900">
                  {sentiment.positive.percent}%
                </p>
              </div>

              {/* Neutral */}
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-yellow-900">Neutral</p>
                    <p className="text-sm text-yellow-700">{sentiment.neutral.count} responses</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-yellow-900">
                  {sentiment.neutral.percent}%
                </p>
              </div>

              {/* Negative */}
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-red-900">Negative</p>
                    <p className="text-sm text-red-700">{sentiment.negative.count} responses</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-red-900">
                  {sentiment.negative.percent}%
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};