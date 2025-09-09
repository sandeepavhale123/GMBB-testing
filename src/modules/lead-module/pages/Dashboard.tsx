import React, { useState, useMemo } from "react";
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

const ITEMS_PER_PAGE = 10;

// Sample data - replace with real API calls
const sampleLeads: Lead[] = [
  {
    id: "1",
    email: "john@pizzapalace.com",
    businessName: "Pizza Palace",
    phone: "+1 234-567-8901",
    leadType: "Hot",
    date: "2024-01-15",
    category: "Restaurant"
  },
  {
    id: "2", 
    email: "sarah@techsolutions.com",
    businessName: "Tech Solutions Inc",
    phone: "+1 234-567-8902",
    leadType: "Warm",
    date: "2024-01-14",
    category: "Technology"
  },
  {
    id: "3",
    email: "mike@healthclinic.com", 
    businessName: "Downtown Health Clinic",
    phone: "+1 234-567-8903",
    leadType: "Cold",
    date: "2024-01-13",
    category: "Healthcare"
  },
  {
    id: "4",
    email: "lisa@fashionstore.com",
    businessName: "Fashion Forward Store",
    phone: "+1 234-567-8904", 
    leadType: "Hot",
    date: "2024-01-12",
    category: "Retail"
  },
  {
    id: "5",
    email: "david@realestate.com",
    businessName: "Prime Real Estate",
    phone: "+1 234-567-8905",
    leadType: "Warm", 
    date: "2024-01-11",
    category: "Real Estate"
  }
];

const Dashboard: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(sampleLeads);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const debouncedEmailFilter = useDebounce(emailFilter, 300);

  // Filter and paginate leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch = lead.businessName.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      const matchesEmail = lead.email.toLowerCase().includes(debouncedEmailFilter.toLowerCase());
      const matchesCategory = !categoryFilter || categoryFilter === "all" || lead.category === categoryFilter;
      
      return matchesSearch && matchesEmail && matchesCategory;
    });
  }, [leads, debouncedSearchQuery, debouncedEmailFilter, categoryFilter]);

  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleAddLead = (leadData: any) => {
    const newLead: Lead = {
      id: Date.now().toString(),
      email: `contact@${leadData.businessName.toLowerCase().replace(/\s+/g, '')}.com`,
      businessName: leadData.businessName,
      phone: "+1 234-567-8900",
      leadType: "Cold",
      date: new Date().toISOString().split('T')[0],
      category: "Other"
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const handleSelectLead = (leadId: string, checked: boolean) => {
    setSelectedLeads(prev => 
      checked ? [...prev, leadId] : prev.filter(id => id !== leadId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedLeads(checked ? paginatedLeads.map(lead => lead.id) : []);
  };

  const handleAction = (action: string, leadId: string) => {
    console.log(`Action: ${action} for lead: ${leadId}`);
    // Implement action handlers
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
        <AddLeadModal onAddLead={handleAddLead} />
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
            <div className="text-2xl font-bold">{leads.length}</div>
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
            leads={paginatedLeads}
            selectedLeads={selectedLeads}
            onSelectLead={handleSelectLead}
            onSelectAll={handleSelectAll}
            onAction={handleAction}
            isLoading={isLoading}
          />

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;