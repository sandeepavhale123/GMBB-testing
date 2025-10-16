import React from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface MediaPaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export const MediaPagination: React.FC<MediaPaginationProps> = ({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  onPageChange,
  totalItems,
  itemsPerPage,
}) => {
  const { t } = useI18nNamespace("Media/mediaPagination");
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevious = () => {
    if (hasPrev) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
      <div className="text-sm text-gray-600">
        {t("mediaPagination.showing", {
          start: startItem,
          end: endItem,
          total: totalItems,
        })}
        {/* Showing {startItem} to {endItem} of {totalItems} media files */}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={!hasPrev}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{t("mediaPagination.previous")}</span>
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(totalPages, 9) }, (_, i) => i + 1).map((pageNum) => (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              className="w-8 h-8 p-0"
            >
              {pageNum}
            </Button>
          ))}
          {totalPages > 9 && (
            <span className="text-sm text-gray-600 px-2">...</span>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={!hasNext}
          className="flex items-center gap-1"
        >
          <span className="hidden sm:inline">{t("mediaPagination.next")}</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
