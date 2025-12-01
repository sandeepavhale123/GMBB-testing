import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface Step4CompleteProps {
  historyId?: number;
}

export const Step4Complete = React.memo<Step4CompleteProps>(({ historyId }) => {
  const { t } = useI18nNamespace("MultidashboardPages/importPostCSVWizard");
  const navigate = useNavigate();

  return (
    <div className="space-y-6 text-center py-8">
      <div className="text-6xl">🎉</div>
      <div>
        <h2 className="text-2xl font-semibold mb-2">
          {t("importPostCSVWizard.submit.heading")}
        </h2>
        <p className="text-muted-foreground">
          {t("importPostCSVWizard.submit.description")}
        </p>
      </div>

      <div className="flex justify-center gap-4">
        <Button onClick={() => navigate("/main-dashboard")}>
          {t("importPostCSVWizard.submit.goToDashboard")}
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate(`/main-dashboard/bulk-import-details/${historyId}`)}
        >
          {t("importPostCSVWizard.submit.viewPostDetails")}
        </Button>
      </div>
    </div>
  );
});

Step4Complete.displayName = "Step4Complete";
