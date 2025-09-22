import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, Database, Mail, TrendingUp, ArrowUpRight, Plus, UserCheck, CreditCard } from "lucide-react";
import { AddLeadModal } from "../components/AddLeadModal";
import { LeadTableFilters } from "../components/LeadTableFilters";
import { LeadsTable, Lead } from "../components/LeadsTable";
import { CitationAuditModal } from "../components/CitationAuditModal";
import { GeoRankingModal } from "../components/GeoRankingModal";
import { LeadClassifierModal } from "../components/LeadClassifierModal";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { useLeads, ApiLead, useCreateGmbHealthReport, useCreateGmbProspectReport, useLeadSummary, useCreateGeoReport, useDeleteLead } from "@/api/leadApi";
import { toast } from "sonner";
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
const ITEMS_PER_PAGE = 10;

// Transform API lead to UI lead
const transformApiLead = (apiLead: ApiLead): Lead => ({
  id: apiLead.id,
  email: apiLead.email,
  businessName: apiLead.business_name,
  phone: apiLead.phone,
  reportTypeLabel: apiLead.reportTypeLabel,
  date: apiLead.generated_date,
  leadCategoryLabel: apiLead.leadCategoryLabel,
  reportId: apiLead.report_id,
  citationReportId: apiLead.report_id,
  reports: {
    gmbReport: {
      status: (apiLead.reports?.gmbReport?.status === 1 ? 1 : 0) as 0 | 1,
      viewUrl: apiLead.reports?.gmbReport?.viewUrl ?? null
    },
    onPage: {
      status: (apiLead.reports?.onPage?.status === 1 ? 1 : 0) as 0 | 1,
      viewUrl: apiLead.reports?.onPage?.viewUrl ?? null
    },
    citation: {
      status: (apiLead.reports?.citation?.status === 1 ? 1 : 0) as 0 | 1,
      viewUrl: apiLead.reports?.citation?.viewUrl ?? null
    },
    prospect: {
      status: (apiLead.reports?.prospect?.status === 1 ? 1 : 0) as 0 | 1,
      viewUrl: apiLead.reports?.prospect?.viewUrl ?? null
    },
    geo: {
      status: ((apiLead as any)?.reports?.geo?.status === 1 ? 1 : 0) as 0 | 1,
      viewUrl: (apiLead as any)?.reports?.geo?.viewUrl ?? null
    }
  }
});
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
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
    refetch
  } = useLeads({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearchQuery
  });

  // Lead summary API integration
  const {
    data: summaryResponse,
    isLoading: isSummaryLoading,
    refetch: refetchSummary
  } = useLeadSummary();
  const leads = leadsResponse?.data.leads.map(transformApiLead) || [];
  const totalPages = leadsResponse?.data.pagination ? Math.ceil(leadsResponse.data.pagination.total / ITEMS_PER_PAGE) : 0;
  const totalLeads = leadsResponse?.data.pagination?.total || 0;

  // Show error toast
  if (error) {
    toast.error("Failed to fetch leads. Please try again.");
  }
  const handleAddLead = () => {
    // Refetch leads and summary after adding a new lead
    refetch();
    refetchSummary();
  };
  const handleSelectLead = (leadId: string, checked: boolean) => {
    setSelectedLeads(prev => checked ? [...prev, leadId] : prev.filter(id => id !== leadId));
  };
  const handleSelectAll = (checked: boolean) => {
    setSelectedLeads(checked ? leads.map(lead => lead.id) : []);
  };
  const handleAction = (action: string, leadId: string) => {
    console.log(`Action: ${action} for lead: ${leadId}`);
    if (action === 'generate-gmb-health') {
      // Find the lead to get its reportId
      const lead = leads.find(l => l.id === leadId);
      if (lead?.reportId) {
        createGmbHealthReport.mutate({
          reportId: lead.reportId
        }, {
          onSuccess: data => {
            window.open(data.data.reportUrl, '_blank');
            // Refetch leads and summary data to show updated report status
            refetch();
            refetchSummary();
          }
        });
      } else {
        toast.error('Report ID not found for this lead');
      }
    }
    if (action === 'generate-citation') {
      const lead = leads.find(l => l.id === leadId);
      setSelectedLeadId(leadId);
      setSelectedLead(lead || null);
      setCitationModalOpen(true);
    }
    if (action === 'lead-classifier') {
      const lead = leads.find(l => l.id === leadId);
      setSelectedLeadId(leadId);
      setSelectedLead(lead || null);
      setLeadClassifierModalOpen(true);
    }
    if (action === 'generate-geo') {
      // Find the lead to get its reportId
      const lead = leads.find(l => l.id === leadId);
      if (lead?.reportId) {
        setSelectedLeadId(lead.reportId);
        setGeoModalOpen(true);
      } else {
        toast.error('Report ID not found for this lead');
      }
    }
    if (action === 'generate-prospect') {
      // Find the lead to get its reportId
      const lead = leads?.find(l => l.id === leadId);
      if (lead?.reportId) {
        // Create prospect report for the lead
        createGmbProspectReport.mutate({
          reportId: lead.reportId
        }, {
        onSuccess: data => {
          window.open(data.data.reportUrl, '_blank');
          // Refetch leads and summary data to show updated report status
          refetch();
          refetchSummary();
        }
        });
      } else {
        toast.error('No report ID found for this lead');
      }
    }

    if (action === 'delete') {
      const lead = leads?.find(l => l.id === leadId);
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
        leadId: parseInt(leadToDelete.id)
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
  return <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lead Dashboard</h1>
          <p className="text-muted-foreground">Manage and track your leads effectively.</p>
        </div>
        <AddLeadModal onSuccess={handleAddLead} />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className={`bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}>
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-1">
              <h3 className="text-sm font-medium text-gray-600">
                Converted Leads
              </h3>
              <div className="text-3xl font-bold text-gray-900">
                {isSummaryLoading ? "-" : summaryResponse?.data.convertedLeads || 0}
              </div>
            </div>
            <div className={`bg-blue-500 rounded-lg p-3 flex items-center justify-center ml-4`}>
              <UserCheck className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className={`bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}>
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-1">
              <h3 className="text-sm font-medium text-gray-600">
                Total Leads
              </h3>
              <div className="text-3xl font-bold text-gray-900">
                {isSummaryLoading ? "-" : summaryResponse?.data.totalLeads || 0}
              </div>
            </div>
            <div className={`bg-green-500 rounded-lg p-3 flex items-center justify-center ml-4`}>
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className={`bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}>
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-1">
              <h3 className="text-sm font-medium text-gray-600">
                Remaining Credits
              </h3>
              <div className="text-3xl font-bold text-gray-900">
                {isSummaryLoading ? "-" : summaryResponse?.data.credits.remaining.toLocaleString() || 0}
              </div>
            </div>
            <div className={`bg-orange-500 rounded-lg p-3 flex items-center justify-center ml-4`}>
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
            {selectedLeads.length > 0 && <Badge variant="secondary">
                {selectedLeads.length} selected
              </Badge>}
          </div>
        </CardHeader>
        <CardContent>
          <LeadTableFilters searchQuery={searchQuery} onSearchChange={setSearchQuery} emailFilter={emailFilter} onEmailFilterChange={setEmailFilter} categoryFilter={categoryFilter} onCategoryFilterChange={setCategoryFilter} onClearFilters={handleClearFilters} />

          <LeadsTable leads={leads} selectedLeads={selectedLeads} onSelectLead={handleSelectLead} onSelectAll={handleSelectAll} onAction={handleAction} isLoading={isLoading || createGmbHealthReport.isPending || createGmbProspectReport.isPending || createGeoReport.isPending || deleteLeadMutation.isPending} />

          {totalPages > 1 && <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Showing page {currentPage} of {totalPages} ({leads?.length || 0} leads)
              </div>
              <Pagination>
                <PaginationContent className="ml-auto ">
                  <PaginationItem>
                    <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-accent"} />
                  </PaginationItem>

                  {/* Show first page if not in first few pages */}
                  <div className="hidden md:contents">
                  {currentPage > 3 && <>
                      <PaginationItem>
                        <PaginationLink onClick={() => handlePageChange(1)} className="cursor-pointer hover:bg-accent">
                          1
                        </PaginationLink>
                      </PaginationItem>
                      {currentPage > 4 && <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>}
                    </>}

                  {/* Show pages around current page */}
                  {Array.from({
                length: Math.min(3, totalPages)
              }, (_, i) => {
                const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                const page = startPage + i;
                if (page <= totalPages) {
                  return <PaginationItem key={page}>
                          <PaginationLink onClick={() => handlePageChange(page)} isActive={currentPage === page} className="cursor-pointer hover:bg-accent">
                            {page}
                          </PaginationLink>
                        </PaginationItem>;
                }
                return null;
              })}

                  {/* Show last page if not in last few pages */}
                  {currentPage < totalPages - 2 && <>
                      {currentPage < totalPages - 3 && <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>}
                      <PaginationItem>
                        <PaginationLink onClick={() => handlePageChange(totalPages)} className="cursor-pointer hover:bg-accent">
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>}
                  </div>

                  <PaginationItem>
                    <PaginationNext onClick={() => handlePageChange(currentPage + 1)} className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-accent"} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>}
        </CardContent>
      </Card>

      {/* Citation Audit Modal */}
      <CitationAuditModal 
        open={citationModalOpen} 
        onClose={handleCitationModalClose} 
        leadId={selectedLeadId}
        businessName={selectedLead?.businessName}
        phone={selectedLead?.phone}
        onSuccess={() => {
          refetch();
          refetchSummary();
        }}
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
      />

      {/* Lead Classifier Modal */}
      <LeadClassifierModal open={leadClassifierModalOpen} onClose={handleLeadClassifierModalClose} lead={selectedLead} />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lead</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the lead for{" "}
              <span className="font-medium">{leadToDelete?.businessName}</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel} disabled={deleteLeadMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteLeadMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteLeadMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};
export default Dashboard;