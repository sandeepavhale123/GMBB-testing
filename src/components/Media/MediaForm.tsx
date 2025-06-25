
import React from 'react';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Calendar, Clock, Globe } from 'lucide-react';
import { convertLocalDateTimeToUTC, getUserTimezone } from '../../utils/dateUtils';

interface MediaFormProps {
  formData: {
    title: string;
    category: string;
    publishOption: string;
    scheduleDate?: string;
  };
  onChange: (data: Partial<MediaFormProps['formData']>) => void;
  hasFiles: boolean;
  fileType?: 'image' | 'video';
}

export const MediaForm: React.FC<MediaFormProps> = ({
  formData,
  onChange,
  hasFiles,
  fileType
}) => {
  const allCategories = [
    { value: 'COVER', label: 'Cover' },
    { value: 'PROFILE', label: 'Profile' },
    { value: 'LOGO', label: 'Logo' },
    { value: 'EXTERIOR', label: 'Exterior' },
    { value: 'INTERIOR', label: 'Interior' },
    { value: 'PRODUCT', label: 'Product' },
    { value: 'AT_WORK', label: 'At Work' },
    { value: 'FOOD_AND_DRINK', label: 'Food and Drink' },
    { value: 'MENU', label: 'Menu' },
    { value: 'COMMON_AREA', label: 'Common Area' },
    { value: 'ROOMS', label: 'Rooms' },
    { value: 'TEAMS', label: 'Teams' },
    { value: 'ADDITIONAL', label: 'Additional' }
  ];

  const videoCategories = [
    { value: 'EXTERIOR', label: 'Exterior' },
    { value: 'INTERIOR', label: 'Interior' },
    { value: 'PRODUCT', label: 'Product' },
    { value: 'AT_WORK', label: 'At Work' },
    { value: 'FOOD_AND_DRINK', label: 'Food and Drink' },
    { value: 'MENU', label: 'Menu' },
    { value: 'COMMON_AREA', label: 'Common Area' },
    { value: 'ROOMS', label: 'Rooms' },
    { value: 'TEAMS', label: 'Teams' },
    { value: 'ADDITIONAL', label: 'Additional' }
  ];

  const categories = fileType === 'video' ? videoCategories : allCategories;

  const publishOptions = [
    { value: 'now', label: 'Publish Now' },
    { value: 'schedule', label: 'Schedule' }
  ];

  const handleScheduleDateChange = (localDateTime: string) => {
    // Convert local datetime to UTC and store
    const utcDateTime = convertLocalDateTimeToUTC(localDateTime);
    onChange({ scheduleDate: utcDateTime });
  };

  // Convert UTC back to local for display in the input
  const getLocalDateTimeValue = (): string => {
    if (!formData.scheduleDate) return '';
    
    try {
      const utcDate = new Date(formData.scheduleDate);
      // Format for datetime-local input (YYYY-MM-DDTHH:MM)
      const year = utcDate.getFullYear();
      const month = String(utcDate.getMonth() + 1).padStart(2, '0');
      const day = String(utcDate.getDate()).padStart(2, '0');
      const hours = String(utcDate.getHours()).padStart(2, '0');
      const minutes = String(utcDate.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      return '';
    }
  };

  if (!hasFiles) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Media Details</h3>
      
      {/* Title and Category Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium text-gray-700">
            Title or Caption
          </Label>
          <Input
            id="title"
            type="text"
            placeholder="Enter media title or caption..."
            value={formData.title}
            onChange={(e) => onChange({ title: e.target.value })}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium text-gray-700">
            Category
          </Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => onChange({ category: value })}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Publish Options Row */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Publish Options
          </Label>
          <Select 
            value={formData.publishOption || 'now'} 
            onValueChange={(value) => onChange({ publishOption: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose publish option" />
            </SelectTrigger>
            <SelectContent>
              {publishOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {formData.publishOption === 'schedule' && (
          <div className="space-y-2">
            <Label htmlFor="schedule-date" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Schedule Date & Time
            </Label>
            <div className="space-y-2">
              <Input
                id="schedule-date"
                type="datetime-local"
                value={getLocalDateTimeValue()}
                onChange={(e) => handleScheduleDateChange(e.target.value)}
                className="w-full"
              />
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Globe className="w-3 h-3" />
                <span>Your timezone: {getUserTimezone()}</span>
                <span>•</span>
                <span>Will be converted to UTC for API</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
