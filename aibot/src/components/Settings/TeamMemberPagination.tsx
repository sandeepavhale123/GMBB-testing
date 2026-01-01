import React from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TeamPaginationInfo } from "../../api/teamApi";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface TeamMemberPaginationProps {
  pagination: TeamPaginationInfo;
  onPageChange: (page: number) => void;
}

export const TeamMemberPagination: React.FC<TeamMemberPaginationProps> = ({
  pagination,
  onPageChange,
}) => {
  const { t } = useI18nNamespace("Settings/teamMemberPagination");
  if (pagination.totalPages <= 1) {
    return null;
  }

  const startItem = (pagination.currentPage - 1) * pagination.itemsPerPage + 1;
  const endItem = Math.min(
    pagination.currentPage * pagination.itemsPerPage,
    pagination.totalItems
  );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-border gap-4">
      <p className="text-sm text-muted-foreground order-2 sm:order-1">
        {t("teamMemberPagination.info", {
          start: startItem,
          end: endItem,
          total: pagination.totalItems,
        })}
        {/* Showing {startItem} to {endItem} of {pagination.totalItems} members */}
      </p>
      <div className="flex items-center gap-2 order-1 sm:order-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.currentPage - 1)}
          disabled={!pagination.hasPreviousPage}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">
            {t("teamMemberPagination.previous")}
          </span>
        </Button>
        <span className="text-sm text-muted-foreground px-2">
          {t("teamMemberPagination.pageInfo", {
            current: pagination.currentPage,
            total: pagination.totalPages,
          })}
          {/* Page {pagination.currentPage} of {pagination.totalPages} */}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className="flex items-center gap-1"
        >
          <span className="hidden sm:inline">
            {t("teamMemberPagination.next")}
          </span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
