
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

  return (
    <div className="space-y-2">
      <Label htmlFor="title" className="text-sm font-medium">Title</Label>
      <Input 
        id="title" 
        value={formData.title} 
        onChange={e => onFormDataChange(prev => ({ ...prev, title: e.target.value }))} 
        placeholder="Enter title..." 
        className="transition-all focus:ring-2" 
        maxLength={60}
      />
    </div>
  );
};
