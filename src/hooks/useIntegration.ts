import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  updateSubdomain,
  getSubdomainStatus,
  getSmtpDetails,
  updateSmtpDetails,
  testSmtpDetails,
  deleteSmtpDetails,
  getMapApiKey,
  updateMapApiKey,
  deleteMapApiKey,
  deleteSubdomainDetails,
  SmtpPayload,
} from "@/api/integrationApi";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
// Query keys
export const integrationKeys = {
  mapApiKey: ["mapApiKey"] as const,
  subdomainStatus: ["subdomainStatus"] as const,
  smtpDetails: (listingId: number | string) =>
    ["smtpDetails", listingId] as const,
};

// Map API Key hooks
export const useGetMapApiKey = () => {
  return useQuery({
    queryKey: integrationKeys.mapApiKey,
    queryFn: getMapApiKey,
    retry: false, // Don't retry on 404 - means no key exists
  });
};

export const useUpdateMapApiKey = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useI18nNamespace("hooks/useIntegration");

  return useMutation({
    mutationFn: updateMapApiKey,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: integrationKeys.mapApiKey });
      toast({
        title: t("integration.toast.titleSuccess"),
        description: data?.message || t("integration.mapApiKey.success.update"),
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        t("integration.mapApiKey.error.update");
      toast({
        title: t("integration.toast.titleError"),
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteMapApiKey = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useI18nNamespace("hooks/useIntegration");
  return useMutation({
    mutationFn: deleteMapApiKey,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: integrationKeys.mapApiKey });
      toast({
        title: t("integration.toast.titleSuccess"),
        description: data?.message || t("integration.mapApiKey.success.delete"),
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        t("integration.mapApiKey.error.delete");
      toast({
        title: t("integration.toast.titleError"),
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

// Subdomain hooks
export const useGetSubdomainStatus = () => {
  return useQuery({
    queryKey: integrationKeys.subdomainStatus,
    queryFn: getSubdomainStatus,
    retry: false,
  });
};

export const useUpdateSubdomain = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useI18nNamespace("hooks/useIntegration");
  return useMutation({
    mutationFn: updateSubdomain,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: integrationKeys.subdomainStatus,
      });
      toast({
        title: t("integration.toast.titleSuccess"),
        description: data?.message || t("integration.subdomain.success.update"),
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        t("integration.subdomain.error.update");
      toast({
        title: t("integration.toast.titleError"),
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

// SMTP hooks
export const useGetSmtpDetails = (listingId: number | string) => {
  return useQuery({
    queryKey: integrationKeys.smtpDetails(listingId),
    queryFn: () =>
      getSmtpDetails({
        listingId:
          typeof listingId === "string" ? parseInt(listingId, 10) : listingId,
      }),
    retry: false,
  });
};

export const useUpdateSmtpDetails = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useI18nNamespace("hooks/useIntegration");
  return useMutation({
    mutationFn: updateSmtpDetails,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["smtpDetails"] });
      toast({
        title: t("integration.toast.titleSuccess"),
        description: data?.message || t("integration.smtp.success.update"),
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        t("integration.smtp.error.update");
      toast({
        title: t("integration.toast.titleError"),
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

export const useTestSmtpDetails = () => {
  const { toast } = useToast();
  const { t } = useI18nNamespace("hooks/useIntegration");
  return useMutation({
    mutationFn: testSmtpDetails,
    onSuccess: (data) => {
      toast({
        title: t("integration.toast.titleTestSuccess"),
        description: data?.message || t("integration.smtp.success.testEmail"),
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        t("integration.smtp.error.testEmail");
      toast({
        title: t("integration.toast.titleTestError"),
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteSmtpDetails = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useI18nNamespace("hooks/useIntegration");
  return useMutation({
    mutationFn: deleteSmtpDetails,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["smtpDetails"] });
      toast({
        title: t("integration.toast.titleSuccess"),
        description: data?.message || t("integration.smtp.success.delete"),
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        t("integration.smtp.error.delete");
      toast({
        title: t("integration.toast.titleError"),
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};
export const useSubdomainDetails = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useI18nNamespace("hooks/useIntegration");
  return useMutation({
    mutationFn: deleteSubdomainDetails,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["subdomainStatus"] });
      toast({
        title: t("integration.toast.titleSuccess"),
        description: data?.message || t("integration.subdomain.success.delete"),
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        t("integration.subdomain.error.delete");
      toast({
        title: t("integration.toast.titleError"),
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};
