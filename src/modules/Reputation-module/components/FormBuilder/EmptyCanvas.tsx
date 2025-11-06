import React from 'react';
import { FormInput, ArrowDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const EmptyCanvas: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] md:min-h-[500px] text-center p-4 md:p-8">
      <div className="mb-4 md:mb-6 relative">
        <div className="p-4 md:p-6 bg-primary/10 rounded-full">
          <FormInput className="h-12 w-12 md:h-16 md:w-16 text-primary" />
        </div>
        <div className="absolute -bottom-2 -right-2 animate-bounce">
          <ArrowDown className="h-5 w-5 md:h-6 md:w-6 text-primary" />
        </div>
      </div>
      
      <h3 className="text-xl md:text-2xl font-semibold mb-2">Start Building Your Form</h3>
      <p className="text-muted-foreground mb-4 md:mb-6 max-w-md text-xs md:text-sm px-4">
        Tap on field types to add them to your custom feedback form
      </p>
      
      <div className="hidden sm:flex flex-wrap gap-2 justify-center max-w-md">
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
