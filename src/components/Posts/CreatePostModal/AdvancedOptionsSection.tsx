
import React from 'react';
import { Calendar, Clock, Wand2 } from 'lucide-react';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';

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

const postTypes = [{
  value: 'regular',
  label: 'Regular Post'
}, {
  value: 'event',
  label: 'Event Post'
}, {
  value: 'offer',
  label: 'Offer Post'
}];

const publishOptions = [{
  value: 'now',
  label: 'Publish Now',
  icon: Clock
}, {
  value: 'schedule',
  label: 'Schedule Post',
  icon: Calendar
}, {
  value: 'auto',
  label: 'Auto Reschedule',
  icon: Wand2
}];

export const AdvancedOptionsSection: React.FC<AdvancedOptionsSectionProps> = ({
  showAdvancedOptions,
  onShowAdvancedOptionsChange,
  formData,
  onFormDataChange,
  listingsSearch,
  onListingsSearchChange,
  onListingToggle
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
          {/* Post Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Post Type</Label>
            <Select 
              value={formData.postType} 
              onValueChange={value => onFormDataChange(prev => ({ ...prev, postType: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose post type" />
              </SelectTrigger>
              <SelectContent>
                {postTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title Field - Only show for Event or Offer posts */}
          {(formData.postType === 'event' || formData.postType === 'offer') && (
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">Title</Label>
              <Input 
                id="title" 
                value={formData.title} 
                onChange={e => onFormDataChange(prev => ({ ...prev, title: e.target.value }))} 
                placeholder="Enter title..." 
                className="transition-all focus:ring-2" 
              />
            </div>
          )}

          {/* Event Post Fields */}
          {formData.postType === 'event' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Start Date & Time</Label>
                <Input 
                  type="datetime-local" 
                  value={formData.eventStartDate} 
                  onChange={e => onFormDataChange(prev => ({ ...prev, eventStartDate: e.target.value }))} 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">End Date & Time</Label>
                <Input 
                  type="datetime-local" 
                  value={formData.eventEndDate} 
                  onChange={e => onFormDataChange(prev => ({ ...prev, eventEndDate: e.target.value }))} 
                />
              </div>
            </div>
          )}

          {/* Offer Post Fields */}
          {formData.postType === 'offer' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Start Date & Time</Label>
                  <Input 
                    type="datetime-local" 
                    value={formData.offerStartDate} 
                    onChange={e => onFormDataChange(prev => ({ ...prev, offerStartDate: e.target.value }))} 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">End Date & Time</Label>
                  <Input 
                    type="datetime-local" 
                    value={formData.offerEndDate} 
                    onChange={e => onFormDataChange(prev => ({ ...prev, offerEndDate: e.target.value }))} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Coupon Code</Label>
                  <Input 
                    value={formData.couponCode} 
                    onChange={e => onFormDataChange(prev => ({ ...prev, couponCode: e.target.value }))} 
                    placeholder="Enter coupon code" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Redeem Online URL</Label>
                  <Input 
                    value={formData.redeemOnlineUrl} 
                    onChange={e => onFormDataChange(prev => ({ ...prev, redeemOnlineUrl: e.target.value }))} 
                    placeholder="https://example.com/redeem" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Terms & Conditions</Label>
                <Textarea 
                  value={formData.termsConditions} 
                  onChange={e => onFormDataChange(prev => ({ ...prev, termsConditions: e.target.value }))} 
                  placeholder="Enter terms and conditions for this offer..." 
                  rows={3} 
                  className="resize-none" 
                />
              </div>
            </div>
          )}

          {/* Publish Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Publish Options</Label>
            <Select 
              value={formData.publishOption} 
              onValueChange={value => onFormDataChange(prev => ({ ...prev, publishOption: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose publish option" />
              </SelectTrigger>
              <SelectContent>
                {publishOptions.map(option => {
                  const IconComponent = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center space-x-2">
                        <IconComponent className="w-4 h-4" />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            
            {formData.publishOption === 'schedule' && (
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Schedule Date & Time</Label>
                <Input 
                  type="datetime-local" 
                  value={formData.scheduleDate} 
                  onChange={e => onFormDataChange(prev => ({ ...prev, scheduleDate: e.target.value }))} 
                  className="w-full" 
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
