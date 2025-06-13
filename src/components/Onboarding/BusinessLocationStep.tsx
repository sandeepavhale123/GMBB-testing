
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight } from 'lucide-react';

interface BusinessLocationStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
}

const BusinessLocationStep = ({ formData, updateFormData, onNext }: BusinessLocationStepProps) => {
  const [localData, setLocalData] = useState({
    address: formData.address || '',
    city: formData.city || '',
    state: formData.state || '',
    zipCode: formData.zipCode || '',
    phone: formData.phone || '',
    website: formData.website || ''
  });

  const handleChange = (field: string, value: string) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    updateFormData(localData);
    onNext();
  };

  const isValid = localData.address && localData.city && localData.state && localData.zipCode;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Where is your business located?
        </h2>
        <p className="text-gray-600">
          Add your business address and contact information
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border space-y-6">
        <div>
          <Label htmlFor="address" className="text-base font-medium">
            Street Address *
          </Label>
          <Input
            id="address"
            value={localData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="123 Main Street"
            className="mt-2 h-12"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city" className="text-base font-medium">
              City *
            </Label>
            <Input
              id="city"
              value={localData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="City"
              className="mt-2 h-12"
            />
          </div>
          <div>
            <Label htmlFor="state" className="text-base font-medium">
              State *
            </Label>
            <Input
              id="state"
              value={localData.state}
              onChange={(e) => handleChange('state', e.target.value)}
              placeholder="State"
              className="mt-2 h-12"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="zipCode" className="text-base font-medium">
            ZIP Code *
          </Label>
          <Input
            id="zipCode"
            value={localData.zipCode}
            onChange={(e) => handleChange('zipCode', e.target.value)}
            placeholder="12345"
            className="mt-2 h-12"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="text-base font-medium">
            Phone Number
          </Label>
          <Input
            id="phone"
            value={localData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="(555) 123-4567"
            className="mt-2 h-12"
          />
        </div>

        <div>
          <Label htmlFor="website" className="text-base font-medium">
            Website
          </Label>
          <Input
            id="website"
            value={localData.website}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="https://yourwebsite.com"
            className="mt-2 h-12"
          />
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

export default BusinessLocationStep;
