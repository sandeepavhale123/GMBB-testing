import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, Trash2, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkMapRankingStats } from "@/api/bulkMapRankingApi";
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

// Mock data for demonstration
const mockData = [
  {
    id: 1,
    keyword: "best pizza near me",
    noOfChecks: 45,
    schedule: "Daily",
    lastChecked: "Nov 14, 2025 • 2:30 PM",
    nextCheck: "Nov 15, 2025 • 2:30 PM",
    status: "complete",
  },
  {
    id: 2,
    keyword: "italian restaurant",
    noOfChecks: 32,
    schedule: "Weekly",
    lastChecked: "Nov 13, 2025 • 10:15 AM",
    nextCheck: "Nov 20, 2025 • 10:15 AM",
    status: "pending",
  },
  {
    id: 3,
    keyword: "coffee shop",
    noOfChecks: 67,
    schedule: "Daily",
    lastChecked: "Nov 14, 2025 • 1:45 PM",
    nextCheck: "Nov 15, 2025 • 1:45 PM",
    status: "complete",
  },
  {
    id: 4,
    keyword: "hair salon near me",
    noOfChecks: 28,
    schedule: "Monthly",
    lastChecked: "Nov 10, 2025 • 9:00 AM",
    nextCheck: "Dec 10, 2025 • 9:00 AM",
    status: "pending",
  },
  {
    id: 5,
    keyword: "plumber emergency",
    noOfChecks: 15,
    schedule: "Weekly",
    lastChecked: "Nov 14, 2025 • 8:20 AM",
    nextCheck: "Nov 21, 2025 • 8:20 AM",
    status: "complete",
  },
];


export const BulkMapRanking: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch stats from API
  const { data: statsData, isLoading: statsLoading, error: statsError } = useBulkMapRankingStats();

  // Extract stats with defaults
  const stats = {
    noOfKeywords: statsData?.data?.noOfKeywords || 0,
    totalProjects: statsData?.data?.totalProjects || 0,
    noOfSchedule: statsData?.data?.noOfSchedule || 0,
    remainingCredit: statsData?.data?.remainingCredit || 0,
    allowedCredit: statsData?.data?.allowedCredit || 0,
  };

  // Filter data based on search query
  const filteredData = mockData.filter((item) =>
    item.keyword.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
    setLoading(true);
    // Simulate loading delay
    setTimeout(() => setLoading(false), 500);
  };

  const handleView = (id: number) => {
    navigate(`/main-dashboard/view-bulk-map-ranking/${id}`);
  };

  const handleDelete = (id: number) => {
    console.log("Delete keyword:", id);
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
                    {currentData.length > 0 ? (
                      currentData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.keyword}</TableCell>
                          <TableCell className="text-center">{item.noOfChecks}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline">{item.schedule}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {item.lastChecked}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {item.nextCheck}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant={item.status === "complete" ? "default" : "secondary"}
                              className={
                                item.status === "complete"
                                  ? "bg-green-500 hover:bg-green-600"
                                  : "bg-yellow-500 hover:bg-yellow-600"
                              }
                            >
                              {item.status === "complete" ? (
                                <CheckCircle2 className="h-3 w-3 mr-1 inline" />
                              ) : (
                                <Clock className="h-3 w-3 mr-1 inline" />
                              )}
                              {item.status}
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
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No keywords found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          className={
                            currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                      {[...Array(totalPages)].map((_, index) => (
                        <PaginationItem key={index}>
                          <PaginationLink
                            onClick={() => setCurrentPage(index + 1)}
                            isActive={currentPage === index + 1}
                            className="cursor-pointer"
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
