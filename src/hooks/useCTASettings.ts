import { useState, useEffect } from "react";
import { z } from "zod";

export const singleCTASettingsSchema = z.object({
  header: z.string().min(1, "Header is required").max(100, "Header must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  buttonLabel: z.string().min(1, "Button label is required").max(50, "Button label must be less than 50 characters"),
  buttonLink: z.string().url("Please enter a valid URL").or(z.literal("")).or(z.string().regex(/^#/, "Hash links must start with #")),
  backgroundColor: z.string().min(1, "Background color is required"),
  textColor: z.string().min(1, "Text color is required"),
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
    backgroundColor: "#FEF3C7",
    textColor: "#1F2937",
  },
  appointmentCTA: {
    header: "BOOST YOUR GBP SCORE &&& Increase your calls",
    description: "Learn how to pay your employees a month's salary by simply fixing what's broken. Get your free blueprint to crush your competition!",
    buttonLabel: "BOOK A CALL", 
    buttonLink: "#contact",
    backgroundColor: "#FEF3C7",
    textColor: "#1F2937",
  },
};

const CTA_SETTINGS_KEY = "lead-module-cta-settings";

export const useCTASettings = () => {
  const [settings, setSettings] = useState<CTASettings>(DEFAULT_CTA_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CTA_SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = ctaSettingsSchema.parse(parsed);
        setSettings(validated);
      }
    } catch (error) {
      console.warn("Failed to load CTA settings from localStorage:", error);
      // Keep default settings on error
    }
  }, []);

  const updateSettings = async (newSettings: CTASettings): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Validate settings
      const validated = ctaSettingsSchema.parse(newSettings);
      
      // Save to localStorage
      localStorage.setItem(CTA_SETTINGS_KEY, JSON.stringify(validated));
      setSettings(validated);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Failed to update CTA settings:", error);
      setIsLoading(false);
      return false;
    }
  };

  const updateSingleCTA = async (ctaType: 'callCTA' | 'appointmentCTA', newSettings: SingleCTASettings): Promise<boolean> => {
    const updatedSettings = {
      ...settings,
      [ctaType]: newSettings,
    };
    return updateSettings(updatedSettings);
  };

  const resetToDefaults = () => {
    localStorage.removeItem(CTA_SETTINGS_KEY);
    setSettings(DEFAULT_CTA_SETTINGS);
  };

  return {
    settings,
    updateSettings,
    updateSingleCTA,
    resetToDefaults,
    isLoading,
  };
};
