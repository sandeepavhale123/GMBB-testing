import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAppSelector } from "../../hooks/useRedux";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const PerformanceChart: React.FC = () => {
  const { performanceData } = useAppSelector((state) => state.dashboard);
  const { t } = useI18nNamespace("Dashboard/performanceChart");
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {t("performanceChart.title")}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t("performanceChart.description")}
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
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
              <Line
                type="monotone"
                dataKey="views"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                name={t("performanceChart.metrics.views")}
              />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="hsl(142 76% 36%)"
                strokeWidth={2}
                dot={{ fill: "hsl(142 76% 36%)", strokeWidth: 2, r: 4 }}
                name={t("performanceChart.metrics.clicks")}
              />
              <Line
                type="monotone"
                dataKey="calls"
                stroke="hsl(25 95% 53%)"
                strokeWidth={2}
                dot={{ fill: "hsl(25 95% 53%)", strokeWidth: 2, r: 4 }}
                name={t("performanceChart.metrics.calls")}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
