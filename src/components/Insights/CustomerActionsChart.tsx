import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { MousePointer, Navigation, Phone, MessageSquare } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface CustomerActionsChartProps {
  isLoadingSummary: boolean;
  isLoadingCustomerActions: boolean;
  customerActionsChartData: any[];
  customerActions: any;
  summary: any;
}

export const CustomerActionsChart: React.FC<CustomerActionsChartProps> = ({
  isLoadingSummary,
  isLoadingCustomerActions,
  customerActionsChartData,
  customerActions,
  summary,
}) => {
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
        {isLoadingSummary || isLoadingCustomerActions ? (
          <Skeleton className="h-64" />
        ) : (
          <>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customerActionsChartData}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Bar
                    dataKey="value"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    name={t("customerActionsChart.chart.barLabel")}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <MousePointer className="w-4 h-4 text-primary" />
                <span className="text-sm text-gray-600">
                  {t("customerActionsChart.metrics.website")}
                  {customerActions?.actions_breakdown.website_clicks.total ||
                    summary?.customer_actions.website_clicks.value ||
                    0}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">
                  {t("customerActionsChart.metrics.messages")}
                  {customerActions?.actions_breakdown.messages.total ||
                    summary?.customer_actions.messages.value ||
                    0}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-gray-600">
                  {t("customerActionsChart.metrics.directions")}
                  {customerActions?.actions_breakdown.direction_requests
                    .total ||
                    summary?.customer_actions.direction_requests.value ||
                    0}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-600">
                  {t("customerActionsChart.metrics.calls")}
                  {customerActions?.actions_breakdown.phone_calls.total ||
                    summary?.customer_actions.phone_calls.value ||
                    0}
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
