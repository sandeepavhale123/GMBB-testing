import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ActionDropdown } from "./ActionDropdown";
import { format, parse, isValid } from "date-fns";

export interface Lead {
  id: string;
  email: string;
  businessName: string;
  phone: string;
  reportTypeLabel: string;
  date: string;
  leadCategoryLabel: string;
  reportId: string;
  citationReportId?: string;
  reports: {
    gmbReport?: {
      status: 0 | 1;
      viewUrl: string | null;
    };
    onPage?: {
      status: 0 | 1;
      viewUrl: string | null;
    };
    citation?: {
      status: 0 | 1;
      viewUrl: string | null;
    };
    prospect?: {
      status: 0 | 1;
      viewUrl: string | null;
    };
  };
}

interface LeadsTableProps {
  leads: Lead[];
  selectedLeads: string[];
  onSelectLead: (leadId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onAction: (action: string, leadId: string) => void;
  isLoading?: boolean;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
  selectedLeads,
  onSelectLead,
  onSelectAll,
  onAction,
  isLoading = false,
}) => {
  const isAllSelected = leads.length > 0 && selectedLeads.length === leads.length;
  const isIndeterminate = selectedLeads.length > 0 && selectedLeads.length < leads.length;

  const formatDate = (dateString: string) => {
    try {
      // Parse MM/dd/yyyy format from API
      const parsedDate = parse(dateString, "MM/dd/yyyy", new Date());
      if (isValid(parsedDate)) {
        return format(parsedDate, "dd-MM-yy");
      }
      // Fallback to original string if parsing fails
      return dateString;
    } catch (error) {
      // Return original string if any error occurs
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox disabled />
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Business Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="w-16">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><div className="h-4 w-4 bg-muted rounded animate-pulse" /></TableCell>
                <TableCell><div className="h-4 w-32 bg-muted rounded animate-pulse" /></TableCell>
                <TableCell><div className="h-4 w-24 bg-muted rounded animate-pulse" /></TableCell>
                <TableCell><div className="h-4 w-20 bg-muted rounded animate-pulse" /></TableCell>
                <TableCell><div className="h-4 w-16 bg-muted rounded animate-pulse" /></TableCell>
                <TableCell><div className="h-4 w-16 bg-muted rounded animate-pulse" /></TableCell>
                <TableCell><div className="h-8 w-8 bg-muted rounded animate-pulse" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={onSelectAll}
                aria-label="Select all"
                {...(isIndeterminate && { "data-state": "indeterminate" })}
              />
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Business Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="w-16">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No leads found. Add your first lead to get started.
              </TableCell>
            </TableRow>
          ) : (
            leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedLeads.includes(lead.id)}
                    onCheckedChange={(checked) => 
                      onSelectLead(lead.id, checked as boolean)
                    }
                    aria-label={`Select ${lead.businessName}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{lead.email || 'N/A'}</TableCell>
                <TableCell>{lead.businessName}</TableCell>
                <TableCell>{lead.phone}</TableCell>
                <TableCell>
                  {lead.date}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{lead.leadCategoryLabel}</Badge>
                </TableCell>
                <TableCell>
                  <ActionDropdown 
                    onAction={onAction} 
                    leadId={lead.id} 
                    reports={lead.reports} 
                    reportId={lead.reportId}
                    citationReportId={lead.citationReportId || lead.reportId}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};