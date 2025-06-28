
import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';

interface FormData {
  postType: string;
  eventStartDate: string;
  eventEndDate: string;
}

interface EventFieldsProps {
  formData: FormData;
  onFormDataChange: (updater: (prev: FormData) => FormData) => void;
}

export const EventFields: React.FC<EventFieldsProps> = ({
  formData,
  onFormDataChange
}) => {
  if (formData.postType !== 'event') {
    return null;
  }

  return (
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
  );
};
