import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { getFormFromLocalStorage, saveFormSubmission, generateValidationSchema } from '../utils/formBuilder.utils';
import type { FormField, FormSchema } from '../types/formBuilder.types';

export const PublicFeedbackForm: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [checkboxValues, setCheckboxValues] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (formId) {
      const schema = getFormFromLocalStorage(formId);
      setFormSchema(schema);
      setIsLoading(false);
    }
  }, [formId]);

  const validationSchema = formSchema?.fields ? generateValidationSchema(formSchema.fields) : null;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: validationSchema ? zodResolver(validationSchema) : undefined,
  });

  const onSubmit = (data: any) => {
    if (!formId) return;

    // Merge checkbox values
    const submissionData = { ...data, ...checkboxValues };
    
    saveFormSubmission(formId, submissionData);
    setSubmissionSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    reset();
    setCheckboxValues({});
    setSubmissionSuccess(false);
  };

  const handleCheckboxChange = (fieldName: string, value: string, checked: boolean) => {
    setCheckboxValues(prev => {
      const current = prev[fieldName] || [];
      if (checked) {
        return { ...prev, [fieldName]: [...current, value] };
      } else {
        return { ...prev, [fieldName]: current.filter(v => v !== value) };
      }
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading form...</p>
        </div>
      </div>
    );
  }

  // Form not found
  if (!formSchema) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Form Not Found</h2>
            <p className="text-muted-foreground">
              This feedback form does not exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No fields configured
  if (formSchema.fields.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Fields Configured</h2>
            <p className="text-muted-foreground">
              This form has no fields configured yet.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (submissionSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
            <p className="text-muted-foreground mb-6">
              Your feedback has been submitted successfully.
            </p>
            <Button onClick={handleReset} variant="outline">
              Submit Another Response
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render form
  const renderField = (field: FormField) => {
    const error = errors[field.name]?.message as string | undefined;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              type={field.type}
              placeholder={field.placeholder}
              {...register(field.name)}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Textarea
              id={field.name}
              placeholder={field.placeholder}
              rows={4}
              {...register(field.name)}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Select onValueChange={(value) => setValue(field.name, value)}>
              <SelectTrigger id={field.name}>
                <SelectValue placeholder={field.placeholder || 'Select an option'} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case 'radio':
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <RadioGroup onValueChange={(value) => setValue(field.name, value)}>
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${field.name}-${option.value}`} />
                  <Label htmlFor={`${field.name}-${option.value}`} className="font-normal cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case 'checkbox-group':
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <div className="space-y-2">
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.name}-${option.value}`}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(field.name, option.value, checked as boolean)
                    }
                  />
                  <Label htmlFor={`${field.name}-${option.value}`} className="font-normal cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case 'file':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              type="file"
              accept={field.accept}
              {...register(field.name)}
            />
            {field.maxFileSize && (
              <p className="text-xs text-muted-foreground">
                Maximum file size: {field.maxFileSize}KB
              </p>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case 'date':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              type="date"
              {...register(field.name)}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle>{formSchema.name}</CardTitle>
          <CardDescription>Please fill out all required fields</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {formSchema.fields
              .sort((a, b) => a.order - b.order)
              .map((field) => renderField(field))}

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Submit
              </Button>
              <Button type="button" variant="outline" onClick={handleReset} className="flex-1">
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicFeedbackForm;
