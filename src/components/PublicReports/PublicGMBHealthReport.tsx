import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { PublicReportDashboardLayout } from "./PublicReportDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CircularProgress } from "@/components/ui/circular-progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePublicI18n } from "@/hooks/usePublicI18n";
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
import {
  Heart,
  CheckCircle,
  AlertCircle,
  XCircle,
  Star,
  MessageSquare,
  Camera,
  FileText,
  Loader2,
} from "lucide-react";
import { usePerformanceHealthReport } from "@/hooks/useReports";
import { applyStoredTheme } from "@/utils/themeUtils";
import i18n from "@/i18n";

export const namespaces = ["PublicReports/publicGMBHealthReport"];

export const PublicGMBHealthReport: React.FC = () => {
  const { t, loaded, languageFullName } = usePublicI18n(namespaces);
  const { token } = useParams();
  const location = useLocation();
  const params = useParams();
  const isPublicLayout = location.pathname.startsWith("/gmb-health");
  const reportId = isPublicLayout ? params.reportId : undefined;

  // Load theme for public report
  React.useEffect(() => {
    applyStoredTheme();
  }, []);

  const {
    data: publichealthData,
    isLoading,
    error,
    refetch,
  } = usePerformanceHealthReport(reportId || "", languageFullName);

  const [breakdownSort, setBreakdownSort] = useState<
    "default" | "failed-first" | "passed-first"
  >("default");

  const truncateToTwoDecimals = (num: number) => {
    return Math.trunc(num * 100) / 100;
  };
  // Extract visible sections from API response
  const visibleSections = Object.entries(
    publichealthData?.data?.visibleSection || {}
  )
    .filter(([_, value]) => value === "1")
    .map(([key]) => key);

  // Handle loading state
  if (isLoading || !loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">{t("loading.report")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-destructive mb-4">
              <AlertCircle className="w-12 h-12 mx-auto mb-2" />
              <h2 className="text-xl font-semibold">{t("error.title")}</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              {t("error.message", { token })}
              {/* Unable to load the GMB health report with ID: {token} */}
            </p>
            <div className="space-x-4">
              <button
                onClick={() => refetch()}
                className="bg-primary text-primary-foreground px-4 py-2 rounded"
              >
                {t("error.retry")}
              </button>
              <button
                onClick={() => window.history.back()}
                className="bg-secondary text-secondary-foreground px-4 py-2 rounded"
              >
                {t("error.goBack")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!publichealthData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">
              {t("notFound.title")}
            </h2>
            <p className="text-muted-foreground mb-4">
              {t("notFound.message")}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {t("notFound.reportId", { token })}
              {/* Report ID: {token} */}
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded"
            >
              {t("notFound.goBack")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const competitors = publichealthData?.data.competitorAndCitationData || [];

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

  const getStatusBg = (status: string) => {
    switch (status) {
      case "complete":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };
  const getSectionStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-600";
      case "good":
        return "text-blue-600";
      case "warning":
        return "text-yellow-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <PublicReportDashboardLayout
      title={t("header")}
      listingName={publichealthData?.data?.locationName}
      address={publichealthData?.data?.address}
      date={publichealthData?.data?.reportDate}
      logo={publichealthData?.data?.companyLogo}
      visibleSections={visibleSections}
      token={reportId}
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 w-full md:grid-cols-5 gap-4">
          {/* GMB Health Score */}
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <CircularProgress
                  value={publichealthData?.data?.successScore}
                  size={80}
                  strokeWidth={8}
                  className="text-primary mb-4"
                >
                  <span className="text-lg font-bold">
                    {publichealthData?.data?.successScore}%
                  </span>
                </CircularProgress>
                <h3 className="font-semibold text-sm">
                  {t("summaryCards.healthScore")}
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
                  {publichealthData?.data?.reviews.reply}
                  <span className="text-sm">
                    / {publichealthData?.data?.reviews.review}
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-muted-foreground">
                  {t("summaryCards.reviews")}
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
                  {truncateToTwoDecimals(publichealthData?.data?.avgRating)}
                </div>
                <h3 className="font-semibold text-sm text-muted-foreground">
                  {t("summaryCards.avgRating")}
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
                  {publichealthData?.data?.gmbPhotos || 0}
                </div>
                <h3 className="font-semibold text-sm text-muted-foreground">
                  {t("summaryCards.photos")}
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
                  {publichealthData?.data?.totalPosts}
                </div>
                <h3 className="font-semibold text-sm text-muted-foreground">
                  {t("summaryCards.posts")}
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Introduction Section */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">
              {t("introduction.title")}
            </h2>
            <p className="text-muted-foreground">{t("introduction.message")}</p>
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
                    {t("glanceReport.title")}
                  </h2>
                </div>
                {/* Failed Tests Card */}
                <div className="bg-red-100 border border-red-200 rounded-lg p-6">
                  <div className="text-red-800 text-sm font-medium mb-1">
                    {t("glanceReport.failedTests")}
                  </div>
                  <div className="text-2xl font-bold text-red-800">
                    {publichealthData?.data?.failedScore}%
                  </div>
                </div>

                {/* Passed Tests Card */}
                <div className="bg-green-100 border border-green-200 rounded-lg p-6">
                  <div className="text-green-800 text-sm font-medium mb-1">
                    {t("glanceReport.passedTests")}
                  </div>
                  <div className="text-2xl font-bold text-green-800">
                    {publichealthData?.data?.successScore} %
                  </div>
                </div>
              </div>

              {/* Right side - Pie Chart */}
              <div className="flex justify-center">
                <div className="w-64 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: t("glanceReport.passedTests"),
                            value: publichealthData?.data?.successScore || 0,
                            fill: "#22c55e",
                          },
                          {
                            name: t("glanceReport.failedTests"),
                            value: publichealthData?.data?.failedScore || 0,
                            fill: "#ef4444",
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-2xl font-bold">
              {t("detailedBreakdown.title")}
            </CardTitle>
            <Select
              value={breakdownSort}
              onValueChange={(value) =>
                setBreakdownSort(
                  value as "default" | "failed-first" | "passed-first"
                )
              }
            >
              <SelectTrigger className="w-[160px] bg-card z-50">
                <SelectValue placeholder={t("order.placeholder")} />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="default">{t("order.default")}</SelectItem>
                <SelectItem value="failed-first">
                  {t("order.failed")}
                </SelectItem>
                <SelectItem value="passed-first">
                  {t("order.passed")}
                </SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-6">
              {Object.entries(publichealthData?.data?.detailedBreakdown)
                .sort(([, valueA], [, valueB]) => {
                  if (breakdownSort === "default") return 0;
                  if (breakdownSort === "failed-first") {
                    // Failed (false) comes first, Passed (true) comes last
                    return valueA === valueB ? 0 : valueA ? 1 : -1;
                  }
                  if (breakdownSort === "passed-first") {
                    // Passed (true) comes first, Failed (false) comes last
                    return valueA === valueB ? 0 : valueA ? -1 : 1;
                  }
                  return 0;
                })
                .map(([key, value], index) => {
                  const breakdownInfo: Record<
                    string,
                    { title: string; why: string; recommendation: string }
                  > = {
                    description: {
                      title: t("detailedBreakdown.description.title"),
                      why: t("detailedBreakdown.description.why"),
                      recommendation: t(
                        "detailedBreakdown.description.recommendation"
                      ),
                    },
                    website: {
                      title: t("detailedBreakdown.website.title"),
                      why: t("detailedBreakdown.website.why"),
                      recommendation: t(
                        "detailedBreakdown.website.recommendation"
                      ),
                    },
                    review: {
                      title: t("detailedBreakdown.review.title"),
                      why: t("detailedBreakdown.review.why"),
                      recommendation: t(
                        "detailedBreakdown.review.recommendation"
                      ),
                    },
                    rating: {
                      title: t("detailedBreakdown.rating.title"),
                      why: t("detailedBreakdown.rating.why"),
                      recommendation: t(
                        "detailedBreakdown.rating.recommendation"
                      ),
                    },
                    addCategory: {
                      title: t("detailedBreakdown.addCategory.title"),
                      why: t("detailedBreakdown.addCategory.why"),
                      recommendation: t(
                        "detailedBreakdown.addCategory.recommendation"
                      ),
                    },
                    photo: {
                      title: t("detailedBreakdown.photo.title"),
                      why: t("detailedBreakdown.photo.why"),
                      recommendation: t(
                        "detailedBreakdown.photo.recommendation"
                      ),
                    },
                    workingHrs: {
                      title: t("detailedBreakdown.workingHrs.title"),
                      why: t("detailedBreakdown.workingHrs.why"),
                      recommendation: t(
                        "detailedBreakdown.workingHrs.recommendation"
                      ),
                    },
                    attributes: {
                      title: t("detailedBreakdown.attributes.title"),
                      why: t("detailedBreakdown.attributes.why"),
                      recommendation: t(
                        "detailedBreakdown.attributes.recommendation"
                      ),
                    },
                    profile: {
                      title: t("detailedBreakdown.profile.title"),
                      why: t("detailedBreakdown.profile.why"),
                      recommendation: t(
                        "detailedBreakdown.profile.recommendation"
                      ),
                    },
                    competitor: {
                      title: t("detailedBreakdown.competitor.title"),
                      why: t("detailedBreakdown.competitor.why"),
                      recommendation: t(
                        "detailedBreakdown.competitor.recommendation"
                      ),
                    },
                    citation: {
                      title: t("detailedBreakdown.citation.title"),
                      why: t("detailedBreakdown.citation.why"),
                      recommendation: t(
                        "detailedBreakdown.citation.recommendation"
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
                          {t("detailedBreakdown.highImpact")}
                        </Badge>
                        <Badge
                          className={
                            value
                              ? "bg-green-500 text-white hover:bg-green-500"
                              : "bg-red-500 text-white hover:bg-red-500"
                          }
                        >
                          {value
                            ? t("detailedBreakdown.passed")
                            : t("detailedBreakdown.failed")}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lg mb-3">
                        {index + 1}. {item.title}
                      </h3>
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">
                          {t("detailedBreakdown.whyItMatters")}
                        </h4>
                        <p className="text-sm text-muted-foreground ml-4">
                          {item.why}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">
                          {t("detailedBreakdown.recommendation")}
                        </h4>
                        <p className="text-sm text-muted-foreground ml-4">
                          {item.recommendation}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* Competitor Analysis */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">
              {t("competitorAnalysis.title")}
            </h2>

            {competitors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 bg-muted/30 rounded-lg border-2 border-dashed border-muted">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t("competitorAnalysis.empty")}
                </h3>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  {t("competitorAnalysis.emptyDesc")}
                </p>
              </div>
            ) : (
              <>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-6">
                  <div className="flex items-center justify-start mb-3">
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                      {t("competitorAnalysis.moderateImpact")}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-3">
                    {t("competitorAnalysis.message")}
                  </h3>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">
                      {t("detailedBreakdown.whyItMatters")}
                    </h4>
                    <p className="text-sm text-muted-foreground ml-4">
                      {t("competitorAnalysis.message1")}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">
                      {t("detailedBreakdown.recommendation")}
                    </h4>
                    <p className="text-sm text-muted-foreground ml-4">
                      {t("competitorAnalysis.analyze")}
                    </p>
                  </div>
                </div>

                {/* Competitor Analysis Chart */}
                <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6 shadow-sm">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {t("competitorAnalysis.chartDescription")}
                    </h3>
                    <p className="text-gray-600">
                      {t("competitorAnalysis.title")}
                    </p>
                  </div>

                  {/* Enhanced Legend */}
                  <div className="flex justify-center items-center gap-8 mb-8 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm">
                      <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm"></div>
                      <span className="text-sm font-medium text-gray-700">
                        {t("competitorAnalysis.avgRating")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm">
                      <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-sm"></div>
                      <span className="text-sm font-medium text-gray-700">
                        {t("competitorAnalysis.reviewCount")}
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
                              : `${value} ${t("chart.reviw")}`,
                            name === "avgRating"
                              ? t("chart.rating")
                              : t("chart.reviewTitle"),
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
                          {t("competitorTable.business")}
                        </th>
                        <th className="px-4 py-3 text-center font-semibold">
                          {t("competitorTable.avg")}
                        </th>
                        <th className="px-4 py-3 text-center font-semibold">
                          {t("competitorTable.review")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {competitorChartData.map((item, idx) => {
                        const isYou = publichealthData?.data?.locationName
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
                              {isYou ? t("competitorTable.you") : item.index}
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
              </>
            )}
          </CardContent>
        </Card>

        {/* Citation Analysis */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">
              {t("citationAnalysis.title")}
            </h2>

            {competitors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 bg-muted/30 rounded-lg border-2 border-dashed border-muted">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t("citationAnalysis.empty")}
                </h3>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  {t("citationAnalysis.emptyDesc")}
                </p>
              </div>
            ) : (
              <>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-6">
                  <div className="flex items-center justify-start mb-3">
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                      {t("citationAnalysis.highImpact")}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-3">
                    {t("citationAnalysis.message")}
                  </h3>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">
                      {t("detailedBreakdown.whyItMatters")}
                    </h4>
                    <p className="text-sm text-muted-foreground ml-4"></p>
                  </div>
                  {t("citationAnalysis.why")}
                  <div>
                    <h4 className="font-medium mb-2">
                      {t("detailedBreakdown.recommendation")}
                    </h4>
                    <p className="text-sm text-muted-foreground ml-4">
                      {t("citationAnalysis.recommendation")}
                    </p>
                  </div>
                </div>

                {/* Citation Analysis Chart */}
                <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6 shadow-sm">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {t("citationAnalysis.chartTitle")}
                    </h3>
                    <p className="text-gray-600">
                      {t("citationAnalysis.chartDescription")}
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
                            `${value} ${t("citationAnalysis.citation")}`,
                            t("citationAnalysis.citationCount"),
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
                          {t("citationTable.business")}
                        </th>
                        <th className="px-4 py-3 text-center font-semibold">
                          {t("citationTable.local")}
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
                        const isYou = publichealthData?.data?.locationName
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
                              {isYou ? t("competitorTable.you") : item.index}
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
              </>
            )}
          </CardContent>
        </Card>

        {/* Summary of Recommendations */}
        <Card className="bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900">
              {t("summaryRecommendations.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-6 bg-card">
              <ul className="space-y-3 list-disc list-inside text-foreground">
                <li className="pl-2">{t("summaryRecommendations.item1")}</li>
                <li className="pl-2">{t("summaryRecommendations.item2")}</li>
                <li className="pl-2">{t("summaryRecommendations.item3")}</li>
                <li className="pl-2">{t("summaryRecommendations.item4")}</li>
                <li className="pl-2">{t("summaryRecommendations.item5")}</li>
                <li className="pl-2">{t("summaryRecommendations.item6")}</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Health Sections Breakdown */}
        <div className="space-y-4">
          {/* {reportData.healthSections.map(
            (section: any, sectionIndex: number) => (
              <Card key={sectionIndex}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          section.status === "excellent"
                            ? "bg-green-500"
                            : section.status === "good"
                            ? "bg-blue-500"
                            : section.status === "warning"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      />
                      {section.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-semibold ${getSectionStatusColor(
                          section.status
                        )}`}
                      >
                        {section.percentage}%
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {section.items.map((item: any, itemIndex: number) => (
                      <div
                        key={itemIndex}
                        className={`p-3 rounded-lg border ${getStatusBg(
                          item.status
                        )}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2 flex-1">
                            {getStatusIcon(item.status)}
                            <span className="font-medium text-sm">
                              {item.label}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 ml-6">
                          <p className="text-xs text-muted-foreground">
                            {item.recommendation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          )} */}
        </div>
      </div>
    </PublicReportDashboardLayout>
  );
};
