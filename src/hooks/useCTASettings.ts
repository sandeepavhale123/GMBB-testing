import { useState, useEffect } from "react";
import { z } from "zod";

export const ctaSettingsSchema = z.object({
  header: z.string().min(1, "Header is required").max(100, "Header must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  buttonLabel: z.string().min(1, "Button label is required").max(50, "Button label must be less than 50 characters"),
  buttonLink: z.string().url("Please enter a valid URL").or(z.literal("")).or(z.string().regex(/^#/, "Hash links must start with #")),
  backgroundColor: z.string().min(1, "Background color is required"),
  textColor: z.string().min(1, "Text color is required"),
});

export type CTASettings = z.infer<typeof ctaSettingsSchema>;

const DEFAULT_CTA_SETTINGS: CTASettings = {
  header: "Ready to Improve Your GMB Performance?",
  description: "Let's work together to boost your Google My Business score and increase your local visibility. Our team of experts will help you implement all the recommendations from this audit and create a comprehensive local SEO strategy tailored to your business.",
  buttonLabel: "Let's Work Together",
  buttonLink: "#contact",
  backgroundColor: "#3B82F6",
  textColor: "#FFFFFF",
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

  const resetToDefaults = () => {
    localStorage.removeItem(CTA_SETTINGS_KEY);
    setSettings(DEFAULT_CTA_SETTINGS);
  };

  return {
    settings,
    updateSettings,
    resetToDefaults,
    isLoading,
  };
};
