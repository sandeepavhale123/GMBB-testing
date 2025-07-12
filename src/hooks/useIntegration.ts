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

// Query keys
export const integrationKeys = {
  mapApiKey: ["mapApiKey"] as const,
  subdomainStatus: ["subdomainStatus"] as const,
  smtpDetails: (listingId: number | string) => ["smtpDetails", listingId] as const,
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

  return useMutation({
    mutationFn: updateMapApiKey,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: integrationKeys.mapApiKey });
      toast({
        title: "Success",
        description: data?.message || "API key updated successfully",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to save API key. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteMapApiKey = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMapApiKey,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: integrationKeys.mapApiKey });
      toast({
        title: "Success",
        description: data?.message || "API key disconnected successfully",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to disconnect API key. Please try again.";
      toast({
        title: "Error",
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

  return useMutation({
    mutationFn: updateSubdomain,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: integrationKeys.subdomainStatus,
      });
      toast({
        title: "Success",
        description:
          data?.message || "Subdomain configuration saved successfully",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to save subdomain configuration. Please try again.";
      toast({
        title: "Error",
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
    queryFn: () => getSmtpDetails({ listingId: typeof listingId === 'string' ? parseInt(listingId, 10) : listingId }),
    retry: false,
  });
};

export const useUpdateSmtpDetails = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSmtpDetails,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["smtpDetails"] });
      toast({
        title: "Success",
        description: data?.message || "SMTP settings saved successfully",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to save SMTP settings. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

export const useTestSmtpDetails = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: testSmtpDetails,
    onSuccess: (data) => {
      toast({
        title: "Test Email Sent",
        description: data?.message || "SMTP test email sent successfully",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to send test email. Please check your settings.";
      toast({
        title: "Test Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteSmtpDetails = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSmtpDetails,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["smtpDetails"] });
      toast({
        title: "Success",
        description: data?.message || "SMTP settings deleted successfully",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete SMTP settings. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};
export const useSubdomainDetails = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSubdomainDetails,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["subdomainStatus"] });
      toast({
        title: "Success",
        description: data?.message || "Subdomain is deleted successfully.",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete Subdomain. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};
