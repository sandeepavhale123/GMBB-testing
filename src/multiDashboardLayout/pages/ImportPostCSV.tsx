import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Eye, Trash2, Search, Import } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TableRowSkeleton } from "@/components/ui/table-row-skeleton";
import { useBulkCSVHistory } from "@/hooks/useBulkCSVHistory";
import { BulkCSVHistoryRecord } from "@/api/csvApi";
import { useToast } from "@/hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { start } from "repl";

export const ImportPostCSV: React.FC = () => {
  const { t } = useI18nNamespace("MultidashboardPages/importPostCSV");

  const getStatusVariant = useCallback((status: string) => {
    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus === "completed") return "default";
    if (normalizedStatus === "processing") return "secondary";
    if (normalizedStatus === "failed") return "destructive";

    return "secondary";
  }, []);

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case t("importPostCSV.status.completed"):
        return "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300";
      case t("importPostCSV.status.processing"):
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-300";
      case t("importPostCSV.status.failed"):
        return "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };



  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    data: csvHistory,
    loading,
    searchLoading,
    error,
    pagination,
    searchTerm,
    setSearchTerm,
    setPage,
    deleteRecord,
  } = useBulkCSVHistory(10);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] =
    useState<BulkCSVHistoryRecord | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleImport = () => {
    navigate("/main-dashboard/import-post-csv-wizard");
  };

  const handleView = (id: string) => {
    navigate(`/main-dashboard/bulk-import-details/${id}`);
  };

  const handleDelete = (id: string) => {
    const record = csvHistory.find((r) => r.id === id);
    if (record) {
      setRecordToDelete(record);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!recordToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteRecord(recordToDelete.id);

      toast({
        title: t("importPostCSV.toast.successTitle"),
        description: t("importPostCSV.toast.successMessage"),
        variant: "default",
      });

      setDeleteDialogOpen(false);
      setRecordToDelete(null);
    } catch (error: any) {
      toast({
        title: t("importPostCSV.toast.errorTitle"),
        description: error.message || t("importPostCSV.toast.errorMessage"),
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const renderPaginationNumbers = () => {
    const pages = [];
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    const currentPage = pagination.page;

    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => setPage(i)}
            isActive={currentPage === i}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return pages;
  };

  // table row component 
  const memoizedCsvRows = useMemo(() => {
    console.log("table row render")
    return csvHistory.map((record, index) => {
      const rowNumber = (pagination.page - 1) * pagination.limit + index + 1;
      return (
        <TableRow key={record.id}>
          
          <TableCell>{rowNumber}. {record.filename}</TableCell>
          <TableCell>{record.note}</TableCell>
          <TableCell>{record.date}</TableCell>
          <TableCell>{record.total_posts}</TableCell>
          <TableCell>{record.listing_count}</TableCell>
          <TableCell>
            <Badge variant={getStatusVariant(record.status)} className={getStatusColor(record.status)}>
              {record.status}
            </Badge>
          </TableCell>
          <TableCell>
            <Button onClick={() => handleView(record.id)} variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-black" ><Eye /></Button>
            <Button onClick={() => handleDelete(record.id)} variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive" ><Trash2 /></Button>
          </TableCell>
        </TableRow>
      );
    });
  }, [csvHistory, pagination, getStatusVariant, getStatusColor]);


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("importPostCSV.title")}
          </h1>
        </div>
        <Button onClick={handleImport}>
          <Import className="w-4 h-4 mr-2" />
          {t("importPostCSV.importButton")}
        </Button>
      </div>

      {/* Search */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t("importPostCSV.searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="text-muted-foreground font-medium">
                {t("importPostCSV.tableHeaders.filename")}
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                {t("importPostCSV.tableHeaders.note")}
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                {t("importPostCSV.tableHeaders.date")}
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                {t("importPostCSV.tableHeaders.totalPosts")}
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                {t("importPostCSV.tableHeaders.listingsApplied")}
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                {t("importPostCSV.tableHeaders.status")}
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                {t("importPostCSV.tableHeaders.action")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading || searchLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRowSkeleton key={index} columns={7} />
              ))
            ) : csvHistory.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  {searchTerm
                    ? t("importPostCSV.noRecordsFound")
                    : t("importPostCSV.noCSVFound")}
                </TableCell>
              </TableRow>
            ) : (
              memoizedCsvRows
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!loading && csvHistory.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {t("importPostCSV.paginationInfo", {
              start: (pagination.page - 1) * pagination.limit + 1,
              end: Math.min(
                pagination.page * pagination.limit,
                pagination.total
              ),
              total: pagination.total,
            })}
            {/* Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} entries */}
          </div>

          <Pagination className="justify-center sm:justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage(Math.max(1, pagination.page - 1))}
                  className={
                    pagination.page === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {renderPaginationNumbers()}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setPage(
                      Math.min(
                        Math.ceil(pagination.total / pagination.limit),
                        pagination.page + 1
                      )
                    )
                  }
                  className={
                    pagination.page >=
                      Math.ceil(pagination.total / pagination.limit)
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("importPostCSV.deleteDialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("importPostCSV.deleteDialog.description", {
                filename: recordToDelete?.filename,
              })}
              {/* Are you sure you want to delete the import record for "
              {recordToDelete?.filename}"? This action cannot be undone. */}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>
              {t("importPostCSV.deleteDialog.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteLoading
                ? t("importPostCSV.deleteDialog.deleting")
                : t("importPostCSV.deleteDialog.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
