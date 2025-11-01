import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import type { FieldOption } from '../../types/formBuilder.types';

interface OptionsEditorProps {
  options: FieldOption[];
  onChange: (options: FieldOption[]) => void;
}

export const OptionsEditor: React.FC<OptionsEditorProps> = ({ options, onChange }) => {
  const handleAddOption = () => {
    onChange([
      ...options,
      { label: `Option ${options.length + 1}`, value: `option_${options.length + 1}` },
    ]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 1) return; // Keep at least one option
    onChange(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, field: 'label' | 'value', value: string) => {
    const newOptions = [...options];
    // Ensure value is never empty - use a placeholder if cleared
    if (field === 'value' && value.trim() === '') {
      newOptions[index] = { ...newOptions[index], [field]: `option_${index + 1}` };
    } else {
      newOptions[index] = { ...newOptions[index], [field]: value };
    }
    onChange(newOptions);
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Options</Label>
      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={index} className="flex gap-2">
            <div className="flex-1 space-y-1">
              <Input
                placeholder="Label"
                value={option.label}
                onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="flex-1 space-y-1">
              <Input
                placeholder="Value"
                value={option.value}
                onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleRemoveOption(index)}
              disabled={options.length <= 1}
              className="h-9 w-9"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        onClick={handleAddOption}
        className="w-full h-9 text-sm"
      >
        <Plus className="h-4 w-4 mr-2" /> Add Option
      </Button>
    </div>
  );
};
