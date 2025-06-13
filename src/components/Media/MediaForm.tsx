
import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { CategorySelector } from './CategorySelector';

interface FormData {
  title: string;
  altText: string;
  category: string;
  location: string;
}

interface MediaFormProps {
  formData: FormData;
  onChange: (data: Partial<FormData>) => void;
  hasFiles: boolean;
}

export const MediaForm: React.FC<MediaFormProps> = ({ formData, onChange, hasFiles }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title/Caption */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium text-gray-900">
            Title or Caption
          </Label>
          <Input
            id="title"
            type="text"
            placeholder="Enter a title for your media..."
            value={formData.title}
            onChange={(e) => onChange({ title: e.target.value })}
            className="w-full"
            maxLength={100}
          />
          <p className="text-xs text-gray-500">
            {formData.title.length}/100 characters
          </p>
        </div>

        {/* Alt Text */}
        <div className="space-y-2">
          <Label htmlFor="altText" className="text-sm font-medium text-gray-900">
            Alt Text (SEO)
          </Label>
          <Input
            id="altText"
            type="text"
            placeholder="Describe your media for accessibility..."
            value={formData.altText}
            onChange={(e) => onChange({ altText: e.target.value })}
            className="w-full"
            maxLength={150}
          />
          <p className="text-xs text-gray-500">
            Helps with SEO and accessibility • {formData.altText.length}/150 characters
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-900">
            Category
          </Label>
          <CategorySelector
            value={formData.category}
            onChange={(category) => onChange({ category })}
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium text-gray-900">
            Location
          </Label>
          <Input
            id="location"
            type="text"
            placeholder="Business location..."
            value={formData.location}
            onChange={(e) => onChange({ location: e.target.value })}
            className="w-full"
          />
          <p className="text-xs text-gray-500">
            Auto-filled from your Google Business Profile
          </p>
        </div>
      </div>
    </div>
  );
};
