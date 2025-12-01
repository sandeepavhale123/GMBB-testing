import React from "react";
import { Image, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface BulkMediaEmptyStateProps {
  onUploadClick: () => void;
}

export const BulkMediaEmptyState: React.FC<BulkMediaEmptyStateProps> = React.memo(
  ({ onUploadClick }) => {
    const { t } = useI18nNamespace("MultidashboardPages/bulkMedia");

    return (
      <div className="text-center py-12">
        <Image className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h4 className="text-lg font-medium text-foreground mb-2">
          {t("messages.noMediaTitle")}
        </h4>
        <p className="text-muted-foreground mb-4">
          {t("messages.noMediaDescription")}
        </p>
        <Button onClick={onUploadClick}>
          <Upload className="w-4 h-4 mr-1" />
          {t("buttons.upload")}
        </Button>
      </div>
    );
  }
);

BulkMediaEmptyState.displayName = "BulkMediaEmptyState";
