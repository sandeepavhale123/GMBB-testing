import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Shield, ChevronDown } from 'lucide-react';
import type { FieldValidation } from '../../types/formBuilder.types';

interface ValidationEditorProps {
  validation?: FieldValidation;
  fieldType: string;
  onChange: (validation: FieldValidation) => void;
}

export const ValidationEditor: React.FC<ValidationEditorProps> = ({
  validation = {},
  fieldType,
  onChange,
}) => {
  const showMinMax = ['text', 'textarea', 'number'].includes(fieldType);

  if (!showMinMax) return null;

  return (
    <Collapsible>
      <CollapsibleTrigger className="flex items-center gap-2 w-full py-2 text-sm font-medium hover:text-primary transition-colors">
        <Shield className="h-4 w-4" />
        <span>Validation Rules</span>
        <ChevronDown className="h-4 w-4 ml-auto" />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 pt-2">
        {fieldType === 'number' ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="min-value" className="text-xs">Minimum Value</Label>
              <Input
                id="min-value"
                type="number"
                placeholder="Min"
                value={validation.min ?? ''}
                onChange={(e) => onChange({ ...validation, min: e.target.value ? Number(e.target.value) : undefined })}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-value" className="text-xs">Maximum Value</Label>
              <Input
                id="max-value"
                type="number"
                placeholder="Max"
                value={validation.max ?? ''}
                onChange={(e) => onChange({ ...validation, max: e.target.value ? Number(e.target.value) : undefined })}
                className="h-9 text-sm"
              />
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="min-length" className="text-xs">Minimum Length</Label>
              <Input
                id="min-length"
                type="number"
                placeholder="Min length"
                value={validation.min ?? ''}
                onChange={(e) => onChange({ ...validation, min: e.target.value ? Number(e.target.value) : undefined })}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-length" className="text-xs">Maximum Length</Label>
              <Input
                id="max-length"
                type="number"
                placeholder="Max length"
                value={validation.max ?? ''}
                onChange={(e) => onChange({ ...validation, max: e.target.value ? Number(e.target.value) : undefined })}
                className="h-9 text-sm"
              />
            </div>
          </>
        )}
        <div className="space-y-2">
          <Label htmlFor="validation-message" className="text-xs">Custom Error Message</Label>
          <Input
            id="validation-message"
            placeholder="Enter error message"
            value={validation.message ?? ''}
            onChange={(e) => onChange({ ...validation, message: e.target.value })}
            className="h-9 text-sm"
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
