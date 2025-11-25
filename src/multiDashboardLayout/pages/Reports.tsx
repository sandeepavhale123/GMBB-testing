import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import TableSkeletonComponent from "@/components/ui/skeleton-components/tableSkeletonComponent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  FileText,
  TrendingUp,
  BarChart3,
  PieChart,
  Eye,
  Edit,
  Trash2,
  Search,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { useBulkReports } from "@/hooks/useBulkReports";
import { useDebounce } from "@/hooks/useDebounce";
import { reportsApi } from "@/api/reportsApi";
import { useToast } from "@/hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

type GenerateBulkReportProps = {
  isSingleListingDashboard?: boolean; // make it optional
};

const Reports: React.FC<GenerateBulkReportProps> = ({
  isSingleListingDashboard = false,
}) => {
  const { t } = useI18nNamespace("MultidashboardPages/reports");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [reportType, setReportType] = useState<
    "all" | "onetime" | "monthly" | "weekly"
  >("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<any>(null);
  const debouncedSearch = useDebounce(searchTerm, 3000);

  const { data, isLoading, error } = useBulkReports(
    currentPage,
    10,
    debouncedSearch,
    reportType
  );

  const reports = data?.data?.reports || [];
  const pagination = data?.data?.pagination || { total: 0, page: 1, limit: 10 };
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (reportId: number) => reportsApi.deleteBulkReport(reportId),
    onSuccess: () => {
      toast({
        title: t("toast.successTitle"),
        description: t("toast.successDesc"),
      });
      queryClient.invalidateQueries({ queryKey: ["bulk-reports"] });
      setDeleteDialogOpen(false);
      setReportToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: t("toast.title"),
        description: error?.message || t("toast.description"),
        variant: "destructive",
      });
    },
  });

  const handleDeleteClick = (report: any) => {
    setReportToDelete(report);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (reportToDelete) {
      deleteMutation.mutate(reportToDelete.id);
    }
  };

  // Calculate quick stats from real data
  const quickStats = useMemo(() => {
    const totalReports = pagination.total;
    const onetimeReports = reports.filter(
      (r) => r.schedule === "ONETIME"
    ).length;
    const monthlyReports = reports.filter(
      (r) => r.schedule === "MONTHLY"
    ).length;
    const weeklyReports = reports.filter((r) => r.schedule === "WEEKLY").length;

    return [
      {
        icon: FileText,
        label: t("totalReports"),
        value: totalReports.toString(),
        color: "text-blue-600",
      },
      {
        icon: TrendingUp,
        label: t("oneTime"),
        value: onetimeReports.toString(),
        color: "text-green-600",
      },
      {
        icon: BarChart3,
        label: t("monthly"),
        value: monthlyReports.toString(),
        color: "text-yellow-600",
      },
      {
        icon: PieChart,
        label: t("weekly"),
        value: weeklyReports.toString(),
        color: "text-purple-600",
      },
    ];
  }, [reports, pagination.total]);

  const getScheduleBadgeVariant = (status: string) => {
    switch (status) {
      case "ONETIME":
        return "secondary";
      case "WEEKLY":
        return "default";
      case "MONTHLY":
        return "outline";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return (
      <TableSkeletonComponent />
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t("reportsManagement")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("reportsManagementDescription")}
            </p>
          </div>
        </div>
        <div className="text-center py-12">
          <p className="text-destructive">{t("errorLoadingReports")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("reportsManagement")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("reportsManagementDescription")}
          </p>
        </div>
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90 self-start sm:self-auto"
          onClick={() => {
            const path = isSingleListingDashboard
              ? "/generate-bulk-reports"
              : "/main-dashboard/generate-bulk-report";

            navigate(path);
          }}
        >
          <FileText className="w-4 h-4 mr-1" />
          {t("generateReport")}
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 hidden">
        {quickStats.map((stat, index) => (
          <div
            key={index}
            className="bg-card rounded-lg border border-border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-lg border border-border p-4 mb-6">
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={reportType}
            onValueChange={(value: any) => setReportType(value)}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allReports")}</SelectItem>
              <SelectItem value="onetime">{t("oneTime")}</SelectItem>
              <SelectItem value="monthly">{t("monthly")}</SelectItem>
              <SelectItem value="weekly">{t("weekly")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Projects Table */}
        <div className="p-0 border rounded-lg mb-4">
          <TooltipProvider>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left font-semibold">
                    {t("projectName")}
                  </TableHead>
                  <TableHead className="text-center font-semibold">
                    {t("scheduledStatus")}
                  </TableHead>
                  <TableHead className="text-center font-semibold">
                    {t("lastUpdate")}
                  </TableHead>
                  <TableHead className="text-center font-semibold">
                    {t("nextUpdate")}
                  </TableHead>
                  <TableHead className="text-center font-semibold w-32">
                    {t("actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id} className="hover:bg-muted/50">
                    <TableCell className="font-semibold text-foreground">
                      <div>
                        <div className="font-bold">{report.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {t("location", { count: report.listing_count })}
                          {/* {report.listing_count} locations */}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getScheduleBadgeVariant(report.schedule)}>
                        {report.schedule}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {report.last_updated}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {report.next_update !== "-" ? report.next_update : "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                const path = isSingleListingDashboard
                                  ? `/view-bulk-report-details/${report.id}`
                                  : `/main-dashboard/bulk-report-details/${report.id}`;
                                navigate(path);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t("viewProject")}</p>
                          </TooltipContent>
                        </Tooltip>

                        {/* <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit project</p>
                          </TooltipContent>
                        </Tooltip> */}

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteClick(report)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t("deleteProject")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TooltipProvider>
        </div>

        {/* pagination  */}
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between ">
            <label className="text-sm  text-foreground">
              {t("totalReport")} : {pagination.total}
            </label>
            <Pagination className="flex justify-end">
              <PaginationContent >
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    className={`${currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                      } [&>span]:hidden`}
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    className={`${currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                      } [&>span]:hidden`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteReport")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteReportConfirmation", {
                reportTitle: reportToDelete?.title,
              })}
              {/* Are you sure you want to delete "{reportToDelete?.title}"? This
              action cannot be undone. */}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteDialogOpen(false);
                setReportToDelete(null);
              }}
              disabled={deleteMutation.isPending}
            >
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
export default Reports;