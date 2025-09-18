import React from "react";
import { usePublicCTASettings } from "@/hooks/usePublicCTASettings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Calendar } from "lucide-react";

interface SingleCTASectionProps {
  reportId: string;
  ctaType: 'callCTA' | 'appointmentCTA';
  isPreview?: boolean;
}

export const SingleCTASection: React.FC<SingleCTASectionProps> = ({ 
  reportId, 
  ctaType, 
  isPreview = false 
}) => {
  const { settings, isLoading, error } = usePublicCTASettings(reportId);

  if (isLoading || error || !settings) {
    return null;
  }

  const ctaSettings = settings[ctaType];
  if (!ctaSettings) {
    return null;
  }

  const handleButtonClick = (e: React.MouseEvent, buttonLink: string) => {
    if (isPreview) {
      e.preventDefault();
      return;
    }

    if (!buttonLink || buttonLink === '#') {
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

  const CTACard: React.FC<{
    type: 'call' | 'appointment';
    settings: any;
  }> = ({ type, settings }) => {
    const isExternal = settings.buttonLink && 
      !settings.buttonLink.startsWith('#') && 
      settings.buttonLink !== '';

    const buttonContent = (
      <>
        {type === 'call' ? (
          <Phone className="w-4 h-4 mr-2" />
        ) : (
          <Calendar className="w-4 h-4 mr-2" />
        )}
        {settings.buttonLabel}
      </>
    );

    return (
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              {type === 'call' ? (
                <Phone className="h-5 w-5 text-primary" />
              ) : (
                <Calendar className="h-5 w-5 text-primary" />
              )}
            </div>
            {settings.header}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{settings.description}</p>
          {isExternal ? (
            <a 
              href={settings.buttonLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button className="w-full" size="lg">
                {buttonContent}
              </Button>
            </a>
          ) : (
            <Button 
              className="w-full" 
              size="lg"
              onClick={(e) => handleButtonClick(e, settings.buttonLink)}
            >
              {buttonContent}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="my-6">
      <CTACard 
        type={ctaType === 'callCTA' ? 'call' : 'appointment'} 
        settings={ctaSettings} 
      />
    </div>
  );
};