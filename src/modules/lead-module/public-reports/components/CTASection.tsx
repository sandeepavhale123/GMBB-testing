import React from "react";
import { Button } from "@/components/ui/button";
import { useCTASettings } from "@/hooks/useCTASettings";

interface CTASectionProps {
  settings?: {
    header?: string;
    description?: string;
    buttonLabel?: string;
    buttonLink?: string;
    backgroundColor?: string;
    textColor?: string;
  };
  isPreview?: boolean;
}

export const CTASection: React.FC<CTASectionProps> = ({ settings: overrideSettings, isPreview = false }) => {
  const { settings: storedSettings } = useCTASettings();
  
  // Merge override settings with stored settings, ensuring all properties exist
  const settings = {
    header: overrideSettings?.header ?? storedSettings.header,
    description: overrideSettings?.description ?? storedSettings.description,
    buttonLabel: overrideSettings?.buttonLabel ?? storedSettings.buttonLabel,
    buttonLink: overrideSettings?.buttonLink ?? storedSettings.buttonLink,
    backgroundColor: overrideSettings?.backgroundColor ?? storedSettings.backgroundColor,
    textColor: overrideSettings?.textColor ?? storedSettings.textColor,
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    if (isPreview || !settings.buttonLink) {
      e.preventDefault();
      return;
    }
    
    if (settings.buttonLink.startsWith('#')) {
      // Handle anchor links
      e.preventDefault();
      const element = document.querySelector(settings.buttonLink);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // For external links, let the default behavior handle it
  };

  return (
    <div 
      className="p-8 rounded-lg my-8 relative overflow-hidden"
      style={{ backgroundColor: settings.backgroundColor, color: settings.textColor }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute top-4 right-4 w-32 h-32 border rounded-full"
          style={{ borderColor: `${settings.textColor}33` }}
        ></div>
        <div 
          className="absolute bottom-4 left-4 w-24 h-24 border rounded-full"
          style={{ borderColor: `${settings.textColor}33` }}
        ></div>
      </div>
      
      <div className="text-center max-w-4xl mx-auto relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
          {settings.header}
        </h2>
        <p className="text-lg mb-6 leading-relaxed opacity-90">
          {settings.description}
        </p>
        
        {settings.buttonLink ? (
          <a
            href={isPreview ? undefined : settings.buttonLink}
            onClick={handleButtonClick}
            className="inline-block"
            target={settings.buttonLink.startsWith('http') ? '_blank' : undefined}
            rel={settings.buttonLink.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            <Button 
              variant="secondary" 
              size="lg"
              className="font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              style={{ 
                backgroundColor: settings.textColor, 
                color: settings.backgroundColor,
                borderColor: settings.backgroundColor
              }}
            >
              {settings.buttonLabel}
            </Button>
          </a>
        ) : (
          <Button 
            variant="secondary" 
            size="lg"
            className="font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            style={{ 
              backgroundColor: settings.textColor, 
              color: settings.backgroundColor,
              borderColor: settings.backgroundColor
            }}
            onClick={handleButtonClick}
          >
            {settings.buttonLabel}
          </Button>
        )}
      </div>
    </div>
  );
};