
import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

const categories = [
  { value: 'product', label: 'Product', icon: '📦' },
  { value: 'interior', label: 'Interior', icon: '🏠' },
  { value: 'team', label: 'Team', icon: '👥' },
  { value: 'food', label: 'Food & Drinks', icon: '🍽️' },
  { value: 'exterior', label: 'Exterior', icon: '🏢' },
  { value: 'event', label: 'Events', icon: '🎉' },
  { value: 'service', label: 'Services', icon: '⚙️' },
  { value: 'atmosphere', label: 'Atmosphere', icon: '✨' },
];

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ value, onChange }) => {
  const selectedCategory = categories.find(cat => cat.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between h-10"
        >
          <div className="flex items-center gap-2">
            {selectedCategory ? (
              <>
                <span>{selectedCategory.icon}</span>
                <span>{selectedCategory.label}</span>
              </>
            ) : (
              <span className="text-gray-500">Select category...</span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full min-w-[200px]" align="start">
        {categories.map((category) => (
          <DropdownMenuItem
            key={category.value}
            onClick={() => onChange(category.value)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </div>
            {value === category.value && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
