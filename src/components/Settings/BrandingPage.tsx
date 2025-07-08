import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Upload, Palette, Image, Settings, Check, Moon, Sun } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { setAccentColor, toggleTheme } from '@/store/slices/themeSlice';

export const BrandingPage: React.FC = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { isDark, accentColor } = useAppSelector((state) => state.theme);
  
  const [lightLogoFile, setLightLogoFile] = useState<File | null>(null);
  const [darkLogoFile, setDarkLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [sidebarTheme, setSidebarTheme] = useState<'dark' | 'light'>('dark');
  const [customSidebarColor, setCustomSidebarColor] = useState('#1f2937');
  const [customLabelColor, setCustomLabelColor] = useState('#ffffff');
  const [isSaving, setIsSaving] = useState(false);

  const themeColors = [
    { name: 'blue', color: 'hsl(217 91% 60%)', value: 'blue' },
    { name: 'teal', color: 'hsl(173 80% 40%)', value: 'teal' },
    { name: 'purple', color: 'hsl(262 83% 58%)', value: 'purple' },
    { name: 'cyan', color: 'hsl(188 78% 41%)', value: 'cyan' },
    { name: 'emerald', color: 'hsl(160 84% 39%)', value: 'emerald' },
    { name: 'orange', color: 'hsl(25 95% 53%)', value: 'orange' },
  ];

  const handleLogoUpload = (type: 'light' | 'dark') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Logo file must be less than 2MB",
          variant: "destructive",
        });
        return;
      }
      
      if (type === 'light') {
        setLightLogoFile(file);
      } else {
        setDarkLogoFile(file);
      }
      
      toast({
        title: `${type === 'light' ? 'Light' : 'Dark'} logo selected`,
        description: `${file.name} ready for upload`,
      });
    }
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Favicon file must be less than 1MB",
          variant: "destructive",
        });
        return;
      }
      setFaviconFile(file);
      toast({
        title: "Favicon selected",
        description: `${file.name} ready for upload`,
      });
    }
  };

  const handleColorSelect = (colorValue: string) => {
    dispatch(setAccentColor(colorValue as any));
    toast({
      title: "Theme color updated",
      description: `Applied ${colorValue} theme`,
    });
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Branding updated successfully",
        description: "Your white-label branding changes have been saved",
      });
    } catch (error) {
      toast({
        title: "Error saving changes",
        description: "Please try again later",
        variant: "destructive",
      });
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

      {/* Logo Section - Light & Dark */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            Application Logos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Light Logo */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-yellow-500" />
              <Label className="text-sm font-medium text-gray-700">Light Mode Logo</Label>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white">
                {lightLogoFile ? (
                  <img 
                    src={URL.createObjectURL(lightLogoFile)} 
                    alt="Light logo preview" 
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <Image className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-2">PNG, JPG up to 2MB. Recommended: 200x60px</p>
                <input
                  id="light-logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload('light')}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('light-logo-upload')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Light Logo
                </Button>
              </div>
            </div>
            {lightLogoFile && (
              <div className="text-sm text-gray-600">
                Selected: {lightLogoFile.name}
              </div>
            )}
          </div>

          {/* Dark Logo */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-blue-500" />
              <Label className="text-sm font-medium text-gray-700">Dark Mode Logo</Label>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-900">
                {darkLogoFile ? (
                  <img 
                    src={URL.createObjectURL(darkLogoFile)} 
                    alt="Dark logo preview" 
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <Image className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-2">PNG, JPG up to 2MB. Recommended: 200x60px</p>
                <input
                  id="dark-logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload('dark')}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('dark-logo-upload')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Dark Logo
                </Button>
              </div>
            </div>
            {darkLogoFile && (
              <div className="text-sm text-gray-600">
                Selected: {darkLogoFile.name}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Theme Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Theme Colors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {themeColors.map((color) => (
              <button
                key={color.value}
                onClick={() => handleColorSelect(color.value)}
                className={`relative w-16 h-16 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                  accentColor === color.value 
                    ? 'border-gray-400 ring-2 ring-offset-2 ring-gray-300' 
                    : 'border-gray-200 hover:border-gray-300'
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
            Current theme: <span className="font-medium capitalize">{accentColor}</span>
          </p>
        </CardContent>
      </Card>

      {/* Sidebar Customization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Sidebar Customization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sidebar Theme Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Sidebar Theme</Label>
            <div className="flex gap-4">
              {[
                { id: 'dark', label: 'Dark', color: '#1f2937', icon: Moon },
                { id: 'light', label: 'Light', color: '#ffffff', icon: Sun },
                { id: 'blue', label: 'Blue', color: '#3b82f6', icon: Settings },
                { id: 'green', label: 'Green', color: '#10b981', icon: Settings },
                { id: 'purple', label: 'Purple', color: '#8b5cf6', icon: Settings },
              ].map((theme) => {
                const IconComponent = theme.icon;
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setSidebarTheme(theme.id as 'dark' | 'light');
                      setCustomSidebarColor(theme.color);
                    }}
                    className={`relative w-20 h-16 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                      (sidebarTheme === theme.id || 
                       (theme.id !== 'dark' && theme.id !== 'light' && customSidebarColor === theme.color))
                        ? 'border-primary ring-2 ring-offset-2 ring-primary/20' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ 
                      backgroundColor: theme.id === 'light' ? '#ffffff' : theme.color,
                      border: theme.id === 'light' ? '2px solid #e5e7eb' : undefined
                    }}
                  >
                    {(sidebarTheme === theme.id || 
                     (theme.id !== 'dark' && theme.id !== 'light' && customSidebarColor === theme.color)) && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white drop-shadow-lg" />
                      </div>
                    )}
                    <div className="absolute bottom-1 left-1 right-1">
                      <div className="text-xs font-medium text-center" 
                           style={{ color: theme.id === 'light' ? '#374151' : '#ffffff' }}>
                        {theme.label}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Custom Sidebar Color</Label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded border-2 border-gray-200"
                  style={{ backgroundColor: customSidebarColor }}
                />
                <Input
                  type="color"
                  value={customSidebarColor}
                  onChange={(e) => setCustomSidebarColor(e.target.value)}
                  className="w-20 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={customSidebarColor}
                  onChange={(e) => setCustomSidebarColor(e.target.value)}
                  className="flex-1 font-mono text-sm"
                  placeholder="#1f2937"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Label Color</Label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded border-2 border-gray-200"
                  style={{ backgroundColor: customLabelColor }}
                />
                <Input
                  type="color"
                  value={customLabelColor}
                  onChange={(e) => setCustomLabelColor(e.target.value)}
                  className="w-20 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={customLabelColor}
                  onChange={(e) => setCustomLabelColor(e.target.value)}
                  className="flex-1 font-mono text-sm"
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>

          {/* Sidebar Preview */}
          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Sidebar Preview</h4>
            <div 
              className="w-48 h-32 rounded border"
              style={{ 
                backgroundColor: sidebarTheme === 'light' ? '#ffffff' : customSidebarColor,
                border: sidebarTheme === 'light' ? '1px solid #e5e7eb' : 'none'
              }}
            >
              <div className="p-3 space-y-2">
                <div 
                  className="text-xs font-medium"
                  style={{ color: sidebarTheme === 'light' ? '#374151' : customLabelColor }}
                >
                  Navigation
                </div>
                <div className="space-y-1">
                  <div 
                    className="text-xs py-1 px-2 rounded"
                    style={{ 
                      backgroundColor: sidebarTheme === 'light' ? '#f3f4f6' : 'rgba(255,255,255,0.1)',
                      color: sidebarTheme === 'light' ? '#374151' : customLabelColor
                    }}
                  >
                    Dashboard
                  </div>
                  <div 
                    className="text-xs py-1 px-2"
                    style={{ color: sidebarTheme === 'light' ? '#6b7280' : customLabelColor }}
                  >
                    Settings
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Favicon Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Favicon
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded flex items-center justify-center bg-gray-50">
              {faviconFile ? (
                <img 
                  src={URL.createObjectURL(faviconFile)} 
                  alt="Favicon preview" 
                  className="w-full h-full object-contain rounded"
                />
              ) : (
                <Settings className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <Label htmlFor="favicon-upload" className="text-sm font-medium text-gray-700">
                Upload Favicon
              </Label>
              <p className="text-xs text-gray-500 mt-1">PNG, ICO up to 1MB. Recommended: 32x32px</p>
              <input
                id="favicon-upload"
                type="file"
                accept="image/*"
                onChange={handleFaviconUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => document.getElementById('favicon-upload')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>
          </div>
          {faviconFile && (
            <div className="text-sm text-gray-600">
              Selected: {faviconFile.name}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Changes */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveChanges} 
          disabled={isSaving}
          className="px-8"
        >
          {isSaving ? (
            <>
              <Settings className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
};