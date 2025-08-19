import { useQuery } from "@tanstack/react-query";
import { getCustomEmailSettings, GetCustomEmailSettingsPayload } from "@/api/integrationApi";

export const useCustomEmailSettings = (params: GetCustomEmailSettingsPayload) => {
  return useQuery({
    queryKey: ["customEmailSettings", params],
    queryFn: () => getCustomEmailSettings(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};