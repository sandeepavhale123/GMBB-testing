import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  getReportBranding,
  updateReportBranding,
  deleteReportBranding,
  UpdateReportBrandingPayload,
} from "@/api/reportBrandingApi";

// Query keys
export const reportBrandingKeys = {
  all: ["reportBranding"] as const,
  details: () => [...reportBrandingKeys.all, "details"] as const,
};

// Get Report Branding hook
export const useGetReportBranding = () => {
  return useQuery({
    queryKey: reportBrandingKeys.details(),
    queryFn: getReportBranding,
    retry: false, // Don't retry on 404 - means no branding exists
  });
};

// Update Report Branding hook
export const useUpdateReportBranding = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateReportBranding,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: reportBrandingKeys.all });
      toast({
        title: "Success",
        description: data?.message || "Report branding updated successfully",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update report branding. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

// Delete Report Branding hook
export const useDeleteReportBranding = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReportBranding,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: reportBrandingKeys.all });
      toast({
        title: "Success",
        description: data?.message || "Report branding deleted successfully",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete report branding. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};
