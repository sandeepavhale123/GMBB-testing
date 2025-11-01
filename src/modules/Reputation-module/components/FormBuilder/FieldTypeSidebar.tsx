import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Type, Mail, AlignLeft, Hash, ChevronDown, Circle, CheckSquare, Upload, Calendar } from 'lucide-react';
import type { FieldType, FieldTypeDefinition } from '../../types/formBuilder.types';

interface FieldTypeSidebarProps {
  onAddField: (fieldType: FieldType) => void;
}

const fieldTypes: FieldTypeDefinition[] = [
  { type: 'text', icon: Type, label: 'Text', category: 'basic', defaultConfig: {} },
  { type: 'email', icon: Mail, label: 'Email', category: 'basic', defaultConfig: {} },
  { type: 'textarea', icon: AlignLeft, label: 'Textarea', category: 'basic', defaultConfig: {} },
  { type: 'number', icon: Hash, label: 'Number', category: 'basic', defaultConfig: {} },
  { type: 'select', icon: ChevronDown, label: 'Select', category: 'basic', defaultConfig: {} },
  { type: 'radio', icon: Circle, label: 'Radio', category: 'basic', defaultConfig: {} },
  { type: 'checkbox-group', icon: CheckSquare, label: 'Checkbox', category: 'basic', defaultConfig: {} },
  { type: 'file', icon: Upload, label: 'File Upload', category: 'advanced', defaultConfig: {} },
  { type: 'date', icon: Calendar, label: 'Date', category: 'advanced', defaultConfig: {} },
];

export const FieldTypeSidebar: React.FC<FieldTypeSidebarProps> = ({ onAddField }) => {
  const basicFields = fieldTypes.filter(f => f.category === 'basic');
  const advancedFields = fieldTypes.filter(f => f.category === 'advanced');

  const handleDragStart = (e: React.DragEvent, fieldType: FieldType) => {
    e.dataTransfer.setData('fieldType', fieldType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const FieldTypeButton: React.FC<{ field: FieldTypeDefinition }> = ({ field }) => {
    const Icon = field.icon;
    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, field.type)}
        onClick={() => onAddField(field.type)}
        className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent hover:border-primary cursor-move transition-all group"
      >
        <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-sm font-medium">{field.label}</span>
      </div>
    );
  };

  return (
    <div className="w-64 border-r bg-card overflow-y-auto">
      <div className="p-4 border-b sticky top-0 bg-card z-10">
        <h3 className="font-semibold">Form Elements</h3>
      </div>

      <div className="p-4">
        <Accordion type="multiple" defaultValue={['basic', 'advanced']} className="space-y-2">
          <AccordionItem value="basic" className="border-none">
            <AccordionTrigger className="py-2 hover:no-underline">
              <span className="text-sm font-medium">Basic ({basicFields.length})</span>
            </AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2">
              {basicFields.map(field => (
                <FieldTypeButton key={field.type} field={field} />
              ))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="advanced" className="border-none">
            <AccordionTrigger className="py-2 hover:no-underline">
              <span className="text-sm font-medium">Advanced ({advancedFields.length})</span>
            </AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2">
              {advancedFields.map(field => (
                <FieldTypeButton key={field.type} field={field} />
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
