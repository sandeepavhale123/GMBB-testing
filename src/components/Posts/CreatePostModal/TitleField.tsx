
import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';

interface FormData {
  title: string;
  postType: string;
}

interface TitleFieldProps {
  formData: FormData;
  onFormDataChange: (updater: (prev: FormData) => FormData) => void;
}

export const TitleField: React.FC<TitleFieldProps> = ({
  formData,
  onFormDataChange
}) => {
  if (formData.postType !== 'event' && formData.postType !== 'offer') {
    return null;
  }

  const characterCount = formData.title.length;
  const maxLength = 60;

  return (
    <div className="space-y-2">
      <Label htmlFor="title" className="text-sm font-medium">Title</Label>
      <div className="relative">
        <Input 
          id="title" 
          value={formData.title} 
          onChange={e => onFormDataChange(prev => ({ ...prev, title: e.target.value }))} 
          placeholder="Enter title..." 
          className="transition-all focus:ring-2 pr-16" 
          maxLength={maxLength}
        />
        <div className="absolute top-2 right-3 text-xs text-gray-500">
          {characterCount}/{maxLength}
        </div>
      </div>
    </div>
  );
};
