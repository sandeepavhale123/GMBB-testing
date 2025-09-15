import React from "react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const QAHeader: React.FC = () => {
  const { t } = useI18nNamespace("QA/qaHeader");
  return (
    <div className="space-y-2">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
        {t("qaHeader.title")}
      </h1>
      <p className="text-gray-600 text-sm sm:text-base">
        {t("qaHeader.description")}
      </p>
    </div>
  );
};
