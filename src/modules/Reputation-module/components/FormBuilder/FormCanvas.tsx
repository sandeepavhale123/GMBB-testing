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
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('fieldIndex', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation();

    const fieldType = e.dataTransfer.getData('fieldType');
    if (fieldType) {
      // New field from sidebar
      onDropNewField(fieldType as FieldType);
      return;
    }

    const dragIndex = e.dataTransfer.getData('fieldIndex');
    if (dragIndex && draggedIndex !== null) {
      // Reordering existing field
      onReorderFields(draggedIndex, dropIndex);
    }

    setDraggedIndex(null);
  };

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
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
