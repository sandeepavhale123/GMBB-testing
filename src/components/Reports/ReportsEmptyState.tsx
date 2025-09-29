import React from "react";
import { Clock, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface ReportsEmptyStateProps {
  onRefresh?: () => void;
}

export const ReportsEmptyState: React.FC<ReportsEmptyStateProps> = ({
  onRefresh,
}) => {
  const { t } = useI18nNamespace("Reports/reportsEmptyState");
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
        <Clock className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">
        {t("reportsEmptyState.title")}
      </h3>
      <p className="text-muted-foreground mb-4 max-w-md mx-auto">
        {t("reportsEmptyState.description")}
      </p>
      {onRefresh && (
        <Button onClick={onRefresh} variant="outline">
          <FileText className="w-4 h-4 mr-1" />
          {t("reportsEmptyState.tryAgainButton")}
        </Button>
      )}
    </div>
  );
};
