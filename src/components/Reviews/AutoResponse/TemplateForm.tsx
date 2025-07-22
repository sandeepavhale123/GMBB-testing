
import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Star } from 'lucide-react';

interface TemplateFormProps {
  onSave: (starRating: number, content: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const TemplateForm: React.FC<TemplateFormProps> = ({
  onSave,
  onCancel,
  isLoading = false
}) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [content, setContent] = useState('');

  const handleSave = () => {
    if (selectedRating && content.trim()) {
      onSave(selectedRating, content.trim());
    }
  };

  const isValid = selectedRating && content.trim().length > 0;

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="star-rating" className="text-sm font-medium text-gray-700">
          Select Star Rating
        </Label>
        <Select onValueChange={(value) => setSelectedRating(parseInt(value))}>
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Choose star rating for this template" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map((rating) => (
              <SelectItem key={rating} value={rating.toString()}>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        className={`w-4 h-4 ${
                          index < rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span>{rating} Star{rating !== 1 ? 's' : ''}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="template-content" className="text-sm font-medium text-gray-700">
          Reply Template
        </Label>
        <Textarea
          id="template-content"
          placeholder="Write your reply template here. Use variables like {first_name} to personalize responses..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">
          Tip: Use the variables from the left panel to make your template more personal
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
        >
          Close
        </Button>
        <Button 
          onClick={handleSave}
          disabled={!isValid || isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Template'}
        </Button>
      </div>
    </div>
  );
};
