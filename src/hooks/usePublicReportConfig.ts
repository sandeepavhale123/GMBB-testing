import { languageMap } from "./../lib/languageMap";
import { useQuery } from "@tanstack/react-query";
import {
  getShareableReport,
  ShareableReportConfigResponse,
} from "@/api/publicDashboardApi";

export const usePublicReportConfig = (reportId: string, language?: string) => {
  return useQuery({
    queryKey: ["publicReportConfig", reportId, language],
    queryFn: (): Promise<ShareableReportConfigResponse> =>
      getShareableReport({ reportId, language }),
    staleTime: 10 * 60 * 1000, // 10 minutes (config doesn't change often)
    retry: 2,
    enabled: !!reportId,
  });
};
