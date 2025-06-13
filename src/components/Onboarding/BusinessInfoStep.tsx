
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

  const locationCounts = [1, 2, 3, 4, 5, 6, 7, 8, 9, '10+'];

  const handleChange = (field: string, value: string | number) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    updateFormData(localData);
    onNext();
  };

  const isValid = localData.businessName && localData.email && localData.timezone;

  return (
    <div className="max-w-2xl mx-auto px-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Tell us about your business
        </h2>
        <p className="text-gray-600">
          We'll use this information to customize your experience
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border space-y-6">
        <div>
          <Label htmlFor="businessName" className="text-base font-medium text-gray-900">
            Business Name *
          </Label>
          <Input
            id="businessName"
            value={localData.businessName}
            onChange={(e) => handleChange('businessName', e.target.value)}
            placeholder="Enter your business name"
            className="mt-2 h-12"
          />
        </div>

        <div>
          <Label htmlFor="website" className="text-base font-medium text-gray-900">
            Website URL
          </Label>
          <Input
            id="website"
            value={localData.website}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="https://yourbusiness.com"
            className="mt-2 h-12"
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-base font-medium text-gray-900">
            Business Email *
          </Label>
          <Input
            id="email"
            type="email"
            value={localData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="business@example.com"
            className="mt-2 h-12"
          />
        </div>

        <div>
          <Label htmlFor="timezone" className="text-base font-medium text-gray-900">
            Timezone *
          </Label>
          <Select value={localData.timezone} onValueChange={(value) => handleChange('timezone', value)}>
            <SelectTrigger className="mt-2 h-12">
              <SelectValue placeholder="Select your timezone" />
            </SelectTrigger>
            <SelectContent>
              {timezones.map((timezone) => (
                <SelectItem key={timezone} value={timezone}>{timezone}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-base font-medium text-gray-900 mb-4 block">
            How many business locations do you have?
          </Label>
          <div className="grid grid-cols-5 gap-3">
            {locationCounts.map((count) => (
              <Button
                key={count}
                variant={localData.locationCount === count ? "default" : "outline"}
                className="h-12"
                onClick={() => handleChange('locationCount', count)}
              >
                {count}
              </Button>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleNext}
          disabled={!isValid}
          className="w-full h-12 text-base mt-8"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default BusinessInfoStep;
