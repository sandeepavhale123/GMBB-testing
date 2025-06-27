
import React from 'react';
import { Link } from 'lucide-react';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Input } from '../../ui/input';

interface CTAButtonSectionProps {
  showCTAButton: boolean;
  onShowCTAButtonChange: (show: boolean) => void;
  ctaButton: string;
  onCTAButtonChange: (value: string) => void;
  ctaUrl: string;
  onCTAUrlChange: (value: string) => void;
}

const ctaOptions = [{
  value: 'learn-more',
  label: 'Learn More'
}, {
  value: 'book-now',
  label: 'Book Now'
}, {
  value: 'call-now',
  label: 'Call Now'
}, {
  value: 'order-online',
  label: 'Order Online'
}, {
  value: 'get-offer',
  label: 'Get Offer'
}, {
  value: 'sign-up',
  label: 'Sign Up'
}, {
  value: 'download',
  label: 'Download'
}];

export const CTAButtonSection: React.FC<CTAButtonSectionProps> = ({
  showCTAButton,
  onShowCTAButtonChange,
  ctaButton,
  onCTAButtonChange,
  ctaUrl,
  onCTAUrlChange
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-3">
        <Switch 
          id="include-cta" 
          checked={showCTAButton} 
          onCheckedChange={onShowCTAButtonChange} 
        />
        <Label htmlFor="include-cta" className="text-sm font-medium">Include CTA Button</Label>
      </div>

      {showCTAButton && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pl-4 border-l-2 border-blue-200">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Button Type</Label>
            <Select 
              value={ctaButton} 
              onValueChange={onCTAButtonChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose CTA button type" />
              </SelectTrigger>
              <SelectContent>
                {ctaOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Button URL</Label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                value={ctaUrl} 
                onChange={e => onCTAUrlChange(e.target.value)} 
                placeholder="https://example.com" 
                className="pl-10" 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
