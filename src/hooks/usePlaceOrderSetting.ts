import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  getPlaceOrderSetting,
  updatePlaceOrderSetting,
  updatePlaceOrderStatus,
  getPlaceOrderSettingByReportId,
  PlaceOrderSettingResponse,
  UpdatePlaceOrderSettingPayload,
  UpdatePlaceOrderStatusPayload,
} from "@/api/citationApi";

export const usePlaceOrderSetting = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: settingsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["place-order-setting"],
    queryFn: async () => {
      const response = await getPlaceOrderSetting();
      return response.data as PlaceOrderSettingResponse;
    },
  });

  const updateSettingMutation = useMutation({
    mutationFn: (data: UpdatePlaceOrderSettingPayload) =>
      updatePlaceOrderSetting(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["place-order-setting"] });
      toast({
        title: "Success",
        description: response.message || "Settings updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings.",
        variant: "destructive",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (data: UpdatePlaceOrderStatusPayload) =>
      updatePlaceOrderStatus(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["place-order-setting"] });
      toast({
        title: "Success",
        description: response.message || "Status updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    },
  });

  return {
    settings: settingsData,
    isLoading,
    refetch,
    updateSetting: updateSettingMutation.mutate,
    updateStatus: updateStatusMutation.mutate,
    isUpdatingSetting: updateSettingMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
  };
};

// Hook for public reports - fetches by reportId (no auth required)
export const usePublicPlaceOrderSetting = (reportId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["public-place-order-setting", reportId],
    queryFn: async () => {
      const response = await getPlaceOrderSettingByReportId({ reportId });
      return response.data as PlaceOrderSettingResponse;
    },
    enabled: !!reportId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    settings: data,
    isLoading,
  };
};
