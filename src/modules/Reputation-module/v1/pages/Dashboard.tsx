import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeedbackStatsCards } from "../components/FeedbackStatsCards";
import { FeedbackFormTable } from "../components/FeedbackFormTable";
import { toast } from "@/hooks/toast/use-toast";
import { getFeedbackForms, deleteFeedbackForm } from "@/utils/feedbackStorage";
import type { FeedbackForm } from "../types";

// Mock data - replace with API call later
const mockFeedbackForms: FeedbackForm[] = [
  {
    id: "1",
    name: "Restaurant Feedback",
    created_at: "2024-01-15T10:30:00Z",
    feedback_count: 45,
    form_url: "https://yourdomain.com/feedback/1",
    logo: "",
    title: "How was your dining experience?",
    subtitle: "We value your feedback",
    positive_feedback_url: "https://google.com/review",
    positive_feedback_title: "Thank you! Please review us on:",
    success_title: "Thanks for your feedback!",
    success_subtitle: "We appreciate your time",
  },
  {
    id: "2",
    name: "Hotel Guest Feedback",
    created_at: "2024-01-20T14:20:00Z",
    feedback_count: 23,
    form_url: "https://yourdomain.com/feedback/2",
    logo: "",
    title: "How was your stay?",
    subtitle: "Help us improve your experience",
    positive_feedback_url: "https://google.com/review",
    positive_feedback_title: "We're glad you enjoyed your stay!",
    success_title: "Thank you!",
    success_subtitle: "Your feedback helps us improve",
  },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState<FeedbackForm[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load forms from localStorage on mount
  useEffect(() => {
    const loadForms = () => {
      try {
        const storedForms = getFeedbackForms();
        setForms(storedForms as any);
      } catch (error) {
        console.error("Failed to load forms:", error);
        toast({
          title: "Error",
          description: "Failed to load feedback forms",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadForms();
  }, []);

  const totalFeedback = forms.reduce((acc, form) => acc + form.feedback_count, 0);
  const thisMonthFeedback = 28; // Mock data
  const averageResponseRate = 75; // Mock data

  const handleDeleteForm = (id: string) => {
    try {
      deleteFeedbackForm(id);
      setForms((prev) => prev.filter((form) => form.id !== id));
      toast({
        title: "Form Deleted",
        description: "Feedback form has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete feedback form",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Feedbacks</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your feedback collection forms
          </p>
        </div>
        <Button
          onClick={() => navigate("/module/reputation/v1/create-feedback-form")}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Feedback Form
        </Button>
      </div>

      {/* Stats Cards */}
      <FeedbackStatsCards
        totalForms={forms.length}
        totalFeedback={totalFeedback}
        thisMonthFeedback={thisMonthFeedback}
        averageResponseRate={averageResponseRate}
      />

      {/* Forms Table */}
      <FeedbackFormTable forms={forms} onDelete={handleDeleteForm} />
    </div>
  );
};
