import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FeedbackStatsCards } from "../components/FeedbackStatsCards";
import { FeedbackFormTable } from "../components/FeedbackFormTable";
import { useGetAllFeedbackForms } from "@/api/reputationApi";
import { transformFeedbackFormData } from "../utils/transformFeedbackData";
import type { FeedbackForm } from "../types";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch data using React Query
  const { data, isLoading, isError, error, refetch } = useGetAllFeedbackForms(
    searchQuery,
    currentPage,
    itemsPerPage
  );

  // Transform API data to component format
  const forms = useMemo(() => {
    if (!data?.data?.data) return [];
    return data.data.data.map(transformFeedbackFormData);
  }, [data]);

  // Extract pagination metadata
  const totalRecords = data?.data?.total_records || 0;
  const totalPages = data?.data?.total_pages || 0;

  const totalFeedback = forms.reduce((acc, form) => acc + form.feedback_count, 0);
  const thisMonthFeedback = 28; // Mock data - TODO: Add API endpoint
  const averageRating = forms.length > 0
    ? forms.reduce((acc, form) => acc + (form.avg_rating || 0), 0) / forms.length
    : 0;

  const handleDeleteForm = (id: string) => {
    // TODO: Implement delete API when available
    // For now, just refetch data
    refetch();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-lg">Loading feedback forms...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
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
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load feedback forms. Please try again.
            {error instanceof Error && `: ${error.message}`}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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
        averageResponseRate={averageRating}
      />

      {/* Forms Table */}
      <FeedbackFormTable 
        forms={forms}
        onDelete={handleDeleteForm}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        isServerPagination={true}
      />
    </div>
  );
};
