import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Palette, Upload, Settings2 } from 'lucide-react';

export const BrandingPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Branding</h1>
        <p className="text-gray-600">Customize your brand appearance and settings</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Logo & Assets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center space-x-2">
              <Upload className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Logo & Assets</CardTitle>
            </div>
            <Badge variant="outline">Pro Feature</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-2">Upload your company logo</p>
              <p className="text-xs text-gray-400">PNG, JPG up to 2MB</p>
            </div>
            <div className="text-sm text-gray-500">
              Your logo will appear in reports and client-facing materials.
            </div>
          </CardContent>
        </Card>

        {/* Brand Colors */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Brand Colors</CardTitle>
            </div>
            <Badge variant="outline">Pro Feature</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Primary Color</span>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded border border-gray-200"></div>
                  <span className="text-sm text-gray-600">#2563eb</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Secondary Color</span>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-600 rounded border border-gray-200"></div>
                  <span className="text-sm text-gray-600">#4b5563</span>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Colors will be applied to your custom reports and dashboard themes.
            </div>
          </CardContent>
        </Card>

        {/* White Label Settings */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center space-x-2">
              <Settings2 className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">White Label Settings</CardTitle>
            </div>
            <Badge variant="outline">Enterprise Feature</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Company Name</label>
                <input 
                  type="text" 
                  placeholder="Your Company Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Custom Domain</label>
                <input 
                  type="text" 
                  placeholder="app.yourcompany.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled
                />
              </div>
            </div>
            <div className="text-sm text-gray-500">
              White label features allow you to customize the platform with your branding for client presentations.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};