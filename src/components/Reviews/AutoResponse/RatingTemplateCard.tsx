
import React, { useState } from 'react';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { useAppSelector } from '../../../hooks/useRedux';

interface RatingTemplateCardProps {
  stars: number;
  label: string;
}

export const RatingTemplateCard: React.FC<RatingTemplateCardProps> = ({
  stars,
  label,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { autoResponse } = useAppSelector(state => state.reviews);
  
  // Find existing template for this rating
  const existingTemplate = autoResponse.templates.find(t => t.starRating === stars);

  const getDefaultContent = (rating: number): string => {
    const templates = {
      5: `Thank you so much, {first_name}, for your amazing 5-star review! 🌟 It's truly wonderful to hear that you had a great experience with us. Your kind words mean the world to me and the team.

~ {owner_name}`,
      4: `Hi {first_name}, thank you for the 4-star review! We're thrilled you had a positive experience with us. We'd love to know how we can make it a 5-star experience next time!

~ {owner_name}`,
      3: `Hello {first_name}, thank you for taking the time to leave a 3-star review. We appreciate your feedback and would love to understand how we can improve your experience.

~ {owner_name}`,
      2: `Hi {first_name}, thank you for your 2-star review. We're sorry to hear that your experience wasn't up to our standards. We'd appreciate the opportunity to make this right.

~ {owner_name}`,
      1: `Hello {first_name}, we're very sorry to see your 1-star review. This is clearly not the experience we want for our customers. Please reach out to us directly so we can resolve this immediately.

~ {owner_name}`
    };
    return templates[rating as keyof typeof templates] || templates[5];
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleConfigure = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="border border-gray-200 hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex">{renderStars(stars)}</div>
            <span className="font-medium text-gray-900">{label}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleConfigure}
              className="text-sm"
            >
              Click to configure
            </Button>
            <button
              onClick={handleConfigure}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Template Content
              </label>
              <Textarea
                value={existingTemplate?.content || getDefaultContent(stars)}
                placeholder="Enter your template response..."
                rows={6}
                className="resize-none"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsExpanded(false)}>
                  Cancel
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Save Template
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
