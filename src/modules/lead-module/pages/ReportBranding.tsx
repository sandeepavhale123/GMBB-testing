import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Palette, Upload, Save } from 'lucide-react';

const ReportBranding: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Report Branding</h1>
        <p className="text-muted-foreground">Customize the appearance of your lead reports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logo Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Company Logo
            </CardTitle>
            <CardDescription>Upload your company logo for reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">Drop your logo here or click to browse</p>
              <Button variant="outline" size="sm">
                Choose File
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              Recommended: PNG or JPG format, max 2MB, 300x100px
            </div>
          </CardContent>
        </Card>

        {/* Color Scheme */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Color Scheme
            </CardTitle>
            <CardDescription>Customize your brand colors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primary-color">Primary Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="primary-color"
                    type="color"
                    defaultValue="#3b82f6"
                    className="w-20 h-10 p-1"
                  />
                  <Input defaultValue="#3b82f6" className="flex-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="secondary-color">Secondary Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="secondary-color"
                    type="color"
                    defaultValue="#64748b"
                    className="w-20 h-10 p-1"
                  />
                  <Input defaultValue="#64748b" className="flex-1" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Details that appear on your reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="company-name">Company Name</Label>
              <Input id="company-name" placeholder="Enter company name" />
            </div>
            <div>
              <Label htmlFor="company-website">Website</Label>
              <Input id="company-website" placeholder="https://yourcompany.com" />
            </div>
            <div>
              <Label htmlFor="company-phone">Phone Number</Label>
              <Input id="company-phone" placeholder="+1 (555) 123-4567" />
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>How your branding will appear</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-muted/30">
              <div className="flex items-center justify-between mb-4">
                <div className="w-24 h-8 bg-primary rounded"></div>
                <div className="text-sm text-muted-foreground">Lead Report</div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="gap-2">
          <Save className="w-4 h-4" />
          Save Branding Settings
        </Button>
      </div>
    </div>
  );
};

export default ReportBranding;