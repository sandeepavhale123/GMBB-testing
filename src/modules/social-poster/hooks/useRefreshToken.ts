import { useMutation, useQueryClient } from "@tanstack/react-query";
import { refreshAccountToken } from "../api/socialPosterApi";
import { RefreshTokenRequest } from "../types";
import { toast } from "@/hooks/use-toast";

export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RefreshTokenRequest) => refreshAccountToken(data),
    onSuccess: (response) => {
      if (response.data.requires_reauthorization) {
        toast({
          title: "Re-authorization Required",
          description: response.message,
          variant: "destructive",
        });
        
        if (response.data.reauthorization_url) {
          window.location.href = response.data.reauthorization_url;
        }
      } else {
        toast({
          title: "Token Refreshed",
          description: response.message,
        });
        
        // Invalidate accounts query to refetch updated data
        queryClient.invalidateQueries({ queryKey: ["social-poster", "accounts"] });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Refresh Failed",
        description: error.response?.data?.message || "Failed to refresh token",
        variant: "destructive",
      });
    },
  });
};
