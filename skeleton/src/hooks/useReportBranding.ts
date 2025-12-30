import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  getReportBranding,
  updateReportBranding,
  deleteReportBranding,
  UpdateReportBrandingPayload,
} from "@/api/reportBrandingApi";
import {
  getLeadReportBranding,
  GetLeadReportBrandingRequest,
} from "@/api/leadApi";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

// Query keys
export const reportBrandingKeys = {
  all: ["reportBranding"] as const,
  details: () => [...reportBrandingKeys.all, "details"] as const,
  leadReport: (reportId: string, language: string) =>
    [...reportBrandingKeys.all, "leadReport", reportId] as const,
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
  const { t } = useI18nNamespace("hooks/useReportBranding");
  return useMutation({
    mutationFn: updateReportBranding,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: reportBrandingKeys.all });
      toast({
        title: t("reportBranding.toast.titleSuccess"),
        description: data?.message || t("reportBranding.success.update"),
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        t("reportBranding.error.update");
      toast({
        title: t("reportBranding.toast.titleError"),
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
  const { t } = useI18nNamespace("hooks/useReportBranding");
  return useMutation({
    mutationFn: deleteReportBranding,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: reportBrandingKeys.all });
      toast({
        title: t("reportBranding.toast.titleSuccess"),
        description: data?.message || t("reportBranding.success.delete"),
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        t("reportBranding.error.delete");
      toast({
        title: t("reportBranding.toast.titleError"),
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

// Get Lead Report Branding hook
export const useGetLeadReportBranding = (
  reportId: string,
  language?: string
) => {
  return useQuery({
    queryKey: reportBrandingKeys.leadReport(reportId, language),
    queryFn: () => getLeadReportBranding({ reportId, language }),
    enabled: !!reportId,
    retry: false, // Don't retry on 404 - means no branding exists
  });
};
