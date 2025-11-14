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
import { applyStoredTheme } from "@/utils/themeUtils";
import { usePublicI18n } from "@/hooks/usePublicI18n";

export const namespaces = ["PublicReports/publicInsightsReport"];

export const PublicInsightsReport: React.FC = () => {
  // Extract reportId from URL
  const reportId = window.location.pathname.split("/").pop() || "";
  const isMobile = useIsMobile(1281);
  const { t, loaded, languageFullName } = usePublicI18n(namespaces);

  // State for donut chart visibility
  const [visibleDonutSegments, setVisibleDonutSegments] = useState<
    Record<string, boolean>
  >({
    "Desktop Search": true,
    "Mobile Search": true,
    "Desktop Map": true,
    "Mobile Map": true,
  });

  // State for bar chart visibility
  const [visibleBarSegments, setVisibleBarSegments] = useState<
    Record<string, boolean>
  >({
    search: true,
    map: true,
    website: true,
    direction: true,
    call: true,
    message: true,
  });

  const toggleDonutSegment = (segmentName: string) => {
    setVisibleDonutSegments((prev) => ({
      ...prev,
      [segmentName]: !prev[segmentName],
    }));
  };

  const toggleBarSegment = (segmentName: string) => {
    setVisibleBarSegments((prev) => ({
      ...prev,
      [segmentName]: !prev[segmentName],
    }));
  };

  // Load theme for public report
  React.useEffect(() => {
    applyStoredTheme();
  }, []);

  // Fetch performance insights data using the hook
  const {
    data: insightData,
    isLoading,
    error,
  } = usePerformanceInsightsReport(reportId, languageFullName);
  // const { token } = useParams();
  const reportType = insightData?.data?.reportType.toLowerCase();

  // Handle loading state
  if (isLoading || !loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">
            {t("publicInsightsReport.loading.message")}
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
          <div className="text-red-500 text-xl mb-4">
            {t("publicInsightsReport.error.title")}
          </div>
          <p className="text-muted-foreground mb-4">
            {t("publicInsightsReport.error.description")}
          </p>
          <Button onClick={() => window.location.reload()}>
            {t("publicInsightsReport.error.retry")}
          </Button>
        </div>
      </div>
    );
  }

  const chartConfig = {
    search: {
      label: t("publicInsightsReport.chartLabels.search"),
      color: "hsl(210 100% 55%)",
    },
    map: {
      label: t("publicInsightsReport.chartLabels.map"),
      color: "hsl(160 85% 50%)",
    },
    website: {
      label: t("publicInsightsReport.chartLabels.website"),
      color: "hsl(25 95% 55%)",
    },
    direction: {
      label: t("publicInsightsReport.chartLabels.direction"),
      color: "hsl(340 100% 55%)",
    },
    call: {
      label: t("publicInsightsReport.chartLabels.call"),
      color: "hsl(260 85% 55%)",
    },
    message: {
      label: t("publicInsightsReport.chartLabels.message"),
      color: "hsl(195 90% 50%)",
    },
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

  const donutLabelTranslation = {
    "Desktop Search": t("publicInsightsReport.donutLabels.desktopSearch"),
    "Mobile Search": t("publicInsightsReport.donutLabels.mobileSearch"),
    "Desktop Map": t("publicInsightsReport.donutLabels.desktopMap"),
    "Mobile Map": t("publicInsightsReport.donutLabels.mobileMap"),
  };
  const prepareDonutChartData = (
    donutChart: { label: string; value: number }[]
  ) => {
    const total = donutChart.reduce((sum, item) => sum + item.value, 0);
    return donutChart
      .filter((item) => visibleDonutSegments[item.label])
      .map((item) => ({
        name: item.label,
        count: item.value,
        value: total ? Math.round((item.value / total) * 100) : 0,
        fill: donutChartColorMap[item.label] || "#ccc",
      }));
  };

  // const renderCustomDonutLegend = () => {
  //   const segments = [
  //     {
  //       name: t("publicInsightsReport.donutLabels.desktopSearch"),
  //       color: "hsl(220 100% 60%)",
  //     },
  //     {
  //       name: t("publicInsightsReport.donutLabels.mobileSearch"),
  //       color: "hsl(142 76% 60%)",
  //     },
  //     {
  //       name: t("publicInsightsReport.donutLabels.desktopMap"),
  //       color: "hsl(47 96% 60%)",
  //     },
  //     {
  //       name: t("publicInsightsReport.donutLabels.mobileMap"),
  //       color: "hsl(280 100% 60%)",
  //     },
  //   ];

  //   return (
  //     <div className="flex justify-center flex-wrap gap-4 pt-4">
  //       {segments.map((segment) => (
  //         <button
  //           key={segment.name}
  //           onClick={() => toggleDonutSegment(segment.name)}
  //           className={`flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80 ${
  //             !visibleDonutSegments[segment.name] ? "opacity-50" : ""
  //           }`}
  //           aria-pressed={visibleDonutSegments[segment.name]}
  //           title={`${visibleDonutSegments[segment.name] ? "Hide" : "Show"} ${
  //             segment.name
  //           }`}
  //           style={{ fontSize: isMobile ? "12px" : "14px" }}
  //         >
  //           <div
  //             className="w-3 h-3 rounded"
  //             style={{ backgroundColor: segment.color }}
  //           />
  //           <span
  //             className={
  //               visibleDonutSegments[segment.name] ? "" : "line-through"
  //             }
  //             style={{ color: segment.color }}
  //           >
  //             {segment.name}
  //           </span>
  //         </button>
  //       ))}
  //     </div>
  //   );
  // };

  const renderCustomDonutLegend = () => {
    const segments = [
      {
        key: "Desktop Search",
        label: t("publicInsightsReport.donutLabels.desktopSearch"),
        color: "hsl(220 100% 60%)",
      },
      {
        key: "Mobile Search",
        label: t("publicInsightsReport.donutLabels.mobileSearch"),
        color: "hsl(142 76% 60%)",
      },
      {
        key: "Desktop Map",
        label: t("publicInsightsReport.donutLabels.desktopMap"),
        color: "hsl(47 96% 60%)",
      },
      {
        key: "Mobile Map",
        label: t("publicInsightsReport.donutLabels.mobileMap"),
        color: "hsl(280 100% 60%)",
      },
    ];

    return (
      <div className="flex justify-center flex-wrap gap-4 pt-4">
        {segments.map((segment) => (
          <button
            key={segment.key}
            onClick={() => toggleDonutSegment(segment.key)}
            className={`flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80 ${
              !visibleDonutSegments[segment.key] ? "opacity-50" : ""
            }`}
            aria-pressed={visibleDonutSegments[segment.key]}
            title={`${visibleDonutSegments[segment.key] ? "Hide" : "Show"} ${
              segment.label
            }`}
            style={{ fontSize: isMobile ? "12px" : "14px" }}
          >
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: segment.color }}
            />
            <span
              className={
                visibleDonutSegments[segment.key] ? "" : "line-through"
              }
              style={{ color: segment.color }}
            >
              {segment.label}
            </span>
          </button>
        ))}
      </div>
    );
  };

  const renderCustomBarLegend = () => {
    const segments = [
      {
        key: "search",
        label: t("publicInsightsReport.chartLabels.search"),
        color: "hsl(210 100% 55%)",
      },
      {
        key: "map",
        label: t("publicInsightsReport.chartLabels.map"),
        color: "hsl(160 85% 50%)",
      },
      {
        key: "website",
        label: t("publicInsightsReport.chartLabels.website"),
        color: "hsl(25 95% 55%)",
      },
      {
        key: "direction",
        label: t("publicInsightsReport.chartLabels.direction"),
        color: "hsl(340 100% 55%)",
      },
      {
        key: "call",
        label: t("publicInsightsReport.chartLabels.call"),
        color: "hsl(260 85% 55%)",
      },
      {
        key: "message",
        label: t("publicInsightsReport.chartLabels.message"),
        color: "hsl(195 90% 50%)",
      },
    ];

    return (
      <div className="flex justify-center flex-wrap gap-4 pt-4">
        {segments.map((segment) => (
          <button
            key={segment.key}
            onClick={() => toggleBarSegment(segment.key)}
            className={`flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80 ${
              !visibleBarSegments[segment.key] ? "opacity-50" : ""
            }`}
            aria-pressed={visibleBarSegments[segment.key]}
            title={`${visibleBarSegments[segment.key] ? "Hide" : "Show"} ${
              segment.label
            }`}
            style={{ fontSize: isMobile ? "10px" : "12px" }}
          >
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: segment.color }}
            />
            <span
              className={visibleBarSegments[segment.key] ? "" : "line-through"}
              style={{ color: segment.color }}
            >
              {segment.label}
            </span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <PublicReportDashboardLayout
      title={t("publicInsightsReport.title")}
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
            t("publicInsightsReport.summaryCards.website"),
            insightData?.data?.periodOne?.summary?.website,
            insightData?.data?.periodTwo?.summary?.website,
            insightData?.data?.changeSummary?.website,
            <Globe className="h-5 w-5" />,
            "bg-blue-50",
            "text-blue-600"
          )}
          {renderSummaryCard(
            t("publicInsightsReport.summaryCards.direction"),
            insightData?.data?.periodOne?.summary?.direction,
            insightData?.data?.periodTwo?.summary?.direction,
            insightData?.data?.changeSummary?.direction,
            <MapPin className="h-5 w-5" />,
            "bg-green-50",
            "text-green-600"
          )}
          {renderSummaryCard(
            t("publicInsightsReport.summaryCards.calls"),
            insightData?.data?.periodOne?.summary?.calls,
            insightData?.data?.periodTwo?.summary?.calls,
            insightData?.data?.changeSummary?.calls,
            <Phone className="h-5 w-5" />,
            "bg-purple-50",
            "text-purple-600"
          )}
          {renderSummaryCard(
            t("publicInsightsReport.summaryCards.messages"),
            insightData?.data?.periodOne?.summary?.messages,
            insightData?.data?.periodTwo?.summary?.messages,
            insightData?.data?.changeSummary?.messages,
            <MessageSquare className="h-5 w-5" />,
            "bg-orange-50",
            "text-orange-600"
          )}
          {renderSummaryCard(
            t("publicInsightsReport.summaryCards.desktopSearch"),
            insightData?.data?.periodOne?.summary?.desk_search,
            insightData?.data?.periodTwo?.summary?.desk_search,
            insightData?.data?.changeSummary?.desk_search,
            <Monitor className="h-5 w-5" />,
            "bg-indigo-50",
            "text-indigo-600"
          )}
          {renderSummaryCard(
            t("publicInsightsReport.summaryCards.desktopMap"),
            insightData?.data?.periodOne?.summary?.desk_map,
            insightData?.data?.periodTwo?.summary?.desk_map,
            insightData?.data?.changeSummary?.desk_map,
            <Monitor className="h-5 w-5" />,
            "bg-teal-50",
            "text-teal-600"
          )}
          {renderSummaryCard(
            t("publicInsightsReport.summaryCards.mobileSearch"),
            insightData?.data?.periodOne?.summary?.mob_search,
            insightData?.data?.periodTwo?.summary?.mob_search,
            insightData?.data?.changeSummary?.mob_search,
            <Smartphone className="h-5 w-5" />,
            "bg-pink-50",
            "text-pink-600"
          )}
          {renderSummaryCard(
            t("publicInsightsReport.summaryCards.mobileMap"),
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
                    {t("publicInsightsReport.charts.customerSearch")}
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
                                      {donutLabelTranslation[data.name] ||
                                        data.name}
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
                        {/* <Legend
                          verticalAlign="bottom"
                          align="center"
                          wrapperStyle={{
                            display: "flex",
                            justifyContent: "center",
                            flexWrap: "wrap",
                            paddingTop: "1rem",
                            fontSize: isMobile ? "12px" : "14px",
                            lineHeight: "20px",
                            textAlign: "center",
                          }}
                          formatter={(value, entry) => (
                            <span style={{ color: entry.color }}>{value}</span>
                          )}
                        /> */}
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  {renderCustomDonutLegend()}
                </CardContent>
              </Card>

              {/* Period 2 Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">
                    {t("publicInsightsReport.charts.customerSearch")}
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
                                      {donutLabelTranslation[data.name] ||
                                        data.name}
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
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  {renderCustomDonutLegend()}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("publicInsightsReport.charts.customerSearch")}
                </CardTitle>
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
                                    {donutLabelTranslation[data.name] ||
                                      data.name}
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
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                {renderCustomDonutLegend()}
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
                    {t("publicInsightsReport.charts.listingViewsClicks")}
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
                          angle={
                            (insightData?.data?.periodOne?.bar_chart?.length ||
                              0) > 6
                              ? -45
                              : 0
                          }
                          textAnchor={
                            (insightData?.data?.periodOne?.bar_chart?.length ||
                              0) > 6
                              ? "end"
                              : "middle"
                          }
                        />
                        <YAxis fontSize={isMobile ? 10 : 12} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        {Object.keys(chartConfig)
                          .filter((key) => visibleBarSegments[key])
                          .map((key) => (
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
                  {renderCustomBarLegend()}
                </CardContent>
              </Card>

              {/* Period 2 Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">
                    {t("publicInsightsReport.charts.listingViewsClicks")}
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
                          angle={
                            (insightData?.data?.periodTwo?.bar_chart?.length ||
                              0) > 6
                              ? -45
                              : 0
                          }
                          textAnchor={
                            (insightData?.data?.periodTwo?.bar_chart?.length ||
                              0) > 6
                              ? "end"
                              : "middle"
                          }
                        />
                        <YAxis fontSize={isMobile ? 10 : 12} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        {Object.keys(chartConfig)
                          .filter((key) => visibleBarSegments[key])
                          .map((key) => (
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
                  {renderCustomBarLegend()}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>
                  {" "}
                  {t("publicInsightsReport.charts.listingViewsClicks")}
                </CardTitle>
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
                        angle={
                          (insightData?.data?.periodOne?.bar_chart?.length ||
                            0) > 6
                            ? -45
                            : 0
                        }
                        textAnchor={
                          (insightData?.data?.periodOne?.bar_chart?.length ||
                            0) > 6
                            ? "end"
                            : "middle"
                        }
                      />
                      <YAxis fontSize={isMobile ? 10 : 12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      {Object.keys(chartConfig)
                        .filter((key) => visibleBarSegments[key])
                        .map((key) => (
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
                {renderCustomBarLegend()}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PublicReportDashboardLayout>
  );
};
