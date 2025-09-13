import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { TrendingUp, BarChart3 } from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const DailyActivitySummaryChart: React.FC = () => {
  const [chartType, setChartType] = useState<"line" | "area">("line");
  const { t } = useI18nNamespace("Dashboard/dailyActivitySummaryChart");

  const data = [
    { date: "05 May", posts: 2.1, mediaResponded: 1.4, reviews: 0.5, qa: 0 },
    { date: "09 May", posts: 1.8, mediaResponded: 1.2, reviews: 1.2, qa: 0.2 },
    { date: "13 May", posts: 2.2, mediaResponded: 2.1, reviews: 0.7, qa: 0.5 },
    { date: "17 May", posts: 2.4, mediaResponded: 2.5, reviews: 1.8, qa: 1.2 },
    { date: "21 May", posts: 0.5, mediaResponded: 1.8, reviews: 2.5, qa: 1.8 },
    { date: "27 May", posts: 1.4, mediaResponded: 2.1, reviews: 1.2, qa: 0.7 },
    { date: "31 May", posts: 2.1, mediaResponded: 2.2, reviews: 1.8, qa: 1.2 },
  ];

  const ChartComponent = chartType === "line" ? LineChart : AreaChart;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              {t("title")}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={chartType === "line" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("line")}
            >
              {t("buttons.line")}
            </Button>
            <Button
              variant={chartType === "area" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("area")}
            >
              {t("buttons.area")}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ChartComponent data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="date"
                className="text-xs"
                axisLine={false}
                tickLine={false}
              />
              <YAxis className="text-xs" axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />

              {chartType === "line" ? (
                <>
                  <Line
                    type="monotone"
                    dataKey="posts"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name={t("labels.posts")}
                    dot={{ fill: "#3b82f6", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mediaResponded"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    name={t("labels.mediaResponded")}
                    dot={{ fill: "#8b5cf6", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="reviews"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    name={t("labels.reviews")}
                    dot={{ fill: "#f59e0b", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="qa"
                    stroke="#10b981"
                    strokeWidth={3}
                    name={t("labels.qa")}
                    dot={{ fill: "#10b981", r: 4 }}
                  />
                </>
              ) : (
                <>
                  <Area
                    type="monotone"
                    dataKey="posts"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="mediaResponded"
                    stackId="1"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="reviews"
                    stackId="1"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="qa"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.3}
                  />
                </>
              )}
            </ChartComponent>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-muted-foreground">
              {t("labels.posts")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-sm text-muted-foreground">
              {t("labels.mediaResponded")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm text-muted-foreground">
              {t("labels.reviews")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-muted-foreground">
              {t("labels.qa")}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
