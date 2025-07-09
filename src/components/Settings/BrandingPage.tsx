import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { EnhancedLogoUploadSection } from './Branding/EnhancedLogoUploadSection';
import { EnhancedFaviconUploadSection } from './Branding/EnhancedFaviconUploadSection';
import { ThemeColorsSection } from './Branding/ThemeColorsSection';
import { SidebarCustomizationSection } from './Branding/SidebarCustomizationSection';
import { BrandingSaveActions } from './Branding/BrandingSaveActions';
export const BrandingPage: React.FC = () => {
  const [lightLogoFile, setLightLogoFile] = useState<File | null>(null);
  const [darkLogoFile, setDarkLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [selectedTheme, setSelectedTheme] = useState('theme_01');
  const [isSaving, setIsSaving] = useState(false);
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
    } finally {
      setIsSaving(false);
    }
  };
  return <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Branding</h1>
          <p className="text-gray-600 mt-1">Customize your application's visual identity</p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          White Label
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Customization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <EnhancedLogoUploadSection lightLogoFile={lightLogoFile} darkLogoFile={darkLogoFile} onLightLogoChange={setLightLogoFile} onDarkLogoChange={setDarkLogoFile} />

          <Separator />

          <EnhancedFaviconUploadSection faviconFile={faviconFile} onFaviconChange={setFaviconFile} />

          <Separator />

          <ThemeColorsSection />

          <Separator />

          <SidebarCustomizationSection selectedTheme={selectedTheme} onThemeChange={setSelectedTheme} />
        </CardContent>
      </Card>

      <BrandingSaveActions isSaving={isSaving} onSave={handleSaveChanges} />
    </div>;
};