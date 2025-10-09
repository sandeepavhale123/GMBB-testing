import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Edit, Phone, Calendar, RotateCcw, MoreVertical } from "lucide-react";
import { SingleCTASettings } from "@/hooks/useCTASettings";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface CTACardProps {
  type: "call" | "appointment";
  settings: SingleCTASettings;
  onEdit: () => void;
  onReset: () => void;
  isPreview?: boolean;
  disabled?: boolean;
}

export const CTACard: React.FC<CTACardProps> = ({
  type,
  settings,
  onEdit,
  onReset,
  isPreview = false,
  disabled = false,
}) => {
  const { t } = useI18nNamespace("Laed-module-component/CTACard");
  const Icon = type === "call" ? Phone : Calendar;

  const handleButtonClick = (e: React.MouseEvent) => {
    if (isPreview || !settings.buttonLink) {
      e.preventDefault();
      return;
    }

    if (settings.buttonLink.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(settings.buttonLink);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div
      className={`relative p-4 md:p-6 rounded-lg overflow-hidden transition-all bg-primary text-primary-foreground ${
        disabled ? "opacity-50 grayscale" : ""
      }`}
    >
      {disabled && (
        <div className="absolute inset-0 bg-black/10 z-10 flex items-center justify-center">
          <div className="bg-black/80 text-white px-3 py-1 rounded-md text-sm font-medium">
            {t("ctaCard.hidden")}
          </div>
        </div>
      )}
      {/* Action Buttons Dropdown */}
      <div className="absolute top-1 right-1 z-20">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-white hover:bg-gray-100 shadow-sm"
              style={{ color: "black" }}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-0" align="end">
            <div className="py-1">
              <button
                onClick={onEdit}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground"
              >
                <Edit className="w-4 h-4" />
                {t("ctaCard.edit")}
              </button>
              <button
                onClick={onReset}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground"
              >
                <RotateCcw className="w-4 h-4" />
                {t("ctaCard.reset")}
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 self-center sm:self-auto">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center bg-white/30 backdrop-blur-sm">
            <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <h3 className="text-base sm:text-lg font-bold mb-2 leading-tight">
            {settings.header}
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed opacity-90 mb-4 sm:mb-0">
            {settings.description}
          </p>
        </div>

        {/* Button */}
        <div className="flex-shrink-0 self-center sm:self-auto">
          {settings.buttonLink ? (
            <a
              href={isPreview ? undefined : settings.buttonLink}
              onClick={handleButtonClick}
              className="inline-block"
              target={
                settings.buttonLink.startsWith("http") ? "_blank" : undefined
              }
              rel={
                settings.buttonLink.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
            >
              <Button className="bg-white hover:bg-gray-50 text-primary border border-primary font-semibold px-6 py-2 rounded-md transition-colors">
                {settings.buttonLabel}
              </Button>
            </a>
          ) : (
            <Button
              className="bg-white hover:bg-gray-50 text-primary border border-primary font-semibold px-6 py-2 rounded-md transition-colors"
              onClick={handleButtonClick}
            >
              {settings.buttonLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
