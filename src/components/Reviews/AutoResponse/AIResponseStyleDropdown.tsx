
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

export const AIResponseStyleDropdown: React.FC = () => {
  const [selectedStyle, setSelectedStyle] = useState('');

  const responseStyles = [
    { value: 'friendly-warm', label: 'Friendly & Warm' },
    { value: 'professional-polite', label: 'Professional & Polite' },
    { value: 'short-direct', label: 'Short & Direct' },
    { value: 'fun-quirky', label: 'Fun & Quirky' },
  ];

  return (
    <div>
      <h3 className="text-base font-medium text-gray-900 mb-3">AI Response Style</h3>
      <Select value={selectedStyle} onValueChange={setSelectedStyle}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose your response style..." />
        </SelectTrigger>
        <SelectContent>
          {responseStyles.map((style) => (
            <SelectItem key={style.value} value={style.value}>
              {style.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
