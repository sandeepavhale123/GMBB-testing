import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Database,
  Mail,
  TrendingUp,
  ArrowUpRight,
  Plus,
  UserCheck,
  CreditCard,
} from "lucide-react";
import { AddLeadModal } from "../components/AddLeadModal";
import { LeadTableFilters } from "../components/LeadTableFilters";
import { LeadsTable, Lead } from "../components/LeadsTable";
import { CitationAuditModal } from "../components/CitationAuditModal";
import { GeoRankingModal } from "../components/GeoRankingModal";
import { LeadClassifierModal } from "../components/LeadClassifierModal";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useLeads,
  ApiLead,
  useCreateGmbHealthReport,
  useCreateGmbProspectReport,
  useLeadSummary,
  useCreateGeoReport,
  useDeleteLead,
} from "@/api/leadApi";
import { toast } from "sonner";
import {
  ReportProgressModal,
  ReportType,
} from "@/components/Dashboard/ReportProgressModal";
import { CopyUrlModal } from "@/components/Dashboard/CopyUrlModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
const ITEMS_PER_PAGE = 10;

// Transform API lead to UI lead
const transformApiLead = (apiLead: ApiLead): Lead => ({
  id: apiLead.id,
  email: apiLead.email,
  businessName: apiLead.business_name,
  reportTypeLabel: apiLead.reportTypeLabel,
  date: apiLead.generated_date,
  leadCategoryLabel: apiLead.leadCategoryLabel,
  reportId: apiLead.report_id,
  citationReportId: apiLead.report_id,
  reports: {
    gmbReport: {
      status: (apiLead.reports?.gmbReport?.status === 1 ? 1 : 0) as 0 | 1,
      viewUrl: apiLead.reports?.gmbReport?.viewUrl ?? null,
    },
    onPage: {
      status: (apiLead.reports?.onPage?.status === 1 ? 1 : 0) as 0 | 1,
      viewUrl: apiLead.reports?.onPage?.viewUrl ?? null,
    },
    citation: {
      status: (apiLead.reports?.citation?.status === 1 ? 1 : 0) as 0 | 1,
      viewUrl: apiLead.reports?.citation?.viewUrl ?? null,
    },
    prospect: {
      status: (apiLead.reports?.prospect?.status === 1 ? 1 : 0) as 0 | 1,
      viewUrl: apiLead.reports?.prospect?.viewUrl ?? null,
    },
    geo: {
      status: ((apiLead as any)?.reports?.geo?.status === 1 ? 1 : 0) as 0 | 1,
      viewUrl: (apiLead as any)?.reports?.geo?.viewUrl ?? null,
    },
  },
});
const Dashboard: React.FC = () => {
  const { t } = useI18nNamespace("Lead-module-pages/dashboard");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [citationModalOpen, setCitationModalOpen] = useState(false);
  const [geoModalOpen, setGeoModalOpen] = useState(false);
  const [leadClassifierModalOpen, setLeadClassifierModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string>("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [reportProgressOpen, setReportProgressOpen] = useState(false);
  const [reportType, setReportType] = useState<ReportType>("gmb-health");
  const [reportStatus, setReportStatus] = useState<
    "loading" | "success" | "error" | null
  >(null);
  const [reportUrl, setReportUrl] = useState<string>("");
  const [copyUrlModalOpen, setCopyUrlModalOpen] = useState(false);

  // Citation report modal states
  const [citationReportStatus, setCitationReportStatus] = useState<
    "loading" | "success" | "error" | null
  >(null);
  const [citationReportUrl, setCitationReportUrl] = useState<string>("");
  const [citationProgressOpen, setCitationProgressOpen] = useState(false);

  // Geo report modal states
  const [geoReportStatus, setGeoReportStatus] = useState<
    "loading" | "success" | "error" | null
  >(null);
  const [geoReportUrl, setGeoReportUrl] = useState<string>("");
  const [geoProgressOpen, setGeoProgressOpen] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const createGmbHealthReport = useCreateGmbHealthReport();
  const createGmbProspectReport = useCreateGmbProspectReport();
  const createGeoReport = useCreateGeoReport();
  const deleteLeadMutation = useDeleteLead();

  // API integration
  const {
    data: leadsResponse,
    isLoading,
    error,
    refetch,
  } = useLeads({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearchQuery,
  });

  // Lead summary API integration
  const {
    data: summaryResponse,
    isLoading: isSummaryLoading,
    refetch: refetchSummary,
  } = useLeadSummary();
  const leads = leadsResponse?.data.leads.map(transformApiLead) || [];
  const totalPages = leadsResponse?.data.pagination
    ? Math.ceil(leadsResponse.data.pagination.total / ITEMS_PER_PAGE)
    : 0;
  const totalLeads = leadsResponse?.data.pagination?.total || 0;

  // Show error toast
  if (error) {
    toast.error(t("fetchError"));
  }
  const handleAddLead = () => {
    // Refetch leads and summary after adding a new lead
    refetch();
    refetchSummary();
  };
  const handleAction = (action: string, leadId: string) => {
    if (action === "generate-gmb-health") {
      // Find the lead to get its reportId
      const lead = leads.find((l) => l.id === leadId);
      if (lead?.reportId) {
        setReportType("gmb-health");
        setReportUrl("");
        setReportProgressOpen(true);
        setReportStatus("loading");

        createGmbHealthReport.mutate(
          {
            reportId: lead.reportId,
          },
          {
            onSuccess: (data) => {
              setReportStatus("success");
              setReportUrl(data.data.reportUrl);
              // Refetch leads and summary data to show updated report status
              refetch();
              refetchSummary();
            },
            onError: () => {
              setReportStatus("error");
            },
          }
        );
      } else {
        toast.error(t("reportIDMissing"));
      }
    }
    if (action === "generate-citation") {
      const lead = leads.find((l) => l.id === leadId);
      setSelectedLeadId(leadId);
      setSelectedLead(lead || null);
      setCitationModalOpen(true);
    }
    if (action === "lead-classifier") {
      const lead = leads.find((l) => l.id === leadId);
      setSelectedLeadId(leadId);
      setSelectedLead(lead || null);
      setLeadClassifierModalOpen(true);
    }
    if (action === "generate-geo") {
      // Find the lead to get its reportId
      const lead = leads.find((l) => l.id === leadId);
      if (lead?.reportId) {
        setSelectedLeadId(lead.reportId);
        setGeoModalOpen(true);
      } else {
        toast.error(t("reportIDMissing"));
      }
    }
    if (action === "generate-prospect") {
      // Find the lead to get its reportId
      const lead = leads?.find((l) => l.id === leadId);
      if (lead?.reportId) {
        setReportType("gmb-prospect");
        setReportUrl("");
        setReportProgressOpen(true);
        setReportStatus("loading");

        // Create prospect report for the lead
        createGmbProspectReport.mutate(
          {
            reportId: lead.reportId,
          },
          {
            onSuccess: (data) => {
              setReportStatus("success");
              setReportUrl(data.data.reportUrl);
              // Refetch leads and summary data to show updated report status
              refetch();
              refetchSummary();
            },
            onError: () => {
              setReportStatus("error");
            },
          }
        );
      } else {
        toast.error(t("noReportID"));
      }
    }

    if (action === "delete") {
      const lead = leads?.find((l) => l.id === leadId);
      if (lead) {
        setLeadToDelete(lead);
        setDeleteDialogOpen(true);
      }
    }

    // Handle other actions here
  };
  const handleCitationModalClose = () => {
    setCitationModalOpen(false);
    setSelectedLeadId("");
    setSelectedLead(null);
    // Optionally refetch leads to update citation report status
    refetch();
    refetchSummary();
  };
  const handleGeoModalClose = () => {
    setGeoModalOpen(false);
    setSelectedLeadId("");
    // Optionally refetch leads to update geo report status
    refetch();
    refetchSummary();
  };
  const handleLeadClassifierModalClose = () => {
    setLeadClassifierModalOpen(false);
    setSelectedLeadId("");
    setSelectedLead(null);
    // Optionally refetch leads to update lead classification
    refetch();
  };

  const handleDeleteConfirm = () => {
    if (leadToDelete) {
      deleteLeadMutation.mutate({
        leadId: parseInt(leadToDelete.id),
      });
      setDeleteDialogOpen(false);
      setLeadToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setLeadToDelete(null);
  };
  const handleClearFilters = () => {
    setSearchQuery("");
    setEmailFilter("");
    setCategoryFilter("all");
    setCurrentPage(1);
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleReportProgressSuccess = () => {
    setReportProgressOpen(false);
    setReportStatus(null);
    setCopyUrlModalOpen(true);
  };

  const handleReportProgressClose = (open: boolean) => {
    setReportProgressOpen(open);
    if (!open) {
      setReportStatus(null);
      setReportUrl("");
    }
  };

  // Citation report handlers
  const handleCitationReportProgress = (
    status: "loading" | "success" | "error",
    url?: string
  ) => {
    setCitationReportStatus(status);
    setCitationProgressOpen(true);
    if (status === "loading") {
      setCitationModalOpen(false);
    }
    if (url) setCitationReportUrl(url);
  };

  const handleCitationReportSuccess = () => {
    setCitationProgressOpen(false);
    setCitationReportStatus(null);
    setCopyUrlModalOpen(true);
    setReportUrl(citationReportUrl);
  };

  const handleCitationProgressClose = (open: boolean) => {
    setCitationProgressOpen(open);
    if (!open) {
      setCitationReportStatus(null);
      setCitationReportUrl("");
    }
  };

  // Geo report handlers
  const handleGeoReportProgress = (
    status: "loading" | "success" | "error",
    url?: string
  ) => {
    setGeoReportStatus(status);
    setGeoProgressOpen(true);
    if (status === "loading") {
      setGeoModalOpen(false);
    }
    if (url) setGeoReportUrl(url);
  };

  const handleGeoReportSuccess = () => {
    setGeoProgressOpen(false);
    setGeoReportStatus(null);
    setCopyUrlModalOpen(true);
    setReportUrl(geoReportUrl);
  };

  const handleGeoProgressClose = (open: boolean) => {
    setGeoProgressOpen(open);
    if (!open) {
      setGeoReportStatus(null);
      setGeoReportUrl("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <AddLeadModal onSuccess={handleAddLead} />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          className={`bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-1">
              <h3 className="text-sm font-medium text-gray-600">
                {t("convertedLeads")}
              </h3>
              <div className="text-3xl font-bold text-gray-900">
                {isSummaryLoading
                  ? "-"
                  : summaryResponse?.data.convertedLeads || 0}
              </div>
            </div>
            <div
              className={`bg-blue-500 rounded-lg p-3 flex items-center justify-center ml-4`}
            >
              <UserCheck className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div
          className={`bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-1">
              <h3 className="text-sm font-medium text-gray-600">
                {t("totalLeads")}
              </h3>
              <div className="text-3xl font-bold text-gray-900">
                {isSummaryLoading ? "-" : summaryResponse?.data.totalLeads || 0}
              </div>
            </div>
            <div
              className={`bg-green-500 rounded-lg p-3 flex items-center justify-center ml-4`}
            >
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div
          className={`bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-1">
              <h3 className="text-sm font-medium text-gray-600">
                {t("remainingCredits")}
              </h3>
              <div className="text-3xl font-bold text-gray-900">
                {isSummaryLoading
                  ? "-"
                  : summaryResponse?.data.credits.remaining.toLocaleString() ||
                    0}
              </div>
            </div>
            <div
              className={`bg-orange-500 rounded-lg p-3 flex items-center justify-center ml-4`}
            >
              <CreditCard className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        {/* <div className={`bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}>
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-1">
              <h3 className="text-sm font-medium text-gray-600">
                Total Email Templates
              </h3>
              <div className="text-3xl font-bold text-gray-900">
                {isSummaryLoading ? "-" : summaryResponse?.data.totalEmailTemplates || 0}
              </div>
            </div>
            <div className={`bg-purple-500 rounded-lg p-3 flex items-center justify-center ml-4`}>
              <Mail className="w-6 h-6 text-white" />
            </div>
          </div>
        </div> */}
      </div>
      {/* Leads Table Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            {/* <div>
              <CardTitle>Leads</CardTitle>
              <CardDescription>
                Manage your lead database and track interactions
              </CardDescription>
            </div> */}
          </div>
        </CardHeader>
        <CardContent>
          <LeadTableFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            emailFilter={emailFilter}
            onEmailFilterChange={setEmailFilter}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            onClearFilters={handleClearFilters}
          />

          <LeadsTable
            leads={leads}
            onAction={handleAction}
            isLoading={
              isLoading ||
              createGmbHealthReport.isPending ||
              createGmbProspectReport.isPending ||
              createGeoReport.isPending ||
              deleteLeadMutation.isPending
            }
          />

          {totalPages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {t("showingPage", {
                  currentPage,
                  totalPages,
                  leadCount: leads?.length || 0,
                })}
                {/* Showing page {currentPage} of {totalPages} ({leads?.length || 0}{" "}
                leads) */}
              </div>
              <Pagination>
                <PaginationContent className="ml-auto ">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={
                        currentPage <= 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer hover:bg-accent"
                      }
                    />
                  </PaginationItem>

                  {/* Show first page if not in first few pages */}
                  <div className="hidden md:contents">
                    {currentPage > 3 && (
                      <>
                        <PaginationItem>
                          <PaginationLink
                            onClick={() => handlePageChange(1)}
                            className="cursor-pointer hover:bg-accent"
                          >
                            1
                          </PaginationLink>
                        </PaginationItem>
                        {currentPage > 4 && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                      </>
                    )}

                    {/* Show pages around current page */}
                    {Array.from(
                      {
                        length: Math.min(3, totalPages),
                      },
                      (_, i) => {
                        const startPage = Math.max(
                          1,
                          Math.min(currentPage - 2, totalPages - 4)
                        );
                        const page = startPage + i;
                        if (page <= totalPages) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => handlePageChange(page)}
                                isActive={currentPage === page}
                                className="cursor-pointer hover:bg-accent"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                        return null;
                      }
                    )}

                    {/* Show last page if not in last few pages */}
                    {currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                        <PaginationItem>
                          <PaginationLink
                            onClick={() => handlePageChange(totalPages)}
                            className="cursor-pointer hover:bg-accent"
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}
                  </div>

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={
                        currentPage >= totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer hover:bg-accent"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Citation Audit Modal */}
      <CitationAuditModal
        open={citationModalOpen}
        onClose={handleCitationModalClose}
        leadId={selectedLeadId}
        businessName={selectedLead?.businessName}
        onSuccess={() => {
          refetch();
          refetchSummary();
        }}
        onReportProgress={handleCitationReportProgress}
        onReportSuccess={(url) => handleCitationReportProgress("success", url)}
      />

      {/* GEO Ranking Modal */}
      <GeoRankingModal
        open={geoModalOpen}
        onClose={handleGeoModalClose}
        leadId={selectedLeadId}
        onSuccess={() => {
          refetch();
          refetchSummary();
        }}
        onReportProgress={handleGeoReportProgress}
        onReportSuccess={(url) => handleGeoReportProgress("success", url)}
      />

      {/* Lead Classifier Modal */}
      <LeadClassifierModal
        open={leadClassifierModalOpen}
        onClose={handleLeadClassifierModalClose}
        lead={selectedLead}
      />

      {/* Report Progress Modal for GMB reports */}
      {reportStatus && (
        <ReportProgressModal
          open={reportProgressOpen}
          onOpenChange={handleReportProgressClose}
          reportType={reportType}
          status={reportStatus}
          onSuccess={handleReportProgressSuccess}
        />
      )}

      {/* Citation Report Progress Modal */}
      {citationReportStatus && (
        <ReportProgressModal
          open={citationProgressOpen}
          onOpenChange={handleCitationProgressClose}
          reportType="citation-audit"
          status={citationReportStatus}
          onSuccess={handleCitationReportSuccess}
        />
      )}

      {/* Geo Report Progress Modal */}
      {geoReportStatus && (
        <ReportProgressModal
          open={geoProgressOpen}
          onOpenChange={handleGeoProgressClose}
          reportType="geo-ranking"
          status={geoReportStatus}
          onSuccess={handleGeoReportSuccess}
        />
      )}

      {/* Copy URL Modal */}
      <CopyUrlModal
        open={copyUrlModalOpen}
        onOpenChange={setCopyUrlModalOpen}
        reportUrl={reportUrl}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteLeadTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteLeadDescription")}
              <span className="font-medium">
                {t("deleteLeadDescription1", {
                  businessName: leadToDelete?.businessName,
                })}
                {/* {leadToDelete?.businessName} */}
              </span>
              {t("deleteLeadDescription2")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleDeleteCancel}
              disabled={deleteLeadMutation.isPending}
            >
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteLeadMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteLeadMutation.isPending ? t("deleting") : t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
export default Dashboard;
