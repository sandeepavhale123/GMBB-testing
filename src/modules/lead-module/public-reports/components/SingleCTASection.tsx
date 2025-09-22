import React from 'react';
import { Button } from "@/components/ui/button";
import { Phone, Calendar } from "lucide-react";
import { usePublicCTASettings } from "@/hooks/usePublicCTASettings";

interface SingleCTASectionProps {
  reportId: string;
  ctaType: 'call' | 'appointment';
  isPreview?: boolean;
}

export const SingleCTASection: React.FC<SingleCTASectionProps> = ({ 
  reportId,
  ctaType,
  isPreview = false 
}) => {
  const { settings, isLoading, error } = usePublicCTASettings(reportId);

  // Don't render anything if loading, error, or no settings
  if (isLoading || error || !settings) {
    return null;
  }

  const ctaSettings = ctaType === 'call' ? settings.callCTA : settings.appointmentCTA;
  
  // Don't render if this specific CTA is not available
  if (!ctaSettings) {
    return null;
  }

  const handleButtonClick = (e: React.MouseEvent, buttonLink: string) => {
    if (isPreview || !buttonLink) {
      e.preventDefault();
      return;
    }
    
    if (buttonLink.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(buttonLink);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const Icon = ctaType === 'call' ? Phone : Calendar;
  
  return (
    <div className="my-8">
      <div 
        className="p-6 rounded-lg overflow-hidden bg-primary text-primary-foreground"
      >
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div 
              className="w-16 h-16 rounded-lg flex items-center justify-center bg-primary/80 bg-white/30 backdrop-blur-sm"
            >
              <Icon className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold mb-2 leading-tight">
              {ctaSettings.header}
            </h3>
            <p className="text-sm leading-relaxed opacity-90 mb-4">
              {ctaSettings.description}
            </p>
          </div>

          {/* Button */}
          <div className="flex-shrink-0">
            {ctaSettings.buttonLink ? (
              <a
                href={isPreview ? undefined : ctaSettings.buttonLink}
                onClick={(e) => handleButtonClick(e, ctaSettings.buttonLink)}
                className="inline-block"
                target={ctaSettings.buttonLink.startsWith('http') ? '_blank' : undefined}
                rel={ctaSettings.buttonLink.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                <Button 
                  className="bg-white hover:bg-gray-50 text-primary border border-primary font-semibold px-6 py-2 rounded-md transition-colors"
                >
                  {ctaSettings.buttonLabel}
                </Button>
              </a>
            ) : (
              <Button 
                className="bg-white hover:bg-gray-50 text-primary border border-primary font-semibold px-6 py-2 rounded-md transition-colors"
                onClick={(e) => handleButtonClick(e, ctaSettings.buttonLink)}
              >
                {ctaSettings.buttonLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};