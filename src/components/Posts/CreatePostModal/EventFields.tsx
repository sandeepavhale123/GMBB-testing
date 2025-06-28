
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

// Helper function to format date for display
const formatDateForDisplay = (dateTimeString: string): string => {
  if (!dateTimeString) return '';
  
  const date = new Date(dateTimeString);
  if (isNaN(date.getTime())) return dateTimeString;
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  
  return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
};

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
        {formData.eventStartDate && (
          <p className="text-xs text-gray-500 mt-1">
            Display: {formatDateForDisplay(formData.eventStartDate)}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">End Date & Time</Label>
        <Input 
          type="datetime-local" 
          value={formData.eventEndDate} 
          onChange={e => onFormDataChange(prev => ({ ...prev, eventEndDate: e.target.value }))} 
        />
        {formData.eventEndDate && (
          <p className="text-xs text-gray-500 mt-1">
            Display: {formatDateForDisplay(formData.eventEndDate)}
          </p>
        )}
      </div>
    </div>
  );
};
