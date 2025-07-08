import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { LogoUploadSection } from './Branding/LogoUploadSection';
import { FaviconUploadSection } from './Branding/FaviconUploadSection';
import { ThemeColorsSection } from './Branding/ThemeColorsSection';
import { SidebarCustomizationSection } from './Branding/SidebarCustomizationSection';
import { BrandingSaveActions } from './Branding/BrandingSaveActions';

export const BrandingPage: React.FC = () => {
  const [lightLogoFile, setLightLogoFile] = useState<File | null>(null);
  const [darkLogoFile, setDarkLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [customSidebarColor, setCustomSidebarColor] = useState('#1f2937');
  const [customLabelColor, setCustomLabelColor] = useState('#ffffff');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Branding</h1>
          <p className="text-gray-600 mt-1">Customize your application's visual identity</p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          White Label
        </Badge>
      </div>

      <LogoUploadSection
        lightLogoFile={lightLogoFile}
        darkLogoFile={darkLogoFile}
        onLightLogoChange={setLightLogoFile}
        onDarkLogoChange={setDarkLogoFile}
      />

      <FaviconUploadSection
        faviconFile={faviconFile}
        onFaviconChange={setFaviconFile}
      />

      <ThemeColorsSection />

      <SidebarCustomizationSection
        customSidebarColor={customSidebarColor}
        customLabelColor={customLabelColor}
        onSidebarColorChange={setCustomSidebarColor}
        onLabelColorChange={setCustomLabelColor}
      />

      <BrandingSaveActions
        isSaving={isSaving}
        onSave={handleSaveChanges}
      />
    </div>
  );
};