import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Copy, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { FieldPreview } from './FieldPreview';
import { cn } from '@/lib/utils';
import type { FormField } from '../../types/formBuilder.types';

interface FieldCardProps {
  field: FormField;
  isSelected: boolean;
  isFirst: boolean;
  isLast: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export const FieldCard: React.FC<FieldCardProps> = ({
  field,
  isSelected,
  isFirst,
  isLast,
  onSelect,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  return (
    <Card
      onClick={onSelect}
      className={cn(
        'relative group cursor-pointer transition-all hover:shadow-md',
        isSelected && 'ring-2 ring-primary shadow-lg'
      )}
    >
      <CardContent className="p-4">
        {/* Field content */}
        <div className="pr-20 md:pr-32">
          <div className="flex items-center gap-2 mb-2">
            <Label className="text-base font-medium">
              {field.label}
            </Label>
            {field.required && (
              <span className="text-destructive font-semibold">*</span>
            )}
            <Badge variant="outline" className="text-xs ml-auto">
              {field.type}
            </Badge>
          </div>
          <FieldPreview field={field} />
        </div>

        {/* Action buttons */}
        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          {!isFirst && (
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp();
              }}
              className="h-7 w-7 md:h-8 md:w-8"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          )}
          {!isLast && (
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown();
              }}
              className="h-7 w-7 md:h-8 md:w-8"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="h-7 w-7 md:h-8 md:w-8"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="h-7 w-7 md:h-8 md:w-8 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
