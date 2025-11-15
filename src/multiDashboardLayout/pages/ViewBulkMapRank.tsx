import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { BulkMapSummaryCards } from "@/multiDashboardLayout/components/BulkMapSummaryCards";
import { useBulkMapRankingKeywordDetails } from "@/api/bulkMapRankingKeywordDetailsApi";
import { useBulkMapRankingKeywordDetailsTable } from "@/api/bulkMapRankingKeywordDetailsTableApi";
import {
  transformKeywordDetailsToSummaryProps,
  mapKeywordStatus,
  formatRank,
  formatDate,
  getStatusBadgeVariant,
} from "@/utils/bulkMapRankingUtils";
import { useDebounce } from "@/hooks/useDebounce";
import { DataPagination } from "@/components/common/DataPagination";

export const ViewBulkMapRank: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8 pt-24 md:pt-28">
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
          <Button
            variant="outline"
            onClick={() => navigate("/main-dashboard/bulk-map-ranking")}
          >
            Back to List
          </Button>
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

        {/* Ranking Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
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
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-muted-foreground">
                      No ranking data found
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                tableData.data.keywordDetails.map((item) => (
                  <TableRow key={item.id}>
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
                      >
                        {mapKeywordStatus(item.kStatus)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(item.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
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
    </div>
  );
};
