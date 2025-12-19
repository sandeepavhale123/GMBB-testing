import React from "react";
import { TeamActivityLogs } from "@/components/TeamActivity";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import { Badge } from "@/components/ui/badge";

export const ActivityWrapper: React.FC = () => {
  const { t } = useI18nNamespace("Settings/activityWrapper");
  const { pagination, isLoading } = useActivityLogs();

  return (
    <div className="p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">{t("title")}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t("description")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{t("totalReplies")}:</span>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {isLoading ? "..." : pagination.total}
          </Badge>
        </div>
      </div>
      <TeamActivityLogs showMemberFilter={true} />
    </div>
  );
};
