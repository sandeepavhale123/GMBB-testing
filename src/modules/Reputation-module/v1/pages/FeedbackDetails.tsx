import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Star, Eye, Search, ChevronLeft, ChevronRight } from "lucide-react";
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
import type { FeedbackResponse } from "../types";

// Mock data - replace with API call later
const mockFeedbackResponses: FeedbackResponse[] = [
  {
    id: "1",
    form_id: "1",
    name: "John Doe",
    email_or_phone: "john@example.com",
    comment: "Great service! The staff was very friendly and helpful.",
    star_rating: 5,
    submitted_at: "2024-01-16T09:30:00Z",
  },
  {
    id: "2",
    form_id: "1",
    name: "Jane Smith",
    email_or_phone: "+1234567890",
    comment: "Good experience overall. Would recommend to friends.",
    star_rating: 4,
    submitted_at: "2024-01-17T14:20:00Z",
  },
  {
    id: "3",
    form_id: "1",
    name: "Mike Johnson",
    email_or_phone: "mike.j@email.com",
    comment: "Excellent! Everything was perfect from start to finish.",
    star_rating: 5,
    submitted_at: "2024-01-18T11:15:00Z",
  },
];

const mockFormDetails = {
  id: "1",
  name: "Restaurant Feedback",
  title: "How was your dining experience?",
  subtitle: "We value your feedback",
  created_at: "2024-01-15T10:30:00Z",
  feedback_count: 45,
};

export const FeedbackDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackResponse | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [starFilter, setStarFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter responses by form ID
  const formResponses = mockFeedbackResponses.filter(
    (response) => response.form_id === id
  );

  // Apply search filter
  const searchFiltered = useMemo(() => {
    if (!searchQuery.trim()) return formResponses;
    
    const query = searchQuery.toLowerCase();
    return formResponses.filter((response) => 
      response.name.toLowerCase().includes(query) ||
      response.email_or_phone.toLowerCase().includes(query) ||
      response.comment.toLowerCase().includes(query)
    );
  }, [formResponses, searchQuery]);

  // Apply star rating filter
  const starFiltered = useMemo(() => {
    if (starFilter === "all") return searchFiltered;
    
    const selectedRating = parseInt(starFilter);
    return searchFiltered.filter((response) => response.star_rating === selectedRating);
  }, [searchFiltered, starFilter]);

  // Apply pagination
  const paginatedResponses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return starFiltered.slice(startIndex, endIndex);
  }, [starFiltered, currentPage, itemsPerPage]);

  // Calculate pagination metadata
  const totalPages = Math.ceil(starFiltered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, starFiltered.length);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, starFilter]);

  const handleViewDetails = (response: FeedbackResponse) => {
    setSelectedFeedback(response);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{mockFormDetails.name}</h1>
        <p className="text-muted-foreground mt-1">
          View and manage feedback responses
        </p>
      </div>

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

        {starFiltered.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground text-lg">
              {formResponses.length === 0 
                ? "No feedback received yet" 
                : "No feedback matches your search criteria"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {formResponses.length === 0
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
                {paginatedResponses.map((response) => (
                  <TableRow key={response.id}>
                    <TableCell className="font-medium">{response.name}</TableCell>
                    <TableCell className="text-sm">
                      {response.email_or_phone.includes("@") ? response.email_or_phone : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < response.star_rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(response.submitted_at), "MMM dd, yyyy HH:mm")}
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
                ))}
              </TableBody>
            </Table>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-4 border-t flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {endIndex} of {starFiltered.length} results
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Name</p>
                  <p className="font-medium">{selectedFeedback.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Contact</p>
                  <p className="font-medium">{selectedFeedback.email_or_phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Submitted</p>
                  <p className="font-medium">
                    {format(new Date(selectedFeedback.submitted_at), "MMM dd, yyyy HH:mm")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Star Rating</p>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < selectedFeedback.star_rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Comment</p>
                <Card className="p-4">
                  <p className="text-foreground">{selectedFeedback.comment}</p>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
