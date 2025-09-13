import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const ProgressDonutChart: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"all" | "manual" | "genie">(
    "manual"
  );
  const { t } = useI18nNamespace("Dashboard/progressDonutChart");
  const data = [
    {
      name: t("progressDonutChart.data.manual"),
      value: 66.7,
      color: "#1e3a8a",
    },
    {
      name: t("progressDonutChart.data.genie"),
      value: 30.2,
      color: "#3b82f6",
    },
    {
      name: t("progressDonutChart.data.other"),
      value: 3.1,
      color: "#93c5fd",
    },
  ];

  const centerValue =
    data.find((item) => item.name === "Manual")?.value || 66.7;

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">
          {t("progressDonutChart.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-bold">{centerValue}%</span>
            <span className="text-sm text-muted-foreground">
              {t("progressDonutChart.centerLabel.responded")}
            </span>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm">{item.name}</span>
              </div>
              <span className="text-sm font-medium">{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
