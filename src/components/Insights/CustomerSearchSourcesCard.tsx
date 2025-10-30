import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
interface CustomerSearchSourcesCardProps {
  summary: any;
  isLoadingSummary: boolean;
}

export const CustomerSearchSourcesCard: React.FC<CustomerSearchSourcesCardProps> = ({ summary, isLoadingSummary }) => {
  const { t } = useI18nNamespace("Insights/customerSearchSources");
  const [hoveredSegment, setHoveredSegment] = useState<{
    name: string;
    value: number;
  } | null>(null);

  const totalSearches =
    (summary?.customer_actions?.desktop_search?.value || 0) +
    (summary?.customer_actions?.desktop_map?.value || 0) +
    (summary?.customer_actions?.mobile_search?.value || 0) +
    (summary?.customer_actions?.mobile_map?.value || 0);

  const chartData = [
    {
      name: t("customerSearchSources.segments.desktopSearch"),
      value: summary?.customer_actions?.desktop_search?.value || 0,
      color: "#22c55e",
    },
    {
      name: t("customerSearchSources.segments.desktopMap"),
      value: summary?.customer_actions?.desktop_map?.value || 0,
      color: "#3b82f6",
    },
    {
      name: t("customerSearchSources.segments.mobileSearch"),
      value: summary?.customer_actions?.mobile_search?.value || 0,
      color: "#a855f7",
    },
    {
      name: t("customerSearchSources.segments.mobileMap"),
      value: summary?.customer_actions?.mobile_map?.value || 0,
      color: "#f97316",
    },
  ];

  if (isLoadingSummary) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-6 w-80" />
          <Skeleton className="h-4 w-full mt-2" />
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasData = totalSearches > 0;

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {!hasData ? (
          <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
            {t("customerSearchSources.noData")}
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Column 1: Title and Description */}
            <div className="flex flex-col justify-center space-y-2 md:space-y-3 lg:w-[65%]">
              <h3 className="text-base md:text-lg font-semibold text-foreground">{t("customerSearchSources.title")}</h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {t("customerSearchSources.description")}
              </p>
            </div>

            {/* Column 2: Donut Chart and Legend */}
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 md:max-h-[200px] lg:w-[35%]">
              {/* Chart Section */}
              <div className="relative w-[180px] md:w-[200px] h-[180px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                      onMouseEnter={(data) =>
                        setHoveredSegment({
                          value: data.value,
                        })
                      }
                      onMouseLeave={() => setHoveredSegment(null)}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl md:text-3xl font-bold text-foreground">
                    {hoveredSegment ? hoveredSegment.value : totalSearches}
                  </span>
                  <span className="text-xs text-muted-foreground">{hoveredSegment ? hoveredSegment.name : ""}</span>
                </div>
              </div>

              {/* Legend Section */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2 md:gap-3 w-full">
                {chartData.map((item, index) => {
                  return (
                    <div key={index} className="flex items-center gap-2 min-w-0">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-xs md:text-sm font-medium text-foreground flex-1 truncate">
                        {item.name}
                      </span>
                      <span className="text-xs md:text-sm text-muted-foreground">{item.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
