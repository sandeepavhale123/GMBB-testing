
import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Star, Plus, Edit, Trash2 } from 'lucide-react';
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
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card className="h-48 flex flex-col">
      <CardContent className="p-4 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(starRating)}</div>
            <span className="text-sm font-medium text-gray-700">
              {starRating} Star{starRating !== 1 ? 's' : ''}
            </span>
          </div>
          {template?.enabled && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              Active
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {template ? (
            <>
              <div className="flex-1 mb-3">
                <p className="text-sm text-gray-600 line-clamp-4">
                  {template.content}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEditTemplate?.(template)}
                  className="flex-1 flex items-center gap-1"
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDeleteTemplate?.(template.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <Plus className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">No template set</p>
              </div>
              <Button
                size="sm"
                onClick={() => onCreateTemplate(starRating)}
                className="w-full"
              >
                Create Template
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
