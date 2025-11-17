import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FeedbackStatsCards } from "../components/FeedbackStatsCards";
import { FeedbackFormTable } from "../components/FeedbackFormTable";
import {
  useGetAllFeedbackForms,
  useDeleteFeedbackForm,
  useGetFeedbackStats,
} from "@/api/reputationApi";
import { transformFeedbackFormData } from "../utils/transformFeedbackData";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/hooks/use-toast";
import type { FeedbackForm } from "../types";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const Dashboard: React.FC = () => {
  const { t } = useI18nNamespace("Reputation-module-v1-pages/Dashboard");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Debounce search to avoid excessive API calls
  const debouncedSearch = useDebounce(searchInput, 500);

  // Fetch data using React Query with debounced search
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetAllFeedbackForms(debouncedSearch, currentPage, itemsPerPage);

  // Delete mutation
  const deleteMutation = useDeleteFeedbackForm();

  // Fetch stats separately
  const {
    data: statsData,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useGetFeedbackStats();

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

  // Use stats from dedicated API
  const stats = useMemo(() => {
    if (statsData?.data) {
      return {
        totalForms: statsData.data.totalForms,
        totalFeedback: statsData.data.totalResponses,
        thisMonthFeedback: statsData.data.responsesThisMonth,
        averageRating: statsData.data.avgRating,
      };
    }

    // Fallback to zeros if stats API fails
    return {
      totalForms: 0,
      totalFeedback: 0,
      thisMonthFeedback: 0,
      averageRating: 0,
    };
  }, [statsData]);

  const handleDeleteForm = async (id: string) => {
    // Find the form to get its form_id (API identifier)
    const formToDelete = forms.find((f) => f.id === id);

    if (!formToDelete?.form_id) {
      toast({
        title: t("messages.error"),
        description: t("alerts.deleteNotFound"),
        variant: "destructive",
      });
      return;
    }

    try {
      // Call delete API with form_id (not display id)
      const response = await deleteMutation.mutateAsync(formToDelete.form_id);

      // Refetch forms list and stats to update the UI
      await Promise.all([refetch(), refetchStats()]);

      toast({
        title: t("messages.success"),
        description: response.message || t("messages.deleteSuccess"),
      });
    } catch (error: any) {
      console.error("Delete error:", error);
      toast({
        title: t("messages.error"),
        description: error?.response?.data?.message || t("alerts.deleteError"),
        variant: "destructive",
      });
    }
  };

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t("error.title")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("error.description")}
            </p>
          </div>
          <Button
            onClick={() =>
              navigate("/module/reputation/v1/create-feedback-form")
            }
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {t("buttons.createFeedbackForm")}
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertDescription>
            {t("alerts.loadError")}
            {error instanceof Error && `: ${error.message}`}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {t("page.title")}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            {t("page.subtitle")}
          </p>
        </div>
        <Button
          onClick={() => navigate("/module/reputation/v1/create-feedback-form")}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          {t("buttons.createFeedbackForm")}
        </Button>
      </div>

      {/* Stats Cards */}
      <FeedbackStatsCards
        totalForms={stats.totalForms}
        totalFeedback={stats.totalFeedback}
        thisMonthFeedback={stats.thisMonthFeedback}
        averageResponseRate={stats.averageRating}
        isLoading={isLoadingStats}
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
        isLoading={isLoading || isLoadingStats || deleteMutation.isPending}
        isFetching={isFetching}
      />
    </div>
  );
};
