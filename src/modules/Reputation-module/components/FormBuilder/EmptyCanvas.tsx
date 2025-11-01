import React from 'react';
import { FormInput, ArrowDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const EmptyCanvas: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center p-8">
      <div className="mb-6 relative">
        <div className="p-6 bg-primary/10 rounded-full">
          <FormInput className="h-16 w-16 text-primary" />
        </div>
        <div className="absolute -bottom-2 -right-2 animate-bounce">
          <ArrowDown className="h-6 w-6 text-primary" />
        </div>
      </div>
      
      <h3 className="text-2xl font-semibold mb-2">Start Building Your Form</h3>
      <p className="text-muted-foreground mb-6 max-w-md text-sm">
        Drag and drop field types from the left sidebar or click on them to add to your custom feedback form
      </p>
      
      <div className="flex flex-wrap gap-2 justify-center max-w-md">
        <Badge variant="secondary" className="text-xs">Text Input</Badge>
        <Badge variant="secondary" className="text-xs">Email</Badge>
        <Badge variant="secondary" className="text-xs">Select Dropdown</Badge>
        <Badge variant="secondary" className="text-xs">Radio Buttons</Badge>
        <Badge variant="secondary" className="text-xs">Checkboxes</Badge>
        <Badge variant="secondary" className="text-xs">File Upload</Badge>
        <Badge variant="secondary" className="text-xs">Date Picker</Badge>
      </div>
    </div>
  );
};
