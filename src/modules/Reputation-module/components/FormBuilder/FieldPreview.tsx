import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Upload } from 'lucide-react';
import type { FormField } from '../../types/formBuilder.types';

interface FieldPreviewProps {
  field: FormField;
}

export const FieldPreview: React.FC<FieldPreviewProps> = ({ field }) => {
  switch (field.type) {
    case 'text':
    case 'email':
      return (
        <Input
          type={field.type}
          placeholder={field.placeholder}
          defaultValue={field.defaultValue}
          disabled
          className="bg-muted/50"
        />
      );

    case 'number':
      return (
        <Input
          type="number"
          placeholder={field.placeholder}
          defaultValue={field.defaultValue}
          disabled
          className="bg-muted/50"
        />
      );

    case 'textarea':
      return (
        <Textarea
          placeholder={field.placeholder}
          defaultValue={field.defaultValue}
          disabled
          className="bg-muted/50 min-h-[100px]"
        />
      );

    case 'select':
      return (
        <Select disabled defaultValue={field.defaultValue}>
          <SelectTrigger className="bg-muted/50">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {field.options?.filter(opt => opt.value && opt.value.trim() !== '').map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case 'radio':
      return (
        <RadioGroup disabled className="space-y-2" defaultValue={field.defaultValue}>
          {field.options?.map(opt => (
            <div key={opt.value} className="flex items-center gap-2">
              <RadioGroupItem value={opt.value} id={`${field.id}-${opt.value}`} />
              <Label htmlFor={`${field.id}-${opt.value}`} className="cursor-pointer">
                {opt.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );

    case 'checkbox-group':
      return (
        <div className="space-y-2">
          {field.options?.map(opt => (
            <div key={opt.value} className="flex items-center gap-2">
              <Checkbox 
                id={`${field.id}-${opt.value}`} 
                disabled 
                defaultChecked={Array.isArray(field.defaultValue) && field.defaultValue.includes(opt.value)}
              />
              <Label htmlFor={`${field.id}-${opt.value}`} className="cursor-pointer">
                {opt.label}
              </Label>
            </div>
          ))}
        </div>
      );

    case 'file':
      return (
        <div className="border-2 border-dashed rounded-lg p-6 text-center bg-muted/50">
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Click to upload or drag and drop
          </p>
          {field.accept && (
            <p className="text-xs text-muted-foreground mt-1">
              Accepted: {field.accept}
            </p>
          )}
        </div>
      );

    case 'date':
      return (
        <Input
          type="date"
          disabled
          className="bg-muted/50"
        />
      );

    default:
      return <div className="text-muted-foreground text-sm">Unsupported field type</div>;
  }
};
