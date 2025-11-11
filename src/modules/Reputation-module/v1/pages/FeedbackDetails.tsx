import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Eye, Search, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useGetFeedbackDetails } from "@/api/reputationApi";
import { FeedbackSummaryCards } from "../components/FeedbackSummaryCards";
import type { FeedbackDetailResponse, GetFeedbackDetailsRequest } from "../types";

// Helper to format field names (field_1762855246040 -> Field 1762855246040)
const formatFieldLabel = (fieldKey: string): string => {
  if (fieldKey.startsWith('field_')) {
    return fieldKey.replace('field_', 'Field ').replace(/_/g, ' ');
  }
  return fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1).replace(/_/g, ' ');
};

// Helper to format field values based on type
const formatFieldValue = (value: any): string => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  
  if (Array.isArray(value)) {
    if (value.length === 0) return '-';
    return value.join(', ');
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }
  
  return String(value);
};

// Helper to extract custom fields (exclude standard fields)
const getCustomFields = (formData: Record<string, any>): Record<string, any> => {
  const standardFields = ['name', 'email', 'comment'];
  const customFields: Record<string, any> = {};
  
  Object.keys(formData).forEach(key => {
    if (!standardFields.includes(key)) {
      customFields[key] = formData[key];
    }
  });
  
  return customFields;
};

export const FeedbackDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackDetailResponse | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [starFilter, setStarFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Build API request
  const apiRequest: GetFeedbackDetailsRequest = useMemo(() => ({
    formId: id || "",
    search: searchQuery,
    starRating: starFilter === "all" ? "" : starFilter,
    page: currentPage,
    limit: itemsPerPage,
  }), [id, searchQuery, starFilter, currentPage]);

  // Fetch data from API
  const { 
    data: feedbackData, 
    isLoading, 
    isError, 
    error 
  } = useGetFeedbackDetails(apiRequest);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, starFilter]);

  // Handle share button
  const handleShare = async () => {
    if (!feedbackData?.data.feedbackForm.formUrl) return;
    
    try {
      await navigator.clipboard.writeText(feedbackData.data.feedbackForm.formUrl);
      toast({
        title: "Link Copied!",
        description: "Feedback form URL has been copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the URL manually",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (response: FeedbackDetailResponse) => {
    setSelectedFeedback(response);
    setDialogOpen(true);
  };

  // Show loading state
  if (isLoading && !feedbackData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading feedback details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <Card className="p-12 text-center">
        <p className="text-destructive text-lg font-semibold">Failed to load feedback details</p>
        <p className="text-sm text-muted-foreground mt-2">
          {error?.message || "Please try again later"}
        </p>
        <Button onClick={() => navigate("/module/reputation/v1/dashboard")} className="mt-4">
          Back to Dashboard
        </Button>
      </Card>
    );
  }

  // No data from API
  if (!feedbackData?.data) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground text-lg">Form not found</p>
        <Button onClick={() => navigate("/module/reputation/v1/dashboard")} className="mt-4">
          Back to Dashboard
        </Button>
      </Card>
    );
  }

  const { feedbackForm, sentiment, feedbackResponses, pagination } = feedbackData.data;
  const totalPages = pagination.total_pages;
  const startIndex = (pagination.current_page - 1) * pagination.per_page;
  const endIndex = Math.min(startIndex + pagination.per_page, pagination.total_records);

  return (
    <div className="space-y-6">
      {/* Header with Share Button */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{feedbackForm.formName}</h1>
          <p className="text-muted-foreground mt-1">
            View and manage feedback responses
          </p>
        </div>
        <Button onClick={handleShare} className="gap-2">
          <Share2 className="w-4 h-4" />
          Share Form
        </Button>
      </div>

      {/* Summary Cards */}
      <FeedbackSummaryCards
        totalResponses={feedbackForm.totalResponses}
        avgRating={feedbackForm.avgRating}
        positiveThreshold={feedbackForm.positiveThreshold}
        sentiment={sentiment}
        isLoading={isLoading}
      />

      {/* Feedback Responses */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Feedback Responses</h2>
        
        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search by name, email, or comment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Star Rating Filter */}
          <Select value={starFilter} onValueChange={setStarFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Ratings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {feedbackResponses.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground text-lg">
              {pagination.total_records === 0 
                ? "No feedback received yet" 
                : "No feedback matches your search criteria"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {pagination.total_records === 0
                ? "Share your feedback form to start collecting responses"
                : "Try adjusting your search or filters"}
            </p>
          </Card>
        ) : (
          <div className="bg-card rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Star Rating</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedbackResponses.map((response) => {
                  const rating = parseInt(response.starRating);
                  return (
                    <TableRow key={response.id}>
                      <TableCell className="font-medium">
                        {response.form_data.name}
                      </TableCell>
                      <TableCell className="text-sm">
                        {response.form_data.email || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(response.created_at), "MMM dd, yyyy HH:mm")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(response)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-4 border-t flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {endIndex} of {pagination.total_records} results
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNumber}
                          variant={currentPage === pageNumber ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNumber)}
                          className="w-9 h-9 p-0"
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>

                  {/* Next Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Feedback Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(85vh-120px)] pr-2">
            {selectedFeedback && (
              <div className="space-y-6">
                {/* Standard Fields - Fixed Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Name</p>
                    <p className="font-medium">{selectedFeedback.form_data.name || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-medium">{selectedFeedback.form_data.email || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Submitted</p>
                    <p className="font-medium">
                      {format(new Date(selectedFeedback.created_at), "MMM dd, yyyy HH:mm")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Star Rating</p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < parseInt(selectedFeedback.starRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

    {/* Form Data Section - All fields */}
    {(() => {
      const allFormData = selectedFeedback.form_data;
      
      return (
        <div>
          <p className="text-sm text-muted-foreground mb-3 font-semibold">
            Form Data
          </p>
          <div className="space-y-3 pr-2">
            {Object.entries(allFormData).map(([key, value]) => (
              <div key={key} className="flex items-start gap-3 border-l-2 border-primary/20 pl-3">
                <p className="text-sm text-muted-foreground min-w-[180px] flex-shrink-0">
                  {formatFieldLabel(key)}:
                </p>
                <p className="font-medium break-words flex-1">
                  {formatFieldValue(value)}
                </p>
              </div>
            ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
