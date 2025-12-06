import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePostingActivity } from "../../hooks/usePostingActivity";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

const platformColors: Record<string, string> = {
  facebook: "hsl(221, 75%, 55%)",
  instagram: "hsl(330, 75%, 50%)",
  linkedin: "hsl(201, 100%, 35%)",
  linkedin_individual: "hsl(201, 100%, 40%)",
  linkedin_organisation: "hsl(201, 100%, 30%)",
  twitter: "hsl(0, 0%, 20%)",
  threads: "hsl(0, 0%, 40%)",
  pinterest: "hsl(0, 75%, 50%)",
  youtube: "hsl(0, 100%, 50%)",
};

export const PostingActivityChart: React.FC = () => {
  const { t } = useI18nNamespace([
    "social-poster-components-dashboard/PostingActivityChart",
  ]);
  const [timeRange, setTimeRange] = useState("last_month");
  const { data, isLoading } = usePostingActivity(timeRange);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div
        className="rounded-md border p-2 shadow-md"
        style={{
          backgroundColor: "hsl(var(--card))",
          borderColor: "hsl(var(--border))",
        }}
      >
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-sm">
          {t("tooltip.posts")}: {payload[0].value}
        </p>
      </div>
    );
  };

  if (isLoading) {
    return <PostingActivityChartSkeleton />;
  }

  const platforms = data?.data?.platforms || [];
  const totalPosts = data?.data?.total_posts || 0;

  const chartData = platforms.map((p) => ({
    name: p.display_name,
    posts: p.posts,
    color: platformColors[p.platform] || "hsl(var(--primary))",
  }));

  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{t("title")}</CardTitle>
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
            {t("totalPostsLabel")}
          </span>
        </div>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              {/* <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                cursor={{ fill: "hsl(var(--muted))" }}
              /> */}

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "hsl(var(--muted))" }}
              />

              <Bar dataKey="posts" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export const PostingActivityChartSkeleton: React.FC = () => (
  <Card>
    <CardHeader className="pb-2">
      <Skeleton className="h-5 w-48" />
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
