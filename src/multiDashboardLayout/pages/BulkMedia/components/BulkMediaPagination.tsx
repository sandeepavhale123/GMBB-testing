import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface BulkMediaPaginationProps {
  pagination: PaginationState;
  onGoToPage: (page: number) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export const BulkMediaPagination: React.FC<BulkMediaPaginationProps> = React.memo(
  ({ pagination, onGoToPage, onPrevPage, onNextPage }) => {
    const { t } = useI18nNamespace("MultidashboardPages/bulkMedia");

    const getPageNumbers = () => {
      const maxButtons = 5;
      const totalPages = pagination.totalPages;
      const currentPage = pagination.currentPage;

      let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
      let endPage = Math.min(totalPages, startPage + maxButtons - 1);

      if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }

      return Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
      );
    };

    return (
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
          <p className="text-sm text-muted-foreground sm:mr-auto">
            {t("pagination.showing", {
              from:
                (pagination.currentPage - 1) * pagination.itemsPerPage + 1,
              to: Math.min(
                pagination.currentPage * pagination.itemsPerPage,
                pagination.totalItems
              ),
              total: pagination.totalItems,
            })}
          </p>

          {pagination.totalPages > 1 && (
            <Pagination className="mr-0 flex align-end justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={onPrevPage}
                    className={
                      !pagination.hasPrevious
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {getPageNumbers().map((pageNum) => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => onGoToPage(pageNum)}
                      isActive={pageNum === pagination.currentPage}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={onNextPage}
                    className={
                      !pagination.hasNext
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    );
  }
);

BulkMediaPagination.displayName = "BulkMediaPagination";
