import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search } from "lucide-react";
import { useCreditHistory } from "../hooks/useCreditHistory";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
const CreditHistory: React.FC = () => {
  const { t } = useI18nNamespace("Geo-Ranking-module-pages/CreditHistory");
  const { creditHistory, isLoading, searchTerm, handleSearchChange } =
    useCreditHistory();

  // frontend pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(creditHistory.length / itemsPerPage);
  const currentData = creditHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate limited page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 3; // how many numbers to show around currentPage

    if (totalPages <= 5) {
      // show all if small
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1); // always show first

      if (currentPage > maxVisible) {
        pages.push("..."); // left ellipsis
      }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - (maxVisible - 1)) {
        pages.push("..."); // right ellipsis
      }
      pages.push(totalPages); // always show last
    }
    return pages;
  };
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-4 bg-muted rounded w-1/6"></div>
                  <div className="h-4 bg-muted rounded w-1/5"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("creditHistory.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("creditHistory.description")}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center w-full">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t("creditHistory.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium">
                    {t("creditHistory.table.keyword")}
                  </th>
                  <th className="text-left py-3 px-4 font-medium">
                    {t("creditHistory.table.type")}
                  </th>
                  <th className="text-left py-3 px-4 font-medium">
                    {t("creditHistory.table.credit")}
                  </th>
                  <th className="text-right py-3 px-4 font-medium">
                    {" "}
                    {t("creditHistory.table.date")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border/50 hover:bg-muted/50"
                  >
                    <td className="py-3 px-4">
                      <span className="font-medium text-muted-foreground">
                        {item.keyword}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-muted-foreground">{item.type}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-muted-foreground">
                        {item.credit}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-right">
                      {item.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {creditHistory.length === 0 && !isLoading && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {" "}
                  {t("creditHistory.empty.title")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("creditHistory.empty.subtitle")}
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 flex justify-end">
              <Pagination>
                {/* <PaginationContent className="ml-auto ">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {getPageNumbers().map((page, i) =>
                    typeof page === "number" ? (
                      <PaginationItem key={i}>
                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={i}>
                        <span className="px-3 py-2 text-muted-foreground">
                          ...
                        </span>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent> */}
                <PaginationContent className="ml-auto">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      className={
                        currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>

                  {/* ✅ Sliding 5-page window */}
                  {(() => {
                    const pagesToShow: number[] = [];
                    const total = totalPages;

                    if (total <= 5) {
                      // Case 1: show all
                      for (let p = 1; p <= total; p++) pagesToShow.push(p);
                    } else if (currentPage <= 3) {
                      // Case 2: near start
                      pagesToShow.push(1, 2, 3, 4, 5);
                    } else if (currentPage >= total - 2) {
                      // Case 3: near end
                      pagesToShow.push(
                        total - 4,
                        total - 3,
                        total - 2,
                        total - 1,
                        total
                      );
                    } else {
                      // Case 4: middle sliding window
                      pagesToShow.push(
                        currentPage - 2,
                        currentPage - 1,
                        currentPage,
                        currentPage + 1,
                        currentPage + 2
                      );
                    }

                    return pagesToShow.map((pageNum) => (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => handlePageChange(pageNum)}
                          isActive={pageNum === currentPage}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    ));
                  })()}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                      }
                      className={
                        currentPage >= totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditHistory;
