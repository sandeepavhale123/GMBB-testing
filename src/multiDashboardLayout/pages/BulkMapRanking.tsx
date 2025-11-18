import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, Trash2, CheckCircle2, Clock, KeyRound, FolderOpen, CalendarClock, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkMapRankingStats } from "@/api/bulkMapRankingApi";
import { useBulkMapRankingKeywords, deleteMapRankingKeyword } from "@/api/bulkMapRankingKeywordsApi";
import { formatDateTime, mapStatus, formatSchedule } from "@/utils/bulkMapRankingUtils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataPagination } from "@/components/common/DataPagination";
import { useDebounce } from "@/hooks/useDebounce";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
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
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";


export const BulkMapRanking: React.FC = () => {

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Match API limit
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; keyword: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { t } = useI18nNamespace('MultidashboardPages/bulkMapRanking');

  // Debounce search query with 1500ms delay
  const debouncedSearchQuery = useDebounce(searchQuery, 1500);

  // Fetch stats from API
  const { data: statsData, isLoading: statsLoading } = useBulkMapRankingStats();

  // Fetch keywords table data from API
  const {
    data: keywordsData,
    isLoading: keywordsLoading,
    isFetching: keywordsFetching,
    error: keywordsError,
  } = useBulkMapRankingKeywords(debouncedSearchQuery, currentPage, itemsPerPage);

  // Extract stats with defaults
  const stats = {
    noOfKeywords: statsData?.data?.noOfKeywords || 0,
    totalProjects: statsData?.data?.totalProjects || 0,
    noOfSchedule: statsData?.data?.noOfSchedule || 0,
    remainingCredit: statsData?.data?.remainingCredit || 0,
    allowedCredit: statsData?.data?.allowedCredit || 0,
  };

  // Extract keywords data
  const keywords = keywordsData?.data?.keywords || [];
  const totalPages = keywordsData?.data?.total_pages || 1;
  const totalRecords = keywordsData?.data?.total_records || 0;

  // Loading state includes both initial load and fetching
  const loading = keywordsLoading || keywordsFetching;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleView = (id: string) => {
    navigate(`/main-dashboard/view-bulk-map-ranking/${id}`);
  };

  const handleDeleteClick = (id: string, keyword: string) => {
    setItemToDelete({ id, keyword });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    setDeletingId(itemToDelete.id);
    try {
      const response = await deleteMapRankingKeyword(Number(itemToDelete.id));

      // Show actual API response message
      toast({
        variant: "success",
        title: response.message,
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["bulk-map-ranking-keywords"] });
      queryClient.invalidateQueries({ queryKey: ["bulk-map-ranking-stats"] });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("toastMessage.deleteFailed"),
        description: error?.response?.data?.message || t("toastMessage.failedToDeleteKeyword"),
      });
    } finally {
      setDeletingId(null);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="flex-1 space-y-6 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{t("header.title")}</h1>
        <Button className="flex items-center gap-2" onClick={() => navigate("/main-dashboard/check-bulk-map-ranking")}>
          <CheckCircle2 className="h-4 w-4" />
          {t("buttons.checkRack")}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t("summerCard.noOfKeywords")}</p>
              {statsLoading ? (
                <Skeleton className="h-8 w-20 mt-2" />
              ) : (
                <p className="text-2xl font-bold mt-2">{stats.noOfKeywords}</p>
              )}
            </div>
            <div className="bg-blue-600 p-3 rounded-lg">
              <KeyRound className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t("summerCard.totalProjects")}</p>
              {statsLoading ? (
                <Skeleton className="h-8 w-20 mt-2" />
              ) : (
                <p className="text-2xl font-bold mt-2">{stats.totalProjects}</p>
              )}
            </div>
            <div className="bg-green-600 p-3 rounded-lg">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t("summerCard.scheduledScan")}</p>
              {statsLoading ? (
                <Skeleton className="h-8 w-20 mt-2" />
              ) : (
                <p className="text-2xl font-bold mt-2">{stats.noOfSchedule}</p>
              )}
            </div>
            <div className="bg-purple-600 p-3 rounded-lg">
              <CalendarClock className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t("summerCard.credits")}</p>
              {statsLoading ? (
                <Skeleton className="h-8 w-32 mt-2" />
              ) : (
                <p className="text-2xl font-bold mt-2">
                  {stats.remainingCredit.toLocaleString()} / {stats.allowedCredit.toLocaleString()}
                </p>
              )}
            </div>
            <div className="bg-orange-600 p-3 rounded-lg">
              <Coins className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search & Table Section */}
      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t("placeholder.searchKeyword")} value={searchQuery} onChange={handleSearch} className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(itemsPerPage)].map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("tableColumns.keyword")}</TableHead>
                      <TableHead className="text-center">{t("tableColumns.noOfChecks")}</TableHead>
                      <TableHead className="text-center">{t("tableColumns.schedule")}</TableHead>
                      <TableHead>{t("tableColumns.lastChecked")}</TableHead>
                      <TableHead>{t("tableColumns.nextCheck")}</TableHead>
                      <TableHead className="text-center">{t("tableColumns.status")}</TableHead>
                      <TableHead className="text-center">{t("tableColumns.action")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keywords.length > 0 ? (
                      keywords.map((item) => {
                        const status = mapStatus(item.status);
                        return (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.keyword}</TableCell>
                            <TableCell className="text-center">{item.noOfKeyword}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline">{formatSchedule(item.schedule)}</Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDateTime(item.last_check)}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDateTime(item.next_check)}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                variant={status === "completed" ? "default" : "secondary"}
                                className={
                                  status === "completed"
                                    ? "bg-green-500 hover:bg-green-600 text-white"
                                    : "bg-blue-500 hover:bg-blue-600 text-white"
                                }
                              >
                                {status === "completed" ? (
                                  <div>
                                    <CheckCircle2 className="h-3 w-3 mr-1 inline" />
                                    {t("status.completed")}
                                  </div>
                                ) : (
                                  <div>
                                    <Clock className="h-3 w-3 mr-1 inline" />
                                    {t("status.running")}
                                  </div>
                                )}

                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleView(item.id)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteClick(item.id, item.keyword)}
                                  disabled={deletingId === item.id}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          {searchQuery ? t("messages.nokeywordsFoundMatchingYourSearch") : t("messages.noKeywordsAvailable")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <DataPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={totalRecords}
                itemsPerPage={itemsPerPage}
                align="right"
                showItemCount={true}
                maxPageButtons={4}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteAlertBox.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteAlertBox.description", { keyword: itemToDelete?.keyword })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!deletingId}>{t("buttons.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={!!deletingId}>
              {deletingId ? t("buttons.deleting") : t("buttons.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
