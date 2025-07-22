
import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Star } from 'lucide-react';
import { ReplyTemplate } from '../../../store/slices/reviews/templateTypes';

interface TemplateCardProps {
  starRating: number;
  template?: ReplyTemplate;
  onCreateTemplate: (starRating: number) => void;
  onEditTemplate?: (template: ReplyTemplate) => void;
  onDeleteTemplate?: (templateId: string) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  starRating,
  template,
  onCreateTemplate,
  onEditTemplate,
  onDeleteTemplate,
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <CardContent className="p-6">
        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-4">
          <span className="text-2xl font-bold text-gray-900 mr-2">{starRating}</span>
          <div className="flex">{renderStars(starRating)}</div>
        </div>

        {/* Template Content */}
        {template ? (
          <div className="mb-6">
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              {template.content}
            </p>
          </div>
        ) : (
          <div className="mb-6">
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Thank you so much, {"{first_name}"}, for your amazing{' '}
              {starRating}-star review! 🌟 It's truly wonderful to hear that
              you had a great experience with us. Your kind words mean the
              world to me and the team.
            </p>
            <p className="text-gray-400 text-sm">~ {"{owner_name}"}</p>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end">
          {template ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditTemplate?.(template)}
              className="bg-gray-900 text-white hover:bg-gray-800 border-gray-900"
            >
              Manage
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCreateTemplate(starRating)}
              className="bg-gray-900 text-white hover:bg-gray-800 border-gray-900"
            >
              Create
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
