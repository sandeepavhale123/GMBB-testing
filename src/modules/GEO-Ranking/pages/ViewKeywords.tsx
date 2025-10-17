import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Loader2, Eye, Info, ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { getSearchKeywords, deleteGeoKeywords } from "@/api/geoRankingApi";
import type { SearchKeywordData } from "@/api/geoRankingApi";
import { useToast } from "@/hooks/use-toast";

export const ViewKeywords: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [keywords, setKeywords] = useState<SearchKeywordData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalKeywords, setTotalKeywords] = useState(0);
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const perPage = 10;

  useEffect(() => {
    fetchKeywords();
  }, [projectId, currentPage]);

  const fetchKeywords = async () => {
    if (!projectId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getSearchKeywords({
        projectId: Number(projectId),
        page: currentPage,
        limit: perPage,
      });

      if (response.code === 200) {
        setKeywords(response.data.keywords);
        setTotalKeywords(response.data.noOfKeyword);
        setTotalPages(response.data.totalPages);
      } else {
        throw new Error(response.message || "Failed to fetch keywords");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch keywords";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewReport = (keywordId: string) => {
    navigate(`/module/geo-ranking/view-project-details/${projectId}?keyword=${keywordId}`);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedKeywords(new Set(keywords.map(k => k.id)));
    } else {
      setSelectedKeywords(new Set());
    }
  };

  const handleSelectKeyword = (keywordId: string, checked: boolean) => {
    const newSelected = new Set(selectedKeywords);
    if (checked) {
      newSelected.add(keywordId);
    } else {
      newSelected.delete(keywordId);
    }
    setSelectedKeywords(newSelected);
  };

  const handleDeleteSelected = async () => {
    if (!projectId) {
      toast({
        title: "Error",
        description: "Project ID is missing",
        variant: "destructive",
      });
      return;
    }

    setDeleting(true);
    try {
      // Convert keyword IDs from string to number
      const keywordIds = Array.from(selectedKeywords).map(id => parseInt(id, 10));
      
      // Call the API to delete keywords using projectId (for GEO Ranking Module)
      const response = await deleteGeoKeywords({
        projectId: parseInt(projectId, 10),
        keywordIds,
        isDelete: "delete"
      });

      if (response.code === 200) {
        // Remove deleted keywords from local state
        setKeywords(keywords.filter(k => !selectedKeywords.has(k.id)));
        setSelectedKeywords(new Set());
        setShowDeleteDialog(false);
        
        // Refresh keywords list to get updated data from server
        await fetchKeywords();
        
        const deletedCount = response.data?.deleted_keywords?.length || keywordIds.length;
        toast({
          title: "Success",
          description: `${deletedCount} keyword${deletedCount > 1 ? 's' : ''} deleted successfully`,
        });
      } else {
        throw new Error(typeof response.message === 'string' ? response.message : "Failed to delete keywords");
      }
    } catch (error: any) {
      // Extract the actual API error message (same pattern as team member deletion)
      const apiErrorMessage = error?.response?.data?.message || 
                              error?.message || 
                              "Failed to delete keywords";
      
      toast({
        title: "Error",
        description: apiErrorMessage,
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";

    const parts = dateString.split("-");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
    }

    const date = new Date(dateString);
    return !isNaN(date.getTime()) ? date.toLocaleDateString() : "Invalid Date";
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "active" || statusLower === "completed") {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Completed
        </Badge>
      );
    } else if (statusLower === "pending") {
      return <Badge variant="secondary">Pending</Badge>;
    } else if (statusLower === "failed") {
      return <Badge variant="destructive">Failed</Badge>;
    } else if (statusLower === "running" || statusLower === "processing" || statusLower === "in progress") {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Processing
        </Badge>
      );
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages: (number | string)[] = [];

    // Always show first 3 pages
    for (let i = 1; i <= Math.min(3, totalPages); i++) {
      pages.push(i);
    }

    // Show current page if it's beyond the first 3
    if (currentPage > 3 && currentPage < totalPages) {
      if (currentPage > 4) pages.push("...");
      pages.push(currentPage);
    }

    // Show ellipsis and last page if needed
    if (totalPages > 3) {
      if (currentPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    const startIndex = (currentPage - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, totalKeywords);

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {endIndex} of {totalKeywords} keywords
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="h-9"
          >
            <ChevronLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          <div className="flex items-center gap-1">
            {pages.map((page, index) =>
              page === "..." ? (
                <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page as number)}
                  disabled={loading}
                  className="h-9 w-9"
                >
                  {page}
                </Button>
              ),
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="h-9"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4 sm:ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  if (loading && keywords.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-[120px] px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </div>
    );
  }

  if (error && keywords.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-[120px] px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-destructive mb-4">{error}</div>
            <Button onClick={fetchKeywords} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background  p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Project Keywords</h1>
            <p className="text-muted-foreground mt-1">Manage and view all keywords for project #{projectId}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">
              Total: <span className="font-semibold text-foreground">{totalKeywords}</span> keywords
            </div>
            <Button
              onClick={() => navigate(`/module/geo-ranking/check-rank?projectId=${projectId}`)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Keywords
            </Button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedKeywords.size > 0 && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                {selectedKeywords.size} keyword{selectedKeywords.size > 1 ? 's' : ''} selected
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedKeywords(new Set())}
              >
                Clear Selection
              </Button>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </Button>
          </div>
        )}

        {/* Table */}
        {keywords.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border">
            <div className="max-w-md mx-auto space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <Eye className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">No keywords found</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Start tracking your rankings by adding keywords to this project.
                </p>
              </div>
              <Button
                onClick={() => navigate(`/module/geo-ranking/check-rank?projectId=${projectId}`)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Your First Keyword
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedKeywords.size === keywords.length && keywords.length > 0}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all keywords"
                    />
                  </TableHead>
                  <TableHead className="w-16">Sr No</TableHead>
                  <TableHead>Keyword</TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span>ARP</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Average Rank Position</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span>ATRP</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Average Top Rank Position</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span>SoLV</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Share of Local Visibility</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Added On</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keywords.map((keyword, index) => (
                  <TableRow key={keyword.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedKeywords.has(keyword.id)}
                        onCheckedChange={(checked) => handleSelectKeyword(keyword.id, checked as boolean)}
                        aria-label={`Select keyword ${keyword.keyword}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{(currentPage - 1) * perPage + index + 1}</TableCell>
                    <TableCell className="font-medium">
                      <button
                        onClick={() => handleViewReport(keyword.id)}
                        className="text-primary hover:text-primary/80 cursor-pointer transition-colors"
                      >
                        {keyword.keyword}
                      </button>
                    </TableCell>
                    <TableCell className="text-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="cursor-help">{keyword.atr || "N/A"}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Average Rank Position</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="cursor-help">{keyword.atrp || "N/A"}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Average Top Rank Position</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="cursor-help">{keyword.solv || "N/A"}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Share of Local Visibility</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-center">{formatDate(keyword.date)}</TableCell>
                    <TableCell className="text-center">{getStatusBadge(keyword.status)}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewReport(keyword.id)}
                          title="View Report"
                          className="h-8 w-8"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedKeywords(new Set([keyword.id]));
                            setShowDeleteDialog(true);
                          }}
                          title="Delete"
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {renderPagination()}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedKeywords.size} keyword{selectedKeywords.size > 1 ? 's' : ''}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSelected}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
