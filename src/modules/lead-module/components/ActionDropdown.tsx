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
  Globe, 
  Search, 
  Target, 
  TrendingUp, 
  Mail, 
  Trash2 
} from "lucide-react";

interface ActionDropdownProps {
  onAction: (action: string, leadId: string) => void;
  leadId: string;
}

export const ActionDropdown: React.FC<ActionDropdownProps> = ({ onAction, leadId }) => {
  const navigate = useNavigate();
  
  const handleAction = (action: string) => {
    if (action === 'gmb-report') {
      navigate('/module/lead/gmb-health-report');
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
        <DropdownMenuItem onClick={() => handleAction('gmb-report')}>
          <FileText className="mr-2 h-4 w-4" />
          View GMB Report
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction('onpage-report')}>
          <Globe className="mr-2 h-4 w-4" />
          View On Page Report
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction('citation-audit')}>
          <Search className="mr-2 h-4 w-4" />
          View Citation Audit Report
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction('competitor-report')}>
          <Target className="mr-2 h-4 w-4" />
          View Competitor Report
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction('gmb-prospect')}>
          <TrendingUp className="mr-2 h-4 w-4" />
          View GMB Prospect Report
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