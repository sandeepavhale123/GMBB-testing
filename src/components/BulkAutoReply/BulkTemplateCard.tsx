import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Star, Settings } from 'lucide-react';

interface Template {
  id: string;
  starRating: number;
  content: string;
  enabled: boolean;
  isRatingOnly?: boolean;
}

interface BulkTemplateCardProps {
  starRating: number;
  template?: Template;
  onManage: (template: Template) => void;
  onCreate: (starRating: number) => void;
  onToggle?: (template: Template, enabled: boolean) => void;
  isRatingOnly?: boolean;
}

export const BulkTemplateCard: React.FC<BulkTemplateCardProps> = ({
  starRating,
  template,
  onManage,
  onCreate,
  onToggle,
  isRatingOnly = false
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const handleToggle = (checked: boolean) => {
    if (template && onToggle) {
      onToggle(template, checked);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {/* First row: Star rating on left, enable toggle on top right */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">{starRating}</span>
            <div className="flex">{renderStars(starRating)}</div>
          </div>
          
          {template && (
            <div className="flex items-center gap-2">
              <Switch
                checked={template.enabled}
                onCheckedChange={handleToggle}
              />
              <span className={`text-xs ${template.enabled ? 'text-green-600' : 'text-gray-400'}`}>
                {template.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          )}
        </div>

        {/* Second row: Template content and manage button */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {template ? (
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {template.content || 'No content'}
              </p>
            ) : (
              <p className="text-sm text-gray-400">No template created</p>
            )}
          </div>
          
          <div className="flex-shrink-0">
            {template ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onManage(template)}
                className="flex items-center gap-1"
              >
                <Settings className="h-3 w-3" />
                Manage
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCreate(starRating)}
              >
                Create
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};