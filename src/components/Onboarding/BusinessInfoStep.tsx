
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight } from 'lucide-react';

interface BusinessInfoStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
}

const BusinessInfoStep = ({ formData, updateFormData, onNext }: BusinessInfoStepProps) => {
  const [localData, setLocalData] = useState({
    businessName: formData.businessName || '',
    businessType: formData.businessType || '',
    description: formData.description || ''
  });

  const businessTypes = [
    'Restaurant', 'Retail Store', 'Professional Services', 'Healthcare', 
    'Beauty & Spa', 'Automotive', 'Real Estate', 'Education', 'Other'
  ];

  const handleChange = (field: string, value: string) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    updateFormData(localData);
    onNext();
  };

  const isValid = localData.businessName && localData.businessType;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Tell us about your business
        </h2>
        <p className="text-gray-600">
          This information will help us set up your Google Business profile
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border space-y-6">
        <div>
          <Label htmlFor="businessName" className="text-base font-medium">
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
          <Label htmlFor="businessType" className="text-base font-medium">
            Business Type *
          </Label>
          <Select value={localData.businessType} onValueChange={(value) => handleChange('businessType', value)}>
            <SelectTrigger className="mt-2 h-12">
              <SelectValue placeholder="Select your business type" />
            </SelectTrigger>
            <SelectContent>
              {businessTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description" className="text-base font-medium">
            Business Description
          </Label>
          <Textarea
            id="description"
            value={localData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe what your business does (optional)"
            className="mt-2 min-h-[100px]"
          />
          <p className="text-sm text-gray-500 mt-1">
            This will help customers understand your services better
          </p>
        </div>

        <Button 
          onClick={handleNext}
          disabled={!isValid}
          className="w-full h-12 text-base"
        >
          Continue
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default BusinessInfoStep;
