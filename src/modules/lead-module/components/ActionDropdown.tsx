import React from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  FileText, 
  Search, 
  TrendingUp, 
  Mail, 
  Trash2 
} from "lucide-react";

interface ReportStatus {
  status: 0 | 1;
  viewUrl: string | null;
}

interface Reports {
  gmbReport: ReportStatus;
  onPage: ReportStatus;
  citation: ReportStatus;
  prospect: ReportStatus;
}

interface ActionDropdownProps {
  onAction: (action: string, leadId: string) => void;
  leadId: string;
  reports: Reports;
  reportId?: string;
  citationReportId?: string;
}

export const ActionDropdown: React.FC<ActionDropdownProps> = ({ onAction, leadId, reports, reportId, citationReportId }) => {
  const navigate = useNavigate();
  
  const handleAction = (action: string, viewUrl?: string, reportId?: string) => {
    // Handle GMB Health Report navigation
    if (action === 'view-gmb-health' && reportId) {
      navigate(`/module/lead/gmb-health-report/${reportId}`);
      return;
    }
    
    // Handle Citation Audit Report navigation
    if (action === 'view-citation' && citationReportId) {
      navigate(`/module/lead/citation-audit-report/${citationReportId}`);
      return;
    }
    
    // Handle other report views with external URLs
    if (viewUrl && action !== 'view-gmb-health' && action !== 'view-citation') {
      window.open(viewUrl, '_blank');
      return;
    }
    
    onAction(action, leadId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem 
          onClick={() => handleAction(
            reports.gmbReport.status === 1 ? 'view-gmb-health' : 'generate-gmb-health',
            reports.gmbReport.viewUrl || undefined,
            reportId
          )}
        >
          <FileText className="mr-2 h-4 w-4" />
          {reports.gmbReport.status === 1 ? 'View GMB Health Report' : 'Generate GMB Health Report'}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleAction(
            reports.citation.status === 1 ? 'view-citation' : 'generate-citation',
            reports.citation.viewUrl || undefined,
            citationReportId
          )}
        >
          <Search className="mr-2 h-4 w-4" />
          {reports.citation.status === 1 ? 'View Citation Audit Report' : 'Generate Citation Audit Report'}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleAction(
            reports.prospect.status === 1 ? 'view-prospect' : 'generate-prospect',
            reports.prospect.viewUrl || undefined
          )}
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          {reports.prospect.status === 1 ? 'View GMB Prospect Report' : 'Generate GMB Prospect Report'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleAction('send-email')}>
          <Mail className="mr-2 h-4 w-4" />
          Send Email
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => handleAction('delete')}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};