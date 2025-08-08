
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
      <Label className="text-sm font-medium">Post Description</Label>
      <div className="space-y-2 relative">
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
          className="resize-none text-sm sm:text-base pr-12" 
          maxLength={1500}
        />
        <Button 
          type="button" 
          size="sm"
          onClick={onOpenAIDescription} 
          className="absolute bottom-8 right-2 h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg"
          title="Use GMB Genie to Write"
        >
          <Wand2 className="w-4 h-4" />
        </Button>
        <div className="flex justify-end">
          <span className={`text-xs ${description.length > 1400 ? 'text-destructive' : 'text-muted-foreground'}`}>
            {description.length}/1500
          </span>
        </div>
      </div>
    </div>
  );
};
