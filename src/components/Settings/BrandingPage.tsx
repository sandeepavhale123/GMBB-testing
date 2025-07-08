import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Upload, Palette, Image, Settings, Check, AlertCircle } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useToast } from '@/hooks/use-toast';

export const BrandingPage: React.FC = () => {
  const { toast } = useToast();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [sidebarColor, setSidebarColor] = useState('#1f2937');
  const [isSaving, setIsSaving] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Logo file must be less than 2MB",
          variant: "destructive",
        });
        return;
      }
      setLogoFile(file);
      toast({
        title: "Logo selected",
        description: `${file.name} ready for upload`,
      });
    }
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (1MB limit)
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

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
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

      {/* Logo Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            Application Logo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              {logoFile ? (
                <img 
                  src={URL.createObjectURL(logoFile)} 
                  alt="Logo preview" 
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <Image className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <Label htmlFor="logo-upload" className="text-sm font-medium text-gray-700">
                Upload Logo
              </Label>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB. Recommended: 200x60px</p>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => document.getElementById('logo-upload')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>
          </div>
          {logoFile && (
            <div className="text-sm text-gray-600">
              Selected: {logoFile.name}
            </div>
          )}
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

      {/* Color Scheme Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Color Scheme
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Color */}
            <div className="space-y-2">
              <Label htmlFor="primary-color" className="text-sm font-medium text-gray-700">
                Primary Color
              </Label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded border-2 border-gray-200"
                  style={{ backgroundColor: primaryColor }}
                />
                <Input
                  id="primary-color"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-20 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 font-mono text-sm"
                  placeholder="#3b82f6"
                />
              </div>
            </div>

            {/* Sidebar Color */}
            <div className="space-y-2">
              <Label htmlFor="sidebar-color" className="text-sm font-medium text-gray-700">
                Sidebar Color
              </Label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded border-2 border-gray-200"
                  style={{ backgroundColor: sidebarColor }}
                />
                <Input
                  id="sidebar-color"
                  type="color"
                  value={sidebarColor}
                  onChange={(e) => setSidebarColor(e.target.value)}
                  className="w-20 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={sidebarColor}
                  onChange={(e) => setSidebarColor(e.target.value)}
                  className="flex-1 font-mono text-sm"
                  placeholder="#1f2937"
                />
              </div>
            </div>
          </div>

          {/* Color Preview */}
          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: primaryColor }}
                />
                <span className="text-sm text-gray-600">Primary</span>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: sidebarColor }}
                />
                <span className="text-sm text-gray-600">Sidebar</span>
              </div>
            </div>
          </div>
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