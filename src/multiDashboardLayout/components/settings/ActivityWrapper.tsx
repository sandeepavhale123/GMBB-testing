import React from "react";
import { TeamActivityLogs } from "@/components/TeamActivity";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const ActivityWrapper: React.FC = () => {
  const { t } = useI18nNamespace("Settings/activityWrapper");
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground"> {t("title")}</h2>
        <p className="text-sm text-muted-foreground mt-1">
         {t("description")}
        </p> 
      </div>
      <TeamActivityLogs showMemberFilter={true} />
    </div>
  );
};
