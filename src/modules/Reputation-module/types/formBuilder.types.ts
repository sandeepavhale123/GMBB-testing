export type FieldType = 
  | 'text' 
  | 'email' 
  | 'textarea'
  | 'number'
  | 'select' 
  | 'radio' 
  | 'checkbox-group' 
  | 'file' 
  | 'date';

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldValidation {
  min?: number;
  max?: number;
  pattern?: string;
  message?: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  name: string;
  placeholder?: string;
  required: boolean;
  order: number;
  
  // Type-specific properties
  options?: FieldOption[];
  multiple?: boolean;
  accept?: string;
  maxFileSize?: number;
  defaultValue?: any;
  validation?: FieldValidation;
}

export interface FormSchema {
  id?: string;
  name: string;
  fields: FormField[];
  createdAt?: string;
  updatedAt?: string;
}

export interface FieldTypeDefinition {
  type: FieldType;
  icon: any;
  label: string;
  category: 'basic' | 'advanced';
  defaultConfig: Partial<FormField>;
}
