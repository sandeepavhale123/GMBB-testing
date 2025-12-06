import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePostActivity } from "../../hooks/usePostActivity";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const PostPerformanceChart: React.FC = () => {
  const { t } = useI18nNamespace([
    "social-poster-components-dashboard/PostPerformanceChart",
  ]);
  const [timeRange, setTimeRange] = useState("last_month");
  const { data, isLoading } = usePostActivity(timeRange);

  if (isLoading) {
    return <PostPerformanceChartSkeleton />;
  }

  const chartData = data?.data.periods || [];
  const totalPosts = data?.data.total_posts || 0;

  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold"> {t("title")}</CardTitle>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_week">
                {t("timeRange.last_week")}
              </SelectItem>
              <SelectItem value="last_month">
                {t("timeRange.last_month")}
              </SelectItem>
              <SelectItem value="last_6_months">
                {t("timeRange.last_6_months")}
              </SelectItem>
              <SelectItem value="last_12_months">
                {t("timeRange.last_12_months")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-4xl font-bold">{totalPosts}</span>
          <span className="text-lg text-muted-foreground">
            {t("postsLabel")}
          </span>
        </div>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="postGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(142, 76%, 36%)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(142, 76%, 36%)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="period"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(value: number, name: string) => [
                  value,
                  t("tooltip.posts"),
                ]}
              />
              <Area
                type="monotone"
                dataKey="posts"
                stroke="hsl(142, 76%, 36%)"
                strokeWidth={2}
                fill="url(#postGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export const PostPerformanceChartSkeleton: React.FC = () => (
  <Card>
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-8 w-[140px]" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="mb-4 flex items-baseline gap-2">
        <Skeleton className="h-10 w-16" />
        <Skeleton className="h-5 w-12" />
      </div>
      <Skeleton className="h-[200px] w-full" />
    </CardContent>
  </Card>
);
