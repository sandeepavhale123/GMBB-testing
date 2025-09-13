import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  Database, 
  Mail, 
  TrendingUp, 
  ArrowUpRight,
  Plus
} from "lucide-react";
import { AddLeadModal } from "../components/AddLeadModal";
import { LeadTableFilters } from "../components/LeadTableFilters";
import { LeadsTable, Lead } from "../components/LeadsTable";
import { CitationAuditModal } from "../components/CitationAuditModal";
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
import { useLeads, ApiLead, useCreateGmbHealthReport, useCreateGmbProspectReport } from "@/api/leadApi";
import { toast } from "sonner";

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
      status: (apiLead.reports.gmbReport.status === 1 ? 1 : 0) as 0 | 1,
      viewUrl: apiLead.reports.gmbReport.viewUrl,
    },
    onPage: {
      status: (apiLead.reports.onPage.status === 1 ? 1 : 0) as 0 | 1,
      viewUrl: apiLead.reports.onPage.viewUrl,
    },
    citation: {
      status: (apiLead.reports.citation.status === 1 ? 1 : 0) as 0 | 1,
      viewUrl: apiLead.reports.citation.viewUrl,
    },
    prospect: {
      status: (apiLead.reports.prospect.status === 1 ? 1 : 0) as 0 | 1,
      viewUrl: apiLead.reports.prospect.viewUrl,
    },
  },
});

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [citationModalOpen, setCitationModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string>("");

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const createGmbHealthReport = useCreateGmbHealthReport();
  const createGmbProspectReport = useCreateGmbProspectReport();

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

  const leads = leadsResponse?.data.leads.map(transformApiLead) || [];
  const totalPages = leadsResponse?.data.pagination ? 
    Math.ceil(leadsResponse.data.pagination.total / ITEMS_PER_PAGE) : 0;
  const totalLeads = leadsResponse?.data.pagination?.total || 0;

  // Show error toast
  if (error) {
    toast.error("Failed to fetch leads. Please try again.");
  }

  const handleAddLead = () => {
    // Refetch leads after adding a new lead
    refetch();
  };

  const handleSelectLead = (leadId: string, checked: boolean) => {
    setSelectedLeads(prev => 
      checked ? [...prev, leadId] : prev.filter(id => id !== leadId)
    );
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
        createGmbHealthReport.mutate(
          { reportId: lead.reportId },
          {
            onSuccess: (data) => {
              navigate(`/module/lead/gmb-health-report/${data.data.reportId}`);
            }
          }
        );
      } else {
        toast.error('Report ID not found for this lead');
      }
    }
    
    if (action === 'generate-citation') {
      setSelectedLeadId(leadId);
      setCitationModalOpen(true);
    }
    
    if (action === 'generate-prospect') {
      // Create prospect report for the lead
      createGmbProspectReport.mutate(
        { leadId: leadId },
        {
          onSuccess: (data) => {
            navigate(`/module/lead/gmb-prospect-report/${data.data.reportId}`);
          }
        }
      );
    }
    
    // Handle other actions here
  };

  const handleCitationModalClose = () => {
    setCitationModalOpen(false);
    setSelectedLeadId("");
    // Optionally refetch leads to update citation report status
    refetch();
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lead Dashboard</h1>
          <p className="text-muted-foreground">Manage and track your leads effectively</p>
        </div>
        <AddLeadModal onSuccess={handleAddLead} />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 inline-flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +8.2%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 inline-flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12.5%
              </span>{" "}
              from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contact List</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 inline-flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +5.3%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Email Templates</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 inline-flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +2 new
              </span>{" "}
              this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Leads</CardTitle>
              <CardDescription>
                Manage your lead database and track interactions
              </CardDescription>
            </div>
            {selectedLeads.length > 0 && (
              <Badge variant="secondary">
                {selectedLeads.length} selected
              </Badge>
            )}
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
            selectedLeads={selectedLeads}
            onSelectLead={handleSelectLead}
            onSelectAll={handleSelectAll}
            onAction={handleAction}
            isLoading={isLoading || createGmbHealthReport.isPending || createGmbProspectReport.isPending}
          />

          {totalPages > 1 && (
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Showing page {currentPage} of {totalPages} ({leads?.length || 0} leads)
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-accent"}
                    />
                  </PaginationItem>
                  
                  {/* Show first page if not in first few pages */}
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
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
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
                  })}
                  
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
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-accent"}
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
      />
    </div>
  );
};

export default Dashboard;