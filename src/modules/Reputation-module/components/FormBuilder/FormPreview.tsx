import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import type { FormSchema } from '../../types/formBuilder.types';

interface FormPreviewProps {
  schema: Partial<FormSchema>;
}

export const FormPreview: React.FC<FormPreviewProps> = ({ schema }) => {
  if (!schema.fields || schema.fields.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <p>Add fields to see form preview</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{schema.name || 'Form Preview'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          {schema.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>

              {field.type === 'text' && (
                <Input id={field.id} placeholder={field.placeholder} />
              )}

              {field.type === 'email' && (
                <Input id={field.id} type="email" placeholder={field.placeholder} />
              )}

              {field.type === 'number' && (
                <Input id={field.id} type="number" placeholder={field.placeholder} />
              )}

              {field.type === 'textarea' && (
                <Textarea id={field.id} placeholder={field.placeholder} />
              )}

              {field.type === 'select' && (
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    {field.options?.filter(opt => opt.value && opt.value.trim() !== '').map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {field.type === 'radio' && (
                <RadioGroup>
                  {field.options?.map((opt) => (
                    <div key={opt.value} className="flex items-center gap-2">
                      <RadioGroupItem value={opt.value} id={`${field.id}-${opt.value}`} />
                      <Label htmlFor={`${field.id}-${opt.value}`}>{opt.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {field.type === 'checkbox-group' && (
                <div className="space-y-2">
                  {field.options?.map((opt) => (
                    <div key={opt.value} className="flex items-center gap-2">
                      <Checkbox id={`${field.id}-${opt.value}`} />
                      <Label htmlFor={`${field.id}-${opt.value}`}>{opt.label}</Label>
                    </div>
                  ))}
                </div>
              )}

              {field.type === 'date' && (
                <Input id={field.id} type="date" />
              )}

              {field.type === 'file' && (
                <Input id={field.id} type="file" accept={field.accept} />
              )}
            </div>
          ))}

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
