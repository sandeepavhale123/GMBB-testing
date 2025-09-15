import React from "react";
import { MessageCircleQuestion } from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface QAEmptyStateProps {
  hasQuestions: boolean;
}

export const QAEmptyState: React.FC<QAEmptyStateProps> = ({ hasQuestions }) => {
  const { t } = useI18nNamespace("QA/qaEmptyState");
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8 sm:p-12 text-center">
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <MessageCircleQuestion className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {hasQuestions
              ? t("qaEmptyState.title.noMatches")
              : t("qaEmptyState.title.noQuestions")}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {hasQuestions
              ? t("qaEmptyState.description.noMatches")
              : t("qaEmptyState.description.noQuestions")}
          </p>
        </div>
      </div>
    </div>
  );
};
