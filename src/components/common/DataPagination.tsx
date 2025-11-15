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

  // Generate page numbers with ellipsis logic
  const getPageNumbers = (): (number | "ellipsis")[] => {
    if (totalPages <= maxPageButtons + 2) {
      // Show all pages if total is small
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "ellipsis")[] = [];

    // Always show first page
    pages.push(1);

    if (currentPage <= Math.ceil(maxPageButtons / 2) + 1) {
      // Near the beginning
      for (let i = 2; i <= maxPageButtons + 1; i++) {
        pages.push(i);
      }
      pages.push("ellipsis");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - Math.floor(maxPageButtons / 2)) {
      // Near the end
      pages.push("ellipsis");
      for (let i = totalPages - maxPageButtons; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // In the middle
      pages.push("ellipsis");
      const start = currentPage - Math.floor((maxPageButtons - 2) / 2);
      const end = currentPage + Math.ceil((maxPageButtons - 2) / 2);
      for (let i = start; i <= end; i++) {
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
    <div className="flex items-center justify-between gap-4 flex-wrap md:flex-nowrap">
      {/* Optional item count */}
      {showItemCount && totalItems && startItem && endItem && (
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          Showing {startItem} to {endItem} of {totalItems} results
        </div>
      )}

      {/* Pagination controls */}
      <Pagination className="justify-end">
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
