import { z } from 'zod';
import type { FormField, FormSchema, FieldType } from '../types/formBuilder.types';

// Generate unique field IDs
export const generateFieldId = (): string => {
  return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Create default field configuration
export const createDefaultField = (type: FieldType): FormField => {
  const baseField = {
    id: generateFieldId(),
    type,
    label: getDefaultLabel(type),
    name: getDefaultName(type),
    required: false,
    order: 0,
  };

  // Add type-specific defaults
  switch (type) {
    case 'text':
      return { ...baseField, placeholder: 'Enter text...' };
    case 'email':
      return { ...baseField, placeholder: 'Enter email address...' };
    case 'textarea':
      return { ...baseField, placeholder: 'Enter your message...' };
    case 'number':
      return { ...baseField, placeholder: 'Enter number...' };
    case 'select':
      return {
        ...baseField,
        options: [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
        ],
        multiple: false,
      };
    case 'radio':
      return {
        ...baseField,
        options: [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
        ],
      };
    case 'checkbox-group':
      return {
        ...baseField,
        options: [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
        ],
      };
    case 'file':
      return {
        ...baseField,
        accept: '.pdf,.docx,.jpg,.png',
        maxFileSize: 2048,
      };
    case 'date':
      return { ...baseField };
    default:
      return baseField;
  }
};

const getDefaultLabel = (type: FieldType): string => {
  const labels: Record<FieldType, string> = {
    text: 'Text Field',
    email: 'Email Address',
    textarea: 'Message',
    number: 'Number',
    select: 'Select Option',
    radio: 'Choose One',
    'checkbox-group': 'Select Multiple',
    file: 'Upload File',
    date: 'Select Date',
  };
  return labels[type];
};

const getDefaultName = (type: FieldType): string => {
  const timestamp = Date.now().toString().slice(-4);
  return `${type}_${timestamp}`;
};

// Validation schema
const fieldOptionSchema = z.object({
  label: z.string().min(1, 'Option label is required').max(100),
  value: z.string().min(1, 'Option value is required').max(50),
});

const fieldSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'email', 'textarea', 'number', 'select', 'radio', 'checkbox-group', 'file', 'date']),
  label: z.string().trim().min(1, 'Label is required').max(100, 'Label too long'),
  name: z.string().trim().min(1, 'Name is required').max(50, 'Name too long').regex(/^[a-z_][a-z0-9_]*$/, 'Name must be lowercase alphanumeric with underscores'),
  placeholder: z.string().max(200).optional(),
  required: z.boolean(),
  order: z.number(),
  options: z.array(fieldOptionSchema).optional(),
  multiple: z.boolean().optional(),
  accept: z.string().optional(),
  maxFileSize: z.number().optional(),
  defaultValue: z.any().optional(),
  validation: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    pattern: z.string().optional(),
    message: z.string().optional(),
  }).optional(),
});

const formSchemaValidator = z.object({
  name: z.string().trim().min(1, 'Template name is required').max(100, 'Template name too long'),
  fields: z.array(fieldSchema).min(1, 'Add at least one field'),
});

// Validate form schema
export const validateFormSchema = (schema: Partial<FormSchema>): { valid: boolean; errors: string[] } => {
  try {
    formSchemaValidator.parse(schema);
    return { valid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`),
      };
    }
    return { valid: false, errors: ['Validation failed'] };
  }
};

// LocalStorage helpers
const STORAGE_PREFIX = 'feedback_form_';

export const saveFormToLocalStorage = (formId: string, schema: FormSchema): void => {
  try {
    const key = `${STORAGE_PREFIX}${formId}`;
    localStorage.setItem(key, JSON.stringify(schema));
  } catch (error) {
    console.error('Failed to save form to localStorage:', error);
  }
};

export const loadFormFromLocalStorage = (formId: string): FormSchema | null => {
  try {
    const key = `${STORAGE_PREFIX}${formId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load form from localStorage:', error);
    return null;
  }
};

export const clearFormFromLocalStorage = (formId: string): void => {
  try {
    const key = `${STORAGE_PREFIX}${formId}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear form from localStorage:', error);
  }
};

// Reorder fields
export const reorderFields = (fields: FormField[], startIndex: number, endIndex: number): FormField[] => {
  const result = Array.from(fields);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  
  // Update order property
  return result.map((field, index) => ({ ...field, order: index }));
};

// Duplicate field
export const duplicateField = (field: FormField): FormField => {
  return {
    ...field,
    id: generateFieldId(),
    name: `${field.name}_copy`,
    label: `${field.label} (Copy)`,
  };
};
