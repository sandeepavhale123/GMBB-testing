import React from "react";
import { Card } from "@/components/ui/card";
import { Star, MessageSquare, TrendingUp, Smile, Meh, Frown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface FeedbackSummaryCardsProps {
  totalResponses: number;
  avgRating: number;
  positiveThreshold: number;
  sentiment: {
    total: number;
    positive: { count: number; percent: number };
    neutral: { count: number; percent: number };
    negative: { count: number; percent: number };
  };
  isLoading?: boolean;
}

export const FeedbackSummaryCards: React.FC<FeedbackSummaryCardsProps> = ({
  totalResponses,
  avgRating,
  positiveThreshold,
  sentiment,
  isLoading,
}) => {
  const stats = [
    {
      title: "Total Responses",
      value: totalResponses,
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Average Rating",
      value: avgRating.toFixed(1),
      suffix: "/5",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Positive Threshold",
      value: positiveThreshold,
      suffix: "+ stars",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  const sentimentStats = [
    {
      label: "Positive",
      count: sentiment.positive.count,
      percent: sentiment.positive.percent,
      icon: Smile,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Neutral",
      count: sentiment.neutral.count,
      percent: sentiment.neutral.percent,
      icon: Meh,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      label: "Negative",
      count: sentiment.negative.count,
      percent: sentiment.negative.percent,
      icon: Frown,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Stats Cards */}
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mt-2" />
                ) : (
                  <p className="text-3xl font-bold">
                    {stat.value}
                    {stat.suffix && (
                      <span className="text-sm text-muted-foreground ml-1">
                        {stat.suffix}
                      </span>
                    )}
                  </p>
                )}
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </Card>
        );
      })}

      {/* Sentiment Card */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-muted-foreground">Sentiment Analysis</p>
        </div>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        ) : (
          <div className="space-y-2">
            {sentimentStats.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`${item.bgColor} p-1 rounded`}>
                      <Icon className={`w-3 h-3 ${item.color}`} />
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {item.count}
                    </span>
                    <span className="text-sm font-medium">
                      ({item.percent}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
