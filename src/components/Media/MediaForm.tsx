
import React from 'react';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Calendar } from 'lucide-react';

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
    'Unspecified category',
    'Cover photo',
    'Profile photo', 
    'Logo photo',
    'Exterior media',
    'Interior media',
    'Product media',
    'At-work media',
    'Food and drink',
    'Menu media',
    'Common area media',
    'Rooms media',
    'Teams media',
    'Additional'
  ];

  const videoCategories = [
    'Unspecified category',
    'Exterior media',
    'Interior media',
    'Product media',
    'At-work media',
    'Food and drink',
    'Menu media',
    'Common area media',
    'Rooms media',
    'Teams media',
    'Additional'
  ];

  const categories = fileType === 'video' ? videoCategories : allCategories;

  const publishOptions = [
    { value: 'now', label: 'Publish Now' },
    { value: 'schedule', label: 'Schedule' }
  ];

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
                <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
                  {category}
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
            <Label htmlFor="schedule-date" className="text-sm font-medium text-gray-700">
              Schedule Date & Time
            </Label>
            <div className="relative">
              <Input
                id="schedule-date"
                type="datetime-local"
                value={formData.scheduleDate || ''}
                onChange={(e) => onChange({ scheduleDate: e.target.value })}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
