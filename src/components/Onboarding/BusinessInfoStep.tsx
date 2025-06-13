
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BusinessInfoStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
}

const BusinessInfoStep = ({ formData, updateFormData, onNext }: BusinessInfoStepProps) => {
  const [localData, setLocalData] = useState({
    businessName: formData.businessName || '',
    website: formData.website || '',
    email: formData.email || '',
    timezone: formData.timezone || '',
    businessType: formData.businessType || '',
    locationCount: formData.locationCount || 1
  });

  const timezones = [
    'Eastern Time (ET)',
    'Central Time (CT)', 
    'Mountain Time (MT)',
    'Pacific Time (PT)',
    'Alaska Time (AKT)',
    'Hawaii Time (HT)'
  ];

  const businessTypes = [
    'Restaurant',
    'Retail Store',
    'Service Business',
    'Healthcare',
    'Real Estate',
    'Automotive',
    'Beauty & Wellness',
    'Professional Services',
    'Education',
    'Other'
  ];

  const locationCounts = [1, 2, 3, 4, 5, 6, 7, 8, 9, '10+'];

  const handleChange = (field: string, value: string | number) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    updateFormData(localData);
    onNext();
  };

  const isValid = localData.businessName && localData.email && localData.timezone && localData.businessType;

  return (
    <div className="max-w-3xl mx-auto px-8 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Tell us about your business
        </h2>
        <p className="text-xl text-gray-600">
          We'll use this information to customize your experience
        </p>
      </div>

      <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 space-y-8">
        {/* Business/Agency Name - Full Width */}
        <div>
          <Label htmlFor="businessName" className="text-base font-semibold text-gray-900 mb-3 block">
            Business/Agency Name *
          </Label>
          <Input
            id="businessName"
            value={localData.businessName}
            onChange={(e) => handleChange('businessName', e.target.value)}
            placeholder="Enter your business or agency name"
            className="h-14 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Website and Company Email - Same Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="website" className="text-base font-semibold text-gray-900 mb-3 block">
              Website
            </Label>
            <Input
              id="website"
              value={localData.website}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="https://yourbusiness.com"
              className="h-14 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-base font-semibold text-gray-900 mb-3 block">
              Company Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={localData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="business@example.com"
              className="h-14 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Preferred Timezone and Business Type - Same Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="timezone" className="text-base font-semibold text-gray-900 mb-3 block">
              Preferred Timezone *
            </Label>
            <Select value={localData.timezone} onValueChange={(value) => handleChange('timezone', value)}>
              <SelectTrigger className="h-14 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select your timezone" />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((timezone) => (
                  <SelectItem key={timezone} value={timezone} className="text-base py-3">
                    {timezone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="businessType" className="text-base font-semibold text-gray-900 mb-3 block">
              What best describes you? *
            </Label>
            <Select value={localData.businessType} onValueChange={(value) => handleChange('businessType', value)}>
              <SelectTrigger className="h-14 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map((type) => (
                  <SelectItem key={type} value={type} className="text-base py-3">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* How many locations - Dropdown */}
        <div>
          <Label className="text-base font-semibold text-gray-900 mb-3 block">
            How many locations do you want to manage?
          </Label>
          <Select 
            value={localData.locationCount.toString()} 
            onValueChange={(value) => handleChange('locationCount', value === '10+' ? '10+' : parseInt(value))}
          >
            <SelectTrigger className="h-14 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500 max-w-xs">
              <SelectValue placeholder="Select number of locations" />
            </SelectTrigger>
            <SelectContent>
              {locationCounts.map((count) => (
                <SelectItem key={count} value={count.toString()} className="text-base py-3">
                  {count} {count === 1 ? 'location' : 'locations'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="pt-6">
          <Button 
            onClick={handleNext}
            disabled={!isValid}
            className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BusinessInfoStep;
