
import React from 'react';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface PostTypeFormData {
  postType: string;
}

interface PostTypeSelectorProps {
  formData: PostTypeFormData;
  onFormDataChange: (updater: (prev: PostTypeFormData) => PostTypeFormData) => void;
}

const postTypes = [{
  value: 'regular',
  label: 'Regular Post'
}, {
  value: 'event',
  label: 'Event Post'
}, {
  value: 'offer',
  label: 'Offer Post'
}];

export const PostTypeSelector: React.FC<PostTypeSelectorProps> = ({
  formData,
  onFormDataChange
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Post Type</Label>
      <Select 
        value={formData.postType} 
        onValueChange={value => onFormDataChange(prev => ({ ...prev, postType: value }))}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose post type" />
        </SelectTrigger>
        <SelectContent>
          {postTypes.map(type => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
