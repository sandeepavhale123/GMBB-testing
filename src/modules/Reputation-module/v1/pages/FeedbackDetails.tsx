import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

  const feedbackResponses = mockFeedbackResponses.filter(
    (response) => response.form_id === id
  );

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
        {feedbackResponses.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground text-lg">No feedback received yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Share your feedback form to start collecting responses
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
                {feedbackResponses.map((response) => (
                  <TableRow key={response.id}>
                    <TableCell className="font-medium">{response.name}</TableCell>
                    <TableCell className="text-sm">{response.email_or_phone}</TableCell>
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
