import React from "react";
import { MessageSquare, Filter } from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface ReviewsEmptyStateProps {
  hasFilters: boolean;
  totalReviewsCount: number;
}

export const ReviewsEmptyState: React.FC<ReviewsEmptyStateProps> = ({
  hasFilters,
  totalReviewsCount,
}) => {
  const isFiltered = hasFilters && totalReviewsCount > 0;
  const { t } = useI18nNamespace("Reviews/reviewsEmptyState");
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8 sm:p-12 text-center">
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            {isFiltered ? (
              <Filter className="h-8 w-8 text-gray-400" />
            ) : (
              <MessageSquare className="h-8 w-8 text-gray-400" />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {isFiltered
              ? t("reviewsEmptyState.title.filtered")
              : t("reviewsEmptyState.title.default")}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {isFiltered
              ? t("reviewsEmptyState.description.filtered")
              : t("reviewsEmptyState.description.default")}
          </p>
        </div>
      </div>
    </div>
  );
};
