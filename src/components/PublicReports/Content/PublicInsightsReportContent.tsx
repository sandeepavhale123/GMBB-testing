import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { usePerformanceInsightsReport } from "@/hooks/useReports";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatToDayMonthYear } from "@/utils/dateUtils";
import {
  Eye,
  MapPin,
  Phone,
  MessageSquare,
  Navigation,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export const PublicInsightsReportContent: React.FC = () => {
  const { token } = useParams();
  const reportId = token || "";
  const isMobile = useIsMobile(1281);

  // Fetch performance insights data using the hook
  const {
    data: insightData,
    isLoading,
    error,
  } = usePerformanceInsightsReport(reportId);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading insights data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div>Error loading insights report</div>
      </div>
    );
  }

  const reportType = insightData?.data?.reportType?.toLowerCase() || "individual";

  // Chart configuration
  const chartConfig = {
    views: { color: "#2563eb" },
    clicks: { color: "#dc2626" },
    calls: { color: "#16a34a" },
    directions: { color: "#ca8a04" },
    messages: { color: "#9333ea" },
  };

  const renderSummaryCard = (
    title: string,
    value: number,
    previousValue?: number,
    icon?: React.ReactNode,
    color: string = "blue"
  ) => {
    const changePercentage = previousValue 
      ? ((value - previousValue) / previousValue) * 100 
      : 0;
    const isPositive = changePercentage >= 0;

    return (
      <Card>
        <CardContent className="p-4 text-center">
          <div className={`flex items-center justify-center w-10 h-10 bg-${color}-50 rounded-lg mx-auto mb-2`}>
            {icon}
          </div>
          <div className="text-2xl font-bold">{value}</div>
          {reportType === "compare" && previousValue !== undefined && (
            <div className="mt-1">
              <div
                className={`flex items-center justify-center gap-1 text-xs ${
                  isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {isPositive ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                <span>{Math.abs(changePercentage).toFixed(1)}% vs previous</span>
              </div>
            </div>
          )}
          <div className="text-sm text-muted-foreground">{title}</div>
        </CardContent>
      </Card>
    );
  };

  const prepareDonutChartData = (data: Record<string, number>, colors: string[]) => {
    return Object.entries(data).map(([key, value], index) => ({
      name: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      value,
      fill: colors[index % colors.length],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {renderSummaryCard(
          "Website Visits",
          insightData?.data?.periodOne?.summary?.website || 0,
          insightData?.data?.periodTwo?.summary?.website,
          <Eye className="h-5 w-5 text-blue-600" />,
          "blue"
        )}
        {renderSummaryCard(
          "Direction Requests",
          insightData?.data?.periodOne?.summary?.direction || 0,
          insightData?.data?.periodTwo?.summary?.direction,
          <Navigation className="h-5 w-5 text-green-600" />,
          "green"
        )}
        {renderSummaryCard(
          "Phone Calls",
          insightData?.data?.periodOne?.summary?.call || 0,
          insightData?.data?.periodTwo?.summary?.call,
          <Phone className="h-5 w-5 text-yellow-600" />,
          "yellow"
        )}
        {renderSummaryCard(
          "Messages",
          insightData?.data?.periodOne?.summary?.message || 0,
          insightData?.data?.periodTwo?.summary?.message,
          <MessageSquare className="h-5 w-5 text-purple-600" />,
          "purple"
        )}
        {renderSummaryCard(
          "Map Views",
          insightData?.data?.periodOne?.summary?.listing_views_maps || 0,
          insightData?.data?.periodTwo?.summary?.listing_views_maps,
          <MapPin className="h-5 w-5 text-red-600" />,
          "red"
        )}
      </div>

      {/* How Customers Search For Your Business */}
      <Card>
        <CardHeader>
          <CardTitle>How Customers Search For Your Business</CardTitle>
        </CardHeader>
        <CardContent>
          {reportType === "individual" ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepareDonutChartData(
                      insightData?.data?.periodOne?.search_breakdown || {},
                      ["#2563eb", "#dc2626", "#16a34a", "#ca8a04", "#9333ea"]
                    )}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    dataKey="value"
                  >
                    {prepareDonutChartData(
                      insightData?.data?.periodOne?.search_breakdown || {},
                      ["#2563eb", "#dc2626", "#16a34a", "#ca8a04", "#9333ea"]
                    ).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-6`}>
              <div>
                <h3 className="text-lg font-semibold mb-4">Current Period</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepareDonutChartData(
                          insightData?.data?.periodOne?.search_breakdown || {},
                          ["#2563eb", "#dc2626", "#16a34a", "#ca8a04", "#9333ea"]
                        )}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {prepareDonutChartData(
                          insightData?.data?.periodOne?.search_breakdown || {},
                          ["#2563eb", "#dc2626", "#16a34a", "#ca8a04", "#9333ea"]
                        ).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Previous Period</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepareDonutChartData(
                          insightData?.data?.periodTwo?.search_breakdown || {},
                          ["#2563eb", "#dc2626", "#16a34a", "#ca8a04", "#9333ea"]
                        )}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {prepareDonutChartData(
                          insightData?.data?.periodTwo?.search_breakdown || {},
                          ["#2563eb", "#dc2626", "#16a34a", "#ca8a04", "#9333ea"]
                        ).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};