import React from "react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const MediaEmptyState: React.FC = () => {
  const { t } = useI18nNamespace("Media/mediaEmptyState");
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {t("mediaEmptyState.title")}
        </h2>
      </div>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800">{t("mediaEmptyState.description")}</p>
      </div>
    </div>
  );
};
