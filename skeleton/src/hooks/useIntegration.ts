import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  updateSubdomain,
  getSubdomainStatus,
  getSmtpDetails,
  updateSmtpDetails,
  testSmtpDetails,
  deleteSmtpDetails,
  deleteSubdomainDetails,
  SmtpPayload,
  connectTwilio,
  getTwilioStatus,
  disconnectTwilio,
  TwilioConnectPayload,
} from "@/api/integrationApi";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

// Query keys
export const integrationKeys = {
  subdomainStatus: ["subdomainStatus"] as const,
  smtpDetails: (listingId: number | string) =>
    ["smtpDetails", listingId] as const,
  twilioStatus: ["twilioStatus"] as const,
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
export const useGetSmtpDetails = (listingId: number | string | null) => {
  return useQuery({
    queryKey: integrationKeys.smtpDetails(listingId ?? 0),
    queryFn: () =>
      getSmtpDetails({
        listingId:
          typeof listingId === "string" ? parseInt(listingId, 10) : (listingId ?? 0),
      }),
    retry: false,
    enabled: listingId !== null,
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

// Twilio hooks
export const useGetTwilioStatus = () => {
  return useQuery({
    queryKey: integrationKeys.twilioStatus,
    queryFn: getTwilioStatus,
    retry: false,
  });
};

export const useConnectTwilio = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useI18nNamespace("hooks/useIntegration");

  return useMutation({
    mutationFn: (data: TwilioConnectPayload) => connectTwilio(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: integrationKeys.twilioStatus });
      toast({
        title: t("integration.toast.titleSuccess"),
        description: data?.message || t("integration.twilio.success.connect"),
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        t("integration.twilio.error.connect");
      toast({
        title: t("integration.toast.titleError"),
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

export const useDisconnectTwilio = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useI18nNamespace("hooks/useIntegration");

  return useMutation({
    mutationFn: (configId: string) => disconnectTwilio(configId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: integrationKeys.twilioStatus });
      toast({
        title: t("integration.toast.titleSuccess"),
        description: data?.message || t("integration.twilio.success.disconnect"),
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        t("integration.twilio.error.disconnect");
      toast({
        title: t("integration.toast.titleError"),
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};