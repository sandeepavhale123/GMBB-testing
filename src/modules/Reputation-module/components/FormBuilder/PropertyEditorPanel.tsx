import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings } from 'lucide-react';
import { OptionsEditor } from './OptionsEditor';
import type { FormField } from '../../types/formBuilder.types';

interface PropertyEditorPanelProps {
  selectedField: FormField | undefined;
  onUpdateField: (updates: Partial<FormField>) => void;
}

export const PropertyEditorPanel: React.FC<PropertyEditorPanelProps> = ({
  selectedField,
  onUpdateField,
}) => {
  if (!selectedField) {
    return (
      <div className="w-80 border-l bg-card overflow-y-auto">
        <div className="p-6 text-center text-muted-foreground">
          <Settings className="mx-auto h-12 w-12 mb-3 opacity-50" />
          <p className="text-sm font-medium mb-1">No Field Selected</p>
          <p className="text-xs">Click on a field to edit its properties</p>
        </div>
      </div>
    );
  }

  const hasOptions = ['select', 'radio', 'checkbox-group'].includes(selectedField.type);
  const isFileField = selectedField.type === 'file';

  return (
    <div className="w-80 border-l bg-card overflow-y-auto">
      <div className="p-4 border-b sticky top-0 bg-card z-10">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold">Field Properties</h3>
          <Badge variant="secondary" className="text-xs">
            {selectedField.type}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">Configure field settings</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Label */}
        <div className="space-y-2">
          <Label htmlFor="field-label" className="text-sm font-medium">
            Label <span className="text-destructive">*</span>
          </Label>
          <Input
            id="field-label"
            value={selectedField.label}
            onChange={(e) => onUpdateField({ label: e.target.value })}
            placeholder="Enter field label"
            className="h-9"
          />
          <p className="text-xs text-muted-foreground">Field name: {selectedField.name}</p>
        </div>

        {/* Placeholder */}
        {!hasOptions && !isFileField && selectedField.type !== 'date' && (
          <div className="space-y-2">
            <Label htmlFor="field-placeholder" className="text-sm font-medium">Placeholder</Label>
            <Input
              id="field-placeholder"
              value={selectedField.placeholder ?? ''}
              onChange={(e) => onUpdateField({ placeholder: e.target.value })}
              placeholder="Enter placeholder text"
              className="h-9"
            />
          </div>
        )}

        {/* Required Toggle */}
        <div className="flex items-center justify-between py-2 px-3 rounded-lg border bg-muted/50">
          <div className="space-y-0.5">
            <Label htmlFor="field-required" className="text-sm font-medium cursor-pointer">
              Required Field
            </Label>
            <p className="text-xs text-muted-foreground">User must fill this field</p>
          </div>
          <Switch
            id="field-required"
            checked={selectedField.required}
            onCheckedChange={(checked) => onUpdateField({ required: checked })}
          />
        </div>

        {/* Options Editor for select/radio/checkbox */}
        {hasOptions && selectedField.options && (
          <div className="pt-2 border-t">
            <OptionsEditor
              options={selectedField.options}
              onChange={(options) => onUpdateField({ options })}
            />
          </div>
        )}

        {/* File-specific options */}
        {isFileField && (
          <div className="pt-2 border-t space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-accept" className="text-sm font-medium">Accepted File Types</Label>
              <Input
                id="file-accept"
                value={selectedField.accept ?? ''}
                onChange={(e) => onUpdateField({ accept: e.target.value })}
                placeholder=".pdf,.docx,.jpg,.png"
                className="h-9 text-sm"
              />
              <p className="text-xs text-muted-foreground">Comma-separated file extensions</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="file-maxsize" className="text-sm font-medium">Max File Size (KB)</Label>
              <Input
                id="file-maxsize"
                type="number"
                value={selectedField.maxFileSize ?? ''}
                onChange={(e) => onUpdateField({ maxFileSize: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="2048"
                className="h-9 text-sm"
              />
            </div>
          </div>
        )}

        {/* Default Value */}
        {selectedField.type !== 'file' && (
          <div className="pt-2 border-t space-y-2">
            <Label htmlFor="field-default" className="text-sm font-medium">Default Value</Label>
            <Input
              id="field-default"
              value={selectedField.defaultValue ?? ''}
              onChange={(e) => onUpdateField({ defaultValue: e.target.value })}
              placeholder="Enter default value"
              className="h-9 text-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
};
