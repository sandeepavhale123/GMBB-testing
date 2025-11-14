import React from "react";
import { Card } from "@/components/ui/card";
import {
  BarChart3,
  TrendingUp,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface BulkMapSummaryCardsProps {
  totalChecks: number;
  avgRank: number;
  keywords: number;
  nextCheck: string;
  nextCheckTime?: string;
  statusDistribution: {
    total: number;
    complete: {
      count: number;
      percent: number;
    };
    pending: {
      count: number;
      percent: number;
    };
    failed: {
      count: number;
      percent: number;
    };
  };
  isLoading?: boolean;
}

export const BulkMapSummaryCards: React.FC<BulkMapSummaryCardsProps> = ({
  totalChecks,
  avgRank,
  keywords,
  nextCheck,
  nextCheckTime = "Scheduled for 4:30 PM",
  statusDistribution,
  isLoading,
}) => {
  // Custom tooltip for chart hover
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
          <p className="font-semibold text-sm">{payload[0].name}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {payload[0].value}% ({payload[0].payload.count} checks)
          </p>
        </div>
      );
    }
    return null;
  };

  const stats = [
    {
      title: "Total Checks",
      value: totalChecks,
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Avg Rank",
      value: avgRank.toFixed(1),
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Keywords",
      value: keywords,
      icon: MapPin,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const statusStats = [
    {
      label: "Complete",
      count: statusDistribution.complete.count,
      percent: statusDistribution.complete.percent,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      label: "Pending",
      count: statusDistribution.pending.count,
      percent: statusDistribution.pending.percent,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      label: "Failed",
      count: statusDistribution.failed.count,
      percent: statusDistribution.failed.percent,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  ];

  const chartData = [
    {
      name: "Complete",
      value: statusDistribution.complete.percent,
      color: "#22c55e",
      count: statusDistribution.complete.count,
    },
    {
      name: "Pending",
      value: statusDistribution.pending.percent,
      color: "#3b82f6",
      count: statusDistribution.pending.count,
    },
    {
      name: "Failed",
      value: statusDistribution.failed.percent,
      color: "#ef4444",
      count: statusDistribution.failed.count,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
      {/* Left Column - Stats Cards Stacked */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:col-span-6">
        {/* Total Checks Card */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">
                {stats[0].title}
              </p>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p
                  className="text-3xl mb:text-5xl mt-[30px] font-bold"
                  style={{ fontSize: "30px" }}
                >
                  {stats[0].value}
                </p>
              )}
            </div>
            <div className={`${stats[0].bgColor} p-3 rounded-lg`}>
              <BarChart3 className={`w-5 h-5 ${stats[0].color}`} />
            </div>
          </div>
        </Card>

        {/* Avg Rank Card */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">
                {stats[1].title}
              </p>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p
                  className="text-3xl mb:text-5xl mt-[30px] font-bold"
                  style={{ fontSize: "30px" }}
                >
                  {stats[1].value}
                </p>
              )}
            </div>
            <div className={`${stats[1].bgColor} p-3 rounded-lg`}>
              <TrendingUp className={`w-5 h-5 ${stats[1].color}`} />
            </div>
          </div>
        </Card>

        {/* Keywords Card */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">
                {stats[2].title}
              </p>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p
                  className="text-3xl mb:text-5xl mt-[30px] font-bold"
                  style={{ fontSize: "30px" }}
                >
                  {stats[2].value}
                </p>
              )}
            </div>
            <div className={`${stats[2].bgColor} p-3 rounded-lg`}>
              <MapPin className={`w-5 h-5 ${stats[2].color}`} />
            </div>
          </div>
        </Card>

        {/* Next Check Card */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">Next Check</p>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <p
                    className="text-3xl mb:text-5xl mt-[30px] font-bold"
                    style={{ fontSize: "30px" }}
                  >
                    {nextCheck}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {nextCheckTime}
                  </p>
                </>
              )}
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Right Column - Status Distribution Chart */}
      <Card className="p-6 lg:col-span-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Status Distribution</h3>

          {isLoading ? (
            <div className="flex items-center justify-center h-[200px]">
              <Skeleton className="h-[200px] w-[200px] rounded-full" />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Chart */}
              <div className="relative">
                <ResponsiveContainer width={190} height={190}>
                  <PieChart>
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
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-3xl font-bold">
                    {statusDistribution.total}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Checks</p>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-col gap-3 flex-1">
                {statusStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg border ${stat.borderColor} ${stat.bgColor}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`${stat.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className={`font-semibold text-sm ${stat.color}`}>
                            {stat.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {stat.count} checks
                          </p>
                        </div>
                      </div>
                      <div className={`text-right ${stat.color}`}>
                        <p className="font-bold text-lg">{stat.percent}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
