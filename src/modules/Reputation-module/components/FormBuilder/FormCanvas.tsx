import React from 'react';
import { FieldCard } from './FieldCard';
import { EmptyCanvas } from './EmptyCanvas';
import type { FormField, FieldType } from '../../types/formBuilder.types';

interface FormCanvasProps {
  fields: FormField[];
  selectedFieldId: string | null;
  onSelectField: (fieldId: string | null) => void;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
  onDeleteField: (fieldId: string) => void;
  onDuplicateField: (fieldId: string) => void;
  onReorderFields: (startIndex: number, endIndex: number) => void;
  onDropNewField: (fieldType: FieldType) => void;
}

export const FormCanvas: React.FC<FormCanvasProps> = ({
  fields,
  selectedFieldId,
  onSelectField,
  onDeleteField,
  onDuplicateField,
  onReorderFields,
  onDropNewField,
}) => {
  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const fieldType = e.dataTransfer.getData('fieldType');
    if (fieldType) {
      onDropNewField(fieldType as FieldType);
    }
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  return (
    <div
      className="flex-1 p-6 overflow-y-auto bg-muted/20"
      onDrop={handleCanvasDrop}
      onDragOver={handleCanvasDragOver}
    >
      {fields.length === 0 ? (
        <EmptyCanvas />
      ) : (
        <div className="max-w-3xl mx-auto space-y-3">
          {fields.map((field, index) => (
            <FieldCard
              key={field.id}
              field={field}
              isSelected={selectedFieldId === field.id}
              isFirst={index === 0}
              isLast={index === fields.length - 1}
              onSelect={() => onSelectField(field.id)}
              onDuplicate={() => onDuplicateField(field.id)}
              onDelete={() => onDeleteField(field.id)}
              onMoveUp={() => onReorderFields(index, index - 1)}
              onMoveDown={() => onReorderFields(index, index + 1)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
