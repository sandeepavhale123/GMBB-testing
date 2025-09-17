import { useState, useEffect } from "react";
import { z } from "zod";
import { useGetCTADetails, useSaveCTACustomizer, useResetCTACustomizer } from "@/api/leadApi";
import { useToast } from "@/hooks/use-toast";

export const singleCTASettingsSchema = z.object({
  header: z.string().min(1, "Header is required").max(100, "Header must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  buttonLabel: z.string().min(1, "Button label is required").max(50, "Button label must be less than 50 characters"),
  buttonLink: z.string().url("Please enter a valid URL").or(z.literal("")).or(z.string().regex(/^#/, "Hash links must start with #")),
  isVisible: z.boolean().default(true),
});

export const ctaSettingsSchema = z.object({
  callCTA: singleCTASettingsSchema,
  appointmentCTA: singleCTASettingsSchema,
});

export type SingleCTASettings = z.infer<typeof singleCTASettingsSchema>;
export type CTASettings = z.infer<typeof ctaSettingsSchema>;

const DEFAULT_CTA_SETTINGS: CTASettings = {
  callCTA: {
    header: "BOOST YOUR GBP SCORE &&& Increase your calls",
    description: "Learn how to pay your employees a month's salary by simply fixing what's broken. Get your free blueprint to crush your competition!",
    buttonLabel: "BOOK A CALL",
    buttonLink: "#contact",
    isVisible: true,
  },
  appointmentCTA: {
    header: "BOOST YOUR GBP SCORE &&& Increase your calls",
    description: "Learn how to pay your employees a month's salary by simply fixing what's broken. Get your free blueprint to crush your competition!",
    buttonLabel: "BOOK A CALL", 
    buttonLink: "#contact",
    isVisible: true,
  },
};

const CTA_SETTINGS_KEY = "lead-module-cta-settings";

export const useCTASettings = () => {
  const [settings, setSettings] = useState<CTASettings>(DEFAULT_CTA_SETTINGS);
  const { toast } = useToast();
  
  // Use API hooks
  const { 
    data: apiData, 
    isLoading: isLoadingData, 
    error: fetchError 
  } = useGetCTADetails();
  
  const { 
    mutateAsync: saveCtaMutation, 
    isPending: isSaving 
  } = useSaveCTACustomizer();
  
  const { 
    mutateAsync: resetCtaMutation, 
    isPending: isResetting 
  } = useResetCTACustomizer();

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
        title: "Error loading CTA settings",
        description: "Using default settings. Please refresh to try again.",
        variant: "destructive",
      });
    }
  }, [fetchError, toast]);

  const updateSingleCTA = async (ctaType: 'callCTA' | 'appointmentCTA', newSettings: SingleCTASettings): Promise<boolean> => {
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
      setSettings(prev => ({
        ...prev,
        [ctaType]: validated,
      }));

      return true;
    } catch (error) {
      console.error("Failed to update CTA settings:", error);
      return false;
    }
  };

  const updateSettings = async (newSettings: CTASettings): Promise<boolean> => {
    // Update both CTAs
    const callSuccess = await updateSingleCTA('callCTA', newSettings.callCTA);
    const appointmentSuccess = await updateSingleCTA('appointmentCTA', newSettings.appointmentCTA);
    
    return callSuccess && appointmentSuccess;
  };

  const resetToDefaults = async () => {
    const callSuccess = await updateSingleCTA('callCTA', DEFAULT_CTA_SETTINGS.callCTA);
    const appointmentSuccess = await updateSingleCTA('appointmentCTA', DEFAULT_CTA_SETTINGS.appointmentCTA);
    
    if (callSuccess && appointmentSuccess) {
      toast({
        title: "CTA Reset",
        description: "CTA settings have been reset to defaults.",
      });
    }
  };

  const resetSingleCTA = async (ctaType: 'callCTA' | 'appointmentCTA'): Promise<boolean> => {
    try {
      const response = await resetCtaMutation({ ctaType });
      
      if (response.code === 200 && response.data) {
        // Update local state with the API response data
        const resetData = response.data[ctaType];
        if (resetData) {
          setSettings(prev => ({
            ...prev,
            [ctaType]: resetData,
          }));
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to reset CTA settings:", error);
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
