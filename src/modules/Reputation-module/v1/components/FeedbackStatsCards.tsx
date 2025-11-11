import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, MessageSquare, Calendar, TrendingUp } from "lucide-react";

interface FeedbackStatsCardsProps {
  totalForms: number;
  totalFeedback: number;
  thisMonthFeedback: number;
  averageResponseRate: number;
  isLoading?: boolean;
}

export const FeedbackStatsCards: React.FC<FeedbackStatsCardsProps> = ({
  totalForms,
  totalFeedback,
  thisMonthFeedback,
  averageResponseRate,
  isLoading = false,
}) => {
  const stats = [
    {
      title: "Total Forms",
      value: totalForms,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Feedback",
      value: totalFeedback,
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "This Month",
      value: thisMonthFeedback,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Avg Rating",
      value: averageResponseRate.toFixed(1),
      suffix: "/5",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-20 mt-2" />
                ) : (
                  <p className="text-2xl font-bold mt-2">
                    {stat.value}
                    {(stat as any).suffix && (
                      <span className="text-lg text-muted-foreground ml-0.5">
                        {(stat as any).suffix}
                      </span>
                    )}
                  </p>
                )}
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
