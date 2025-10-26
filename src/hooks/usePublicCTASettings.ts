import { useState, useEffect } from "react";
import { useGetCTAWithoutLogin } from "@/api/leadApi";
import type { CTASettings, SingleCTASettings } from "./useCTASettings";
import i18n from "@/i18n";

export const usePublicCTASettings = (reportId: string) => {
  const [settings, setSettings] = useState<CTASettings | null>(null);

  interface Language {
    code: string;
    name: string;
  }

  const languages: Language[] = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "fr", name: "French" },
  ];

  const currentLang = i18n.language || "en";

  // Find the full name
  const currentLangName = languages.find(
    (lang) => lang.code === currentLang
  )?.name;

  // Use API hook for public CTA data
  const {
    data: apiData,
    isLoading: isLoadingData,
    error: fetchError,
  } = useGetCTAWithoutLogin(reportId, currentLangName);

  // Update settings when API data is loaded
  useEffect(() => {
    if (apiData?.code === 200 && apiData.data) {
      setSettings(apiData.data);
    }
  }, [apiData, currentLangName]);

  // Filter out invisible CTAs
  const visibleSettings = settings
    ? {
        callCTA: settings.callCTA.isVisible ? settings.callCTA : null,
        appointmentCTA: settings.appointmentCTA.isVisible
          ? settings.appointmentCTA
          : null,
      }
    : null;

  return {
    settings: visibleSettings,
    isLoading: isLoadingData,
    error: fetchError,
  };
};
