import React from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export type ReportType =
  | "gmb-health"
  | "citation-audit"
  | "geo-ranking"
  | "gmb-prospect";

interface ReportProgressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportType: ReportType;
  status: "loading" | "success" | "error";
  onSuccess?: () => void;
}

const getLoadingMessage = (reportType: ReportType): string => {
  const messages = {
    "gmb-health": "Generating GMB Health Report...",
    "citation-audit": "Generating Citation Audit Report...",
    "geo-ranking": "Generating GEO Ranking Report...",
    "gmb-prospect": "Generating GMB Prospect Report...",
  };
  return messages[reportType];
};

const getSuccessMessage = (reportType: ReportType): string => {
  const messages = {
    "gmb-health": "GMB Health Report Generated Successfully!",
    "citation-audit": "Citation Audit Report Generated Successfully!",
    "geo-ranking": "GEO Ranking Report Generated Successfully!",
    "gmb-prospect": "GMB Prospect Report Generated Successfully!",
  };
  return messages[reportType];
};

export const ReportProgressModal: React.FC<ReportProgressModalProps> = ({
  open,
  onOpenChange,
  reportType,
  status,
  onSuccess,
}) => {
  const { t } = useI18nNamespace("Dashboard/reportProgressModal");
  React.useEffect(() => {
    if (open && status === "success" && onSuccess) {
      // Small delay to show success state briefly before transitioning
      const timer = setTimeout(() => {
        onSuccess();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [open, status, onSuccess]);

  const renderContent = () => {
    if (status === "loading") {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium text-center">
            {t(`loadingMessage.${reportType}`)}
            {/* {getLoadingMessage(reportType)} */}
          </p>
          <p className="text-sm text-muted-foreground text-center mt-2">
            {t("loadingSubText")}
          </p>
        </div>
      );
    }

    if (status === "success") {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
          <p className="text-lg font-medium text-center">
            {/* {getSuccessMessage(reportType)} */}
            {t(`successMessage.${reportType}`)}
          </p>
          <p className="text-sm text-muted-foreground text-center mt-2">
            {t("successSubText")}
          </p>
        </div>
      );
    }

    if (status === "error") {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <XCircle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-lg font-medium text-center">{t("failReport")}</p>
          <p className="text-sm text-muted-foreground text-center mt-2">
            {t("errorSubText")}
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {status === "loading" && t("loadingTitle")}
            {status === "success" && t("successTitle")}
            {status === "error" && t("errorTitle")}
          </DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};
