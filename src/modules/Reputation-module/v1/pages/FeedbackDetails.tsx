import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Mail, MessageSquare, Trash2 } from "lucide-react";
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
    submitted_at: "2024-01-16T09:30:00Z",
  },
  {
    id: "2",
    form_id: "1",
    name: "Jane Smith",
    email_or_phone: "+1234567890",
    comment: "Good experience overall. Would recommend to friends.",
    submitted_at: "2024-01-17T14:20:00Z",
  },
  {
    id: "3",
    form_id: "1",
    name: "Mike Johnson",
    email_or_phone: "mike.j@email.com",
    comment: "Excellent! Everything was perfect from start to finish.",
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
  const navigate = useNavigate();

  const feedbackResponses = mockFeedbackResponses.filter(
    (response) => response.form_id === id
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/module/reputation/v1/dashboard")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{mockFormDetails.name}</h1>
          <p className="text-muted-foreground mt-1">
            View and manage feedback responses
          </p>
        </div>
      </div>

      {/* Form Details Card */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Form Configuration</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Title</p>
            <p className="font-medium">{mockFormDetails.title}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Subtitle</p>
            <p className="font-medium">{mockFormDetails.subtitle}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Created</p>
            <p className="font-medium">
              {format(new Date(mockFormDetails.created_at), "MMM dd, yyyy")}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Responses</p>
            <p className="font-medium">{mockFormDetails.feedback_count}</p>
          </div>
        </div>
      </Card>

      {/* Feedback Responses */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Feedback Responses</h2>
        {feedbackResponses.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
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
                  <TableHead>Contact</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedbackResponses.map((response) => (
                  <TableRow key={response.id}>
                    <TableCell className="font-medium">{response.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        {response.email_or_phone.includes("@") ? (
                          <Mail className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                        )}
                        {response.email_or_phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="max-w-md truncate text-sm">{response.comment}</p>
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(response.submitted_at), "MMM dd, yyyy HH:mm")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};
