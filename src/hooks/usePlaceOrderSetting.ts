import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  getPlaceOrderSetting,
  updatePlaceOrderSetting,
  updatePlaceOrderStatus,
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
