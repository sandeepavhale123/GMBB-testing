import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, Trash2, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkMapRankingStats } from "@/api/bulkMapRankingApi";
import { useBulkMapRankingKeywords } from "@/api/bulkMapRankingKeywordsApi";
import { formatDateTime, mapStatus, formatSchedule } from "@/utils/bulkMapRankingUtils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataPagination } from "@/components/common/DataPagination";
import { useDebounce } from "@/hooks/useDebounce";

export const BulkMapRanking: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Match API limit

  // Debounce search query with 1500ms delay
  const debouncedSearchQuery = useDebounce(searchQuery, 1500);

  // Fetch stats from API
  const { data: statsData, isLoading: statsLoading } = useBulkMapRankingStats();

  // Fetch keywords table data from API
  const { 
    data: keywordsData, 
    isLoading: keywordsLoading,
    isFetching: keywordsFetching,
    error: keywordsError 
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

  const handleDelete = (id: string) => {
    console.log("Delete keyword:", id);
    // TODO: Implement delete functionality
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8 pt-24 md:pt-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Bulk Map Ranking</h1>
        <Button 
          className="flex items-center gap-2"
          onClick={() => navigate("/main-dashboard/check-bulk-map-ranking")}
        >
          <CheckCircle2 className="h-4 w-4" />
          Check Rank
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">No Of Keywords</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats.noOfKeywords}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Scan</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats.noOfSchedule}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="text-2xl font-bold">
                {stats.remainingCredit.toLocaleString()} / {stats.allowedCredit.toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Search & Table Section */}
      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search keywords..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10"
            />
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
                      <TableHead>Keyword</TableHead>
                      <TableHead className="text-center">No Of Checks</TableHead>
                      <TableHead className="text-center">Schedule</TableHead>
                      <TableHead>Last Checked</TableHead>
                      <TableHead>Next Check</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keywords.length > 0 ? (
                      keywords.map((item) => {
                        const status = mapStatus(item.status);
                        return (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.keyword}</TableCell>
                            <TableCell className="text-center">
                              {item.noOfKeyword}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline">
                                {formatSchedule(item.schedule)}
                              </Badge>
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
                                    ? "bg-green-500 hover:bg-green-600"
                                    : "bg-yellow-500 hover:bg-yellow-600"
                                }
                              >
                                {status === "completed" ? (
                                  <CheckCircle2 className="h-3 w-3 mr-1 inline" />
                                ) : (
                                  <Clock className="h-3 w-3 mr-1 inline" />
                                )}
                                {status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleView(item.id)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(item.id)}
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
                          {searchQuery
                            ? "No keywords found matching your search"
                            : "No keywords available"}
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
    </div>
  );
};
