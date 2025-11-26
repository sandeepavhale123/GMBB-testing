import React from "react";
import { useHealthReport } from "@/api/healthApi";
import { useListingContext } from "@/context/ListingContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CircularProgress } from "../ui/circular-progress";
import {
  Camera,
  FileText,
  MessageSquare,
  RefreshCcw,
  Star,
  MapPin,
} from "lucide-react";
import { Button } from "../ui/button";
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
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { formatToDayMonthYear } from "@/utils/dateUtils";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const Health: React.FC = () => {
  const { t } = useI18nNamespace("Health/healthPage");
  const { selectedListing } = useListingContext();
  const isMobile = useIsMobile();
  const {
    data: healthData,
    loading,
    error,
    refreshHealthReport,
  } = useHealthReport(
    selectedListing?.id ? parseInt(selectedListing.id) : null
  );

  const truncateToTwoDecimals = (num: number) => {
    return Math.trunc(num * 100) / 100;
  };

  const competitors = healthData?.competitorAndCitationData || [];

  const competitorChartData = competitors.map((item, index) => ({
    index: String(index + 1), // used on X axis
    displayName: item.title,
    avgRating: item.rating?.value ? parseFloat(item.rating.value) : 0,
    reviewCount: item.rating?.votes_count ?? 0,
  }));

  const citationChartData = competitors.map((item, index) => ({
    index: String(index + 1),
    displayName: item.title,
    citationCount: item.citation ?? 0,
  }));

  if (loading)
    return <div className="text-center py-10">{t("healthPage.loading")}</div>;
  if (error)
    return (
      <div className="text-red-500 text-center py-10">
        {t("healthPage.error")}: {error}
      </div>
    );
  if (!healthData)
    return (
      <div className="text-gray-500 text-center py-10">
        {t("healthPage.noData")}
      </div>
    );
  return (
    // header area
    <div className={`flex-1 flex flex-col transition-all duration-300 bg-white shadow shadow-lg`}>
      {/* Dark Header */}
      <header className="bg-gradient-to-br from-primary via-primary/80 to-primary/60 text-white h-[370px] sm:h-[250px] z-10 relative">
        <h2
          className="text-3xl font-bold text-white"
          style={{
            marginTop: isMobile ? "60px" : "30px",
            textAlign: "center",
          }}
        >
          {t("healthPage.header.title")}
        </h2>
        <div
          className={`container mx-auto flex items-center justify-between px-4 md:px-8 ${
            isMobile ? "flex-col space-y-4" : ""
          }`}
          style={{
            paddingTop: "20px",
            paddingBottom: "50px",
          }}
        >
          {/* Left: Business Branding */}
          <div className={`flex items-center space-x-4`}>
            {healthData?.logo ? (
              <img
                src={healthData?.logo}
                alt="Business Logo"
                className={`rounded-lg object-cover ${
                  isMobile ? "w-12 h-12" : "w-16 h-16"
                }`}
              />
            ) : (
              <div
                className={`bg-white rounded-lg flex items-center justify-center ${
                  isMobile ? "w-12 h-12" : "w-16 h-16"
                }`}
              >
                <MapPin
                  className={`text-gray-900 ${
                    isMobile ? "w-6 h-6" : "w-8 h-8"
                  }`}
                />
              </div>
            )}
            <div className={`flex flex-col ${isMobile ? " space-y-1" : ""}`}>
              <h1
                className={`font-bold text-white ${
                  isMobile ? "text-base" : "text-2xl"
                }`}
              >
                {healthData?.locationName}
              </h1>
              <p
                className={`text-white flex items-center gap-2 ${
                  isMobile ? "text-xs leading-tight max-w-[280px]" : "text-lg"
                }`}
              >
                <MapPin
                  className={`${
                    isMobile ? "w-3 h-3" : "w-4 h-4"
                  } text-white/80 shrink-0`}
                />
                {healthData?.address}
              </p>
            </div>
          </div>

          {/* Center: Report Title - Hidden on mobile as it's already in the header */}

          {/* Right: Report Date */}
          <div className={`${isMobile ? "text-center" : "text-right"}`}>
            <p className="text-sm text-white">
              {t("healthPage.header.reportDate")}
            </p>
            <p className={`text-white ${isMobile ? "text-base" : "text-lg"}`}>
              {formatToDayMonthYear(new Date())}
            </p>
          </div>
        </div>
      </header>

      <main
        className="flex-1 overflow-auto relative z-40"
        style={{
          marginTop: "-100px",
        }}
      >
        {!isMobile && <div className="flex-1 text-center"></div>}
        <Button
          onClick={refreshHealthReport}
          className="bg-white hover:bg-black hover:text-white text-black fixed right-0 top-1/2 -translate-y-1/2 shadow-lg shadow-grey-500/50 flex-col p-2 z-[9999] rounded-l-md rounded-r-none hidden sm:flex"
          style={{ height: 70, width: 120 }}
        >
          <RefreshCcw className="w-5 h-5 mb-1" />
          <span className="text-xs leading-tight">
            {t("healthPage.header.refresh")}
          </span>
        </Button>
        <div className={`container mx-auto ${isMobile ? "p-4" : "p-8"}`}>
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* GMB Health Score */}
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <CircularProgress
                      value={healthData?.successScore}
                      size={80}
                      strokeWidth={8}
                      className="text-primary mb-4"
                    >
                      <span className="text-lg font-bold">
                        {healthData?.successScore}%
                      </span>
                    </CircularProgress>
                    <h3 className="font-semibold text-sm">
                      {t("healthPage.summaryCards.gmbHealthScore")}
                    </h3>
                  </div>
                </CardContent>
              </Card>

              {/* No. Of Reviews */}
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                      <MessageSquare className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {healthData?.reviews?.reply}
                      <span className="text-sm">
                        / {healthData?.reviews?.review}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm text-muted-foreground">
                      {t("healthPage.summaryCards.noOfReviews")}
                    </h3>
                  </div>
                </CardContent>
              </Card>

              {/* GMB Avg Rating */}
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mb-4">
                      <Star className="h-8 w-8 text-yellow-600" />
                    </div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {truncateToTwoDecimals(healthData?.avgRating)}
                    </div>
                    <h3 className="font-semibold text-sm text-muted-foreground">
                      {t("healthPage.summaryCards.gmbAvgRating")}
                    </h3>
                  </div>
                </CardContent>
              </Card>

              {/* No. Of GMB Photos */}
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                      <Camera className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {truncateToTwoDecimals(healthData?.gmbPhotos)}
                    </div>
                    <h3 className="font-semibold text-sm text-muted-foreground">
                      {t("healthPage.summaryCards.noOfGmbPhotos")}
                    </h3>
                  </div>
                </CardContent>
              </Card>

              {/* No. Of GMB Posts */}
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                      <FileText className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      {healthData?.totalPosts}
                    </div>
                    <h3 className="font-semibold text-sm text-muted-foreground">
                      {t("healthPage.summaryCards.noOfGmbPosts")}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Introduction Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">
                  {t("healthPage.introduction.title")}
                </h2>
                <p className="text-muted-foreground">
                  {t("healthPage.introduction.content")}
                </p>
              </CardContent>
            </Card>

            {/* GMB Report at a Glance */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  {/* Left side - Test Results Cards */}
                  <div className="space-y-4">
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {t("healthPage.gmbReportAtGlance.title")}
                      </h2>
                    </div>
                    {/* Failed Tests Card */}
                    <div className="bg-red-100 border border-red-200 rounded-lg px-6 py-3">
                      <div className="text-red-800 text-sm font-medium mb-1">
                        {t("healthPage.gmbReportAtGlance.failedTests")}
                      </div>
                      <div className="text-2xl font-bold text-red-800">
                        {healthData?.failedScore}%
                      </div>
                    </div>

                    {/* Passed Tests Card */}
                    <div className="bg-green-100 border border-green-200 rounded-lg px-6 py-3">
                      <div className="text-green-800 text-sm font-medium mb-1">
                        {t("healthPage.gmbReportAtGlance.passedTests")}
                      </div>
                      <div className="text-2xl font-bold text-green-800">
                        {healthData?.successScore} %
                      </div>
                    </div>
                  </div>

                  {/* Right side - Pie Chart */}
                  <div className="flex justify-center">
                    <div className="w-[250px] h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              {
                                name: t(
                                  "healthPage.gmbReportAtGlance.passedTests"
                                ),
                                value: healthData?.successScore || 0,
                                fill: "#22c55e",
                              },
                              {
                                name: t(
                                  "healthPage.gmbReportAtGlance.failedTests"
                                ),
                                value: healthData?.failedScore || 0,
                                fill: "#ef4444",
                              },
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            startAngle={90}
                            endAngle={450}
                          />
                          <Tooltip
                            formatter={(value) => [`${value || 0}%`, ""]}
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Breakdown */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">
                  {t("healthPage.detailedBreakdown.title")}
                </h2>

                <div className="space-y-6">
                  {Object.entries(healthData?.detailedBreakdown).map(
                    ([key, value], index) => {
                      const breakdownInfo: Record<
                        string,
                        { title: string; why: string; recommendation: string }
                      > = {
                        description: {
                          title: t(
                            "healthPage.detailedBreakdown.sections.description.title"
                          ),
                          why: t(
                            "healthPage.detailedBreakdown.sections.description.why"
                          ),
                          recommendation: t(
                            "healthPage.detailedBreakdown.sections.description.recommendation"
                          ),
                        },
                        website: {
                          title: t(
                            "healthPage.detailedBreakdown.sections.website.title"
                          ),
                          why: t(
                            "healthPage.detailedBreakdown.sections.website.why"
                          ),
                          recommendation: t(
                            "healthPage.detailedBreakdown.sections.website.recommendation"
                          ),
                        },
                        review: {
                          title: t(
                            "healthPage.detailedBreakdown.sections.review.title"
                          ),
                          why: t(
                            "healthPage.detailedBreakdown.sections.review.why"
                          ),
                          recommendation: t(
                            "healthPage.detailedBreakdown.sections.review.recommendation"
                          ),
                        },
                        rating: {
                          title: t(
                            "healthPage.detailedBreakdown.sections.rating.title"
                          ),
                          why: t(
                            "healthPage.detailedBreakdown.sections.rating.why"
                          ),
                          recommendation: t(
                            "healthPage.detailedBreakdown.sections.rating.recommendation"
                          ),
                        },
                        addCategory: {
                          title: t(
                            "healthPage.detailedBreakdown.sections.addCategory.title"
                          ),
                          why: t(
                            "healthPage.detailedBreakdown.sections.addCategory.why"
                          ),
                          recommendation: t(
                            "healthPage.detailedBreakdown.sections.addCategory.recommendation"
                          ),
                        },
                        photo: {
                          title: t(
                            "healthPage.detailedBreakdown.sections.photo.title"
                          ),
                          why: t(
                            "healthPage.detailedBreakdown.sections.photo.why"
                          ),
                          recommendation: t(
                            "healthPage.detailedBreakdown.sections.photo.recommendation"
                          ),
                        },
                        workingHrs: {
                          title: t(
                            "healthPage.detailedBreakdown.sections.workingHrs.title"
                          ),
                          why: t(
                            "healthPage.detailedBreakdown.sections.workingHrs.why"
                          ),
                          recommendation: t(
                            "healthPage.detailedBreakdown.sections.workingHrs.recommendation"
                          ),
                        },
                        attributes: {
                          title: t(
                            "healthPage.detailedBreakdown.sections.attributes.title"
                          ),
                          why: t(
                            "healthPage.detailedBreakdown.sections.attributes.why"
                          ),
                          recommendation: t(
                            "healthPage.detailedBreakdown.sections.attributes.recommendation"
                          ),
                        },
                        profile: {
                          title: t(
                            "healthPage.detailedBreakdown.sections.profile.title"
                          ),
                          why: t(
                            "healthPage.detailedBreakdown.sections.profile.why"
                          ),
                          recommendation: t(
                            "healthPage.detailedBreakdown.sections.profile.recommendation"
                          ),
                        },
                        competitor: {
                          title: t(
                            "healthPage.detailedBreakdown.sections.competitor.title"
                          ),
                          why: t(
                            "healthPage.detailedBreakdown.sections.competitor.why"
                          ),
                          recommendation: t(
                            "healthPage.detailedBreakdown.sections.competitor.recommendation"
                          ),
                        },
                        citation: {
                          title: t(
                            "healthPage.detailedBreakdown.sections.citation.title"
                          ),
                          why: t(
                            "healthPage.detailedBreakdown.sections.citation.why"
                          ),
                          recommendation: t(
                            "healthPage.detailedBreakdown.sections.citation.recommendation"
                          ),
                        },
                      };

                      const item = breakdownInfo[key] || {
                        title: key,
                        why: "No information available.",
                        recommendation: "Please update this section.",
                      };
                      return (
                        <div
                          key={index}
                          className={`border rounded-lg p-4 ${
                            value
                              ? "border-green-200 bg-green-50"
                              : "border-red-200 bg-red-50"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <Badge
                              className={
                                value
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : "bg-red-100 text-red-800 hover:bg-red-100"
                              }
                            >
                              {t("healthPage.detailedBreakdown.title")}
                            </Badge>
                            <Badge
                              className={
                                value
                                  ? "bg-green-500 text-white hover:bg-green-500"
                                  : "bg-red-500 text-white hover:bg-red-500"
                              }
                            >
                              {value
                                ? t("healthPage.detailedBreakdown.passed")
                                : t("healthPage.detailedBreakdown.failed")}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-lg mb-3">
                            {index + 1}. {item.title}
                          </h3>
                          <div className="mb-4">
                            <h4 className="font-medium mb-2">
                              {t("healthPage.detailedBreakdown.matter")}
                            </h4>
                            <p className="text-sm text-muted-foreground ml-4">
                              {item.why}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">
                              {t("healthPage.detailedBreakdown.recommendation")}
                            </h4>
                            <p className="text-sm text-muted-foreground ml-4">
                              {item.recommendation}
                            </p>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Competitor Analysis */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">
                  {t("healthPage.competitorAnalysis.title")}
                </h2>

                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-6">
                  <div className="flex items-center justify-start mb-3">
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                      {t("healthPage.competitorAnalysis.moderateImpact")}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-3">
                    {t("healthPage.competitorAnalysis.description")}
                  </h3>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">
                      {" "}
                      {t("healthPage.detailedBreakdown.matter")}
                    </h4>
                    <p className="text-sm text-muted-foreground ml-4">
                      {t("healthPage.competitorAnalysis.whyItMatters")}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">
                      {" "}
                      {t("healthPage.detailedBreakdown.recommendation")}
                    </h4>
                    <p className="text-sm text-muted-foreground ml-4">
                      {t("healthPage.competitorAnalysis.recommendation")}
                    </p>
                  </div>
                </div>

                {/* Competitor Analysis Chart */}
                <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6 shadow-sm">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {t("healthPage.competitorAnalysis.title")}
                    </h3>
                    <p className="text-gray-600">
                      {t("healthPage.competitorAnalysis.subtitle")}
                    </p>
                  </div>

                  {/* Enhanced Legend */}
                  <div className="flex justify-center items-center gap-2 sm:gap-8 mb-8 p-4 bg-gray-50 rounded-lg flex-wrap">
                    <div className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm">
                      <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm"></div>
                      <span className="text-sm font-medium text-gray-700">
                        {t("healthPage.competitorAnalysis.chart.averageRating")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm">
                      <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-sm"></div>
                      <span className="text-sm font-medium text-gray-700">
                        {t("healthPage.competitorAnalysis.chart.reviewCount")}
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Bar Chart */}
                  <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={competitorChartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="index" />
                        <YAxis yAxisId="left" domain={[0, 5]} />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          domain={[0, 100]}
                        />

                        {/* ✅ Add missing gradient definitions */}
                        <defs>
                          <linearGradient
                            id="blueGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#1d4ed8" />
                          </linearGradient>
                          <linearGradient
                            id="orangeGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop offset="0%" stopColor="#f97316" />
                            <stop offset="100%" stopColor="#ea580c" />
                          </linearGradient>
                        </defs>

                        <Tooltip
                          shared={false}
                          formatter={(value, name) => [
                            name === "avgRating"
                              ? `${value} ⭐`
                              : `${value} ${t(
                                  "healthPage.competitorAnalysis.chart.reviews"
                                )}`,
                            name === "avgRating"
                              ? t(
                                  "healthPage.competitorAnalysis.chart.tooltipRating"
                                )
                              : t(
                                  "healthPage.competitorAnalysis.chart.tooltipReviews"
                                ),
                          ]}
                          labelFormatter={(label) => {
                            const business = competitorChartData.find(
                              (b) => b.index === label
                            );
                            return business ? business.displayName : label;
                          }}
                        />

                        <Bar
                          yAxisId="left"
                          dataKey="avgRating"
                          fill="url(#blueGradient)"
                          name="avgRating"
                          radius={[2, 2, 0, 0]}
                        />
                        <Bar
                          yAxisId="right"
                          dataKey="reviewCount"
                          fill="url(#orangeGradient)"
                          name="reviewCount"
                          radius={[2, 2, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Competitor Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-green-200">
                        <th className="px-4 py-3 text-left font-semibold">#</th>
                        <th className="px-4 py-3 text-left font-semibold">
                          {t(
                            "healthPage.competitorAnalysis.table.businessName"
                          )}
                        </th>
                        <th className="px-4 py-3 text-center font-semibold">
                          {t("healthPage.competitorAnalysis.table.avgRating")}
                        </th>
                        <th className="px-4 py-3 text-center font-semibold">
                          {t("healthPage.competitorAnalysis.table.reviewCount")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {competitorChartData.map((item, idx) => {
                        const isYou = healthData?.locationName
                          .toLowerCase()
                          .includes(item.displayName.toLowerCase());

                        return (
                          <tr
                            key={item.index}
                            className={
                              isYou
                                ? "bg-green-100"
                                : idx % 2 === 0
                                ? "bg-white"
                                : "bg-gray-50"
                            }
                          >
                            <td className="px-4 py-3 font-medium">
                              {isYou
                                ? t("healthPage.competitorAnalysis.table.you")
                                : item.index}
                            </td>
                            <td className="px-4 py-3">{item.displayName}</td>
                            <td className="px-4 py-3 text-center">
                              {item.avgRating > 0 ? item.avgRating : "—"}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {item.reviewCount > 0 ? item.reviewCount : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Citation Analysis */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">
                  {" "}
                  {t("healthPage.citationAnalysis.title")}
                </h2>

                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-6">
                  <div className="flex items-center justify-start mb-3">
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                      {t("healthPage.citationAnalysis.highImpact")}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-3">
                    {t("healthPage.citationAnalysis.description")}
                  </h3>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">
                      {" "}
                      {t("healthPage.detailedBreakdown.matter")}
                    </h4>
                    <p className="text-sm text-muted-foreground ml-4">
                      {t("healthPage.citationAnalysis.whyItMatters")}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">
                      {" "}
                      {t("healthPage.detailedBreakdown.recommendation")}
                    </h4>
                    <p className="text-sm text-muted-foreground ml-4">
                      {t("healthPage.citationAnalysis.recommendation")}
                    </p>
                  </div>
                </div>

                {/* Citation Analysis Chart */}
                <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6 shadow-sm">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {t("healthPage.citationAnalysis.title")}
                    </h3>
                    <p className="text-gray-600">
                      {t("healthPage.citationAnalysis.compare")}
                    </p>
                  </div>

                  {/* Enhanced Bar Chart */}
                  <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart
                        data={citationChartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

                        <XAxis
                          dataKey="index"
                          height={60}
                          interval={0}
                          fontSize={14}
                          tick={{ fill: "#374151", fontWeight: 600 }}
                        />

                        <YAxis
                          domain={[
                            0,
                            Math.max(
                              ...citationChartData.map((d) => d.citationCount),
                              10
                            ),
                          ]}
                          tick={{ fill: "#374151", fontSize: 12 }}
                        />

                        <Tooltip
                          formatter={(value) => [
                            t("healthPage.tooltip", { value }),
                            // `${value} citations`,
                            t("healthPage.citationAnalysis.chart.tooltip"),
                          ]}
                          labelFormatter={(label) => {
                            const business = citationChartData.find(
                              (b) => b.index === label
                            );
                            return business ? business.displayName : label;
                          }}
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            width: "200px", // ✅ fixed width
                            whiteSpace: "normal",
                          }}
                        />

                        <Bar
                          dataKey="citationCount"
                          fill="url(#citationGradient)"
                          name="Citation Count"
                          radius={[2, 2, 0, 0]}
                        />

                        <defs>
                          <linearGradient
                            id="citationGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#1d4ed8" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Citation Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-green-200">
                        <th className="px-4 py-3 text-left font-semibold">#</th>
                        <th className="px-4 py-3 text-left font-semibold">
                          {t("healthPage.citationAnalysis.table.businessName")}
                        </th>
                        <th className="px-4 py-3 text-center font-semibold">
                          {t("healthPage.citationAnalysis.table.localCitation")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {/* Optional: Add your own business as "YOU" at the top */}
                      {/* <tr className="bg-green-100">
                                <td className="px-4 py-3 font-medium">YOU</td>
                                <td className="px-4 py-3">Webmarts Software Solution</td>
                                <td className="px-4 py-3 text-center">14</td>
                              </tr> */}

                      {/* Competitor rows */}
                      {citationChartData.map((item, idx) => {
                        const isYou = healthData?.locationName
                          .toLowerCase()
                          .includes(item.displayName.toLowerCase());
                        return (
                          <tr
                            key={item.index}
                            className={
                              isYou
                                ? "bg-green-100"
                                : idx % 2 === 0
                                ? "bg-white"
                                : "bg-gray-50"
                            }
                          >
                            <td className="px-4 py-3 font-medium">
                              {isYou
                                ? t("healthPage.competitorAnalysis.table.you")
                                : item.index}
                            </td>
                            <td className="px-4 py-3">{item.displayName}</td>
                            <td className="px-4 py-3 text-center">
                              {item.citationCount > 0
                                ? item.citationCount
                                : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Summary of Recommendations */}
            <Card className="bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900">
                  {t("healthPage.summaryOfRecommendations.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-600 mt-1">•</span>
                      <span>
                        {t(
                          "healthPage.summaryOfRecommendations.recommendations.0"
                        )}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-600 mt-1">•</span>
                      <span>
                        {t(
                          "healthPage.summaryOfRecommendations.recommendations.1"
                        )}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-600 mt-1">•</span>
                      <span>
                        {t(
                          "healthPage.summaryOfRecommendations.recommendations.2"
                        )}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-600 mt-1">•</span>
                      <span>
                        {t(
                          "healthPage.summaryOfRecommendations.recommendations.3"
                        )}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-600 mt-1">•</span>
                      <span>
                        {t(
                          "healthPage.summaryOfRecommendations.recommendations.4"
                        )}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-600 mt-1">•</span>
                      <span>
                        {t(
                          "healthPage.summaryOfRecommendations.recommendations.5"
                        )}
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
