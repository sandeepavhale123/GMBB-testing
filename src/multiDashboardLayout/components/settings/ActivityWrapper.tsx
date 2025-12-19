import React, { useState, useCallback } from "react";
import { TeamActivityLogs } from "@/components/TeamActivity";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface PaginationData {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export const ActivityWrapper: React.FC = () => {
  const { t } = useI18nNamespace("Settings/activityWrapper");
  const [paginationData, setPaginationData] = useState<PaginationData>({ total: 0, page: 1, totalPages: 1, limit: 20 });
  const [isLoadingData, setIsLoadingData] = useState(true);

  const handlePaginationChange = useCallback((pagination: PaginationData, isLoading: boolean) => {
    setPaginationData(pagination);
    setIsLoadingData(isLoading);
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">{t("title")}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t("description")}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-100 p-3 rounded-md mb-0">
          <p className="text-sm text-muted-foreground">{t("totalReplies")}:</p>
          <p className="bg-blue-500 text-white rounded px-2 py-1 text-sm">{isLoadingData ? " " : paginationData.total}</p>
        </div>
      </div>
      <TeamActivityLogs showMemberFilter={true} onPaginationChange={handlePaginationChange} />
    </div>
  );
};
