import React, { useEffect } from "react";
import { Palette, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { setAccentColor } from "@/store/slices/themeSlice";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

const themeColors = [
  { name: "blue", color: "hsl(217 91% 60%)", value: "blue" },
  { name: "teal", color: "hsl(173 80% 40%)", value: "teal" },
  { name: "purple", color: "hsl(262 83% 58%)", value: "purple" },
  { name: "cyan", color: "hsl(188 78% 41%)", value: "cyan" },
  { name: "emerald", color: "hsl(160 84% 39%)", value: "emerald" },
  { name: "orange", color: "hsl(25 95% 53%)", value: "orange" },
];

export const ThemeColorsSection: React.FC = () => {
  const { t } = useI18nNamespace("Branding/themeColorsSection");
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { accentColor } = useAppSelector((state) => state.theme);

  // Apply stored color on component mount
  useEffect(() => {
    const colorMap: Record<string, string> = {
      blue: "217 91% 60%",
      green: "142 76% 36%",
      teal: "173 80% 40%",
      purple: "262 83% 58%",
      cyan: "188 78% 41%",
      emerald: "160 84% 39%",
      orange: "25 95% 53%",
    };

    const hslColor = colorMap[accentColor];
    if (hslColor) {
      document.documentElement.style.setProperty("--primary", hslColor);
      document.documentElement.style.setProperty("--ring", hslColor);
      document.documentElement.style.setProperty("--sidebar-ring", hslColor);
      document.documentElement.style.setProperty("--accent-primary", hslColor);
    }
  }, [accentColor]);

  const handleColorSelect = (colorValue: string) => {
    dispatch(setAccentColor(colorValue as any));

    // Apply theme color as primary immediately throughout the app
    const colorMap: Record<string, string> = {
      blue: "217 91% 60%",
      green: "142 76% 36%",
      teal: "173 80% 40%",
      purple: "262 83% 58%",
      cyan: "188 78% 41%",
      emerald: "160 84% 39%",
      orange: "25 95% 53%",
    };

    const hslColor = colorMap[colorValue];
    if (hslColor) {
      document.documentElement.style.setProperty("--primary", hslColor);
      document.documentElement.style.setProperty("--ring", hslColor);
      document.documentElement.style.setProperty("--sidebar-ring", hslColor);
      document.documentElement.style.setProperty("--accent-primary", hslColor);
    }

    toast({
      title: t("themeColorsSection.toast.title"),
      description: t("themeColorsSection.toast.description", {
        color: colorValue,
      }),
    });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5" />
        {t("themeColorsSection.title")}
      </h3>
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {themeColors.map((color) => (
            <button
              key={color.value}
              onClick={() => handleColorSelect(color.value)}
              className={`relative w-16 h-16 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                accentColor === color.value
                  ? "border-gray-400 ring-2 ring-offset-2 ring-gray-300"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              style={{ backgroundColor: color.color }}
            >
              {accentColor === color.value && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Check className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
              )}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-3">
          {t("themeColorsSection.currentTheme")}
          <span className="font-medium capitalize">{accentColor}</span>
        </p>
      </div>
    </div>
  );
};
