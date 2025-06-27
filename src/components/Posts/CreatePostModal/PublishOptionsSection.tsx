
import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Input } from '../../ui/input';

interface FormData {
  publishOption: string;
  scheduleDate: string;
}

interface PublishOptionsSectionProps {
  formData: FormData;
  onFormDataChange: (updater: (prev: FormData) => FormData) => void;
}

const publishOptions = [{
  value: 'now',
  label: 'Publish Now',
  icon: Clock
}, {
  value: 'schedule',
  label: 'Schedule Post',
  icon: Calendar
}];

export const PublishOptionsSection: React.FC<PublishOptionsSectionProps> = ({
  formData,
  onFormDataChange
}) => {
  return (
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
  );
};
