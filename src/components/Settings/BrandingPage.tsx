import React from 'react';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';
import { EnhancedLogoUploadSection } from './Branding/EnhancedLogoUploadSection';
import { EnhancedFaviconUploadSection } from './Branding/EnhancedFaviconUploadSection';
import { ThemeColorsSection } from './Branding/ThemeColorsSection';
import { SidebarCustomizationSection } from './Branding/SidebarCustomizationSection';
import { BrandingSaveActions } from './Branding/BrandingSaveActions';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { updateTheme, ThemeUpdateData } from '../../api/themeApi';
import { setThemeLoading, setLightLogo, setDarkLogo, setFavicon, setSelectedTheme } from '../../store/slices/themeSlice';
import { useToast } from '@/hooks/use-toast';

export const BrandingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const {
    light_logo,
    dark_logo,
    favicon,
    selected_theme,
    accent_color,
    bg_color,
    label_color,
    active_menu_bg_color,
    active_menu_label_color,
    isLoading
  } = useAppSelector((state) => state.theme);

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
        toast({
          title: "Theme updated successfully",
          description: response.message,
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Error saving theme:', error);
      toast({
        title: "Error saving theme",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      dispatch(setThemeLoading(false));
    }
  };
  return <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Theme Customization</h1>
          <p className="text-gray-600">Customize your application's visual identity</p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          White Label
        </Badge>
      </div>

      <Card>
        <CardContent className="space-y-6 pt-6">
          <EnhancedLogoUploadSection 
            lightLogoFile={light_logo} 
            darkLogoFile={dark_logo} 
            onLightLogoChange={(file) => dispatch(setLightLogo(file))} 
            onDarkLogoChange={(file) => dispatch(setDarkLogo(file))} 
          />

          <Separator className="mx-0" />

          <EnhancedFaviconUploadSection 
            faviconFile={favicon} 
            onFaviconChange={(file) => dispatch(setFavicon(file))} 
          />

          <Separator className="mx-0" />

          <ThemeColorsSection />

          <Separator className="mx-0" />

          <SidebarCustomizationSection 
            selectedTheme={selected_theme} 
            onThemeChange={(theme) => dispatch(setSelectedTheme(theme))} 
          />
        </CardContent>
      </Card>

      <BrandingSaveActions isSaving={isLoading} onSave={handleSaveChanges} />
    </div>;
};