import React from "react";
import { Card } from "@/components/ui/card";
import { Search, Clock, CheckCircle2, Calendar, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
interface BulkMapSummaryCardsProps {
  searchBy: string;
  scheduledFrequency: string;
  lastCheck: string;
  nextCheck: string;
  nextCheckTime?: string;
  positionSummary: {
    total: number;
    pos1_3: {
      count: number;
      percent: number;
    };
    pos4_10: {
      count: number;
      percent: number;
    };
    pos11_15: {
      count: number;
      percent: number;
    };
    pos16_20: {
      count: number;
      percent: number;
    };
  };
  isLoading?: boolean;
}
export const BulkMapSummaryCards: React.FC<BulkMapSummaryCardsProps> = ({
  searchBy,
  scheduledFrequency,
  lastCheck,
  nextCheck,
  nextCheckTime = "Scheduled for 4:30 PM",
  positionSummary,
  isLoading,
}) => {
  const { t } = useI18nNamespace("MultidashboardComponent/bulkMapSummaryCards");
  // Custom tooltip for chart hover.
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
      title: t("statsCards.searchBy"),
      value: searchBy,
      icon: Search,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: t("statsCards.scheduledFrequency"),
      value: scheduledFrequency,
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: t("statsCards.lastCheck"),
      value: lastCheck,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];
  const positionStats = [
    {
      label: "1-3",
      count: positionSummary.pos1_3.count,
      percent: positionSummary.pos1_3.percent,
      color: "text-green-600",
      dotColor: "bg-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      label: "4-10",
      count: positionSummary.pos4_10.count,
      percent: positionSummary.pos4_10.percent,
      color: "text-yellow-500",
      dotColor: "bg-yellow-500",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    {
      label: "11-15",
      count: positionSummary.pos11_15.count,
      percent: positionSummary.pos11_15.percent,
      color: "text-orange-500",
      dotColor: "bg-orange-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    {
      label: "16-20+",
      count: positionSummary.pos16_20.count,
      percent: positionSummary.pos16_20.percent,
      color: "text-red-600",
      dotColor: "bg-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  ];
  const chartData = [
    {
      name: "1-3",
      value: positionSummary.pos1_3.percent,
      color: "#22c55e",
      count: positionSummary.pos1_3.count,
    },
    {
      name: "4-10",
      value: positionSummary.pos4_10.percent,
      color: "#eab308",
      count: positionSummary.pos4_10.count,
    },
    {
      name: "11-15",
      value: positionSummary.pos11_15.percent,
      color: "#f97316",
      count: positionSummary.pos11_15.count,
    },
    {
      name: "16-20+",
      value: positionSummary.pos16_20.percent,
      color: "#ef4444",
      count: positionSummary.pos16_20.count,
    },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
      {/* Left Column - Stats Cards Stacked */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:col-span-6">
        {/* Search By Card */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">{stats[0].title}</p>
              {isLoading ? (
                <Skeleton className="h-8 w-16 text-xl" />
              ) : (
                <p
                  style={{
                    fontSize: "20px",
                  }}
                  className="mt-[30px] font-bold text-xl"
                >
                  {stats[0].value}
                </p>
              )}
            </div>
            <div className={`${stats[0].bgColor} p-3 rounded-lg`}>
              <Search className={`w-5 h-5 ${stats[0].color}`} />
            </div>
          </div>
        </Card>

        {/* Scheduled Frequency Card */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">{stats[1].title}</p>
              {isLoading ? (
                <Skeleton className="h-8 w-16 text-xl" />
              ) : (
                <p
                  style={{
                    fontSize: "20px",
                  }}
                  className="mt-[30px] font-bold text-xl"
                >
                  {stats[1].value}
                </p>
              )}
            </div>
            <div className={`${stats[1].bgColor} p-3 rounded-lg`}>
              <Clock className={`w-5 h-5 ${stats[1].color}`} />
            </div>
          </div>
        </Card>

        {/* Last Check Card */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">{stats[2].title}</p>
              {isLoading ? (
                <Skeleton className="h-8 w-16 text-xl" />
              ) : (
                <p
                  style={{
                    fontSize: "20px",
                  }}
                  className="mt-[30px] font-bold text-xl"
                >
                  {stats[2].value}
                </p>
              )}
            </div>
            <div className={`${stats[2].bgColor} p-3 rounded-lg`}>
              <CheckCircle2 className={`w-5 h-5 ${stats[2].color}`} />
            </div>
          </div>
        </Card>

        {/* Next Check Card */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2"> {t("statsCards.nextCheck")}</p>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <p
                    style={{
                      fontSize: "20px",
                    }}
                    className="mt-[30px] font-bold text-xl"
                  >
                    {nextCheck}
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

      {/* Right Column - Position Summary */}
      <Card className="p-6 lg:col-span-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t("positionSummary.title")}</h3>

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
                  <p className="text-3xl font-bold">{positionSummary.total}</p>
                  <p className="text-xs text-muted-foreground">{t("positionSummary.totalKeywords")}</p>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-col gap-3 flex-1">
                {positionStats.map((stat, index) => {
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${stat.dotColor}`}></div>
                        <div>
                          <p className="font-medium text-sm text-foreground">{stat.label}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-foreground">{stat.count}</p>
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
