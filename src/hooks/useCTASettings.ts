import { useState, useEffect } from "react";
import { z } from "zod";
import {
  useGetCTADetails,
  useSaveCTACustomizer,
  useResetCTACustomizer,
} from "@/api/leadApi";
import { useToast } from "@/hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

// export const singleCTASettingsSchema = z.object({
//   header: z
//     .string()
//     .min(1, t("ctaSettings.validation.headerRequired"))
//     .max(100, t("ctaSettings.validation.headerMax")),
//   description: z
//     .string()
//     .min(1, t("ctaSettings.validation.descriptionRequired"))
//     .max(500, t("ctaSettings.validation.descriptionMax")),
//   buttonLabel: z
//     .string()
//     .min(1, t("ctaSettings.validation.buttonLabelRequired"))
//     .max(50, t("ctaSettings.validation.buttonLabelMax")),
//   buttonLink: z
//     .string()
//     .url(t("ctaSettings.validation.buttonLinkInvalid"))
//     .or(z.literal(""))
//     .or(z.string().regex(/^#/, t("ctaSettings.validation.hash"))),
//   isVisible: z.boolean().default(true),
// });

// export const ctaSettingsSchema = z.object({
//   callCTA: singleCTASettingsSchema,
//   appointmentCTA: singleCTASettingsSchema,
// });

// export type SingleCTASettings = z.infer<typeof singleCTASettingsSchema>;
// export type CTASettings = z.infer<typeof ctaSettingsSchema>;

// ✅ Move schema & types OUTSIDE the hook and export them
export const createSingleCTASettingsSchema = (t: (key: string) => string) =>
  z.object({
    header: z
      .string()
      .min(1, t("ctaSettings.validation.headerRequired"))
      .max(100, t("ctaSettings.validation.headerMax")),
    description: z
      .string()
      .min(1, t("ctaSettings.validation.descriptionRequired"))
      .max(500, t("ctaSettings.validation.descriptionMax")),
    buttonLabel: z
      .string()
      .min(1, t("ctaSettings.validation.buttonLabelRequired"))
      .max(50, t("ctaSettings.validation.buttonLabelMax")),
    buttonLink: z
      .string()
      .url(t("ctaSettings.validation.buttonLinkInvalid"))
      .or(z.literal(""))
      .or(z.string().regex(/^#/, t("ctaSettings.validation.hash"))),
    isVisible: z.boolean().default(true),
  });

// 🧠 You can export a static version too (for useFormValidation etc.)
export const singleCTASettingsSchema = z.object({
  header: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  buttonLabel: z.string().min(1).max(50),
  buttonLink: z.string().url().or(z.literal("")).or(z.string().regex(/^#/)),
  isVisible: z.boolean().default(true),
});

export type SingleCTASettings = z.infer<typeof singleCTASettingsSchema>;

export type CTASettings = {
  callCTA: SingleCTASettings;
  appointmentCTA: SingleCTASettings;
};

export const useCTASettings = () => {
  const { t } = useI18nNamespace("hooks/useCTASettings");

  const dynamicSchema = createSingleCTASettingsSchema(t);

  const ctaSettingsSchema = z.object({
    callCTA: dynamicSchema,
    appointmentCTA: dynamicSchema,
  });

  const DEFAULT_CTA_SETTINGS: CTASettings = {
    callCTA: {
      header: t("ctaSettings.default.callCTA.header"),
      description: t("ctaSettings.default.callCTA.description"),
      buttonLabel: t("ctaSettings.default.callCTA.buttonLabel"),
      buttonLink: t("ctaSettings.default.callCTA.buttonLink"),
      isVisible: true,
    },
    appointmentCTA: {
      header: t("ctaSettings.default.appointmentCTA.header"),
      description: t("ctaSettings.default.appointmentCTA.description"),
      buttonLabel: t("ctaSettings.default.appointmentCTA.buttonLabel"),
      buttonLink: t("ctaSettings.default.appointmentCTA.buttonLink"),
      isVisible: true,
    },
  };

  const CTA_SETTINGS_KEY = "lead-module-cta-settings";

  const [settings, setSettings] = useState<CTASettings>(DEFAULT_CTA_SETTINGS);
  const { toast } = useToast();

  // Use API hooks
  const {
    data: apiData,
    isLoading: isLoadingData,
    error: fetchError,
  } = useGetCTADetails();

  const { mutateAsync: saveCtaMutation, isPending: isSaving } =
    useSaveCTACustomizer();

  const { mutateAsync: resetCtaMutation, isPending: isResetting } =
    useResetCTACustomizer();

  // Update settings when API data is loaded
  useEffect(() => {
    if (apiData?.code === 200 && apiData.data) {
      setSettings(apiData.data);
    }
  }, [apiData]);

  // Show error toast if API fetch fails
  useEffect(() => {
    if (fetchError) {
      toast({
        title: t("ctaSettings.toast.errorTitle"),
        description: t("ctaSettings.toast.errorDesc"),
        variant: "destructive",
      });
    }
  }, [fetchError, toast]);

  const updateSingleCTA = async (
    ctaType: "callCTA" | "appointmentCTA",
    newSettings: SingleCTASettings
  ): Promise<boolean> => {
    try {
      const validated = singleCTASettingsSchema.parse(newSettings);

      await saveCtaMutation({
        ctaType,
        header: validated.header,
        description: validated.description,
        buttonLabel: validated.buttonLabel,
        buttonLink: validated.buttonLink,
        isVisible: validated.isVisible,
      });

      // Update local state
      setSettings((prev) => ({
        ...prev,
        [ctaType]: validated,
      }));

      return true;
    } catch (error) {
      // console.error("Failed to update CTA settings:", error);
      return false;
    }
  };

  const updateSettings = async (newSettings: CTASettings): Promise<boolean> => {
    // Update both CTAs
    const callSuccess = await updateSingleCTA("callCTA", newSettings.callCTA);
    const appointmentSuccess = await updateSingleCTA(
      "appointmentCTA",
      newSettings.appointmentCTA
    );

    return callSuccess && appointmentSuccess;
  };

  const resetToDefaults = async () => {
    const callSuccess = await updateSingleCTA(
      "callCTA",
      DEFAULT_CTA_SETTINGS.callCTA
    );
    const appointmentSuccess = await updateSingleCTA(
      "appointmentCTA",
      DEFAULT_CTA_SETTINGS.appointmentCTA
    );

    if (callSuccess && appointmentSuccess) {
      toast({
        title: t("ctaSettings.toast.ctaTitle"),
        description: t("ctaSettings.toast.resetSuccess"),
      });
    }
  };

  const resetSingleCTA = async (
    ctaType: "callCTA" | "appointmentCTA"
  ): Promise<boolean> => {
    try {
      const response = await resetCtaMutation({ ctaType });

      if (response.code === 200 && response.data) {
        // Update local state with the API response data
        const resetData = response.data[ctaType];
        if (resetData) {
          setSettings((prev) => ({
            ...prev,
            [ctaType]: resetData,
          }));
        }
        return true;
      }
      return false;
    } catch (error) {
      // console.error("Failed to reset CTA settings:", error);
      return false;
    }
  };

  return {
    settings,
    updateSettings,
    updateSingleCTA,
    resetToDefaults,
    resetSingleCTA,
    isLoading: isLoadingData || isSaving || isResetting,
  };
};
