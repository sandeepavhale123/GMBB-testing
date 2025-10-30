import React, { useState } from "react";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Settings, Palette } from "lucide-react";
import { useAppDispatch } from "../../../hooks/useRedux";
import { setThemeColors } from "../../../store/slices/themeSlice";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface SidebarCustomizationSectionProps {
  selectedTheme: string;
  onThemeChange: (themeId: string) => void;
}

export const SidebarCustomizationSection: React.FC<
  SidebarCustomizationSectionProps
> = ({ selectedTheme, onThemeChange }) => {
  const { t } = useI18nNamespace("Branding/sidebarCustomizationSection");

  const sidebarThemes = [
    {
      id: "theme_01",
      label: t("sidebarCustomization.themes.theme_01"),
      bgColor: "#111827",
      labelColor: "#e2e8f0",
      activeMenuBgColor: "#2563eb",
      activeMenuLabelColor: "#fff",
    },
    {
      id: "blue",
      label: t("sidebarCustomization.themes.blue"),
      bgColor: "#2563eb",
      labelColor: "#ffffff",
      activeMenuBgColor: "#1d4ed8",
      activeMenuLabelColor: "#ffffff",
    },
    {
      id: "red",
      label: t("sidebarCustomization.themes.red"),
      bgColor: "#dc2626",
      labelColor: "#ffffff",
      activeMenuBgColor: "#b91c1c",
      activeMenuLabelColor: "#ffffff",
    },
    {
      id: "green",
      label: t("sidebarCustomization.themes.green"),
      bgColor: "#059669",
      labelColor: "#ffffff",
      activeMenuBgColor: "#047857",
      activeMenuLabelColor: "#ffffff",
    },
    {
      id: "brown",
      label: t("sidebarCustomization.themes.brown"),
      bgColor: "#7c2d12",
      labelColor: "#ffffff",
      activeMenuBgColor: "#92400e",
      activeMenuLabelColor: "#ffffff",
    },
    {
      id: "gray",
      label: t("sidebarCustomization.themes.gray"),
      bgColor: "#1f2937",
      labelColor: "#d1d5db",
      activeMenuBgColor: "#374151",
      activeMenuLabelColor: "#ffffff",
    },
    {
      id: "purple",
      label: t("sidebarCustomization.themes.purple"),
      bgColor: "#581c87",
      labelColor: "#ffffff",
      activeMenuBgColor: "#6b21a8",
      activeMenuLabelColor: "#ffffff",
    },
  ];

  const SidebarPreview: React.FC<{
    theme: (typeof sidebarThemes)[0];
    isSelected: boolean;
  }> = ({ theme, isSelected }) => {
    const menuItems = ["Overview", "Posts", "Media", "Insights", "GEO Ranking"];

    return (
      <div
        className="w-full h-32 rounded-lg border overflow-hidden relative"
        style={{
          backgroundColor: theme.bgColor,
          borderColor: "#e5e7eb",
        }}
      >
        {/* Logo Area */}
        <div className="p-2 border-b border-black/10">
          <div
            className="text-xs font-semibold truncate"
            style={{ color: theme.labelColor }}
          >
            {t("sidebarCustomization.customModal.preview.logo")}
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-1 space-y-1">
          {menuItems.slice(0, 4).map((item, index) => (
            <div
              key={item}
              className="px-2 py-1 rounded text-xs truncate"
              style={{
                backgroundColor:
                  index === 1 ? theme.activeMenuBgColor : "transparent",
                color:
                  index === 1 ? theme.activeMenuLabelColor : theme.labelColor,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const CustomColorModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSelectColor: (colors: any) => void;
  }> = ({ isOpen, onClose, onSelectColor }) => {
    const [bgColor, setBgColor] = useState("#2563eb");
    const [labelColor, setLabelColor] = useState("#ffffff");
    const [activeMenuBgColor, setActiveMenuBgColor] = useState("#1d4ed8");
    const [activeMenuLabelColor, setActiveMenuLabelColor] = useState("#ffffff");

    const handleApply = () => {
      onSelectColor({
        bgColor,
        labelColor,
        activeMenuBgColor,
        activeMenuLabelColor,
      });
      onClose();
    };

    const handleReset = () => {
      setBgColor("#2563eb");
      setLabelColor("#ffffff");
      setActiveMenuBgColor("#1d4ed8");
      setActiveMenuLabelColor("#ffffff");
    };

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[95vw] sm:max-w-md lg:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
              {t("sidebarCustomization.customModal.title")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 p-2 sm:p-4">
            {/* Preview */}
            <div className="border rounded-lg overflow-hidden">
              <div className="h-32 sm:h-36 p-3 sm:p-4" style={{ backgroundColor: bgColor }}>
                <div
                  className="text-xs font-semibold mb-3"
                  style={{ color: labelColor }}
                >
                  {t("sidebarCustomization.customModal.preview.logo")}
                </div>
                <div className="space-y-1">
                  <div
                    className="text-xs px-2 py-1"
                    style={{ color: labelColor }}
                  >
                    {t(
                      "sidebarCustomization.customModal.preview.menuItems.overview"
                    )}
                  </div>
                  <div
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      backgroundColor: activeMenuBgColor,
                      color: activeMenuLabelColor,
                    }}
                  >
                    {t(
                      "sidebarCustomization.customModal.preview.menuItems.posts"
                    )}
                  </div>
                  <div
                    className="text-xs px-2 py-1"
                    style={{ color: labelColor }}
                  >
                    {t(
                      "sidebarCustomization.customModal.preview.menuItems.media"
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Color Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="bgColor">
                  {t("sidebarCustomization.customModal.labels.background")}
                </Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    id="bgColor"
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full sm:w-12 h-10 p-1 rounded"
                  />
                  <Input
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    placeholder="#2563eb"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="labelColor">
                  {t("sidebarCustomization.customModal.labels.text")}
                </Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    id="labelColor"
                    type="color"
                    value={labelColor}
                    onChange={(e) => setLabelColor(e.target.value)}
                    className="w-full sm:w-12 h-10 p-1 rounded"
                  />
                  <Input
                    value={labelColor}
                    onChange={(e) => setLabelColor(e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activeMenuBgColor">
                  {t(
                    "sidebarCustomization.customModal.labels.activeBackground"
                  )}
                </Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    id="activeMenuBgColor"
                    type="color"
                    value={activeMenuBgColor}
                    onChange={(e) => setActiveMenuBgColor(e.target.value)}
                    className="w-full sm:w-12 h-10 p-1 rounded"
                  />
                  <Input
                    value={activeMenuBgColor}
                    onChange={(e) => setActiveMenuBgColor(e.target.value)}
                    placeholder="#1d4ed8"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activeMenuLabelColor">
                  {t("sidebarCustomization.customModal.labels.activeText")}
                </Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    id="activeMenuLabelColor"
                    type="color"
                    value={activeMenuLabelColor}
                    onChange={(e) => setActiveMenuLabelColor(e.target.value)}
                    className="w-full sm:w-12 h-10 p-1 rounded"
                  />
                  <Input
                    value={activeMenuLabelColor}
                    onChange={(e) => setActiveMenuLabelColor(e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
              <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto">
                {t("sidebarCustomization.customModal.buttons.reset")}
              </Button>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
                  {t("sidebarCustomization.customModal.buttons.cancel")}
                </Button>
                <Button onClick={handleApply} className="flex-1 sm:flex-none">
                  {t("sidebarCustomization.customModal.buttons.apply")}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const dispatch = useAppDispatch();
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  const handleThemeChange = (themeId: string) => {
    const theme = sidebarThemes.find((t) => t.id === themeId);
    if (theme) {
      // Update selected_theme in Redux
      onThemeChange(themeId);

      // Update sidebar colors in Redux
      dispatch(
        setThemeColors({
          bg_color: theme.bgColor,
          label_color: theme.labelColor,
          active_menu_bg_color: theme.activeMenuBgColor,
          active_menu_label_color: theme.activeMenuLabelColor,
        })
      );

      // Apply to real sidebar immediately
      document.documentElement.style.setProperty("--sidebar-bg", theme.bgColor);
      document.documentElement.style.setProperty(
        "--sidebar-text",
        theme.labelColor
      );
      document.documentElement.style.setProperty(
        "--sidebar-active-bg",
        theme.activeMenuBgColor
      );
      document.documentElement.style.setProperty(
        "--sidebar-active-text",
        theme.activeMenuLabelColor
      );
      document.documentElement.style.setProperty(
        "--sidebar-border",
        "rgba(255, 255, 255, 0.1)"
      );
      document.documentElement.style.setProperty(
        "--sidebar-hover-bg",
        "rgba(255, 255, 255, 0.1)"
      );
      document.documentElement.style.setProperty(
        "--sidebar-hover-text",
        "#ffffff"
      );
    }
  };

  const handleCustomColorSelect = (colors: any) => {
    // Update selected_theme to 'custom' in Redux
    onThemeChange("custom");

    // Update sidebar colors in Redux
    dispatch(
      setThemeColors({
        bg_color: colors.bgColor,
        label_color: colors.labelColor,
        active_menu_bg_color: colors.activeMenuBgColor,
        active_menu_label_color: colors.activeMenuLabelColor,
      })
    );

    // Apply custom colors immediately
    document.documentElement.style.setProperty("--sidebar-bg", colors.bgColor);
    document.documentElement.style.setProperty(
      "--sidebar-text",
      colors.labelColor
    );
    document.documentElement.style.setProperty(
      "--sidebar-active-bg",
      colors.activeMenuBgColor
    );
    document.documentElement.style.setProperty(
      "--sidebar-active-text",
      colors.activeMenuLabelColor
    );
    document.documentElement.style.setProperty(
      "--sidebar-border",
      "rgba(255, 255, 255, 0.1)"
    );
    document.documentElement.style.setProperty(
      "--sidebar-hover-bg",
      "rgba(255, 255, 255, 0.1)"
    );
    document.documentElement.style.setProperty(
      "--sidebar-hover-text",
      "#ffffff"
    );
  };

  return (
    <div>
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5" />
        {t("sidebarCustomization.title")}
      </h3>
      <div>
        <RadioGroup value={selectedTheme} onValueChange={handleThemeChange}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sidebarThemes.map((theme) => (
              <div
                key={theme.id}
                className={`space-y-2 rounded-lg p-3 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedTheme === theme.id
                    ? "border-2 border-blue-400 bg-blue-50"
                    : "border-2 border-transparent hover:border-gray-200"
                }`}
                onClick={() => handleThemeChange(theme.id)}
              >
                <div className="relative">
                  <SidebarPreview
                    theme={theme}
                    isSelected={selectedTheme === theme.id}
                  />
                  <RadioGroupItem
                    value={theme.id}
                    id={theme.id}
                    className="absolute top-2 right-2 bg-white pointer-events-none"
                    checked={selectedTheme === theme.id}
                  />
                </div>
                <Label
                  htmlFor={theme.id}
                  className="text-sm font-medium text-center cursor-pointer block pointer-events-none"
                >
                  {theme.label}
                </Label>
              </div>
            ))}

            {/* Custom Color Card */}
            <div
              className={`space-y-2 rounded-lg p-3 cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedTheme === "custom"
                  ? "border-2 border-blue-400 bg-blue-50"
                  : "border-2 border-transparent hover:border-gray-200"
              }`}
              onClick={() => setIsCustomModalOpen(true)}
            >
              <div className="relative">
                <div className="w-full h-32 rounded-lg border overflow-hidden relative bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Palette className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-white/20 backdrop-blur-sm rounded px-2 py-1">
                    <span className="text-xs text-white font-medium">
                      {t("sidebarCustomization.customCard.label")}
                    </span>
                  </div>
                </div>
                <RadioGroupItem
                  value="custom"
                  id="custom"
                  className="absolute top-2 right-2 bg-white pointer-events-none"
                  checked={selectedTheme === "custom"}
                />
              </div>
              <Label
                htmlFor="custom"
                className="text-sm font-medium text-center cursor-pointer block pointer-events-none"
              >
                {t("sidebarCustomization.customCard.description")}
              </Label>
            </div>
          </div>
        </RadioGroup>

        <CustomColorModal
          isOpen={isCustomModalOpen}
          onClose={() => setIsCustomModalOpen(false)}
          onSelectColor={handleCustomColorSelect}
        />
      </div>
    </div>
  );
};
