import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Upload, Building, X, Star, TrendingUp, Users, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ReportBrandingPage: React.FC = () => {
  const { toast } = useToast();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    companyEmail: '',
    companyWebsite: '',
    companyPhone: '',
    companyAddress: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndUpload(file);
    }
  };

  const validateAndUpload = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Logo file must be less than 2MB",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (PNG, JPG, SVG)",
        variant: "destructive",
      });
      return;
    }

    setLogoFile(file);
    toast({
      title: "Report logo uploaded",
      description: `${file.name} ready for use`,
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const removeLogo = () => {
    setLogoFile(null);
    toast({
      title: "Report logo removed",
      description: "Logo has been removed successfully",
    });
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Settings saved",
        description: "Report branding settings have been updated successfully",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Report Branding</h1>
          <p className="text-gray-600">Customize your company branding for generated reports</p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          White Label
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Form Fields */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name" className="text-sm font-medium">
                    Company Name
                  </Label>
                  <Input
                    id="company-name"
                    placeholder="Enter company name"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-email" className="text-sm font-medium">
                    Company Email
                  </Label>
                  <Input
                    id="company-email"
                    type="email"
                    placeholder="company@example.com"
                    value={formData.companyEmail}
                    onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-website" className="text-sm font-medium">
                    Company Website
                  </Label>
                  <Input
                    id="company-website"
                    placeholder="https://www.company.com"
                    value={formData.companyWebsite}
                    onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-phone" className="text-sm font-medium">
                    Company Phone
                  </Label>
                  <Input
                    id="company-phone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.companyPhone}
                    onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-address" className="text-sm font-medium">
                    Company Address
                  </Label>
                  <Input
                    id="company-address"
                    placeholder="123 Business St, City, State 12345"
                    value={formData.companyAddress}
                    onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Company Logo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Upload Logo
                </Label>
                {logoFile && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={removeLogo}
                    className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <div className="flex items-start gap-4">
                <div 
                  className={`w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center transition-colors ${
                    dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  {logoFile ? (
                    <img 
                      src={URL.createObjectURL(logoFile)} 
                      alt="Report logo preview" 
                      className="w-full h-full object-contain rounded p-1"
                    />
                  ) : (
                    <Building className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-3">
                    PNG, JPG, SVG up to 2MB. Recommended: 200x80px
                  </p>
                  
                  <input
                    id="report-logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('report-logo-upload')?.click()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Logo
                  </Button>
                  
                  {logoFile && (
                    <div className="text-sm text-gray-600 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="truncate mr-2">Selected: {logoFile.name}</span>
                        <span className="text-xs text-green-600">✓ Ready</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {dragOver && (
                <div className="text-center p-2 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-600">Drop logo here to upload</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button 
              onClick={handleSaveChanges} 
              disabled={isSaving}
              className="min-w-[120px]"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Right Column - Report Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Report Preview
                </span>
                <Badge variant="secondary">Sample Report</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Report Header */}
              <div className="border-b pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {logoFile ? (
                      <img 
                        src={URL.createObjectURL(logoFile)} 
                        alt="Company logo" 
                        className="h-12 object-contain"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <Building className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">
                        {formData.companyName || 'Your Company Name'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formData.companyWebsite || 'www.yourcompany.com'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Report Date</p>
                    <p className="font-medium">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Sample Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Star className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-700">4.8</p>
                  <p className="text-sm text-gray-600">Avg Rating</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-700">1,247</p>
                  <p className="text-sm text-gray-600">Total Reviews</p>
                </div>
              </div>

              {/* Sample Chart Area */}
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">Performance Chart</p>
                <div className="h-24 bg-gradient-to-r from-blue-100 to-green-100 rounded flex items-end justify-center space-x-1 p-2">
                  {[40, 60, 45, 80, 65, 85, 75].map((height, index) => (
                    <div
                      key={index}
                      className="bg-blue-500 rounded-t"
                      style={{ height: `${height}%`, width: '12px' }}
                    />
                  ))}
                </div>
              </div>

              {/* Report Footer */}
              <div className="border-t pt-4 text-sm text-gray-600">
                <div className="flex justify-between items-center">
                  <div>
                    <p>{formData.companyEmail || 'contact@yourcompany.com'}</p>
                    <p>{formData.companyPhone || '+1 (555) 123-4567'}</p>
                  </div>
                  <div className="text-right">
                    <p>{formData.companyAddress || '123 Business St, City, State'}</p>
                    <p className="flex items-center gap-1 justify-end mt-1">
                      <Calendar className="w-3 h-3" />
                      Generated on {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};