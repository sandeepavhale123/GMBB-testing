
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
    businessType: formData.businessType || ''
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

  const handleChange = (field: string, value: string | number) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    updateFormData(localData);
    onNext();
  };

  const isValid = localData.businessName && localData.email && localData.timezone && localData.businessType;

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
      <div className="text-center mb-6 sm:mb-8 lg:mb-10 xl:mb-12">
        <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
          Tell us about your business
        </h2>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600">
          We'll use this information to customize your experience
        </p>
      </div>

      <div className="bg-white p-4 sm:p-6 lg:p-8 xl:p-10 rounded-2xl shadow-sm border border-gray-100 space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Business/Agency Name - Full Width */}
        <div>
          <Label htmlFor="businessName" className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3 block">
            Business/Agency Name *
          </Label>
          <Input
            id="businessName"
            value={localData.businessName}
            onChange={(e) => handleChange('businessName', e.target.value)}
            placeholder="Enter your business or agency name"
            className="h-10 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Website and Company Email - Same Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          <div>
            <Label htmlFor="website" className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3 block">
              Website
            </Label>
            <Input
              id="website"
              value={localData.website}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="https://yourbusiness.com"
              className="h-10 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3 block">
              Company Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={localData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="business@example.com"
              className="h-10 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Preferred Timezone and Business Type - Same Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          <div>
            <Label htmlFor="timezone" className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3 block">
              Preferred Timezone *
            </Label>
            <Select value={localData.timezone} onValueChange={(value) => handleChange('timezone', value)}>
              <SelectTrigger className="h-10 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select your timezone" />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((timezone) => (
                  <SelectItem key={timezone} value={timezone} className="text-sm sm:text-base py-2 sm:py-3">
                    {timezone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="businessType" className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3 block">
              What best describes you? *
            </Label>
            <Select value={localData.businessType} onValueChange={(value) => handleChange('businessType', value)}>
              <SelectTrigger className="h-10 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map((type) => (
                  <SelectItem key={type} value={type} className="text-sm sm:text-base py-2 sm:py-3">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-3 sm:pt-4 lg:pt-6">
          <Button 
            onClick={handleNext}
            disabled={!isValid}
            className="w-full h-10 text-sm sm:text-base font-semibold bg-blue-600 hover:bg-blue-700"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BusinessInfoStep;
