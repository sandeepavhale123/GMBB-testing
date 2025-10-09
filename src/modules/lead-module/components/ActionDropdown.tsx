import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  FileText,
  Search,
  TrendingUp,
  Mail,
  Trash2,
  MapPin,
  Tags,
} from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface ReportStatus {
  status: 0 | 1;
  viewUrl: string | null;
}

interface Reports {
  gmbReport?: ReportStatus;
  onPage?: ReportStatus;
  citation?: ReportStatus;
  prospect?: ReportStatus;
  geo?: ReportStatus;
}

interface ActionDropdownProps {
  onAction: (action: string, leadId: string) => void;
  leadId: string;
  reports: Reports;
  reportId?: string;
  citationReportId?: string;
}

export const ActionDropdown: React.FC<ActionDropdownProps> = ({
  onAction,
  leadId,
  reports,
  reportId,
  citationReportId,
}) => {
  const { t } = useI18nNamespace("Laed-module-component/ActionDropdown");
  const handleAction = (action: string, viewUrl?: string) => {
    // Handle view actions with external URLs
    if (
      viewUrl &&
      (action === "view-gmb-health" ||
        action === "view-citation" ||
        action === "view-prospect" ||
        action === "view-geo")
    ) {
      window.open(viewUrl, "_blank");
      return;
    }

    onAction(action, leadId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">{t("actionDropdown.openMenu")}</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() =>
            handleAction(
              reports?.gmbReport?.status === 1
                ? "view-gmb-health"
                : "generate-gmb-health",
              reports?.gmbReport?.viewUrl || undefined
            )
          }
        >
          <FileText className="mr-2 h-4 w-4" />
          {reports?.gmbReport?.status === 1
            ? t("actionDropdown.viewGmbHealthReport")
            : t("actionDropdown.generateGmbHealthReport")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            handleAction(
              reports?.citation?.status === 1
                ? "view-citation"
                : "generate-citation",
              reports?.citation?.viewUrl || undefined
            )
          }
        >
          <Search className="mr-2 h-4 w-4" />
          {reports?.citation?.status === 1
            ? t("actionDropdown.viewCitationAuditReport")
            : t("actionDropdown.generateCitationAuditReport")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            handleAction(
              reports?.geo?.status === 1 ? "view-geo" : "generate-geo",
              reports?.geo?.viewUrl || undefined
            )
          }
        >
          <MapPin className="mr-2 h-4 w-4" />
          {reports?.geo?.status === 1
            ? t("actionDropdown.viewGeoRankingReport")
            : t("actionDropdown.generateGeoRankingReport")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            handleAction(
              reports?.prospect?.status === 1
                ? "view-prospect"
                : "generate-prospect",
              reports?.prospect?.viewUrl || undefined
            )
          }
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          {reports?.prospect?.status === 1
            ? t("actionDropdown.viewGmbProspectReport")
            : t("actionDropdown.generateGmbProspectReport")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleAction("lead-classifier")}>
          <Tags className="mr-2 h-4 w-4" />
          {t("actionDropdown.leadClassifier")}
        </DropdownMenuItem>
        {/* <DropdownMenuItem onClick={() => handleAction('send-email')}>
          <Mail className="mr-2 h-4 w-4" />
          Send Email
        </DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleAction("delete")}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {t("actionDropdown.delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
