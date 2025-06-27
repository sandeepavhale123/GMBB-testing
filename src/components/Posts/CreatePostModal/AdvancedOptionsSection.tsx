
import React from 'react';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import { PostTypeSelector } from './PostTypeSelector';
import { TitleField } from './TitleField';
import { EventFields } from './EventFields';
import { OfferFields } from './OfferFields';
import { PublishOptionsSection } from './PublishOptionsSection';

interface FormData {
  listings: string[];
  title: string;
  postType: string;
  description: string;
  image: File | string | null;
  ctaButton: string;
  ctaUrl: string;
  publishOption: string;
  scheduleDate: string;
  platforms: string[];
  // Event fields
  eventStartDate: string;
  eventEndDate: string;
  // Offer fields
  offerStartDate: string;
  offerEndDate: string;
  couponCode: string;
  redeemOnlineUrl: string;
  termsConditions: string;
}

interface AdvancedOptionsSectionProps {
  showAdvancedOptions: boolean;
  onShowAdvancedOptionsChange: (show: boolean) => void;
  formData: FormData;
  onFormDataChange: (updater: (prev: FormData) => FormData) => void;
  listingsSearch: string;
  onListingsSearchChange: (value: string) => void;
  onListingToggle: (listing: string) => void;
}

export const AdvancedOptionsSection: React.FC<AdvancedOptionsSectionProps> = ({
  showAdvancedOptions,
  onShowAdvancedOptionsChange,
  formData,
  onFormDataChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <Switch 
          id="advanced-options" 
          checked={showAdvancedOptions} 
          onCheckedChange={onShowAdvancedOptionsChange} 
        />
        <Label htmlFor="advanced-options" className="text-sm font-medium">Advanced Post Options</Label>
      </div>

      {showAdvancedOptions && (
        <div className="space-y-4 sm:space-y-6 p-4 border rounded-lg bg-gray-50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <PostTypeSelector formData={formData} onFormDataChange={onFormDataChange} />
            <TitleField formData={formData} onFormDataChange={onFormDataChange} />
          </div>

          <EventFields formData={formData} onFormDataChange={onFormDataChange} />

          <OfferFields formData={formData} onFormDataChange={onFormDataChange} />

          <PublishOptionsSection formData={formData} onFormDataChange={onFormDataChange} />
        </div>
      )}
    </div>
  );
};
