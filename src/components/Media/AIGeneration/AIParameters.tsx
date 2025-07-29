
import React from 'react';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface AIParametersProps {
  variants: number;
  style: string;
  onVariantsChange: (variants: number) => void;
  onStyleChange: (style: string) => void;
}

export const AIParameters: React.FC<AIParametersProps> = ({
  variants,
  style,
  onVariantsChange,
  onStyleChange
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Variants Parameter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-900">
          Number of Variants
        </Label>
        <Select value={variants.toString()} onValueChange={(value) => onVariantsChange(parseInt(value))}>
          <SelectTrigger className="w-full bg-white h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
            <SelectItem value="1">1 variant</SelectItem>
            <SelectItem value="2">2 variants</SelectItem>
            <SelectItem value="3">3 variants</SelectItem>
            <SelectItem value="4">4 variants</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Style Parameter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-900">
          Style
        </Label>
        <Select value={style} onValueChange={onStyleChange}>
          <SelectTrigger className="w-full bg-white h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
            <SelectItem value="realistic">Realistic</SelectItem>
            <SelectItem value="artistic">Artistic</SelectItem>
            <SelectItem value="cartoon">Cartoon</SelectItem>
            <SelectItem value="abstract">Abstract</SelectItem>
            <SelectItem value="minimalist">Minimalist</SelectItem>
            <SelectItem value="vintage">Vintage</SelectItem>
            <SelectItem value="modern">Modern</SelectItem>
            <SelectItem value="file-1">File-1</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
