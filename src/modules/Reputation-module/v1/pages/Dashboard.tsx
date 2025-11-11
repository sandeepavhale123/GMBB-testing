import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FeedbackStatsCards } from "../components/FeedbackStatsCards";
import { FeedbackFormTable } from "../components/FeedbackFormTable";
import { useGetAllFeedbackForms } from "@/api/reputationApi";
import { transformFeedbackFormData } from "../utils/transformFeedbackData";
import { useDebounce } from "@/hooks/useDebounce";
import type { FeedbackForm } from "../types";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Debounce search to avoid excessive API calls
  const debouncedSearch = useDebounce(searchInput, 500);

  // Fetch data using React Query with debounced search
  const { data, isLoading, isError, error, refetch } = useGetAllFeedbackForms(
    debouncedSearch,
    currentPage,
    itemsPerPage
  );

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Transform API data to component format
  const forms = useMemo(() => {
    if (!data?.data?.data) return [];
    return data.data.data.map(transformFeedbackFormData);
  }, [data]);

  // Extract pagination metadata
  const totalRecords = data?.data?.total_records || 0;
  const totalPages = data?.data?.total_pages || 0;

  // Calculate stats from API summary or fallback to forms array
  const statsData = useMemo(() => {
    // If API provides summary, use it
    if (data?.data?.summary) {
      return {
        totalForms: data.data.summary.total_forms,
        totalFeedback: data.data.summary.total_feedback,
        thisMonthFeedback: data.data.summary.total_feedback_this_month,
        averageRating: data.data.summary.average_rating,
      };
    }
    
    // Fallback: Calculate from current forms
    const totalFeedback = forms.reduce((acc, form) => acc + form.feedback_count, 0);
    const averageRating = forms.length > 0
      ? forms.reduce((acc, form) => acc + (form.avg_rating || 0), 0) / forms.length
      : 0;
    
    return {
      totalForms: totalRecords || forms.length,
      totalFeedback,
      thisMonthFeedback: 0,
      averageRating,
    };
  }, [data, forms, totalRecords]);

  const handleDeleteForm = (id: string) => {
    // TODO: Implement delete API when available
    // For now, just refetch data
    refetch();
  };

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
        totalForms={statsData.totalForms}
        totalFeedback={statsData.totalFeedback}
        thisMonthFeedback={statsData.thisMonthFeedback}
        averageResponseRate={statsData.averageRating}
      />

      {/* Forms Table */}
      <FeedbackFormTable 
        forms={forms}
        onDelete={handleDeleteForm}
        searchQuery={searchInput}
        onSearchChange={setSearchInput}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        isServerPagination={true}
        isLoading={isLoading}
      />
    </div>
  );
};
