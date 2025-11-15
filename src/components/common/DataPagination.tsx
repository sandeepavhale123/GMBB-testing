import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface DataPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  align?: "left" | "center" | "right";
  showItemCount?: boolean;
  maxPageButtons?: number;
}

export const DataPagination: React.FC<DataPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  align = "right",
  showItemCount = true,
  maxPageButtons = 4,
}) => {
  // Calculate item count display
  const startItem =
    totalItems && itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : null;
  const endItem =
    totalItems && itemsPerPage
      ? Math.min(currentPage * itemsPerPage, totalItems)
      : null;

  // Generate page numbers with ellipsis logic - max 4 page buttons
  const getPageNumbers = (): (number | "ellipsis")[] => {
    if (totalPages <= maxPageButtons) {
      // Show all pages if total is within limit
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "ellipsis")[] = [];

    if (currentPage <= 2) {
      // Near the beginning: [1] [2] [3] [4] ... [last]
      for (let i = 1; i <= maxPageButtons; i++) {
        pages.push(i);
      }
      pages.push("ellipsis");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 1) {
      // Near the end: [1] ... [n-3] [n-2] [n-1] [n]
      pages.push(1);
      pages.push("ellipsis");
      for (let i = totalPages - maxPageButtons + 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // In the middle: [1] ... [current-1] [current] [current+1] [current+2] ... [last]
      pages.push(1);
      pages.push("ellipsis");
      for (let i = currentPage - 1; i <= Math.min(currentPage + 2, totalPages - 1); i++) {
        pages.push(i);
      }
      pages.push("ellipsis");
      pages.push(totalPages);
    }

    return pages;
  };

  const alignmentClass = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  }[align];

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center ${alignmentClass} gap-4 flex-wrap`}>
      {/* Optional item count */}
      {showItemCount && totalItems && startItem && endItem && (
        <div className="text-sm text-muted-foreground">
          Showing {startItem} to {endItem} of {totalItems} results
        </div>
      )}

      {/* Pagination controls */}
      <Pagination className={alignmentClass}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              className={
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {getPageNumbers().map((item, index) =>
            item === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <PaginationLink
                  onClick={() => onPageChange(item as number)}
                  isActive={currentPage === item}
                  className="cursor-pointer"
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                onPageChange(Math.min(currentPage + 1, totalPages))
              }
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
