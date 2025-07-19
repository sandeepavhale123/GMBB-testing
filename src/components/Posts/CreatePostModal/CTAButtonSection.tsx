
import React from 'react';
import { Link } from 'lucide-react';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Input } from '../../ui/input';
import { z } from 'zod';
import { useFormValidation } from '../../../hooks/useFormValidation';

interface CTAButtonSectionProps {
  showCTAButton: boolean;
  onShowCTAButtonChange: (show: boolean) => void;
  ctaButton: string;
  onCTAButtonChange: (value: string) => void;
  ctaUrl: string;
  onCTAUrlChange: (value: string) => void;
}

const ctaOptions = [{
  value: 'LEARN_MORE',
  label: 'Learn More'
}, {
  value: 'BOOK',
  label: 'Book Now'
}, {
  value: 'CALL',
  label: 'Call Now'
}, {
  value: 'ORDER',
  label: 'Order Online'
}, {
  value: 'SHOP',
  label: 'Shop Now'
}, {
  value: 'SIGN_UP',
  label: 'Sign Up'
}, ];

const urlSchema = z.object({
  ctaUrl: z.string().min(1, "URL is required").url("Please enter a valid URL")
});

export const CTAButtonSection: React.FC<CTAButtonSectionProps> = ({
  showCTAButton,
  onShowCTAButtonChange,
  ctaButton,
  onCTAButtonChange,
  ctaUrl,
  onCTAUrlChange
}) => {
  const { getFieldError, hasFieldError, clearFieldError } = useFormValidation(urlSchema);

  const handleUrlChange = (value: string) => {
    onCTAUrlChange(value);
    
    // Validate URL if not empty
    if (value.trim()) {
      const result = urlSchema.safeParse({ ctaUrl: value });
      if (!result.success) {
        // Error will be handled by validation hook
      } else {
        clearFieldError('ctaUrl');
      }
    } else {
      clearFieldError('ctaUrl');
    }
  };
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

          {/* Hide URL field only when Call Now is selected */}
          {ctaButton !== 'CALL' && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Button URL</Label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  value={ctaUrl} 
                  onChange={e => handleUrlChange(e.target.value)} 
                  placeholder="https://example.com" 
                  className={`pl-10 ${hasFieldError('ctaUrl') ? 'border-red-500' : ''}`}
                />
                {hasFieldError('ctaUrl') && (
                  <p className="text-red-500 text-xs mt-1">{getFieldError('ctaUrl')}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
