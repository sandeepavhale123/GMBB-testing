
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

export const EventFields: React.FC<EventFieldsProps> = ({
  formData,
  onFormDataChange
}) => {
  if (formData.postType !== 'event') {
    return null;
  }

  // Helper function to parse datetime-local value into date, time, and period
  const parseDateTime = (dateTimeValue: string) => {
    if (!dateTimeValue) return { date: '', time: '', period: 'AM' };
    
    const dateObj = new Date(dateTimeValue);
    const date = dateObj.toISOString().split('T')[0];
    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    if (hours === 0) hours = 12;
    else if (hours > 12) hours -= 12;
    
    const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    return { date, time, period };
  };

  // Helper function to combine date, time, and period into datetime-local format
  const combineDateTime = (date: string, time: string, period: string) => {
    if (!date || !time) return '';
    
    const [hours, minutes] = time.split(':').map(Number);
    let adjustedHours = hours;
    
    // Convert to 24-hour format
    if (period === 'AM' && hours === 12) adjustedHours = 0;
    else if (period === 'PM' && hours !== 12) adjustedHours = hours + 12;
    
    const dateTime = new Date(`${date}T${adjustedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
    return dateTime.toISOString().slice(0, 16);
  };

  const startDateTime = parseDateTime(formData.eventStartDate);
  const endDateTime = parseDateTime(formData.eventEndDate);

  const handleStartDateTimeChange = (field: string, value: string) => {
    const newDateTime = combineDateTime(
      field === 'date' ? value : startDateTime.date,
      field === 'time' ? value : startDateTime.time,
      field === 'period' ? value : startDateTime.period
    );
    onFormDataChange(prev => ({ ...prev, eventStartDate: newDateTime }));
  };

  const handleEndDateTimeChange = (field: string, value: string) => {
    const newDateTime = combineDateTime(
      field === 'date' ? value : endDateTime.date,
      field === 'time' ? value : endDateTime.time,
      field === 'period' ? value : endDateTime.period
    );
    onFormDataChange(prev => ({ ...prev, eventEndDate: newDateTime }));
  };

  return (
    <div className="space-y-6">
      {/* Start Date & Time */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Start Date & Time</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label className="text-xs text-gray-600">Date</Label>
            <Input 
              type="date" 
              value={startDateTime.date} 
              onChange={e => handleStartDateTimeChange('date', e.target.value)} 
            />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Time</Label>
            <Input 
              type="time" 
              value={startDateTime.time} 
              onChange={e => handleStartDateTimeChange('time', e.target.value)} 
            />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Period</Label>
            <Select 
              value={startDateTime.period} 
              onValueChange={value => handleStartDateTimeChange('period', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* End Date & Time */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">End Date & Time</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label className="text-xs text-gray-600">Date</Label>
            <Input 
              type="date" 
              value={endDateTime.date} 
              onChange={e => handleEndDateTimeChange('date', e.target.value)} 
            />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Time</Label>
            <Input 
              type="time" 
              value={endDateTime.time} 
              onChange={e => handleEndDateTimeChange('time', e.target.value)} 
            />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Period</Label>
            <Select 
              value={endDateTime.period} 
              onValueChange={value => handleEndDateTimeChange('period', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
