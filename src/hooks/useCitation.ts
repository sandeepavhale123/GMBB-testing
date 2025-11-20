// src/hooks/api/useCreateCitationReport.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createCitationReport,
  getCitationReport,
  refreshCitationReport,
  CreateCitationReportPayload,
  GetCitationReportPayload,
  RefreshCitationReportPayload,
  getPossibleCitationList,
} from "@/api/citationApi";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const useCreateCitationReport = () => {
  const { t } = useI18nNamespace("hooks/useCitation");
  return useMutation({
    mutationFn: (payload: CreateCitationReportPayload) =>
      createCitationReport(payload),
    onSuccess: (data) => {
      toast({
        title: t("citationReport.toast.success.create.title"),
        description:
          data?.message || t("citationReport.toast.success.create.description"),
      });
    },
    onError: (data) => {
      toast({
        title: t("citationReport.toast.error.create.title"),
        description:
          data?.message || t("citationReport.toast.error.create.description"),
      });
    },
  });
};

export const useGetCitationReport = (
  listingId?: string | number,
  enabled = true
) => {
  const { t } = useI18nNamespace("hooks/useCitation");
  const query = useQuery({
    queryKey: ["citation-report", listingId],
    queryFn: () => getCitationReport({ listingId: listingId! }),
    enabled: enabled && !!listingId,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.isSuccess) {
      toast({
        title: t("citationReport.toast.success.fetch.title"),
        description:
          query.data?.message ||
          t("citationReport.toast.success.fetch.description"),
      });
    }
  }, [query.isSuccess]);

  useEffect(() => {
    if (query.isError) {
      const error = query.error as any;
      const isValidationError =
        error?.response?.status === 400 &&
        error?.response?.data?.message?.includes(
          t("citationReport.toast.validation.requiredFields")
        );

      // Only show error toast for real errors, not the expected validation error
      if (!isValidationError) {
        toast({
          title: t("citationReport.toast.error.fetch.title"),
          description:
            error?.message || t("citationReport.toast.error.fetch.description"),
        });
      }
    }
  }, [query.isError]);

  return query;
};

export const usePossibleCitationList = (
  listingId?: number | string,
  enabled = false
) => {
  return useQuery({
    queryKey: ["possible-citation-list", listingId],
    queryFn: () => getPossibleCitationList(Number(listingId)),
    enabled: enabled && !!listingId,
    staleTime: 1000 * 60 * 10, // cache 10 minutes
  });
};

export const useRefreshCitationReport = () => {
  const { t } = useI18nNamespace("hooks/useCitation");
  return useMutation({
    mutationFn: (payload: RefreshCitationReportPayload) =>
      refreshCitationReport(payload),
    onSuccess: (data) => {
      toast({
        title: t("citationReport.toast.success.refresh.title"),
        description:
          data?.message ||
          t("citationReport.toast.success.refresh.description"),
      });
    },
    onError: (data) => {
      toast({
        title: t("citationReport.toast.error.refresh.title"),
        description:
          data?.message || t("citationReport.toast.error.refresh.description"),
      });
    },
  });
};
