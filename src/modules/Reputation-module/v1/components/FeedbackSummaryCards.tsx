import React from "react";
import { Card } from "@/components/ui/card";
import {
  Star,
  MessageSquare,
  TrendingUp,
  Smile,
  Meh,
  Frown,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
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
  isLoading,
}) => {
  const { t } = useI18nNamespace(
    "Reputation-module-v1-components/FeedbackSummaryCards"
  );
  // Custom tooltip for chart hover
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
          <p className="font-semibold text-sm">{payload[0].name}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {payload[0].value}% ({payload[0].payload.count} {t("responses")})
          </p>
        </div>
      );
    }
    return null;
  };

  const stats = [
    {
      title: t("totalResponses"),
      value: totalResponses,
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: t("averageRating"),
      value: avgRating.toFixed(1),
      suffix: t("suffix"),
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: t("positiveThreshold"),
      value: positiveThreshold,
      suffix: t("starsSuffix"),
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];
  const sentimentStats = [
    {
      label: t("positive"),
      count: sentiment.positive.count,
      percent: sentiment.positive.percent,
      icon: Smile,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: t("neutral"),
      count: sentiment.neutral.count,
      percent: sentiment.neutral.percent,
      icon: Meh,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      label: t("negative"),
      count: sentiment.negative.count,
      percent: sentiment.negative.percent,
      icon: Frown,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];
  const chartData = [
    {
      name: t("positive"),
      value: sentiment.positive.percent,
      color: "#22c55e",
      count: sentiment.positive.count,
    },
    {
      name: t("neutral"),
      value: sentiment.neutral.percent,
      color: "#eab308",
      count: sentiment.neutral.count,
    },
    {
      name: t("negative"),
      value: sentiment.negative.percent,
      color: "#ef4444",
      count: sentiment.negative.count,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
      {/* Left Column - Stats Cards Stacked */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:col-span-6">
        {/* Total Responses Card */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">
                {t("totalResponses")}
              </p>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p
                  className="text-3xl mb:text-5xl mt-[30px]  font-bold"
                  style={{ fontSize: "30px" }}
                >
                  {totalResponses}
                </p>
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
              <p className="text-sm text-muted-foreground mb-2">
                {t("averageRating")}
              </p>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <p
                  className="text-3xl mb:text-5xl mt-[30px]  font-bold"
                  style={{ fontSize: "30px" }}
                >
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
              <p className="text-sm text-muted-foreground mb-2">
                {t("positiveThreshold")}
              </p>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p
                  className="text-3xl mb:text-5xl mt-[30px]  font-bold"
                  style={{ fontSize: "30px" }}
                >
                  {positiveThreshold}
                  <span className="text-sm text-muted-foreground ml-1">
                    {t("starsSuffix")}
                  </span>
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
              <p className="text-sm text-muted-foreground mb-2">
                {t("positive")}
              </p>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p
                  className="text-3xl mb:text-5xl mt-[30px]  font-bold"
                  style={{ fontSize: "30px" }}
                >
                  {sentiment.positive.count}
                </p>
              )}
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <Smile className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Right Column - Large Sentiment Analysis Card with Doughnut Chart */}
      <Card className="p-6 lg:col-span-6">
        <div className="flex flex-col lg:flex-wrap justify-between items-start mb-3 gap-2">
          <h3 className="text-lg font-semibold ">{t("sentimentAnalysis")}</h3>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Skeleton className="h-48 w-48 rounded-full" />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row justify-between  items-center gap-8">
            {/* Doughnut Chart */}
            <div className="flex-shrink-0">
              <ResponsiveContainer width={190} height={190}>
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
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

            <div className="flex flex-col gap-4  lg:gap:4">
              <div className="flex flex-row gap-2 items-center border px-2 py-1 rounded border-green-500 border-1">
                <div className="w-2 h-2 rounded bg-green-500 "></div>
                <div className="flex flex-row items-center gap-2">
                  <p className="font-semibold text-green-500">
                    {t("positive")}
                  </p>
                  <p className="font-semibold text-sm text-green-500">
                    {sentiment.positive.count}{" "}
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-2 items-center border px-2 py-1 rounded border-yellow-500 border-1">
                <div className="w-2 h-2 rounded bg-yellow-500 "></div>
                <div className="flex flex-row items-center gap-2">
                  <p className="font-semibold text-yellow-500">
                    {t("neutral")}
                  </p>
                  <p className="font-semibold text-sm text-yellow-500">
                    {sentiment.neutral.count}{" "}
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-2 items-center border px-2 py-1 rounded border-red-500 border-1">
                <div className="w-2 h-2 rounded bg-red-500 "></div>
                <div className="flex flex-row items-center gap-2">
                  <p className="font-semibold text-red-500">{t("negative")}</p>
                  <p className="font-semibold text-sm text-red-500">
                    {sentiment.negative.count}{" "}
                  </p>
                </div>
              </div>
            </div>
            {/* Legend with Counts   */}
          </div>
        )}
      </Card>
    </div>
  );
};
