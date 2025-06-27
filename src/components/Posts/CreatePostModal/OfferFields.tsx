
import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';

interface FormData {
  postType: string;
  offerStartDate: string;
  offerEndDate: string;
  couponCode: string;
  redeemOnlineUrl: string;
  termsConditions: string;
}

interface OfferFieldsProps {
  formData: FormData;
  onFormDataChange: (updater: (prev: FormData) => FormData) => void;
}

export const OfferFields: React.FC<OfferFieldsProps> = ({
  formData,
  onFormDataChange
}) => {
  if (formData.postType !== 'offer') {
    return null;
  }

  return (
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
  );
};
