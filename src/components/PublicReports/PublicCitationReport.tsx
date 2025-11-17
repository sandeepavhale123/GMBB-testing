import { applyStoredTheme } from "@/utils/themeUtils";
import React from "react";
import { PublicReportDashboardLayout } from "./PublicReportDashboardLayout";
import { usePerformanceCitationReport } from "@/hooks/useReports";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { FileSearch } from "lucide-react";
import { Button } from "../ui/button";
import { usePublicI18n } from "@/hooks/usePublicI18n";

export const namespaces = ["PublicReports/publicCitationReport"];

const PublicCitationReport: React.FC = () => {
  // Extract reportId from URL
  const reportId = window.location.pathname.split("/").pop() || "";
  const { t, loaded, languageFullName } = usePublicI18n(namespaces);

  const { data, isLoading, error } = usePerformanceCitationReport(
    reportId,
    languageFullName
  );
  const citationData = data?.data;

  // Load theme for public report
  React.useEffect(() => {
    applyStoredTheme();
  }, []);

  // Extract visible sections from API response
  const visibleSections = Object.entries(citationData?.visibleSection || {})
    .filter(([_, value]) => value === "1")
    .map(([key]) => key);

  const trackerData = citationData?.summary;
  const existingCitationData = citationData?.existingCitations || [];
  const possibleCitationData = citationData?.possibleCitations || [];

  type TrackerData = {
    listed: number;
    notListed: number;
    listedPercent: number;
    totalChecked: number;
  };
  const CitationTrackerCard = ({
    trackerData,
  }: {
    trackerData: TrackerData;
  }) => {
    const listed = trackerData?.listed || 0;
    const notListed = trackerData?.notListed || 0;
    const listedPercent = trackerData?.listedPercent || 0;
    const chartData = [
      {
        name: "Listed",
        value: listed,
        fill: "hsl(var(--primary))",
      },
      {
        name: "Not Listed",
        value: notListed,
        fill: "hsl(var(--muted))",
      },
    ];
    const CustomLegend = ({ payload }: any) => (
      <div className="flex flex-col gap-2 ml-4">
        {payload?.map((entry: any, index: number) => (
          <div
            key={index}
            className="flex items-center gap-2 px-3 py-2 rounded text-sm"
            style={{
              backgroundColor: entry.color + "20",
              color: entry.color,
            }}
          >
            <span>{entry.value}</span>
            <span className="font-semibold">{entry.payload.value}</span>
          </div>
        ))}
      </div>
    );
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">
            {t("publicCitationReport.tracker.cardTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={48}
                    paddingAngle={2}
                    dataKey="value"
                    className="sm:!hidden"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={64}
                    paddingAngle={2}
                    dataKey="value"
                    className="hidden sm:!block"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {t("publicCitationReport.tracker.listed")}
                </span>
                <span className="text-sm sm:text-lg font-semibold">
                  {listedPercent}%
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:ml-4">
            <div className="flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-2 bg-primary text-primary-foreground rounded text-xs sm:text-sm">
              <span> {t("publicCitationReport.tracker.listed")}</span>
              <span className="font-semibold">{listed}</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-2 bg-muted text-muted-foreground rounded text-xs sm:text-sm">
              <span> {t("publicCitationReport.tracker.notListed")}</span>
              <span className="font-semibold">{notListed}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  const LocalPagesCard = () => (
    <Card className="h-full">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-full flex items-center justify-center">
          <FileSearch className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
        </div>
        <CardTitle className="text-base sm:text-lg">
          {t("publicCitationReport.localPages.title")}
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-muted-foreground px-2">
          {t("publicCitationReport.localPages.description")}
        </CardDescription>
      </CardHeader>
    </Card>
  );

  return (
    <PublicReportDashboardLayout
      title={t("publicCitationReport.title")}
      listingName={citationData?.locationName}
      logo={citationData?.companyLogo}
      address={citationData?.address}
      date={citationData?.reportDate}
      visibleSections={visibleSections}
      token={reportId}
    >
      <div className="space-y-6">
        {/* Two Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CitationTrackerCard trackerData={trackerData} />
          <LocalPagesCard />
        </div>

        {/* Citation Audit Card */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl">
                {t("publicCitationReport.audit.title")}
              </CardTitle>
            </div>
            <Button
              asChild
              variant="default"
              className="w-full sm:w-auto text-sm"
            >
              <a
                href="https://orders.citationbuilderpro.com/store/43/local-citation-service"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("publicCitationReport.audit.placeOrder")}
              </a>
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="existing" className="w-full">
              <TabsList className="grid grid-cols-2 sm:inline-flex sm:h-10 sm:items-center sm:justify-center sm:rounded-md bg-muted p-1 text-muted-foreground">
                <TabsTrigger value="existing" className="text-xs sm:text-sm">
                  {t("publicCitationReport.audit.tabs.existing")} (
                  {citationData?.existingCitation})
                </TabsTrigger>
                <TabsTrigger value="possible" className="text-xs sm:text-sm">
                  {t("publicCitationReport.audit.tabs.possible")} (
                  {trackerData?.totalChecked})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="existing" className="mt-6">
                <div className="overflow-x-auto rounded-md border">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">
                          {t("publicCitationReport.table.existing.website")}
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">
                          {t(
                            "publicCitationReport.table.existing.businessName"
                          )}
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm hidden md:table-cell">
                          {t("publicCitationReport.table.existing.phone")}
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm">
                          {t("publicCitationReport.table.existing.action")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {existingCitationData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2 sm:gap-4">
                              <img
                                src={`https://www.google.com/s2/favicons?sz=16&domain_url=${row.website}`}
                                alt="favicon"
                                className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                                onError={(e) =>
                                  (e.currentTarget.src = "/default-icon.png")
                                }
                              />
                              <span className="text-xs sm:text-sm truncate">
                                {row.website}
                              </span>
                            </div>
                            <div className="sm:hidden text-xs text-muted-foreground mt-1">
                              {row.businessName} • {row.phone}
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                            {row.businessName?.includes("Not Matching")
                              ? t("publicCitationReport.notmatch")
                              : row.businessName}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-xs sm:text-sm">
                            {row.phone?.includes("Not Matching")
                              ? t("publicCitationReport.notmatch")
                              : row.phone}
                          </TableCell>
                          <TableCell>
                            <a
                              href={
                                row.website?.startsWith("http://") ||
                                row.website?.startsWith("https://")
                                  ? row.website
                                  : `https://${row.website}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-2 bg-primary text-primary-foreground rounded text-xs sm:text-sm hover:bg-primary/80 transition-colors"
                            >
                              {t("publicCitationReport.table.existing.view")}
                            </a>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="possible" className="mt-6">
                <div className="overflow-x-auto rounded-md border">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">
                          {t("publicCitationReport.table.possible.siteName")}
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm text-right">
                          {t("publicCitationReport.table.possible.action")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {possibleCitationData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2 sm:gap-4">
                              <img
                                src={`https://www.google.com/s2/favicons?sz=16&domain_url=${row.website}`}
                                alt="favicon"
                                className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                                onError={(e) =>
                                  (e.currentTarget.src = "/default-icon.png")
                                }
                              />
                              <span className="text-xs sm:text-sm">
                                {row.site}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => {
                                if (row.website) {
                                  const url =
                                    row.website.startsWith("http://") ||
                                    row.website.startsWith("https://")
                                      ? row.website
                                      : `https://${row.website}`;
                                  window.open(
                                    url,
                                    "_blank",
                                    "noopener,noreferrer"
                                  );
                                }
                              }}
                            >
                              {t("publicCitationReport.table.possible.fixNow")}
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
    </PublicReportDashboardLayout>
  );
};

export default PublicCitationReport;
