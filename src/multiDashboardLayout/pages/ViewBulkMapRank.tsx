import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Skeleton } from "@/components/ui/skeleton";
import { BulkMapSummaryCards } from "@/multiDashboardLayout/components/BulkMapSummaryCards";
import { useBulkMapRankingKeywordDetails } from "@/api/bulkMapRankingKeywordDetailsApi";
import {
  useBulkMapRankingKeywordDetailsTable,
  deleteMapRankingKeywordListings,
} from "@/api/bulkMapRankingKeywordDetailsTableApi";
import {
  transformKeywordDetailsToSummaryProps,
  mapKeywordStatus,
  formatRank,
  formatDate,
  getStatusBadgeVariant,
} from "@/utils/bulkMapRankingUtils";
import { useDebounce } from "@/hooks/useDebounce";
import { DataPagination } from "@/components/common/DataPagination";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const ViewBulkMapRank: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Selection and delete states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<{
    ids: string[];
    keywordId: number;
  }>({ ids: [], keywordId: 0 });
  const [isDeleting, setIsDeleting] = useState(false);

  // Extract keywordId from URL params
  const keywordId = id ? parseInt(id, 10) : 0;

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 1500);

  // Fetch keyword details from API
  const {
    data: keywordDetailsData,
    isLoading: isKeywordDetailsLoading,
    error: keywordDetailsError,
  } = useBulkMapRankingKeywordDetails(keywordId);

  // Fetch table data from API
  const {
    data: tableData,
    isLoading: isTableLoading,
    error: tableError,
  } = useBulkMapRankingKeywordDetailsTable(
    keywordId,
    currentPage,
    itemsPerPage,
    debouncedSearchQuery
  );

  const handleViewDetails = (detailId: string) => {
    console.log("View details for:", detailId);
  };

  // Selection handlers
  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === tableData?.data?.keywordDetails.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(
        tableData?.data?.keywordDetails.map((item) => item.id) || []
      );
    }
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  // Delete handlers
  const handleDeleteClick = (id: string) => {
    setItemsToDelete({
      ids: [id],
      keywordId: keywordId,
    });
    setDeleteDialogOpen(true);
  };

  const handleBulkDeleteClick = () => {
    if (selectedIds.length === 0) return;
    setItemsToDelete({
      ids: selectedIds,
      keywordId: keywordId,
    });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const response = await deleteMapRankingKeywordListings({
        ids: itemsToDelete.ids.map((id) => parseInt(id)),
        keywordId: itemsToDelete.keywordId,
      });

      // Show actual API response message
      toast({
        title: "Success",
        description: response.message,
        variant: "default",
      });

      // Clear selection
      setSelectedIds([]);

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ["bulk-map-ranking-keyword-details-table"],
      });
      queryClient.invalidateQueries({
        queryKey: ["bulk-map-ranking-keyword-details"],
      });

      setDeleteDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to delete listings",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Reset selection on page/search changes
  useEffect(() => {
    setSelectedIds([]);
  }, [currentPage, debouncedSearchQuery]);

  return (
    <div className="flex-1 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {keywordDetailsData?.data?.keywordDetails?.keywordName || "Keyword Name"}
            </h1>
            <p className="text-muted-foreground mt-1">
              View ranking details and performance metrics
            </p>
          </div>
        </div>

        {/* Error State */}
        {keywordDetailsError && (
          <Card className="p-4 mb-6 border-destructive">
            <p className="text-destructive text-sm">
              Failed to load keyword details. Please try again.
            </p>
          </Card>
        )}

        {/* Summary Cards */}
        <BulkMapSummaryCards
          {...(keywordDetailsData?.data
            ? transformKeywordDetailsToSummaryProps(keywordDetailsData.data)
            : {
                searchBy: "N/A",
                scheduledFrequency: "N/A",
                lastCheck: "N/A",
                nextCheck: "N/A",
                positionSummary: {
                  total: 0,
                  pos1_3: { count: 0, percent: 0 },
                  pos4_10: { count: 0, percent: 0 },
                  pos11_15: { count: 0, percent: 0 },
                  pos16_20: { count: 0, percent: 0 },
                },
              })}
          isLoading={isKeywordDetailsLoading}
        />

        {/* Table Error State */}
        {tableError && (
          <Card className="p-4 mb-6 border-destructive">
            <p className="text-destructive text-sm">
              Failed to load ranking details. Please try again.
            </p>
          </Card>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search by business name, city, or postal code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedIds.length > 0 && (
          <div className="bg-muted/50 border rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {selectedIds.length}{" "}
                  {selectedIds.length === 1 ? "listing" : "listings"} selected
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                  className="h-8"
                >
                  Clear Selection
                </Button>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDeleteClick}
                className="h-8"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          </div>
        )}

        {/* Ranking Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      tableData?.data?.keywordDetails.length > 0 &&
                      selectedIds.length === tableData?.data?.keywordDetails.length
                    }
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Business Name</TableHead>
                <TableHead>Rank Position</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Postal Code</TableHead>
                <TableHead>Last Checked</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isTableLoading || isKeywordDetailsLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-8 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : !tableData?.data?.keywordDetails ||
                tableData.data.keywordDetails.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-muted-foreground">
                      No ranking data found
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                tableData.data.keywordDetails.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(item.id)}
                        onCheckedChange={() => handleSelectRow(item.id)}
                        aria-label={`Select ${item.businessName}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.businessName}
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-primary">
                        {formatRank(item.rank)}
                      </span>
                    </TableCell>
                    <TableCell>{item.city}</TableCell>
                    <TableCell>{item.zipcode}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(item.date)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(
                          mapKeywordStatus(item.kStatus)
                        )}
                        className={
                          mapKeywordStatus(item.kStatus) === "running"
                            ? "bg-blue-500 hover:bg-blue-600 text-white border-transparent"
                            : ""
                        }
                      >
                        {mapKeywordStatus(item.kStatus)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(item.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(item.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {!isTableLoading &&
            tableData?.data?.keywordDetails &&
            tableData.data.keywordDetails.length > 0 && (
              <div className="border-t">
                <DataPagination
                  currentPage={tableData.data.current_page}
                  totalPages={tableData.data.total_pages}
                  totalItems={tableData.data.total_records}
                  itemsPerPage={tableData.data.per_page}
                  onPageChange={setCurrentPage}
                  showItemCount={true}
                />
              </div>
            )}
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {itemsToDelete.ids.length}{" "}
              {itemsToDelete.ids.length === 1 ? "listing" : "listings"}? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
