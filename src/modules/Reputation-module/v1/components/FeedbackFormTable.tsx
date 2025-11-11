import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Trash2, Eye, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { toast } from "@/hooks/toast/use-toast";
import { format } from "date-fns";
import type { FeedbackForm } from "../types";

interface FeedbackFormTableProps {
  forms: FeedbackForm[];
  onDelete: (id: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  totalPages?: number;
  totalRecords?: number;
  isServerPagination?: boolean;
  isLoading?: boolean;
}

export const FeedbackFormTable: React.FC<FeedbackFormTableProps> = ({ 
  forms, 
  onDelete,
  searchQuery: propSearchQuery,
  onSearchChange,
  currentPage: propCurrentPage,
  onPageChange,
  totalPages: propTotalPages,
  totalRecords: propTotalRecords,
  isServerPagination = false,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [localCurrentPage, setLocalCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Use prop values if server pagination, otherwise use local state
  const searchQuery = isServerPagination ? (propSearchQuery ?? "") : localSearchQuery;
  const currentPage = isServerPagination ? (propCurrentPage ?? 1) : localCurrentPage;

  // Filter forms based on search query (client-side only)
  const filteredForms = useMemo(() => {
    if (isServerPagination) return forms;
    if (!searchQuery.trim()) return forms;

    const query = searchQuery.toLowerCase();
    return forms.filter(
      (form) =>
        form.name.toLowerCase().includes(query) ||
        format(new Date(form.created_at), "MMM dd, yyyy").toLowerCase().includes(query),
    );
  }, [forms, searchQuery, isServerPagination]);

  // Calculate pagination (client-side only)
  const clientTotalPages = Math.ceil(filteredForms.length / itemsPerPage);
  const totalPages = isServerPagination ? (propTotalPages ?? 1) : clientTotalPages;
  const totalRecords = isServerPagination ? (propTotalRecords ?? forms.length) : filteredForms.length;
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedForms = isServerPagination ? forms : filteredForms.slice(startIndex, endIndex);

  // Reset to page 1 when search query changes (client-side only)
  React.useEffect(() => {
    if (!isServerPagination) {
      setLocalCurrentPage(1);
    }
  }, [localSearchQuery, isServerPagination]);

  const handleCopyUrl = (formUrl: string, formName: string) => {
    navigator.clipboard.writeText(formUrl);
    toast({
      title: "URL Copied",
      description: `Form URL for "${formName}" copied to clipboard`,
    });
  };

  const handleDeleteClick = (id: string) => {
    setSelectedFormId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedFormId) {
      onDelete(selectedFormId);
      toast({
        title: "Form Deleted",
        description: "Feedback form has been deleted successfully",
      });
    }
    setDeleteDialogOpen(false);
    setSelectedFormId(null);
  };

  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      setLocalSearchQuery(value);
    }
  };

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      setLocalCurrentPage(page);
    }
  };

  if (forms.length === 0 && !searchQuery) {
    return (
      <div className="bg-card rounded-lg border p-12 text-center">
        <p className="text-muted-foreground text-lg">No feedback forms created yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Create your first feedback form to start collecting customer feedback
        </p>
      </div>
    );
  }

  return (
    <>
      <Card className="relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Updating...</span>
          </div>
        </div>
      )}
      
      <div className={isLoading ? "opacity-50 pointer-events-none p-6 space-y-4" : "p-6 space-y-4"}>
        {/* Search Bar */}
        <div className="relative max-w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search feedback forms..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {(isServerPagination ? forms.length === 0 : filteredForms.length === 0) ? (
          <div className="bg-muted/30 rounded-lg border p-12 text-center">
            <p className="text-muted-foreground text-lg">No forms found</p>
            <p className="text-sm text-muted-foreground mt-2">Try adjusting your search query</p>
          </div>
        ) : (
          <>
            <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Sr. No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-center">No. of Feedback</TableHead>
                  <TableHead className="text-center">Avg Rating</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedForms.map((form, index) => (
                  <TableRow key={form.id}>
                    <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                    <TableCell>{form.name}</TableCell>
                    <TableCell>{format(new Date(form.created_at), "MMM dd, yyyy")}</TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                        {form.feedback_count}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {form.avg_rating ? (
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className="font-medium">{form.avg_rating.toFixed(1)}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/module/reputation/v1/feedback/${form.id}`)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopyUrl(form.form_url, form.name)}
                          title="Copy Form URL"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(form.id)}
                          title="Delete Form"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, totalRecords)} of {totalRecords} results
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
              </div>
            )}
          </>
        )}
      </div>
    </Card>

    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Feedback Form</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this feedback form? This action cannot be undone. All feedback responses
            associated with this form will also be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
};
