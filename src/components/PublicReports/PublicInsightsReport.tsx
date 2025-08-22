import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { PublicReportDashboardLayout } from "./PublicReportDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Globe,
  MapPin,
  Phone,
  Monitor,
  Smartphone,
  MessageSquare,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { usePerformanceInsightsReport } from "@/hooks/useReports";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatToDayMonthYear } from "@/utils/dateUtils";
import { usePublicReportTheme } from "@/hooks/usePublicReportTheme";

export const PublicInsightsReport: React.FC = () => {
  // Extract reportId from URL
  const reportId = window.location.pathname.split("/").pop() || "";
  const isMobile = useIsMobile(1281);

  // Load theme for public report
  usePublicReportTheme();

  // Fetch performance insights data using the hook
  const {
    data: insightData,
    isLoading,
    error,
  } = usePerformanceInsightsReport(reportId);
  // const { token } = useParams();
  const reportType = insightData?.data?.reportType.toLowerCase();
  // console.log("reportType is", reportType);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">
            Loading insights report...
          </p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error Loading Report</div>
          <p className="text-muted-foreground mb-4">
            Failed to load the performance insights report. Please try again
            later.
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const chartConfig = {
    search: { label: "Search", color: "hsl(210 100% 55%)" },
    map: { label: "Map", color: "hsl(160 85% 50%)" },
    website: { label: "Website", color: "hsl(25 95% 55%)" },
    direction: { label: "Direction", color: "hsl(340 100% 55%)" },
    call: { label: "Call", color: "hsl(260 85% 55%)" },
    message: { label: "Message", color: "hsl(195 90% 50%)" },
  };

  const renderSummaryCard = (
    title: string,
    currentValue: number,
    previousValue: number,
    change: number,
    icon: React.ReactNode,
    bgColor: string,
    iconColor: string
  ) => (
    <Card>
      <CardContent className="p-4 text-center">
        <div
          className={`flex items-center justify-center w-10 h-10 ${bgColor} rounded-lg mx-auto mb-2`}
        >
          <div className={iconColor}>{icon}</div>
        </div>
        <div className="text-2xl font-bold">
          {currentValue.toLocaleString()}
        </div>
        {reportType === "compare" && (
          <div className="mt-1">
            <div
              className={`text-sm ${
                change >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {change >= 0 ? "+" : ""}
              {change.toFixed(1)}% vs previous
            </div>
          </div>
        )}
        <div className="text-sm text-muted-foreground">{title}</div>
      </CardContent>
    </Card>
  );

  // Extract visible sections from API response
  const visibleSections = Object.entries(insightData?.data.visibleSection || {})
    .filter(([_, value]) => value === "1")
    .map(([key]) => key);

  // colors for pie chart
  const donutChartColorMap: Record<string, string> = {
    "Desktop Search": "hsl(220 100% 60%)",
    "Mobile Search": "hsl(142 76% 60%)",
    "Desktop Map": "hsl(47 96% 60%)",
    "Mobile Map": "hsl(280 100% 60%)",
  };

  const prepareDonutChartData = (
    donutChart: { label: string; value: number }[]
  ) => {
    const total = donutChart.reduce((sum, item) => sum + item.value, 0);
    return donutChart.map((item) => ({
      name: item.label,
      count: item.value,
      value: total ? Math.round((item.value / total) * 100) : 0,
      fill: donutChartColorMap[item.label] || "#ccc",
    }));
  };

  return (
    <PublicReportDashboardLayout
      title="Business Insights Report"
      listingName={insightData?.data.locationName}
      logo={insightData?.data.companyLogo}
      address={insightData?.data.address}
      date={insightData?.data?.reportDate}
      visibleSections={visibleSections}
      token={reportId}
      compareDate={insightData?.data?.compareDate}
    >
      <div className="space-y-6">
        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {renderSummaryCard(
            "Website Visits",
            insightData?.data?.periodOne?.summary?.website,
            insightData?.data?.periodTwo?.summary?.website,
            insightData?.data?.changeSummary?.website,
            <Globe className="h-5 w-5" />,
            "bg-blue-50",
            "text-blue-600"
          )}
          {renderSummaryCard(
            "Direction Requests",
            insightData?.data?.periodOne?.summary?.direction,
            insightData?.data?.periodTwo?.summary?.direction,
            insightData?.data?.changeSummary?.direction,
            <MapPin className="h-5 w-5" />,
            "bg-green-50",
            "text-green-600"
          )}
          {renderSummaryCard(
            "Phone Calls",
            insightData?.data?.periodOne?.summary?.calls,
            insightData?.data?.periodTwo?.summary?.calls,
            insightData?.data?.changeSummary?.calls,
            <Phone className="h-5 w-5" />,
            "bg-purple-50",
            "text-purple-600"
          )}
          {renderSummaryCard(
            "Messages",
            insightData?.data?.periodOne?.summary?.messages,
            insightData?.data?.periodTwo?.summary?.messages,
            insightData?.data?.changeSummary?.messages,
            <MessageSquare className="h-5 w-5" />,
            "bg-orange-50",
            "text-orange-600"
          )}
          {renderSummaryCard(
            "Desktop Search",
            insightData?.data?.periodOne?.summary?.desk_search,
            insightData?.data?.periodTwo?.summary?.desk_search,
            insightData?.data?.changeSummary?.desk_search,
            <Monitor className="h-5 w-5" />,
            "bg-indigo-50",
            "text-indigo-600"
          )}
          {renderSummaryCard(
            "Desktop Map",
            insightData?.data?.periodOne?.summary?.desk_map,
            insightData?.data?.periodTwo?.summary?.desk_map,
            insightData?.data?.changeSummary?.desk_map,
            <Monitor className="h-5 w-5" />,
            "bg-teal-50",
            "text-teal-600"
          )}
          {renderSummaryCard(
            "Mobile Search",
            insightData?.data?.periodOne?.summary?.mob_search,
            insightData?.data?.periodTwo?.summary?.mob_search,
            insightData?.data?.changeSummary?.mob_search,
            <Smartphone className="h-5 w-5" />,
            "bg-pink-50",
            "text-pink-600"
          )}
          {renderSummaryCard(
            "Mobile Map",
            insightData?.data?.periodOne?.summary?.mob_map,
            insightData?.data?.periodTwo?.summary?.mob_map,
            insightData?.data?.changeSummary?.mob_map,
            <Smartphone className="h-5 w-5" />,
            "bg-yellow-50",
            "text-yellow-600"
          )}
        </div>

        {/* Charts Section */}
        <div
          className={`grid gap-6 ${
            reportType === "compare"
              ? "grid-cols-1"
              : "grid-cols-1 lg:grid-cols-2"
          }`}
        >
          {/* How Customers Search Doughnut Chart */}
          {reportType === "compare" ? (
            <div
              className={`grid gap-6 ${
                isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
              }`}
            >
              {/* Period 1 Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">
                    How Customers Search For Your Business
                  </CardTitle>
                  <p className="text-sm text-muted-foreground text-center">
                    {formatToDayMonthYear(
                      insightData?.data?.periodOne?.date?.from_date
                    )}{" "}
                    -{" "}
                    {formatToDayMonthYear(
                      insightData?.data?.periodOne?.date?.to_date
                    )}
                  </p>
                </CardHeader>
                <CardContent className={isMobile ? "flex justify-center" : ""}>
                  <ChartContainer
                    config={{}}
                    className={`${
                      isMobile ? "h-[250px] w-[250px]" : "h-[300px]"
                    }`}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={prepareDonutChartData(
                            insightData?.data?.periodOne?.donut_chart || []
                          )}
                          cx="50%"
                          cy="50%"
                          innerRadius={isMobile ? 45 : 60}
                          outerRadius={isMobile ? 75 : 100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {prepareDonutChartData(
                            insightData?.data?.periodOne?.donut_chart || []
                          ).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="h-3 w-3 rounded-full"
                                      style={{ backgroundColor: data.fill }}
                                    />
                                    <span className="font-medium">
                                      {data.name}
                                    </span>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {data.count.toLocaleString()} ({data.value}
                                    %)
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          width={450}
                          wrapperStyle={isMobile ? { left: -80 } : { left: 50 }}
                          formatter={(value, entry) => (
                            <span style={{ color: entry.color }}>{value}</span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Period 2 Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">
                    How Customers Search For Your Business
                  </CardTitle>
                  <p className="text-sm text-muted-foreground text-center">
                    {formatToDayMonthYear(
                      insightData?.data?.periodTwo?.date?.from_date
                    )}{" "}
                    -{" "}
                    {formatToDayMonthYear(
                      insightData?.data?.periodTwo?.date?.to_date
                    )}
                  </p>
                </CardHeader>
                <CardContent className={isMobile ? "flex justify-center" : ""}>
                  <ChartContainer
                    config={{}}
                    className={`${
                      isMobile ? "h-[250px] w-[250px]" : "h-[300px]"
                    }`}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={prepareDonutChartData(
                            insightData?.data?.periodTwo?.donut_chart || []
                          )}
                          cx="50%"
                          cy="50%"
                          innerRadius={isMobile ? 45 : 60}
                          outerRadius={isMobile ? 75 : 100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {prepareDonutChartData(
                            insightData?.data?.periodTwo?.donut_chart || []
                          ).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="h-3 w-3 rounded-full"
                                      style={{ backgroundColor: data.fill }}
                                    />
                                    <span className="font-medium">
                                      {data.name}
                                    </span>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {data.count.toLocaleString()} ({data.value}
                                    %)
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          width={450}
                          wrapperStyle={isMobile ? { left: -80 } : { left: 50 }}
                          formatter={(value, entry) => (
                            <span style={{ color: entry.color }}>{value}</span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>How Customers Search For Your Business</CardTitle>
              </CardHeader>
              <CardContent className={isMobile ? "flex justify-center" : ""}>
                <ChartContainer
                  config={{}}
                  className={`${
                    isMobile ? "h-[250px] w-[250px]" : "h-[300px]"
                  }`}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepareDonutChartData(
                          insightData?.data?.periodOne?.donut_chart || []
                        )}
                        cx="50%"
                        cy="50%"
                        innerRadius={isMobile ? 45 : 60}
                        outerRadius={isMobile ? 75 : 100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {prepareDonutChartData(
                          insightData?.data?.periodOne?.donut_chart || []
                        ).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="h-3 w-3 rounded-full"
                                    style={{ backgroundColor: data.fill }}
                                  />
                                  <span className="font-medium">
                                    {data.name}
                                  </span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {data.count.toLocaleString()} ({data.value}%)
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={60}
                        wrapperStyle={{
                          textAlign: "center",
                          display: "flex",
                          justifyContent: "center",
                          flexWrap: "wrap",
                          paddingTop: "1rem",
                        }}
                        formatter={(value, entry) => (
                          <span style={{ color: entry.color }}>{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          )}

          {/* Listing Views & Clicks Chart */}
          {reportType === "compare" ? (
            <div
              className={`grid gap-6 ${
                isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
              }`}
            >
              {/* Period 1 Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">
                    Listing Views & Clicks
                  </CardTitle>
                  <p className="text-sm text-muted-foreground text-center">
                    {formatToDayMonthYear(
                      insightData?.data?.periodOne?.date?.from_date
                    )}{" "}
                    -
                    {formatToDayMonthYear(
                      insightData?.data?.periodOne?.date?.to_date
                    )}
                  </p>
                </CardHeader>
                <CardContent
                  className={
                    isMobile ? "flex justify-center overflow-x-auto" : ""
                  }
                >
                  <ChartContainer
                    config={chartConfig}
                    className={`${
                      isMobile ? "h-[250px] min-w-[350px]" : "h-[300px]"
                    }`}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={insightData?.data?.periodOne?.bar_chart || []}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="label"
                          fontSize={isMobile ? 10 : 12}
                          interval={isMobile ? 1 : 0}
                        />
                        <YAxis fontSize={isMobile ? 10 : 12} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend fontSize={isMobile ? 10 : 12} />
                        {Object.keys(chartConfig).map((key) => (
                          <Bar
                            key={key}
                            dataKey={key}
                            fill={chartConfig[key].color}
                            name={chartConfig[key].label}
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Period 2 Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">
                    Listing Views & Clicks
                  </CardTitle>
                  <p className="text-sm text-muted-foreground text-center">
                    {formatToDayMonthYear(
                      insightData?.data?.periodTwo?.date?.from_date
                    )}{" "}
                    -{" "}
                    {formatToDayMonthYear(
                      insightData?.data?.periodTwo?.date?.to_date
                    )}
                  </p>
                </CardHeader>
                <CardContent
                  className={
                    isMobile ? "flex justify-center overflow-x-auto" : ""
                  }
                >
                  <ChartContainer
                    config={chartConfig}
                    className={`${
                      isMobile ? "h-[250px] min-w-[350px]" : "h-[300px]"
                    }`}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={insightData?.data?.periodTwo?.bar_chart || []}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="label"
                          fontSize={isMobile ? 10 : 12}
                          interval={isMobile ? 1 : 0}
                          angle={-45} // tilt 45 degrees
                          textAnchor="end"
                        />
                        <YAxis fontSize={isMobile ? 10 : 12} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend
                          fontSize={isMobile ? 10 : 12}
                          wrapperStyle={{
                            paddingTop: "3.5rem",
                          }}
                        />
                        {Object.keys(chartConfig).map((key) => (
                          <Bar
                            key={key}
                            dataKey={key}
                            fill={chartConfig[key].color}
                            name={chartConfig[key].label}
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Listing Views & Clicks</CardTitle>
              </CardHeader>
              <CardContent
                className={
                  isMobile ? "flex justify-center overflow-x-auto" : ""
                }
              >
                <ChartContainer
                  config={chartConfig}
                  className={`${
                    isMobile ? "h-[250px] min-w-[350px]" : "h-[300px]"
                  }`}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={insightData?.data?.periodOne?.bar_chart || []}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="label"
                        fontSize={isMobile ? 10 : 12}
                        interval={isMobile ? 1 : 0}
                      />
                      <YAxis fontSize={isMobile ? 10 : 12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend fontSize={isMobile ? 10 : 12} />
                      {Object.keys(chartConfig).map((key) => (
                        <Bar
                          key={key}
                          dataKey={key}
                          fill={chartConfig[key].color}
                          name={chartConfig[key].label}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PublicReportDashboardLayout>
  );
};
