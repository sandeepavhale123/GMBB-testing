import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import type { FieldOption } from '../../types/formBuilder.types';
import { generateOptionValue } from '../../utils/formBuilder.utils';

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

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    // Auto-generate value from label
    newOptions[index] = { 
      label: value, 
      value: generateOptionValue(value, index)
    };
    onChange(newOptions);
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Options</Label>
      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="flex-1 space-y-1">
              <Input
                placeholder="Option label"
                value={option.label}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="h-9 text-sm"
              />
              <p className="text-xs text-muted-foreground">Value: {option.value}</p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleRemoveOption(index)}
              disabled={options.length <= 1}
              className="h-9 w-9 shrink-0"
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
