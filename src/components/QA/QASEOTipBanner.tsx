import React from "react";
import { X, Lightbulb } from "lucide-react";
import { Button } from "../ui/button";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface QASEOTipBannerProps {
  onDismiss: () => void;
}

export const QASEOTipBanner: React.FC<QASEOTipBannerProps> = ({
  onDismiss,
}) => {
  const { t } = useI18nNamespace("QA/qaSEOTipBanner");
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
      <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-blue-800">
          <strong>{t("qaSEOTipBanner.tip")}</strong> {t("qaSEOTipBanner.use")}
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDismiss}
        className="text-blue-600 hover:text-blue-800 p-1 h-auto"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
