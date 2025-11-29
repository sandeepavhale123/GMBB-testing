import React from "react";
import { useParams } from "react-router-dom";
import { PublicReportLayout } from "../components/PublicReportLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Star,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { CTASection } from "../components/CTASection";
import { SingleCTASection } from "../components/SingleCTASection";
import { useGetGmbProspectReportPublic, getLeadReportBrandingPublic } from "@/api/leadPublicApi";
import { InsightsErrorState } from "@/components/Insights/InsightsErrorState";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import i18n from "@/i18n";

interface Language {
  code: string;
  name: string;
}

const languages: Language[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "fr", name: "French" },
];

export const GmbProspectReport: React.FC = () => {
  const { t, loaded } = useI18nNamespace(
    "Lead-module-public-report/gmbProspectReport"
  );
  const { reportId } = useParams<{ reportId: string }>();

  const currentLang = i18n.language || "en";

  // Find the full name
  const language = languages.find((lang) => lang.code === currentLang)?.name;

  // Fetch prospect report data
  const {
    data: reportResponse,
    isLoading: reportLoading,
    error: reportError,
    refetch: refetchReport,
  } = useGetGmbProspectReportPublic(reportId || "", language);

  // Fetch branding data
  const [brandingData, setBrandingData] = React.useState(null);
  const [brandingLoading, setBrandingLoading] = React.useState(true);

  React.useEffect(() => {
    if (reportId) {
      getLeadReportBrandingPublic({ reportId, language })
        .then((response) => setBrandingData(response.data))
        .catch(() => setBrandingData(null))
        .finally(() => setBrandingLoading(false));
    }
  }, [reportId, language]);

  if (reportLoading || brandingLoading || !loaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">{t("report.loading")}</p>
        </div>
      </div>
    );
  }

  if (reportError || !reportResponse?.data) {
    return (
      <InsightsErrorState error={t("report.error")} onRetry={refetchReport} />
    );
  }

  const reportData = reportResponse.data;

  // Transform API data to component format
  const auditItems = reportData.breakdownDetails.map((item) => ({
    id: item.id,
    item: item.title,
    status: item.status.toLowerCase() === "failed" ? "fail" : "pass",
    whyItMatters: item.whyItMatters,
    recommendation: item.recommendations,
  }));

  const competitorData = (reportData.compData?.table || []).map((comp) => ({
    name: comp.bname,
    avgRating: comp.rating,
    reviewCount: comp.reviews,
  }));

  const competitorTableData = (reportData.compData?.table || []).map(
    (comp) => ({
      rank: comp.position === "YOU" ? "YOU" : comp.position.toString(),
      name: comp.bname,
      rating: comp.rating,
      reviews: comp.reviews,
    })
  );

  const citationCompetitorData = (reportData.citationCompData?.table || []).map(
    (comp) => ({
      name: comp.bname,
      localCitation: comp.localCitation,
    })
  );

  const citationCompetitorTableData = (
    reportData.citationCompData?.table || []
  ).map((comp) => ({
    rank: comp.position === "YOU" ? "YOU" : comp.position.toString(),
    name: comp.bname,
    localCitation: comp.localCitation,
  }));

  const advancedSuggestions = reportData.advancedSuggestions.map(
    (suggestion) => ({
      number: suggestion.id,
      suggestion: suggestion.suggestion,
      impact: suggestion.impact,
    })
  );

  const pieData = [
    {
      name: t("report.failedTests.title"),
      value: reportData.scoreDetails.failPercent,
      fill: "#ef4444",
    },
    {
      name: t("report.passedTests.title"),
      value: reportData.scoreDetails.passPercent,
      fill: "#22c55e",
    },
  ];

  const COLORS = ["#ef4444", "#22c55e"];

  return (
    <PublicReportLayout
      title={t("report.title")}
      listingName={reportData.reportDetails.bname}
      address={reportData.reportDetails.address}
      logo=""
      date={new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
      brandingData={brandingData}
      reportId={reportId}
      reportType="prospect"
    >
      <div className="mx-auto space-y-8">
        {/* Introduction Section */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">
              {reportData.reportTitle?.introduction ||
                t("report.introductionTitle")}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {reportData.reportTitle?.description ||
                t("report.introductionDesc")}
            </p>
          </CardContent>
        </Card>

        {/* Your GMB Report at a Glance */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left side - Test Results */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                  {t("report.atAGlance")}
                </h2>
                {/* Failed Tests Card */}
                <Card className="bg-red-100 border-red-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-red-900 mb-1">
                          {t("report.failedTests.title")}
                        </h3>
                        <p className="text-sm text-red-700">
                          {t("report.failedTests.desc")}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-red-900">
                          {reportData.scoreDetails.failPercent}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Passed Tests Card */}
                <Card className="bg-green-100 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-green-900 mb-1">
                          {t("report.passedTests.title")}
                        </h3>
                        <p className="text-sm text-green-700">
                          {t("report.passedTests.desc")}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-green-900">
                          {reportData.scoreDetails.passPercent}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right side - Pie Chart */}
              <Card className="bg-white border-none ">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <div className="w-64 h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={120}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value, name) => [`${value}%`, name]}
                            labelStyle={{ color: "#374151" }}
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "6px",
                              fontSize: "14px",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    {/* Legend */}
                    {/* <div className="mt-6 space-y-2 w-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        <span className="text-sm text-gray-700">Failed Tests</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {reportData.auditItems.filter(item => item.status === 'fail').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span className="text-sm text-gray-700">Passed Tests</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {reportData.auditItems.filter(item => item.status === 'pass').length}
                      </span>
                    </div>
                  </div> */}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>{t("report.breakdownTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {auditItems.map((item) => (
                <div
                  key={item.id}
                  className={`border-2 rounded-lg p-6 relative ${
                    item.status === "pass"
                      ? "border-green-200 bg-green-50/50"
                      : "border-red-200 bg-red-50/50"
                  }`}
                >
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-semibold ${
                        item.status === "pass"
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {item.status === "pass"
                        ? t("report.passed")
                        : t("report.failed")}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="mb-4 pr-20">
                    <h3 className="text-base font-semibold text-gray-900">
                      {item.id}. {item.item}
                    </h3>
                  </div>

                  {/* Why It Matters */}
                  <div className="mb-4">
                    <div className="flex items-start">
                      <span className="text-sm font-semibold text-gray-900 mr-1">
                        •
                      </span>
                      <div>
                        <span className="text-sm font-semibold text-gray-900">
                          {t("report.whyItMatters")}
                        </span>
                        <div className="text-sm text-gray-700 mt-1 leading-relaxed">
                          {item.whyItMatters}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div>
                    <div className="flex items-start">
                      <span className="text-sm font-semibold text-gray-900 mr-1">
                        •
                      </span>
                      <div>
                        <span className="text-sm font-semibold text-gray-900">
                          {t("report.recommendation")}
                        </span>
                        <div className="text-sm text-gray-700 mt-1 leading-relaxed">
                          {item.recommendation}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call CTA Section */}
        <SingleCTASection reportId={reportId || ""} ctaType="call" />

        {/* Competitor Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>{t("report.competitor.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Top Section - Performance Summary */}
            <div
              className={`mb-6 p-6 border-2 rounded-lg relative ${
                reportData.compData?.info?.impact === "High Impact"
                  ? "border-red-200 bg-red-50/50"
                  : reportData.compData?.info?.impact === "Moderate Impact"
                  ? "border-orange-200 bg-orange-50/50"
                  : "border-green-200 bg-green-50/50"
              }`}
            >
              <div className="absolute top-4 right-4">
                <span
                  className={`px-4 py-1 rounded-full text-sm font-semibold ${
                    reportData.compData?.info?.impact === "High Impact"
                      ? "bg-red-600 text-white"
                      : reportData.compData?.info?.impact === "Moderate Impact"
                      ? "bg-orange-600 text-white"
                      : "bg-green-600 text-white"
                  }`}
                >
                  {reportData.compData?.info?.impact ||
                    t("report.competitor.impact")}
                </span>
              </div>

              <h3 className="text-base font-semibold text-gray-900 mb-4 pr-20">
                {reportData.compData?.info?.title ||
                  t("report.competitor.listingDesc")}
              </h3>

              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-sm font-semibold text-gray-900 mr-1">
                    •
                  </span>
                  <div>
                    <span className="text-sm font-semibold text-gray-900">
                      {t("report.whyItMatters")}
                    </span>
                    <div className="text-sm text-gray-700 mt-1">
                      {reportData.compData?.info?.whyItMatters ||
                        t("report.competitor.impact")}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-sm font-semibold text-gray-900 mr-1">
                    •
                  </span>
                  <div>
                    <span className="text-sm font-semibold text-gray-900">
                      {t("report.recommendation")}
                    </span>
                    <div className="text-sm text-gray-700 mt-1">
                      {reportData.compData?.info?.recommendations ||
                        t("report.competitor.recomendation")}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Section */}
            <div className="mb-6 p-4 border rounded-lg">
              <h4 className="text-lg font-semibold text-center mb-4">
                {t("report.competitor.chartTitle")}
              </h4>

              <div className="flex justify-center items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm text-gray-700">
                    {t("report.competitor.legend.avgRating")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span className="text-sm text-gray-700">
                    {" "}
                    {t("report.competitor.legend.reviewCount")}
                  </span>
                </div>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={competitorData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      interval={0}
                      fontSize={12}
                    />
                    <YAxis yAxisId="rating" domain={[0, 5]} />
                    <YAxis
                      yAxisId="reviews"
                      orientation="right"
                      domain={[0, 100]}
                    />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "avgRating" ? `${value}/5.0` : value,
                        name === "avgRating"
                          ? t("report.competitor.legend.avgRating")
                          : t("report.competitor.legend.reviewCount"),
                      ]}
                    />
                    <Bar
                      yAxisId="rating"
                      dataKey="avgRating"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      yAxisId="reviews"
                      dataKey="reviewCount"
                      fill="#f97316"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Competitor Table */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-green-200 grid grid-cols-4 font-semibold text-gray-900">
                <div className="p-3 text-center">#</div>
                <div className="p-3">
                  {t("report.competitor.tableHeaders.name")}
                </div>
                <div className="p-3 text-center">
                  {" "}
                  {t("report.competitor.tableHeaders.rating")}
                </div>
                <div className="p-3 text-center">
                  {" "}
                  {t("report.competitor.tableHeaders.reviews")}
                </div>
              </div>

              {competitorTableData.map((item, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-4 border-t ${
                    item.rank === "YOU" ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <div className="p-3 text-center font-medium text-gray-900">
                    {item.rank}
                  </div>
                  <div className="p-3 text-gray-800">{item.name}</div>
                  <div className="p-3 text-center text-gray-900">
                    {item.rating > 0 ? `${item.rating}/5.0` : "-"}
                  </div>
                  <div className="p-3 text-center text-gray-900">
                    {item.reviews}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Citation Competitor Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>{t("report.citation.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Top Section - Performance Summary */}
            <div
              className={`mb-6 p-6 border-2 rounded-lg relative ${
                reportData.citationCompData?.info?.impact === "High Impact"
                  ? "border-red-200 bg-red-50/50"
                  : reportData.citationCompData?.info?.impact ===
                    "Moderate Impact"
                  ? "border-orange-200 bg-orange-50/50"
                  : "border-green-200 bg-green-50/50"
              }`}
            >
              <div className="absolute top-4 right-4">
                <span
                  className={`px-4 py-1 rounded-full text-sm font-semibold ${
                    reportData.citationCompData?.info?.impact === "High Impact"
                      ? "bg-red-600 text-white"
                      : reportData.citationCompData?.info?.impact ===
                        "Moderate Impact"
                      ? "bg-orange-600 text-white"
                      : "bg-green-600 text-white"
                  }`}
                >
                  {reportData.citationCompData?.info?.impact ||
                    t("report.citation.impact")}
                </span>
              </div>

              <h3 className="text-base font-semibold text-gray-900 mb-4 pr-20">
                {reportData.citationCompData?.info?.title ||
                  t("report.citation.result")}
              </h3>

              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-sm font-semibold text-gray-900 mr-1">
                    •
                  </span>
                  <div>
                    <span className="text-sm font-semibold text-gray-900">
                      {t("report.whyItMatters")}
                    </span>
                    <div className="text-sm text-gray-700 mt-1">
                      {reportData.citationCompData?.info?.whyItMatters ||
                        t("report.why")}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-sm font-semibold text-gray-900 mr-1">
                    •
                  </span>
                  <div>
                    <span className="text-sm font-semibold text-gray-900">
                      {t("report.recommendation")}
                    </span>
                    <div className="text-sm text-gray-700 mt-1">
                      {reportData.citationCompData?.info?.recommendations ||
                        t("report.recommendation")}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Section */}
            <div className="mb-6 p-4 border rounded-lg">
              <h4 className="text-lg font-semibold text-center mb-4">
                {t("report.citation.chartTitle")}
              </h4>

              <div className="flex justify-center items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span className="text-sm text-gray-700">
                    {t("report.citation.legend.localCitations")}
                  </span>
                </div>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={citationCompetitorData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      interval={0}
                      fontSize={12}
                    />
                    <YAxis domain={[0, "dataMax + 10"]} />
                    <Tooltip
                      formatter={(value, name) => [value, "Local Citations"]}
                    />
                    <Bar
                      dataKey="localCitation"
                      fill="#8b5cf6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Citation Competitor Table */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-purple-200 grid grid-cols-3 font-semibold text-gray-900">
                <div className="p-3 text-center">#</div>
                <div className="p-3">
                  {" "}
                  {t("report.citation.tableHeaders.name")}
                </div>
                <div className="p-3 text-center">
                  {" "}
                  {t("report.citation.tableHeaders.citations")}
                </div>
              </div>

              {citationCompetitorTableData.map((item, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-3 border-t ${
                    item.rank === "YOU" ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <div className="p-3 text-center font-medium text-gray-900">
                    {item.rank}
                  </div>
                  <div className="p-3 text-gray-800">{item.name}</div>
                  <div className="p-3 text-center text-gray-900">
                    {item.localCitation}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Appointment CTA Section */}
        <SingleCTASection reportId={reportId || ""} ctaType="appointment" />

        {/* Advanced Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle>{t("report.suggestions.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto border rounded-lg">
              {/* Table Header */}
              <div className="grid grid-cols-12 bg-gray-50 border-b font-semibold text-gray-900">
                <div className="col-span-1 p-4 text-center">#</div>
                <div className="col-span-8 p-4">
                  {t("report.suggestions.tableHeaders.suggestion")}
                </div>
                <div className="col-span-3 p-4 text-center">
                  {" "}
                  {t("report.suggestions.tableHeaders.impact")}
                </div>
              </div>

              {/* Table Rows */}
              {advancedSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-12 border-b last:border-b-0 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  <div className="col-span-1 p-4 text-center font-medium text-gray-900">
                    {index + 1}
                  </div>
                  <div className="col-span-8 p-4 text-gray-800">
                    {suggestion.suggestion}
                  </div>
                  <div className="col-span-3 p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                        suggestion.impact === "High Impact"
                          ? "bg-red-200 text-red-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {suggestion.impact}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("report.summary.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {reportData.recommendationsSummary?.map(
                (recommendation, index) => <li key={index}>{recommendation}</li>
              ) || (
                <>
                  <li>{t("report.summary.li1")}</li>
                  <li>{t("report.summary.li2")}</li>
                  <li>{t("report.summary.li3")}</li>
                  <li>{t("report.summary.li4")}</li>
                  <li>{t("report.summary.li5")}</li>
                  <li>{t("report.summary.li6")}</li>
                </>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </PublicReportLayout>
  );
};
