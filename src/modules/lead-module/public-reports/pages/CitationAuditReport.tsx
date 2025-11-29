import React from "react";
import { useParams } from "react-router-dom";
import { PublicReportLayout } from "../components/PublicReportLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Copy,
  MapPin,
  Loader2,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { useGetCitationAuditReportPublic, useGetLeadReportBrandingPublic } from "@/api/leadPublicApi";
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

export const CitationAuditReport: React.FC = () => {
  const { t, loaded } = useI18nNamespace(
    "Lead-module-public-report/citationAuditReport"
  );
  const { reportId } = useParams<{
    reportId: string;
  }>();

  const currentLang = i18n.language || "en";

  // Find the full name
  const currentLangName = languages.find(
    (lang) => lang.code === currentLang
  )?.name;

  const {
    data: apiResponse,
    isLoading,
    error,
  } = useGetCitationAuditReportPublic(reportId || "", currentLangName);
  const { data: brandingResponse } = useGetLeadReportBrandingPublic(
    reportId || "",
    currentLangName
  );
  if (isLoading || !loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">{t("citationAudit.loading")}</p>
        </div>
      </div>
    );
  }
  if (error || !apiResponse?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">
            {t("citationAudit.loadError")}
          </p>
          <Button onClick={() => window.location.reload()}>
            {t("citationAudit.retry")}
          </Button>
        </div>
      </div>
    );
  }

  // Transform API response to match expected format
  const reportDetails = apiResponse?.data?.reportDetails;
  const summary = apiResponse?.data?.summary;
  const existingCitations = apiResponse?.data?.existingCitation ?? [];
  const possibleCitations = apiResponse?.data?.possibleCitation ?? [];

  // Calculate listed and non-listed counts from existing citations
  const totalCitations = summary?.totalCitations ?? 0;
  const listed = existingCitations.length;
  const nonListed = Math.max(0, totalCitations - listed);
  const reportData = {
    title: t("citationAudit.title"),
    listingName: reportDetails?.bname || t("citationAudit.listingName"),
    address: reportDetails?.address || "",
    logo: "",
    date: new Date().toLocaleDateString(),
    citations: {
      total: totalCitations,
      listed: listed,
      nonListed: nonListed,
      missing: summary?.missingCitations ?? 0,
      duplicates: summary?.duplicateListings ?? 0,
      accuracy: summary?.accuracyScore ?? 0,
    },
    existingCitations: existingCitations.map((citation) => ({
      siteName: citation.host || citation.title,
      businessName: citation.found_bname || citation.title,
      phone: citation.found_phone || "",
      url: citation.url,
    })),
    possibleCitations: possibleCitations.map((citation) => ({
      siteName: citation.host || citation.sitename,
      businessName: reportDetails?.bname || "",
      phone: reportDetails?.phone || "",
      url: citation.url,
      status: citation.site_status,
    })),
  };
  const brandingData = brandingResponse?.data || null;

  // Chart data for donut chart
  const chartData = [
    {
      name: t("citationAudit.metrics.total"),
      value: reportData.citations.total,
      fill: "#22c55e", // green
    },
    {
      name: t("citationAudit.metrics.missing"),
      value: reportData.citations.missing,
      fill: "#ef4444", // red
    },
  ];
  const CustomLegend = ({ payload }: any) => (
    <div className="flex flex-col gap-2 ml-4">
      {payload?.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: entry.color,
            }}
          />
          <span className="text-sm font-medium">{entry.value}</span>
          <span className="text-sm text-muted-foreground">
            ({entry.payload.value})
          </span>
        </div>
      ))}
    </div>
  );
  return (
    <PublicReportLayout
      title={reportData.title}
      listingName={reportData.listingName}
      address={reportData.address}
      logo={reportData.logo}
      date={reportData.date}
      brandingData={brandingData}
      reportType="citation"
    >
      <div className="space-y-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("citationAudit.metrics.total")}
                  </p>
                  <p className="text-3xl font-bold">
                    {reportData.citations.total}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("citationAudit.metrics.accuracy")}
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {reportData.citations.accuracy}%
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("citationAudit.metrics.missing")}
                  </p>
                  <p className="text-3xl font-bold text-orange-600">
                    {reportData.citations.missing}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          {/* <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Duplicate Listings</p>
                  <p className="text-3xl font-bold text-red-600">{reportData.citations.duplicates}</p>
                </div>
                <Copy className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Citation Status at a Glance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {t("citationAudit.atAGlance.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1 space-y-4">
                {/* Found Citations Card */}
                <div className="bg-green-100 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-green-900">
                        {t("citationAudit.atAGlance.foundTitle")}
                      </h3>
                      <p className="text-sm text-green-700">
                        {t("citationAudit.atAGlance.foundDesc")}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-900">
                        {reportData.citations.total}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Missing Citations Card */}
                <div className="bg-red-100 border border-red-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-red-900">
                        {t("citationAudit.atAGlance.missingTitle")}
                      </h3>
                      <p className="text-sm text-red-700">
                        {t("citationAudit.atAGlance.missingDesc")}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-red-900">
                        {reportData.citations.missing}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Donut Chart */}
              <div className="flex-1 flex justify-center">
                <div className="w-64 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                        startAngle={90}
                        endAngle={450}
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.name === "Total Citations Found"
                                ? "#22c55e"
                                : "#ef4444"
                            }
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Local Page & Directory Score Info */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 rounded-full p-3">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {t("citationAudit.localPageScore.title")}
              </h3>
              <p className="text-blue-100 leading-relaxed">
                {t("citationAudit.localPageScore.description")}
              </p>
            </div>
          </div>
        </div>

        {/* Citation Audit Tabs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {t("citationAudit.tabs.citation")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="existing" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="existing">
                  {t("citationAudit.tabs.existing")} (
                  {reportData.existingCitations.length})
                </TabsTrigger>
                <TabsTrigger value="possible">
                  {t("citationAudit.tabs.possible")} (
                  {reportData.possibleCitations.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="existing" className="mt-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          {t("citationAudit.table.siteName")}
                        </TableHead>
                        <TableHead>
                          {t("citationAudit.table.businessName")}
                        </TableHead>
                        <TableHead>{t("citationAudit.table.phone")}</TableHead>
                        <TableHead className="text-right">
                          {t("citationAudit.table.action")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.existingCitations.map((citation, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <img
                                src={`https://www.google.com/s2/favicons?sz=16&domain_url=${citation.siteName}`}
                                alt="favicon"
                                className="w-4 h-4"
                                onError={(e) =>
                                  (e.currentTarget.src = "/placeholder.svg")
                                }
                              />
                              {citation.siteName}
                            </div>
                          </TableCell>
                          <TableCell>
                            {citation.businessName?.includes("Not Matching") ? (
                              <span className="text-red-600 font-medium">
                                {t("citationAudit.table.notMatching")}
                              </span>
                            ) : (
                              citation.businessName
                            )}
                          </TableCell>
                          <TableCell>
                            {citation.phone?.includes("Not Matching") ? (
                              <span className="text-red-600 font-medium">
                                {t("citationAudit.table.notMatching")}
                              </span>
                            ) : (
                              citation.phone
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                window.open(
                                  `https://${citation.siteName}`,
                                  "_blank"
                                )
                              }
                            >
                              {t("citationAudit.table.view")}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="possible" className="mt-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          {t("citationAudit.table.siteName")}
                        </TableHead>
                        <TableHead>
                          {t("citationAudit.table.businessName")}
                        </TableHead>
                        <TableHead>{t("citationAudit.table.phone")}</TableHead>
                        <TableHead className="text-right">
                          {t("citationAudit.table.phone")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.possibleCitations.map((citation, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <img
                                src={`https://www.google.com/s2/favicons?sz=16&domain_url=${citation.siteName}`}
                                alt="favicon"
                                className="w-4 h-4"
                                onError={(e) =>
                                  (e.currentTarget.src = "/placeholder.svg")
                                }
                              />
                              {citation.siteName}
                            </div>
                          </TableCell>
                          <TableCell>
                            {citation.businessName?.includes("Not Matching") ? (
                              <span className="text-red-600 font-medium">
                                {t("citationAudit.table.notMatching")}
                              </span>
                            ) : (
                              citation.businessName
                            )}
                          </TableCell>
                          <TableCell>
                            {citation.phone?.includes("Not Matching") ? (
                              <span className="text-red-600 font-medium">
                                {t("citationAudit.table.notMatching")}
                              </span>
                            ) : (
                              citation.phone
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              onClick={() =>
                                window.open(
                                  `https://${citation.siteName}`,
                                  "_blank"
                                )
                              }
                            >
                              {t("citationAudit.table.add")}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PublicReportLayout>
  );
};
