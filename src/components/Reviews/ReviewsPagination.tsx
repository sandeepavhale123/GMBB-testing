import React from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationResponse } from "../../services/reviewService";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface ReviewsPaginationProps {
  pagination: PaginationResponse;
  onPageChange: (page: number) => void;
}

export const ReviewsPagination: React.FC<ReviewsPaginationProps> = ({
  pagination,
  onPageChange,
}) => {
  const { t } = useI18nNamespace("Reviews/reviewsPagination");
  if (pagination.total_pages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-gray-200 gap-4">
      <p className="text-sm text-gray-600 order-2 sm:order-1">
        {t("reviewsPagination.showing", {
          start: (pagination.page - 1) * pagination.limit + 1,
          end: Math.min(pagination.page * pagination.limit, pagination.total),
          total: pagination.total,
        })}
        {/* Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
        {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
        {pagination.total} reviews */}
      </p>
      <div className="flex items-center gap-2 order-1 sm:order-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={!pagination.has_prev}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">
            {t("reviewsPagination.previous")}
          </span>
        </Button>
        <span className="text-sm text-gray-600 px-2">
          {t("reviewsPagination.pageInfo", {
            page: pagination.page,
            totalPages: pagination.total_pages,
          })}
          {/* Page {pagination.page} of {pagination.total_pages} */}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={!pagination.has_next}
          className="flex items-center gap-1"
        >
          <span className="hidden sm:inline">
            {t("reviewsPagination.next")}
          </span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
