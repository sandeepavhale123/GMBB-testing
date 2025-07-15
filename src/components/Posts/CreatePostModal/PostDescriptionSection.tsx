
import React from 'react';
import { Wand2 } from 'lucide-react';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';

interface PostDescriptionSectionProps {
  description: string;
  onDescriptionChange: (value: string) => void;
  onOpenAIDescription: () => void;
}

export const PostDescriptionSection: React.FC<PostDescriptionSectionProps> = ({
  description,
  onDescriptionChange,
  onOpenAIDescription
}) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <Label className="text-sm font-medium">Post Description</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={onOpenAIDescription} 
          className="text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 w-full sm:w-auto"
        >
          <Wand2 className="w-3 h-3 mr-1" />
          Use GMB Genie to Write
        </Button>
      </div>
      <div className="space-y-2">
        <Textarea 
          value={description} 
          onChange={e => {
            const value = e.target.value;
            if (value.length <= 1500) {
              onDescriptionChange(value);
            }
          }}
          placeholder="Write your post description..." 
          rows={7} 
          className="resize-none text-sm sm:text-base" 
          maxLength={1500}
        />
        <div className="flex justify-end">
          <span className={`text-xs ${description.length > 1400 ? 'text-destructive' : 'text-muted-foreground'}`}>
            {description.length}/1500
          </span>
        </div>
      </div>
    </div>
  );
};
