
import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

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

// Helper function to parse datetime-local value into components
const parseDateTimeComponents = (dateTimeString: string) => {
  if (!dateTimeString) return { date: '', time: '', ampm: 'AM' };
  
  const date = new Date(dateTimeString);
  if (isNaN(date.getTime())) return { date: '', time: '', ampm: 'AM' };
  
  const dateStr = date.toISOString().split('T')[0];
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12;
  const timeStr = `${hours.toString().padStart(2, '0')}:${minutes}`;
  
  return { date: dateStr, time: timeStr, ampm };
};

// Helper function to combine date, time, and AM/PM into datetime-local format
const combineDateTimeComponents = (date: string, time: string, ampm: string): string => {
  if (!date || !time) return '';
  
  const [hours, minutes] = time.split(':');
  let hour24 = parseInt(hours);
  
  if (ampm === 'PM' && hour24 !== 12) {
    hour24 += 12;
  } else if (ampm === 'AM' && hour24 === 12) {
    hour24 = 0;
  }
  
  return `${date}T${hour24.toString().padStart(2, '0')}:${minutes}`;
};

export const EventFields: React.FC<EventFieldsProps> = ({
  formData,
  onFormDataChange
}) => {
  if (formData.postType !== 'event') {
    return null;
  }

  const startComponents = parseDateTimeComponents(formData.eventStartDate);
  const endComponents = parseDateTimeComponents(formData.eventEndDate);

  const handleStartDateTimeChange = (field: 'date' | 'time' | 'ampm', value: string) => {
    const current = parseDateTimeComponents(formData.eventStartDate);
    const updated = { ...current, [field]: value };
    const combined = combineDateTimeComponents(updated.date, updated.time, updated.ampm);
    onFormDataChange(prev => ({ ...prev, eventStartDate: combined }));
  };

  const handleEndDateTimeChange = (field: 'date' | 'time' | 'ampm', value: string) => {
    const current = parseDateTimeComponents(formData.eventEndDate);
    const updated = { ...current, [field]: value };
    const combined = combineDateTimeComponents(updated.date, updated.time, updated.ampm);
    onFormDataChange(prev => ({ ...prev, eventEndDate: combined }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Start Date & Time</Label>
        <div className="grid grid-cols-3 gap-2">
          <Input 
            type="date" 
            value={startComponents.date} 
            onChange={e => handleStartDateTimeChange('date', e.target.value)} 
            className="col-span-2"
          />
          <Input 
            type="time" 
            value={startComponents.time} 
            onChange={e => handleStartDateTimeChange('time', e.target.value)} 
          />
        </div>
        <Select value={startComponents.ampm} onValueChange={value => handleStartDateTimeChange('ampm', value)}>
          <SelectTrigger>
            <SelectValue placeholder="AM/PM" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectContent>
        </Select>
        {formData.eventStartDate && (
          <p className="text-xs text-gray-500 mt-1">
            Display: {formatDateForDisplay(formData.eventStartDate)}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">End Date & Time</Label>
        <div className="grid grid-cols-3 gap-2">
          <Input 
            type="date" 
            value={endComponents.date} 
            onChange={e => handleEndDateTimeChange('date', e.target.value)} 
            className="col-span-2"
          />
          <Input 
            type="time" 
            value={endComponents.time} 
            onChange={e => handleEndDateTimeChange('time', e.target.value)} 
          />
        </div>
        <Select value={endComponents.ampm} onValueChange={value => handleEndDateTimeChange('ampm', value)}>
          <SelectTrigger>
            <SelectValue placeholder="AM/PM" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectContent>
        </Select>
        {formData.eventEndDate && (
          <p className="text-xs text-gray-500 mt-1">
            Display: {formatDateForDisplay(formData.eventEndDate)}
          </p>
        )}
      </div>
    </div>
  );
};
