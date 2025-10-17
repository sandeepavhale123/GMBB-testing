import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface CustomerActionsChartProps {
  isLoadingSummary: boolean;
  isLoadingVisibility: boolean;
  visibilityTrends: any;
  summary: any;
}

export const CustomerActionsChart: React.FC<CustomerActionsChartProps> = ({
  isLoadingSummary,
  isLoadingVisibility,
  visibilityTrends,
  summary,
}) => {
  const [visibleBars, setVisibleBars] = useState({
    website: true,
    direction: true,
    messages: true,
    calls: true,
  });

  const toggleBar = (
    barName: "website" | "direction" | "messages" | "calls"
  ) => {
    setVisibleBars((prev) => ({
      ...prev,
      [barName]: !prev[barName],
    }));
  };

  const customerActionsChartData =
    visibilityTrends?.chart_data?.map((item: any) => ({
      name: item.name,
      website: item.website || 0,
      direction: item.direction || 0,
      messages: item.messages || 0,
      calls: item.calls || 0,
    })) || [];
  const { t } = useI18nNamespace("Insights/customerActionsChart");
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {t("customerActionsChart.title")}
        </CardTitle>
        <p className="text-sm text-gray-600">
          {t("customerActionsChart.description")}
        </p>
      </CardHeader>
      <CardContent>
        {isLoadingSummary || isLoadingVisibility ? (
          <Skeleton className="h-64" />
        ) : (
          <>
            <div style={{ height: "306px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customerActionsChartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  {visibleBars.website && (
                    <Bar
                      dataKey="website"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                      name="Website"
                    />
                  )}
                  {visibleBars.direction && (
                    <Bar
                      dataKey="direction"
                      fill="#f97316"
                      radius={[4, 4, 0, 0]}
                      name="Direction"
                    />
                  )}
                  {visibleBars.messages && (
                    <Bar
                      dataKey="messages"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      name="Messages"
                    />
                  )}
                  {visibleBars.calls && (
                    <Bar
                      dataKey="calls"
                      fill="#a855f7"
                      radius={[4, 4, 0, 0]}
                      name="Calls"
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-center mt-4">
              <div className="flex gap-4 text-sm">
                <button
                  onClick={() => toggleBar("website")}
                  className={`flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80 ${
                    !visibleBars.website ? "opacity-50" : ""
                  }`}
                  aria-pressed={visibleBars.website}
                  title={t(
                    `customerActionsChart.tooltips.${
                      visibleBars.website ? "hide" : "show"
                    }`,
                    {
                      metric: t("customerActionsChart.metrics.website"),
                    }
                  )}
                >
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: "#10b981" }}
                  ></div>
                  <span className={!visibleBars.website ? "line-through" : ""}>
                    {t("customerActionsChart.metrics.website")}
                  </span>
                </button>
                <button
                  onClick={() => toggleBar("direction")}
                  className={`flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80 ${
                    !visibleBars.direction ? "opacity-50" : ""
                  }`}
                  aria-pressed={visibleBars.direction}
                  title={t(
                    `customerActionsChart.tooltips.${
                      visibleBars.website ? "hide" : "show"
                    }`,
                    {
                      metric: t("customerActionsChart.metrics.direction"),
                    }
                  )}
                >
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: "#f97316" }}
                  ></div>
                  <span
                    className={!visibleBars.direction ? "line-through" : ""}
                  >
                    {t("customerActionsChart.metrics.direction")}
                  </span>
                </button>
                <button
                  onClick={() => toggleBar("messages")}
                  className={`flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80 ${
                    !visibleBars.messages ? "opacity-50" : ""
                  }`}
                  aria-pressed={visibleBars.messages}
                  title={t(
                    `customerActionsChart.tooltips.${
                      visibleBars.website ? "hide" : "show"
                    }`,
                    {
                      metric: t("customerActionsChart.metrics.messages"),
                    }
                  )}
                >
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: "#3b82f6" }}
                  ></div>
                  <span className={!visibleBars.messages ? "line-through" : ""}>
                    {t("customerActionsChart.metrics.messages")}
                  </span>
                </button>
                <button
                  onClick={() => toggleBar("calls")}
                  className={`flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80 ${
                    !visibleBars.calls ? "opacity-50" : ""
                  }`}
                  aria-pressed={visibleBars.calls}
                  title={t(
                    `customerActionsChart.tooltips.${
                      visibleBars.website ? "hide" : "show"
                    }`,
                    {
                      metric: t("customerActionsChart.metrics.calls"),
                    }
                  )}
                >
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: "#a855f7" }}
                  ></div>
                  <span className={!visibleBars.calls ? "line-through" : ""}>
                    {t("customerActionsChart.metrics.calls")}
                  </span>
                </button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
