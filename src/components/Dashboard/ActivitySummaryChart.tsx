import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const ActivitySummaryChart: React.FC = () => {
  const { t } = useI18nNamespace("Dashboard/activitySummaryChart");
  const barChartData = [
    { name: t("labels.success"), value: 55, fill: "#10b981" },
    { name: t("labels.failed"), value: 5, fill: "#ef4444" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{t("summary")} </span>
            <span className="text-2xl font-bold">60</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
