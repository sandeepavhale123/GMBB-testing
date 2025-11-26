import React, { useEffect } from "react";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { EnhancedLogoUploadSection } from "./Branding/EnhancedLogoUploadSection";
import { EnhancedFaviconUploadSection } from "./Branding/EnhancedFaviconUploadSection";
import { ThemeColorsSection } from "./Branding/ThemeColorsSection";
import { SidebarCustomizationSection } from "./Branding/SidebarCustomizationSection";
import { BrandingSaveActions } from "./Branding/BrandingSaveActions";
import { useAppSelector, useAppDispatch } from "../../hooks/useRedux";
import { updateTheme, ThemeUpdateData, getTheme, deleteTheme } from "../../api/themeApi";
import {
  setThemeLoading,
  setLightLogo,
  setDarkLogo,
  setFavicon,
  setSelectedTheme,
  loadThemeFromAPI,
  setThemeColors,
  setAccentColor,
} from "../../store/slices/themeSlice";
import { useToast } from "@/hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const BrandingPage: React.FC = () => {
  const { t } = useI18nNamespace("Settings/brandingPage");
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const defaultThemeState = {
    selected_theme: "theme_01",
    accentColor: "blue",
    bg_color: "#111827",
    label_color: "#e2e8f0",
    active_menu_bg_color: "#2563eb",
    active_menu_label_color: "#fff",
  };
  const {
    light_logo,
    dark_logo,
    favicon,
    light_logo_url,
    dark_logo_url,
    favicon_url,
    selected_theme,
    accentColor,
    accent_color,
    bg_color,
    label_color,
    active_menu_bg_color,
    active_menu_label_color,
    isLoading,
  } = useAppSelector((state) => state.theme);
  const isCustomThemeApplied =
    selected_theme !== defaultThemeState.selected_theme ||
    accentColor !== defaultThemeState.accentColor ||
    bg_color !== defaultThemeState.bg_color ||
    label_color !== defaultThemeState.label_color ||
    active_menu_bg_color !== defaultThemeState.active_menu_bg_color ||
    active_menu_label_color !== defaultThemeState.active_menu_label_color;

  // Load existing theme data on component mount
  useEffect(() => {
    const loadThemeData = async () => {
      try {
        dispatch(setThemeLoading(true));
        const response = await getTheme();
        if (response.code === 200) {
          dispatch(loadThemeFromAPI(response.data));
        }
      } catch (error) {
        // console.error("Error loading theme data:", error);
      } finally {
        dispatch(setThemeLoading(false));
      }
    };
    loadThemeData();
  }, [dispatch]);
  const handleResetTheme = async () => {
    dispatch(setThemeLoading(true));
    try {
      const response = await deleteTheme();

      if (response?.code === 200) {
        toast({
          title: t("brandingPage.messages.reset.title"),
          description: response?.message || t("brandingPage.messages.reset.success"),
        });

        // Fetch fresh theme data from server after reset
        const themeResponse = await getTheme();
        if (themeResponse.code === 200) {
          dispatch(loadThemeFromAPI(themeResponse.data));
        }
      }
    } catch (error) {
      // console.error("Theme reset error:", error);
      toast({
        title: t("brandingPage.messages.reset.errorTitle"),
        description: error?.response?.data?.message || t("brandingPage.messages.reset.errorDescription"),
        variant: "destructive",
      });
    } finally {
      dispatch(setThemeLoading(false));
    }
  };
  const handleSaveChanges = async () => {
    dispatch(setThemeLoading(true));
    try {
      const themeData: ThemeUpdateData = {
        accent_color,
        selected_theme,
        bg_color,
        label_color,
        active_menu_bg_color,
        active_menu_label_color,
        light_logo,
        dark_logo,
        favicon,
      };
      const response = await updateTheme(themeData);
      if (response.code === 200) {
        // Fetch updated theme data to get new logo URLs
        const updatedTheme = await getTheme();
        if (updatedTheme.code === 200) {
          dispatch(loadThemeFromAPI(updatedTheme.data));
        }
        toast({
          title: t("brandingPage.messages.save.successTitle"),
          description: response.message,
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      // console.error("Error saving theme:", error);
      toast({
        title: t("brandingPage.messages.save.errorTitle"),
        description:
          error?.response?.data?.message || error.message || t("brandingPage.messages.save.errorDescription"),
        variant: "destructive",
      });
    } finally {
      dispatch(setThemeLoading(false));
    }
  };
  return (
    <div className="p-4 sm:p-6  pb-[100px] sm:pb-[100px] ">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("brandingPage.title")}</h1>
          <p className="text-gray-600">{t("brandingPage.subtitle")}</p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          {t("brandingPage.badge")}
        </Badge>
      </div>

      <Card>
        <CardContent className="space-y-6 pt-6">
          <EnhancedLogoUploadSection
            lightLogoFile={light_logo}
            darkLogoFile={dark_logo}
            lightLogoUrl={light_logo_url}
            darkLogoUrl={dark_logo_url}
            onLightLogoChange={(file) => dispatch(setLightLogo(file))}
            onDarkLogoChange={(file) => dispatch(setDarkLogo(file))}
          />

          <Separator className="mx-0" />

          <EnhancedFaviconUploadSection
            faviconFile={favicon}
            faviconUrl={favicon_url}
            onFaviconChange={(file) => dispatch(setFavicon(file))}
          />

          <Separator className="mx-0" />

          <ThemeColorsSection />

          <Separator className="mx-0" />

          <SidebarCustomizationSection
            selectedTheme={selected_theme}
            onThemeChange={(theme) => dispatch(setSelectedTheme(theme))}
          />

          <Separator className="mx-0" />

          <BrandingSaveActions
            isSaving={isLoading}
            onSave={handleSaveChanges}
            onReset={handleResetTheme}
            canReset={isCustomThemeApplied}
          />
        </CardContent>
      </Card>
    </div>
  );
};
