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
  isRatingOnly?: boolean;
}

export const BulkTemplateCard: React.FC<BulkTemplateCardProps> = ({
  starRating,
  template,
  onManage,
  onCreate,
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
    if (template) {
      // Handle enable/disable logic
      console.log(`${checked ? 'Enabling' : 'Disabling'} template for ${starRating} stars`);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">{starRating}</span>
              <div className="flex">{renderStars(starRating)}</div>
            </div>
            
            <div className="flex-1 min-w-0">
              {template ? (
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 truncate">
                    {template.content || 'No content'}
                  </p>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={template.enabled}
                      onCheckedChange={handleToggle}
                    />
                    <span className={`text-xs ${template.enabled ? 'text-green-600' : 'text-gray-400'}`}>
                      {template.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400">No template created</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
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