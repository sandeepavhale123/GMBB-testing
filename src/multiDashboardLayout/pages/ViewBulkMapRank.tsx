import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { transformKeywordDetailsToSummaryProps } from "@/utils/bulkMapRankingUtils";

interface RankingData {
  id: number;
  keyword: string;
  location: string;
  currentRank: number;
  previousRank: number;
  lastChecked: string;
  status: string;
}

export const ViewBulkMapRank: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  // Extract keywordId from URL params
  const keywordId = id ? parseInt(id, 10) : 0;

  // Fetch keyword details from API
  const {
    data: keywordDetailsData,
    isLoading: isKeywordDetailsLoading,
    error: keywordDetailsError,
  } = useBulkMapRankingKeywordDetails(keywordId);

  const businessName = "Main Street Pizza";

  const mockRankingData: RankingData[] = [
    {
      id: 1,
      keyword: "best pizza near me",
      location: "Downtown",
      currentRank: 2,
      previousRank: 4,
      lastChecked: "Nov 14, 2025 • 2:30 PM",
      status: "complete",
    },
    {
      id: 2,
      keyword: "italian restaurant",
      location: "City Center",
      currentRank: 5,
      previousRank: 5,
      lastChecked: "Nov 14, 2025 • 1:15 PM",
      status: "complete",
    },
    {
      id: 3,
      keyword: "pizza delivery",
      location: "North End",
      currentRank: 8,
      previousRank: 6,
      lastChecked: "Nov 14, 2025 • 12:45 PM",
      status: "pending",
    },
    {
      id: 4,
      keyword: "wood fired pizza",
      location: "Downtown",
      currentRank: 3,
      previousRank: 3,
      lastChecked: "Nov 14, 2025 • 11:30 AM",
      status: "complete",
    },
    {
      id: 5,
      keyword: "family restaurant",
      location: "Suburbs",
      currentRank: 12,
      previousRank: 10,
      lastChecked: "Nov 14, 2025 • 10:15 AM",
      status: "failed",
    },
    {
      id: 6,
      keyword: "lunch specials",
      location: "Business District",
      currentRank: 7,
      previousRank: 9,
      lastChecked: "Nov 14, 2025 • 9:45 AM",
      status: "complete",
    },
    {
      id: 7,
      keyword: "authentic italian",
      location: "Old Town",
      currentRank: 4,
      previousRank: 5,
      lastChecked: "Nov 14, 2025 • 9:00 AM",
      status: "complete",
    },
    {
      id: 8,
      keyword: "pizza takeout",
      location: "City Center",
      currentRank: 6,
      previousRank: 7,
      lastChecked: "Nov 13, 2025 • 8:30 PM",
      status: "complete",
    },
  ];

  const getRankChange = (current: number, previous: number) => {
    const change = previous - current;
    if (change > 0) {
      return (
        <span className="text-green-600 font-medium flex items-center gap-1">
          ↑ {change}
        </span>
      );
    } else if (change < 0) {
      return (
        <span className="text-red-600 font-medium flex items-center gap-1">
          ↓ {Math.abs(change)}
        </span>
      );
    }
    return <span className="text-muted-foreground">—</span>;
  };

  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case "complete":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const filteredData = useMemo(() => {
    let filtered = mockRankingData;

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.keyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (item) => item.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    return filtered;
  }, [searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleViewDetails = (itemId: number) => {
    console.log("View details for ranking:", itemId);
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8 pt-24 md:pt-28">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {businessName || "Business Name"}
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

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search by keyword or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="complete">Complete</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Data Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Current Rank</TableHead>
                <TableHead>Previous Rank</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Last Checked</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
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
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-muted-foreground">
                      No ranking data found
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.keyword}
                    </TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>
                      <span className="font-semibold text-primary">
                        #{item.currentRank}
                      </span>
                    </TableCell>
                    <TableCell>#{item.previousRank}</TableCell>
                    <TableCell>
                      {getRankChange(item.currentRank, item.previousRank)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.lastChecked}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(item.status)}>
                        {item.status}
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
          {!loading && filteredData.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1}-
                {Math.min(endIndex, filteredData.length)} of{" "}
                {filteredData.length} results
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
