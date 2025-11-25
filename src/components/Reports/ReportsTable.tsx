import React, { useState } from "react";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card, CardContent } from "../ui/card";
import { Eye, Loader2 } from "lucide-react";
import { Report, DateRange, CompareDateRange } from "@/types/reportTypes";
import { useNavigate } from "react-router-dom";
import { useAllReports } from "@/hooks/useReports";
import { formatToDayMonthYear } from "@/utils/dateUtils";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { current } from "@reduxjs/toolkit";
import TableSkeletonComponent from "../ui/skeleton-components/tableSkeletonComponent";

interface ReportsTableProps {
  listingId: string;
}

const ReportsTable: React.FC<ReportsTableProps> = ({ listingId }) => {
  const { t } = useI18nNamespace("Reports/reportsTable");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError } = useAllReports(
    listingId,
    currentPage,
    10
  );
  const reports = data?.data?.reports;
  const pagination = data?.data?.pagination;
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <TableSkeletonComponent />
        </div>
      </div>
    );
  }

  if ((!isLoading && isError) || !data?.data) {
    return (
      <div className="text-center py-10 text-destructive">
        {t("reportsTable.error")}
      </div>
    );
  }

  const formatDateRange = (
    dateRange: DateRange | CompareDateRange,
    type: "Individual" | "Compare"
  ) => {
    if (type === "Individual") {
      const range = dateRange as DateRange;
      return `${formatToDayMonthYear(range.from)} to ${formatToDayMonthYear(
        range.to
      )}`;
    } else {
      const compareRange = dateRange as CompareDateRange;
      return (
        <div className="space-y-1">
          <div>
            {t("reportsTable.period1")}{" "}
            {formatToDayMonthYear(compareRange.period1.from)}{" "}
            {t("reportsTable.to")}{" "}
            {formatToDayMonthYear(compareRange.period1.to)}
          </div>
          <div>
            {t("reportsTable.period2")}{" "}
            {formatToDayMonthYear(compareRange.period2.from)}{" "}
            {t("reportsTable.to")}{" "}
            {formatToDayMonthYear(compareRange.period2.to)}
          </div>
        </div>
      );
    }
  };

  const getReportTypeBadgeVariant = (section: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      "gmb-health": "outline",
      insights: "outline",
      reviews: "outline",
      posts: "outline",
      media: "outline",
      "geo-ranking": "outline",
      citation: "outline",
    };
    return variants[section] || "outline";
  };

  const getBadgeColor = (section: string) => {
    const colorMap: Record<string, string> = {
      "gmb-health": "border-green-500 bg-green-500 text-white ",
      insights: "border-sky-500 bg-sky-500 text-white",
      reviews: "border-yellow-500 bg-yellow-500 text-white",
      posts: "border-pink-500 bg-pink-500 text-white",
      media: "border-purple-500 bg-purple-500 text-white",
      "geo-ranking": "border-orange-500 bg-orange-500 text-white",
      citation: "border-[#218871] bg-[#218871] text-white",
    };
    return colorMap[section];
  };
  const getReportRoute = (reportId: string, sections_visible: string[]) => {
    const section = sections_visible?.[0];

    const sectionRouteMap: Record<string, string> = {
      "gmb-health": "/gmb-health",
      insights: "/gmb-insight",
      reviews: "/gmb-review",
      posts: "/gmb-post",
      media: "/gmb-media",
      "geo-ranking": "/gmb-ranking",
    };
    const ln = localStorage.getItem("i18nextLng");
    const basePath = sectionRouteMap[section] || "/gmb-health";
    return `${basePath}/${reportId}?lang=${ln}`;
  };

  const handleViewReport = (reportId: string, sections_visible: string[]) => {
    const url = getReportRoute(reportId, sections_visible);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground mb-4">
            {t("reportsTable.noReports.title")}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("reportsTable.noReports.description")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Card>
            <CardContent className="p-5">
              <div className="rounded-lg border overflow-hidden mb-3">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-900">
                        {t("reportsTable.tableHeaders.reportName")}
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        {t("reportsTable.tableHeaders.reports")}
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        {t("reportsTable.tableHeaders.reportType")}
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        {t("reportsTable.tableHeaders.reportDate")}
                      </TableHead>
                      <TableHead className="text-right font-semibold text-gray-900">
                        {t("reportsTable.tableHeaders.action")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow
                        key={report.report_id || report.id}
                        className="hover:bg-gray-50"
                      >
                        <TableCell>
                          <div className="font-medium text-gray-900">
                            {report.title || report.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {(report.sections_visible || []).map((sectionId) => (
                              <Badge
                                key={sectionId}
                                variant={getReportTypeBadgeVariant(sectionId)}
                                className={`"text-xs" ${getBadgeColor(sectionId)}`}
                              >
                                {sectionId
                                  .replace("-", " ")
                                  .replace(/\b\w/g, (c) => c.toUpperCase())}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-gray-600">
                            {report.type === "Compare" ? "Comparision" : report.type}{" "}
                            {t("reportsTable.tableHeaders.report")}
                          </span>
                        </TableCell>
                        <TableCell className="min-w-[200px]">
                          <div className="text-gray-600">
                            {formatDateRange(
                              report.date_range || report.dateRange,
                              report.type
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleViewReport(
                                report.report_id || report.id,
                                report.sections_visible || []
                              )
                            }
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div>
                {/* Pagination */}
                {(pagination.total_pages || pagination.totalPages || 0) > 1 && (
                  <div className="flex items-center justify-end space-x-2 ">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={!(pagination.has_prev ?? pagination.page > 1)}
                    >
                      {t("reportsTable.pagination.previous")}
                    </Button>

                    <span className="text-sm text-gray-600">
                      {t("reportsTable.pagination.page", {
                        current: pagination.page,
                        total: pagination.total_pages || pagination.totalPages,
                      })}
                      {/* Page {pagination.page} of{" "}
            {pagination.total_pages || pagination.totalPages} */}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(
                            prev + 1,
                            pagination.total_pages || pagination.totalPages || 1
                          )
                        )
                      }
                      disabled={
                        !(
                          pagination.has_next ??
                          pagination.page <
                          (pagination.total_pages || pagination.totalPages || 1)
                        )
                      }
                    >
                      {t("reportsTable.pagination.next")}
                    </Button>
                  </div>
                )}

              </div>
            </CardContent>
          </Card>
        </div>
      </div>


    </>
  );
};

export default ReportsTable;
