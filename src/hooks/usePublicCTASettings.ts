import { useState, useEffect } from "react";
import { useGetCTAWithoutLogin } from "@/api/leadApi";
import type { CTASettings, SingleCTASettings } from "./useCTASettings";

export const usePublicCTASettings = (reportId: string) => {
  const [settings, setSettings] = useState<CTASettings | null>(null);
  
  // Use API hook for public CTA data
  const { 
    data: apiData, 
    isLoading: isLoadingData, 
    error: fetchError 
  } = useGetCTAWithoutLogin(reportId);

  // Update settings when API data is loaded
  useEffect(() => {
    if (apiData?.code === 200 && apiData.data) {
      setSettings(apiData.data);
    }
  }, [apiData]);

  // Filter out invisible CTAs
  const visibleSettings = settings ? {
    callCTA: settings.callCTA.isVisible ? settings.callCTA : null,
    appointmentCTA: settings.appointmentCTA.isVisible ? settings.appointmentCTA : null,
  } : null;

  return {
    settings: visibleSettings,
    isLoading: isLoadingData,
    error: fetchError,
  };
};